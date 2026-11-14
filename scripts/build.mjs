import { cp, mkdir } from 'node:fs/promises';

const project = new URL('../', import.meta.url);
const output = new URL('dist/', project);
await mkdir(output, { recursive: true });

for (const entry of ['index.html', 'style.css', 'app.js', 'assets']) {
  await cp(new URL(entry, project), new URL(entry, output), { recursive: true });
}

console.log('前端构建完成：dist/');
