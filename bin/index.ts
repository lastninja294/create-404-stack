#!/usr/bin/env node
import semver from 'semver';
import inquirer from 'inquirer';
import { generateComponent } from '@/generators/component.js';
import { showBanner } from '@/ui/banner.js';
import { setupNext } from '@/scaffolders/next.js';
import { setupReact } from '@/scaffolders/react.js';
import { setupBiome } from '@/scaffolders/biome.js';
import { setupTailwind } from '@/scaffolders/tailwind.js';
import { setupHusky } from '@/scaffolders/husky.js';
import { setupCommitlint } from '@/scaffolders/commitlint.js';
import { setupPathAlias } from '@/scaffolders/path-alias.js';
import { withSpinner } from '@/utils/spinner.js';
import { fs } from 'zx';

// ✅ Version check
const requiredNode = '>=20.19.0';
const currentNode = process.version; // e.g. 'v20.15.1'

if (!semver.satisfies(semver.clean(currentNode)!, requiredNode)) {
  console.error(`❌ Node.js ${requiredNode} is required. You are using ${currentNode}`);
  process.exit(1);
}

process.on('SIGINT', () => {
    console.log('\n👋 Prompt cancelled by user. Exiting...');
    process.exit(0);
});

const argv = process.argv.slice(2);

if (argv.includes('--generate')) {
  const name = argv[1];
  if (!name) {
    console.error('❌ Please provide a component name');
    process.exit(1);
  }
  await generateComponent(name);
  process.exit(0);
}

await showBanner();

// --------------------------------------------------------------------------------------------

let projectType: string;
let projectName: string;

try {
  const result = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: 'Which project would you like to create?',
      choices: ['Next.js', 'React (Vite)']
    },
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      validate: (input: string) => {
        const isValid = /^[a-z][a-z0-9-]{1,}$/.test(input);
        if (!isValid) return '❌ Use only lowercase letters, numbers, and dashes. Start with a letter.';
        if (fs.existsSync(input)) return '❌ A folder with this name already exists.';
        return true;
      }
    }
  ]);
  projectType = result.projectType;
  projectName = result.projectName;
} catch (error) {
  if (error instanceof Error && error.message.includes('SIGINT')) {
    console.log('\n👋 Prompt cancelled by user. Goodbye!');
  } else {
    console.error('\n❌ Unexpected error during prompt:', error);
  }
  process.exit(1);
}


let tools: string[] = [];
if (projectType === 'React (Vite)') {
  const toolPrompt = await inquirer.prompt({
    type: 'checkbox',
    name: 'tools',
    message: 'Select tools to include',
    choices: ['Biome', 'TailwindCSS', 'Husky', 'Commitlint', 'Path Alias']
  });
  tools = toolPrompt.tools;
} else {
  const toolPrompt = await inquirer.prompt({
    type: 'checkbox',
    name: 'tools',
    message: 'Select tools to include',
    choices: ['Biome', 'TailwindCSS', 'Husky', 'Commitlint']
  });
  tools = toolPrompt.tools;
}
    
if (projectType === 'Next.js'){
    await withSpinner('Scaffolding Next.js project', () => setupNext(projectName)); 
} 
else {
    await withSpinner('Scaffolding React (Vite) project', () => setupReact(projectName));
}

if (tools.includes('Biome')) await withSpinner('Installing Biome', () => setupBiome(projectName));
if (tools.includes('Husky')) await withSpinner('Configuring Husky', () => setupHusky(projectName));
if (tools.includes('Commitlint')) await withSpinner('Adding Commitlint', () => setupCommitlint(projectName));
if (tools.includes('TailwindCSS')) await withSpinner('Setting up TailwindCSS', () => setupTailwind(projectName));
if (projectType === 'React (Vite)' && tools.includes('Path Alias')) await withSpinner('Setting up Path Alias', () => setupPathAlias(projectName));

console.log('✅ Project is ready!');
