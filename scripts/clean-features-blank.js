const fs = require("fs");
const p = "src/data/products.ts";
let s = fs.readFileSync(p, "utf8");
s = s.replace(/"features":\s*\[\s*\n\s*\n/g, '"features": [\n');
fs.writeFileSync(p, s);
console.log("ok");
