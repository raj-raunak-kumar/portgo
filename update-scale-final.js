const fs = require('fs');
const file = 'src/components/omnitrix-3d.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
    `<group scale={2.2}>\n                <CodeSymbol color={color} />\n            </group>`,
    `<group scale={3.8}>\n                <CodeSymbol color={color} />\n            </group>`
);
fs.writeFileSync(file, content);
console.log("Maximum scale core updated.");
