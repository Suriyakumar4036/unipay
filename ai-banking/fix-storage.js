const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let code = fs.readFileSync(file, 'utf8');

const safeStorageStr = `
const safeStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(key, value); } catch (e) {}
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try { localStorage.clear(); } catch (e) {}
  }
};
`;

code = code.replace('export default function Dashboard() {', safeStorageStr + '\nexport default function Dashboard() {');
code = code.replace(/localStorage\./g, 'safeStorage.');

fs.writeFileSync(file, code);
console.log('Done');
