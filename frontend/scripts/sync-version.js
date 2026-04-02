const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');
const out = path.join(__dirname, '../src/app/core/version.ts');
fs.writeFileSync(out, `/** Versión de la app. Sincronizada con package.json en build. */\nexport const APP_VERSION = '${pkg.version}';\n`);
console.log('Version synced:', pkg.version);
