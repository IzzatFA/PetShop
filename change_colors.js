const fs = require('fs');
const path = require('path');

const traverse = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf-8');

            // Tailwind color swaps mapping to pink (dominant) and emerald/teal (green accent)
            content = content.replace(/blue-/g, 'pink-');
            content = content.replace(/indigo-/g, 'pink-');
            content = content.replace(/purple-/g, 'pink-');
            content = content.replace(/cyan-/g, 'emerald-');
            content = content.replace(/teal-/g, 'emerald-');

            fs.writeFileSync(fullPath, content);
        }
    }
};

traverse(path.join(__dirname, 'src'));
console.log('Colors successfully swapped!');
