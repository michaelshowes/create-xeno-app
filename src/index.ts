#!/usr/bin/env node
import {
  cancel,
  confirm,
  group,
  intro,
  note,
  outro,
  select,
  spinner,
  text
} from '@clack/prompts';
import fs from 'fs';
import color from 'picocolors';

import { installDrizzle } from './tasks/drizzle/index.js';
import { createNextProject } from './tasks/next/index.js';
import { installPayload } from './tasks/payload/index.js';

export async function main() {
  intro(`${color.bgCyan(color.black('Create a new Next.js project'))}`);

  const project = await group(
    {
      name: () =>
        text({
          message: 'Enter a project name.',
          placeholder: 'my-app',
          initialValue: 'my-app',
          validate: (value) => {
            if (!value) {
              return 'Project name cannot be empty';
            }
            if (value.includes(' ')) {
              return 'Project name cannot contain spaces';
            }
            if (fs.existsSync(value)) {
              return 'A directory with that name already exists';
            }
            if (!/^[a-zA-Z0-9-]*$/.test(value)) {
              return 'Project name can only contain letters, numbers, and hyphens';
            }
          }
        }),

      cms: () =>
        confirm({
          message: 'Include Payload CMS?'
        }),

      database: ({ results }) => {
        if (!results.cms) {
          return confirm({
            message: 'Would you like to use a database?'
          });
        }

        return undefined;
      },

      databaseName: ({ results }) => {
        if (results.database) {
          return text({
            message: 'Enter the name of the database',
            placeholder: results.name,
            initialValue: results.name,
            validate: (value) => {
              if (!value) {
                return 'Database name cannot be empty';
              }
              if (value.includes(' ')) {
                return 'Database name cannot contain spaces';
              }
              if (!/^[a-zA-Z0-9-_]*$/.test(value)) {
                return 'Database name can only contain letters, numbers, hyphens, and underscores';
              }
            }
          });
        }
      },

      databaseUser: ({ results }) => {
        if (results.database) {
          return text({
            message: 'Enter the database username',
            placeholder: 'username',
            validate: (value) => {
              if (!value) {
                return 'Database username cannot be empty';
              }
              if (value.includes(' ')) {
                return 'Database username cannot contain spaces';
              }
              if (!/^[a-zA-Z0-9-_]*$/.test(value)) {
                return 'Database username can only contain letters, numbers, hyphens, and underscores';
              }
            }
          });
        }
      },

      databasePassword: ({ results }) => {
        if (results.database) {
          return text({
            message: 'Enter the database password',
            placeholder: 'password',
            validate: (value) => {
              if (!value) {
                return 'Database password cannot be empty';
              }
              if (value.includes(' ')) {
                return 'Database password cannot contain spaces';
              }
            }
          });
        }
      },

      auth: ({ results }) => {
        if (!results.cms) {
          return select({
            message: 'Select an authentication method',
            initialValue: 'none',
            options: [
              { value: 'none', label: 'None' },
              {
                value: 'authjs',
                label: 'Auth.js',
                hint: 'Auth.js is a simple authentication library'
              },
              { value: 'clerk', label: 'Clerk' }
            ]
          });
        }

        return undefined;
      }

      // additionalPackages: () =>
      //   multiselect({
      //     message: 'Select any addtional packages you would like to include',
      //     options: [
      //       {
      //         value: 'shadcn',
      //         label: 'Shadcn'
      //       },
      //       {
      //         value: 'framerMotion',
      //         label: 'Framer Motion'
      //       },
      //       {
      //         value: 'storybook',
      //         label: 'Storybook'
      //       }
      //     ],
      //     required: false
      //   })
    },
    {
      onCancel: () => {
        cancel('Project creation cancelled');
        process.exit(0);
      }
    }
  );

  const s = spinner();
  s.start(`Creating ${color.green(project.name)}...`);
  await createNextProject(project.name);

  if (project.cms) {
    await installPayload();
  }

  if (project.database) {
    await installDrizzle({
      dbName: project.databaseName as string,
      dbUser: project.databaseUser as string,
      dbPassword: project.databasePassword as string
    });
  }
  s.stop(`Project ${color.green(project.name)} created!`);

  const nextSteps = `cd ${project.name}
    \n${project.name ? '' : 'pnpm install\n'}pnpm dev
  `;

  note(nextSteps, 'Next steps.');

  outro(
    `Problems? ${color.underline(color.cyan('https://example.com/issues'))}`
  );
}

main().catch(console.error);
