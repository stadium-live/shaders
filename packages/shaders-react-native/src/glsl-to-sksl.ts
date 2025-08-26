export function glslToSkSL(source: string): string {
  let result = source;
  // Remove WebGL directives not supported by SkSL
  result = result.replace(/^#version\s+\d+\s+es\n/, '');
  result = result.replace(/^precision\s+mediump\s+float;\n/, '');
  // Remove explicit out variable declarations
  result = result.replace(/^\s*out\s+vec4\s+\w+;\n/m, '');
  // Convert main entry point
  result = result.replace(/void\s+main\s*\(\s*\)\s*{\n/, 'vec4 main(vec2 fragCoord) {\n');
  // Replace fragColor assignments with return statements
  result = result.replace(/fragColor\s*=\s*/g, 'return ');
  // Map GLSL types to SkSL types
  result = result.replace(/\bvec2\b/g, 'float2');
  result = result.replace(/\bvec3\b/g, 'float3');
  result = result.replace(/\bvec4\b/g, 'float4');
  result = result.replace(/\bmat2\b/g, 'float2x2');
  result = result.replace(/\bmat3\b/g, 'float3x3');
  result = result.replace(/\bmat4\b/g, 'float4x4');
  return result;
}
