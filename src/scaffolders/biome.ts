import { $ } from 'zx';
import fs from 'fs/promises';
import path from 'path';

export async function setupBiome(projectName: string) {
  const cwd = path.resolve(process.cwd(), projectName);

  // 1. Install ultracite + biome
  await $({ cwd })`npm install -D -E ultracite @biomejs/biome@2.0.6`;

  // 2. Create biome.json
  const biomeConfigPath = path.join(cwd, 'biome.json');
  const biomeConfig = `{
  "$schema": "https://biomejs.dev/schemas/2.0.6/schema.json",
  "extends": ["ultracite"]
}
`;
  await fs.writeFile(biomeConfigPath, biomeConfig);

  // 3. Create .vscode/settings.json
  const vscodeDir = path.join(cwd, '.vscode');
  const vscodeSettingsPath = path.join(vscodeDir, 'settings.json');

  await fs.mkdir(vscodeDir, { recursive: true });

  const vscodeSettings = {
    "editor.tabSize": 2,
    "editor.detectIndentation": false,
    "search.exclude": {
      "package-lock.json": true
    },
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true,
    "editor.codeActionsOnSave": {
      "source.addMissingImports": "explicit",
      "source.fixAll.biome": "explicit",
      "source.organizeImports.biome": "explicit"
    },
    "typescript.preferences.preferTypeOnlyAutoImports": true,
    "typescript.tsdk": "node_modules/typescript/lib",
    "[typescript]": {
      "editor.defaultFormatter": "biomejs.biome"
    },
    "[json]": {
      "editor.defaultFormatter": "biomejs.biome"
    },
    "[javascript]": {
      "editor.defaultFormatter": "biomejs.biome"
    },
    "[jsonc]": {
      "editor.defaultFormatter": "biomejs.biome"
    },
    "[typescriptreact]": {
      "editor.defaultFormatter": "biomejs.biome"
    }
  };

  await fs.writeFile(
    vscodeSettingsPath,
    JSON.stringify(vscodeSettings, null, 2)
  );
}
