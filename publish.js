import { spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

// This publish process automatically replaces workspace:* with the actual version number of other packages currently in the repo

// The packages to publish – this will run in order and await each package before moving on
const packages = ['shaders-react-native'];

const isDryRun = process.argv.includes('--dry-run');
// Extract the tag value from the command line arguments
const tagArg = process.argv.find((arg) => arg.startsWith('--tag='));
const tag = tagArg ? tagArg.split('=')[1] : null;

if (tag) {
  console.log(`Publishing with tag: ${tag}`);
} else {
  console.log('No tag specified, publishing without a tag');
}

/** Stores the newest version of each package so we can replace it in package.json before publishing */
const packageVersionMap = {};
// Loop through all the packages and get the current version of each
for (const pkg of packages) {
  const packageJson = JSON.parse(readFileSync(`packages/${pkg}/package.json`, 'utf8'));
  // Get the name of the package
  const name = packageJson.name;
  const currentVersion = packageJson.version;
  packageVersionMap[name] = currentVersion;
}

async function publish(pkg) {
  const packagePath = `packages/${pkg}`;
  console.log(`Publishing ${pkg}...`);

  //  ----- Update any workspace dependencies with the current version ----- //
  const originalPackageJson = readFileSync(`${packagePath}/package.json`, 'utf8');
  const packageJson = JSON.parse(originalPackageJson);
  // Search the package.json for any packages in our packageVersionMap and replace the version with the current version
  for (const [key, value] of Object.entries(packageJson.dependencies)) {
    if (packageVersionMap[key]) {
      packageJson.dependencies[key] = packageVersionMap[key];
    }
  }
  // Write the updated package.json
  writeFileSync(`${packagePath}/package.json`, JSON.stringify(packageJson, null, 2));

  // ----- Publish the package ----- //
  const args = ['publish', '--access', 'public'];
  if (isDryRun) {
    args.push('--dry-run');
  }
  if (tag) {
    args.push('--tag', tag);
  }

  return new Promise((resolve, reject) => {
    const child = spawn('npm', args, {
      cwd: packagePath,
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.log(`Skipping ${pkg}: Publication failed or package is already up to date`);
      } else {
        console.log(`Published ${pkg}`);
      }

      // Restore the original package.json to put back workspace:* dependencies
      writeFileSync(`${packagePath}/package.json`, originalPackageJson);
      resolve();
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function publishAll() {
  try {
    for (const pkg of packages) {
      await publish(pkg);
    }
    console.log('All packages processed!');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  }
}

publishAll();
