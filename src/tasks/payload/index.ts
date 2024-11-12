import { execSync } from 'child_process';
import consola from 'consola';
import fs from 'fs';

import { pkgManager } from '@/constants.js';

export async function installPayload() {
  consola.start('Installing Payload CMS...');

  fs.mkdirSync('./src/app/(app)/');
  fs.renameSync('./src/app/layout.tsx', './src/app/(app)/layout.tsx');
  fs.renameSync('./src/app/page.tsx', './src/app/(app)/page.tsx');

  execSync(`${pkgManager.execute} create-payload-app@beta`, {
    stdio: 'inherit'
  });

  execSync(`${pkgManager.install} sharp`, {
    stdio: ['ignore', 'ignore', 'ignore']
  });
}
