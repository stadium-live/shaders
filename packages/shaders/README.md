# @paper-design/shaders

This is the vanilla JS of Paper Shaders. You can also find framework specific wrappers.

## Example usage:

```
import { ShaderMount, meshGradientFragmentShader } from '@paper-design/shaders';

const myCanvas = document.createElement('canvas');

const shaderParams = {
  colors: ['#283BFC', color2: '#FF2828'],
  blur: 0.6,
  frequency: 0.8,
  animationSpeed: 1
}

const meshGradient = new ShaderMount(myCanvas, meshGradientFragmentShader, shaderParams);
```
