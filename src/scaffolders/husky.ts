import { $ } from 'zx';
import fs from 'fs/promises';
import path from 'path';

export async function setupHusky(projectName: string) {
  const cwd = path.resolve(process.cwd(), projectName);

  await $({ cwd })`npm install --save-dev husky lint-staged`;

  await $({ cwd })`npx husky init`;
    
  const preCommitPath = path.join(cwd, '.husky', 'pre-commit');
  await fs.writeFile(preCommitPath, `npx lint-staged\n`);
  await $({ cwd })`chmod +x .husky/pre-commit`;
    
  const commitMsgPath = path.join(cwd, '.husky', 'commit-msg');
  await fs.writeFile(commitMsgPath, `npx --no -- commitlint --edit "$1"\n`);
  await $({ cwd })`chmod +x .husky/commit-msg`;

  const pkgPath = path.join(cwd, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));

  pkg['lint-staged'] = {
    '*.{js,ts,jsx,tsx,json,css,md}': ['npx ultracite format']
  };

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
}
