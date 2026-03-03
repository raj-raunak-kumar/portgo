const fs = require('fs');
const file = 'src/components/omnitrix-3d.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
    `            {/* Inner Glowing Code Symbol < / > */}\n            <group scale={1.1}>`,
    `            {/* Inner Glowing Code Symbol < / > */}\n            <group scale={2.2}>`
);
fs.writeFileSync(file, content);
console.log("Scale updated.");
