const fs = require("fs");
const p = "src/data/products.ts";
let s = fs.readFileSync(p, "utf8");
const before = (s.match(/Под заказ/g) || []).length;
s = s.replace(/\n\s*"Под заказ"\s*,?/g, "\n");
s = s.replace(/,\s*\n(\s*\])/g, "\n$1");
fs.writeFileSync(p, s);
console.log({
  before,
  after: (fs.readFileSync(p, "utf8").match(/Под заказ/g) || []).length,
});
