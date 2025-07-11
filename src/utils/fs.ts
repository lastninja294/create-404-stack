import { promises as fs } from 'fs';

export async function write(path: string, content: string) {
    await fs.writeFile(path, content);
}