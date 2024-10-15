import { ShaderMount } from '../shader-mount';
import { grainCloudsFragmentShader } from '@paper-design/shaders';

export const GrainClouds = () => {
  return <ShaderMount fragmentShader={grainCloudsFragmentShader} />;
};
