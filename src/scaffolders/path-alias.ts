import fs from 'fs/promises';
import path from 'path';

export async function setupPathAlias(projectName: string) {
  const cwd = path.resolve(process.cwd(), projectName);

  const tsconfigPath = path.join(cwd, 'tsconfig.json');
  const exists = await fs
    .access(tsconfigPath)
    .then(() => true)
    .catch(() => false);

  if (exists) {
    const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'));
    tsconfig.compilerOptions ||= {};
    tsconfig.compilerOptions.baseUrl = './';
    tsconfig.compilerOptions.paths ||= {};
    tsconfig.compilerOptions.paths['@/*'] = ['src/*'];

    await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  }

  const viteConfigPath = path.join(cwd, 'vite.config.ts');
  try {
    const viteContent = await fs.readFile(viteConfigPath, 'utf-8');

    const updated = viteContent.replace(
      /resolve:\s*{([\s\S]*?)}/,
      `resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }`
    );

    await fs.writeFile(viteConfigPath, updated);
  } catch {
    // vite.config.ts doesn't exist — skip
  }
}
