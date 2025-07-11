import { $ } from 'zx';
import fs from 'fs/promises';
import path from 'path';

export async function setupTailwind(projectName: string) {
  const cwd = path.resolve(process.cwd(), projectName);

  await $({ cwd })`npm install -D tailwindcss @tailwindcss/vite`;

  await fs.writeFile(
    path.join(cwd, 'tailwind.config.js'),
    `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`
  );

  const viteConfigPath = path.join(cwd, 'vite.config.ts');
  await fs.writeFile(
    viteConfigPath,
    `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`
  );

  const cssPath = path.join(cwd, 'src/index.css');
  await fs.mkdir(path.join(cwd, 'src'), { recursive: true });
  await fs.writeFile(cssPath, `@import "tailwindcss";\n`);

  const mainPath = path.join(cwd, 'src/main.tsx');
  try {
    const main = await fs.readFile(mainPath, 'utf-8');
    if (!main.includes(`'./index.css'`)) {
      await fs.writeFile(mainPath, `import './index.css';\n${main}`);
    }
  } catch {
    // If main.tsx doesn't exist, skip
  }
}
