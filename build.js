import path from 'path';
import { Glob } from 'bun';
import esbuild from 'esbuild';
import { execSync } from 'child_process';

function build(packageDir) {
  const input = `${packageDir}/src/index.ts`;
  const outDir = `${packageDir}/dist`;
  const tsconfig = `${packageDir}/tsconfig.json`;

  // Run tsc to generate declaration files and typecheck
  execSync(
    `tsc --emitDeclarationOnly --outDir ${outDir} --project ${tsconfig}`,
    {
      stdio: 'inherit',
    }
  );

  // esbuild configuration
  esbuild.buildSync({
    entryPoints: [input],
    outdir: outDir,
    bundle: true,
    platform: 'browser',
    target: 'es2022',
    format: 'esm',
    sourcemap: true,
    minify: true,
    external: ['react'], // don't bundle react
  });

  console.log(`Built ${outDir}/index.d.ts`);
}

build('packages/shaders');
build('packages/shaders-react');
