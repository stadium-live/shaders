'use client';

import React, { useEffect, useRef, forwardRef } from 'react';
import {
  Canvas,
  Fill,
  Shader as SkiaShader,
  Skia,
  type CanvasRef,
  type SkImage,
} from '@shopify/react-native-skia';
import { PixelRatio, type LayoutChangeEvent, type ViewProps } from 'react-native';
import { useMergeRefs } from './use-merge-refs.js';
import type { ShaderMotionParams } from '@paper-design/shaders';
import { glslToSkSL } from './glsl-to-sksl.js';

interface ShaderMountUniformsReactNative {
  [key: string]:
    | string
    | boolean
    | number
    | number[]
    | number[][]
    | SkImage
    | HTMLImageElement
    | undefined;
}

export interface ShaderMountProps extends Omit<ViewProps, 'ref'>, ShaderMotionParams {
  ref?: React.Ref<CanvasRef>;
  fragmentShader: string;
  uniforms: ShaderMountUniformsReactNative;
  minPixelRatio?: number;
  maxPixelCount?: number;
}

export interface ShaderComponentProps extends Omit<ViewProps, 'ref'> {
  ref?: React.Ref<CanvasRef>;
  minPixelRatio?: number;
  maxPixelCount?: number;
}

async function loadImage(url: string): Promise<SkImage | undefined> {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const data = Skia.Data.fromBytes(new Uint8Array(buffer));
    const image = Skia.Image.MakeImageFromEncoded(data);
    data.dispose();
    return image ?? undefined;
  } catch (error) {
    console.error(`Could not set uniforms. Failed to load image at ${url}`);
    return undefined;
  }
}

async function processUniforms(uniformsProp: ShaderMountUniformsReactNative): Promise<Record<string, unknown>> {
  const processed: Record<string, unknown> = {};
  await Promise.all(
    Object.entries(uniformsProp).map(async ([key, value]) => {
      if (typeof value === 'string') {
        const img = await loadImage(value);
        if (img) {
          processed[key] = img;
        }
      } else {
        processed[key] = value;
      }
    })
  );
  return processed;
}

export const ShaderMount: React.FC<ShaderMountProps> = forwardRef<CanvasRef, ShaderMountProps>(function ShaderMountImpl(
  {
    fragmentShader,
    uniforms: uniformsProp,
    speed = 0,
    frame = 0,
    minPixelRatio = 2,
    maxPixelCount,
    style,
    ...viewProps
  },
  forwardedRef
) {
  const canvasRef = useRef<CanvasRef>(null);
  const mergedRef = useMergeRefs([canvasRef, forwardedRef]) as React.Ref<CanvasRef>;

  const effectRef = useRef(Skia.RuntimeEffect.Make(glslToSkSL(fragmentShader)));
  useEffect(() => {
    effectRef.current = Skia.RuntimeEffect.Make(glslToSkSL(fragmentShader));
  }, [fragmentShader]);

  const [uniforms, setUniforms] = React.useState<Record<string, unknown>>({ u_time: frame });
  const timeRef = useRef(frame);
  const layoutRef = useRef({ width: 0, height: 0 });

  const computeResolution = () => {
    const { width, height } = layoutRef.current;
    if (width === 0 || height === 0) return;
    const deviceRatio = PixelRatio.get();
    let ratio = Math.max(minPixelRatio, deviceRatio);
    let w = width * ratio;
    let h = height * ratio;
    const pixelCount = w * h;
    if (maxPixelCount && pixelCount > maxPixelCount) {
      const scale = Math.sqrt(maxPixelCount / pixelCount);
      w *= scale;
      h *= scale;
    }
    setUniforms((prev) => ({ ...prev, u_resolution: [w, h] }));
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    layoutRef.current = {
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    };
    computeResolution();
  };

  useEffect(() => {
    computeResolution();
  }, [minPixelRatio, maxPixelCount]);

  useEffect(() => {
    let mounted = true;
    processUniforms(uniformsProp).then((u) => {
      if (mounted) {
        setUniforms((prev) => ({ ...u, u_time: timeRef.current, u_resolution: prev.u_resolution }));
      }
    });
    return () => {
      mounted = false;
    };
  }, [uniformsProp]);

  useEffect(() => {
    timeRef.current = frame;
    setUniforms((prev) => ({ ...prev, u_time: timeRef.current }));
  }, [frame]);

  useEffect(() => {
    if (speed === 0) return;
    let start: number | null = null;
    let raf: number;
    const loop = (t: number) => {
      if (start == null) start = t;
      const delta = t - start;
      start = t;
      timeRef.current += (delta / 1000) * speed;
      setUniforms((prev) => ({ ...prev, u_time: timeRef.current }));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  if (!effectRef.current) return null;

  return (
    <Canvas
      ref={mergedRef as unknown as React.Ref<unknown>}
      style={style}
      onLayout={handleLayout}
      {...viewProps}
    >
      <Fill>
        <SkiaShader source={effectRef.current} uniforms={uniforms as any} />
      </Fill>
    </Canvas>
  );
});

ShaderMount.displayName = 'ShaderMount';
