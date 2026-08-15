const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '../../../zuv-lsp.exe');
const destination = path.resolve(__dirname, '../server/zuv-lsp.exe');

if (!fs.existsSync(source)) {
  throw new Error(`Zuv language server was not found: ${source}. Build zuv-lsp.exe before packaging the extension.`);
}

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(source, destination);
