# @paper-design/shaders-react-native

## Usage

This package expects `@shopify/react-native-skia@1.12.4` to be installed in your project.

```
import { MeshGradient, DotOrbit } from '@paper-design/shaders-react-native';

<MeshGradient
    colors={['#5100ff', '#00ff80', '#ffcc00', '#ea00ff']}
    distortion={1}
    swirl={0.8}
    speed={0.2}
    style={{width: 200, height: 200}}
/>

<DotOrbit
    colors={['#d2822d', '#0c3b7e', '#b31a57', '#37a066']}
    colorBack={'#000000'}
    scale={0.3}
    style={{width: 200, height: 200}}
/>


// these settings can be configured in code or designed in Paper
```

## Release notes

[View changelog →](https://github.com/paper-design/shaders/blob/main/CHANGELOG.md)
