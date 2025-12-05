import fs from 'fs-extra';

const dirs = ['docs/api', 'docs/components', 'docs/pages'];

for (const dir of dirs) {
  fs.removeSync(dir);
}
