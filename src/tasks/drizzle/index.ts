import { execSync } from 'child_process';
import consola from 'consola';
import fs from 'fs';

import { pkgManager } from '@/constants.js';

import { drizzleClient } from './config/drizzleClient.js';
import { defaultUserQueries } from './config/queries.js';
import { defaultSchema, defaultUserSchema } from './config/schema.js';

type DBInfo = {
  dbName: string;
  dbUser: string;
  dbPassword: string;
};

export async function installDrizzle({ dbName, dbUser, dbPassword }: DBInfo) {
  consola.start('Installing Drizzle ORM...');

  execSync(`${pkgManager.install} drizzle-orm pg drizzle-zod`, {
    stdio: ['ignore', 'ignore', 'ignore']
  });

  execSync(`${pkgManager.installDev} drizzle-kit @types/pg`, {
    stdio: ['ignore', 'ignore', 'ignore']
  });

  if (!fs.existsSync('.env')) {
    fs.writeFileSync(
      '.env',
      `DATABASE_URL=postgres://${dbUser}:${dbPassword}@localhost:5432/${dbName}\n`
    );
  } else {
    fs.appendFileSync(
      '.env',
      `DATABASE_URL=postgres://${dbUser}:${dbPassword}@localhost:5432/${dbName}\n`
    );
  }
  fs.writeFileSync('./drizzle.config.ts', drizzleClient);
  fs.mkdirSync('./src/db/');
  fs.writeFileSync('./src/db/index.ts', drizzleClient);
  fs.mkdirSync('./src/db/schema/', { recursive: true });
  fs.writeFileSync('./src/db/schema/index.ts', defaultSchema);
  fs.writeFileSync('./src/db/schema/users.ts', defaultUserSchema);
  fs.mkdirSync('./src/db/queries/', { recursive: true });
  fs.writeFileSync('./src/db/queries/users.ts', defaultUserQueries);

  consola.success('Drizzle ORM installed!');
}
