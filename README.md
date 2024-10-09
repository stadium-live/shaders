# Paper Shaders

### Goals:
- Give designers a visual way to use common shaders in their designs
- What you make is directly exportable as lightweight code that works in any codebase

### What it is:
- Zero-dependency HTML canvas shaders that can be installed from npm or designed in Paper
- To be used in websites to add texture as backgrounds or masked with shapes and text
- Animated (or not, your choice) and highly customizable

### Values:
- Very lightweight, maximum performance
- Visual quality
- Abstractions that are easy to play with
- Wide browser and device support

### Examples:
```
import { MeshGradient } from '@paper-design/shaders';

<MeshGradient
  colors={['#283BFC', '#FF2828', '#ddd']}
  blur="0.6"
  frequency="0.8"
  animationSpeed="1"
  style={{ width: 500, height: 200 }} />

// these settings can be configured in code or designed in Paper
```

## Roadmap:

### Patterns:
- Perlin noise
- Voronoi
- Meta balls
- Wave
- Random lines
- Value
- Marble
- Mesh gradient
- Dots
- Grid

### VFX
- God rays
- Starfield
- Stripe
- Mountains
- Clouds
- Water
