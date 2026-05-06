const fs = require('fs');

let text = fs.readFileSync('frontend/src/pages/user/CodingTestAttempt.jsx', 'utf8');
text = text.replace(/bg-neutral-950/g, 'bg-slate-50')
           .replace(/text-white/g, 'text-slate-900')
           .replace(/bg-neutral-900\/50/g, 'bg-white shadow-sm')
           .replace(/border-neutral-800/g, 'border-slate-200')
           .replace(/bg-neutral-800/g, 'bg-slate-100')
           .replace(/text-neutral-500/g, 'text-slate-500')
           .replace(/text-neutral-400/g, 'text-slate-600')
           .replace(/bg-violet-600/g, 'bg-indigo-600')
           .replace(/text-violet-500/g, 'text-indigo-600')
           .replace(/text-violet-400/g, 'text-indigo-600')
           .replace(/border-violet-500/g, 'border-indigo-500')
           .replace(/theme="vs-dark"/g, 'theme="light"');

fs.writeFileSync('frontend/src/pages/user/CodingTestAttempt.jsx', text);
console.log('Done!');
