const fs = require("fs");
const p = "src/data/products.ts";
let s = fs.readFileSync(p, "utf8");
const before = (s.match(/В наличии/g) || []).length;
s = s.replaceAll("В наличии", "Под заказ");
s = s.replaceAll('"inStock": true', '"inStock": false');
fs.writeFileSync(p, s);
console.log({
  replacedNalichie: before,
  inStockFalse: (s.match(/"inStock": false/g) || []).length,
  inStockTrue: (s.match(/"inStock": true/g) || []).length,
  leftNalichie: (s.match(/В наличии/g) || []).length,
  podZakaz: (s.match(/Под заказ/g) || []).length,
});
