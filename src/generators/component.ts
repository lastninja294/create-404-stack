import { $ } from 'zx';
import fs from 'fs/promises';

export async function generateComponent(name: string) {
  const dir = `src/components/${name}`;
  await $`mkdir -p ${dir}`;
  await fs.writeFile(`${dir}/index.tsx`, `export function ${name}() {
  return <div>${name} Component</div>;
}
`);
  console.log(`✅ Component ${name} created at ${dir}`);
}
