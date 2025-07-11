import { $ } from 'zx';
import path from 'path';

export async function setupNext(projectName: string) {
  const cwd = process.cwd();

  await $({ cwd: process.cwd() })`npm create next-app@latest ${projectName} \
    -- \
    --ts \
    --tailwind \
    --app \
    --no-eslint \
    --no-src-dir \
    --no-import-alias \
    --no-turbopack
`;



  await $({ cwd: path.join(cwd, projectName) })`
  npx shadcn@latest init \
    --yes \
    --defaults \
    --template next \
    --base-color neutral \
    --no-src-dir \
    --css-variables
`;


  await $({ cwd: path.join(cwd, projectName) })`npx shadcn@latest add button`;
}
