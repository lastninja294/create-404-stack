import { $ } from 'zx';

export async function setupReact(name: string) {
  await $`npm create vite@latest ${name} -- --template react-ts`;
  await $`cd ${name} && npm install`;
}