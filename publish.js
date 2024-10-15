import { readdirSync } from 'fs';
import { spawnSync } from 'child_process';

const isDryRun = process.argv.includes('--dry-run');

function publish(pkg) {
  const packagePath = `packages/${pkg}`;
  console.log(`Publishing ${pkg}...`);

  const args = ['publish', '--access', 'public'];
  if (isDryRun) {
    args.push('--dry-run');
  }

  const result = spawnSync('bun', args, {
    cwd: packagePath,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.error(`Failed to publish ${pkg}`);
    process.exit(1);
  } else {
    console.log(`Published ${pkg}`);
  }
}

publish('shaders');
publish('shaders-react');

console.log('All packages published successfully!');
