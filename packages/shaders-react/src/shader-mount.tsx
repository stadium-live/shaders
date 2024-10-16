import React, { useEffect, useRef } from 'react';
import { ShaderMount as ShaderMountVanilla } from '@paper-design/shaders';

export interface ShaderMountProps {
  ref?: React.RefObject<HTMLCanvasElement>;
  fragmentShader: string;
  style?: React.CSSProperties;
  uniforms?: Record<string, number | number[]>;
  webGlContextAttributes?: WebGLContextAttributes;
  animated?: boolean;
}

export const ShaderMount: React.FC<ShaderMountProps> = ({
  ref,
  fragmentShader,
  style,
  uniforms = {},
  webGlContextAttributes,
  animated = true,
}) => {
  const canvasRef = ref ?? useRef<HTMLCanvasElement>(null);
  const shaderMountRef = useRef<ShaderMountVanilla | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      shaderMountRef.current = new ShaderMountVanilla(
        canvasRef.current,
        fragmentShader,
        uniforms,
        webGlContextAttributes,
        animated
      );
    }

    return () => {
      if (shaderMountRef.current) {
        shaderMountRef.current.dispose();
      }
    };
  }, [fragmentShader, webGlContextAttributes]);

  useEffect(() => {
    if (shaderMountRef.current) {
      shaderMountRef.current.setUniforms(uniforms);
    }
  }, [uniforms]);

  useEffect(() => {
    if (shaderMountRef.current) {
      if (animated) {
        shaderMountRef.current.startAnimating();
      } else {
        shaderMountRef.current.stopAnimating();
      }
    }
  }, [animated]);

  return <canvas ref={canvasRef} style={style} />;
};
