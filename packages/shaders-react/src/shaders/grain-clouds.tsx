import { ShaderMount, type ShaderMountProps } from '../shader-mount';
import {
  grainCloudsFragmentShader,
  GrainCloudsUniforms,
} from '@paper-design/shaders';

type GrainCloudsProps = Omit<ShaderMountProps, 'fragmentShader'> & {
  uniforms: GrainCloudsUniforms;
};

export const GrainClouds = (props: GrainCloudsProps): JSX.Element => {
  return <ShaderMount {...props} fragmentShader={grainCloudsFragmentShader} />;
};
