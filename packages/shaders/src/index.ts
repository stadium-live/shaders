/** The core Shader Mounting class. Pass it a canvas element and a fragment shader to get started. */
export { ShaderMount } from './shader-mount';

// ----- Fragment shaders ----- //
/** An example fragment shader that renders a grainy texture over top of blobby animated clouds */
export {
  grainCloudsFragmentShader,
  type GrainCloudsUniforms,
} from './shaders/grain-clouds';

// ----- Uniform conversion utils ----- //
export { getShaderColorFromString } from './shader-mount';
