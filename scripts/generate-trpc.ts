import fs from 'fs';
import path from 'path';

const SOURCE_PATH = '../nexploring-bff/src/trpc/builder/api-types/index.d.ts';
const TARGET_PATH = 'src/trpc/types.d.ts';

const generateTRPC = async () => {
  const fileContent = fs.readFileSync(SOURCE_PATH, 'utf8');

  const targetDir = path.dirname(TARGET_PATH);
  fs.mkdirSync(targetDir, { recursive: true });

  fs.writeFileSync(TARGET_PATH, fileContent);

  // eslint-disable-next-line no-console
  console.log('\x1b[32m✅ tRPC API successfully imported.\x1b[0m');
};

generateTRPC().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('\x1b[31m❌ Failed to import tRPC API:\x1b[0m', error);

  process.exit(1);
});
