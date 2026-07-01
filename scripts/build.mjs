import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await copyFile(join(root, 'index.html'), join(dist, 'index.html'));
await copyFile(join(root, 'payload.txt'), join(dist, 'payload.txt'));
await writeFile(join(dist, '404.html'), '<!DOCTYPE html><meta charset="utf-8"><title>404</title><body>Not Found</body>\n');

console.log('Built gg-keeper static assets into dist/');
