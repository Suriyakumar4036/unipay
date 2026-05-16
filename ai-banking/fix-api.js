const fs = require('fs');
const file = 'src/lib/api.ts';
let code = fs.readFileSync(file, 'utf8');

const safeStorageStr = `
const safeStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
};
`;

code = safeStorageStr + code;
code = code.replace(/localStorage\./g, 'safeStorage.');

fs.writeFileSync(file, code);
console.log('Done api.ts');
