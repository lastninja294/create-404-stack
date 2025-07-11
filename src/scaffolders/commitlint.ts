import { $ } from 'zx';
import fs from 'fs/promises';

export async function setupCommitlint(path: string) {
  await $({ cwd: path })`npm install -D @commitlint/{config-conventional,cli}`;
  await fs.writeFile(`${path}/commitlint.config.ts`, `export default { extends: ['@commitlint/config-conventional'] };`);
}