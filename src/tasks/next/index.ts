import { execSync } from 'child_process';
import consola from 'consola';
import fs from 'fs';

import { pkgManager } from '@/constants.js';

import { eslintConfig } from './config/eslintConfig.js';
import { gitignore } from './config/gitignore.js';
import { prettierConfig } from './config/prettierConfig.js';
import { defaultRootLayout } from './config/rootLayout.js';
import { utilsConfig } from './config/utilsConfig.js';
import { dependencies, devDependencies } from './dependencies.js';

export async function createNextProject(projectName: string) {
  consola.start(`Creating Next.js project ${projectName}...`);

  execSync(
    `${pkgManager.execute} create-next-app@latest --empty --use-${pkgManager.type} --yes ${projectName}`,
    {
      stdio: ['ignore', 'ignore', 'ignore']
    }
  );

  // cd into the project directory
  process.chdir(projectName);

  // Move the globals.css file to the root directory
  fs.renameSync('./src/app/globals.css', './src/globals.css');
  // update layout.tsx
  fs.writeFileSync('./src/app/layout.tsx', defaultRootLayout);

  // Create the lib directory and utils
  fs.mkdirSync('./src/lib/');
  fs.writeFileSync('./src/lib/utils.ts', utilsConfig);

  // Install additional dependencies
  execSync(`${pkgManager.install} ${dependencies}`, {
    stdio: ['ignore', 'ignore', 'ignore']
  });

  // Install additional devDependencies
  execSync(`${pkgManager.installDev} ${devDependencies}`, {
    stdio: ['ignore', 'ignore', 'ignore']
  });

  // Create the .prettierrc file
  fs.writeFileSync('.prettierrc', prettierConfig);

  // Create the .eslintrc file
  fs.writeFileSync('.eslintrc.json', eslintConfig);

  // Update .gitignore
  fs.writeFileSync('.gitignore', gitignore);

  consola.success('Next.js successfully installed!');
}
