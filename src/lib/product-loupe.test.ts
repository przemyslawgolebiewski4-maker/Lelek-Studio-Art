import assert from "node:assert/strict";
import { productLoupeFrame } from "./product-loupe";

const frame = productLoupeFrame(200, 300, 400, 600, 100, 2);
assert.ok(frame);
assert.equal(frame.size, 100);
assert.equal(frame.left, 150);
assert.equal(frame.top, 250);
assert.equal(frame.backgroundSize, "800px 1200px");
assert.equal(frame.backgroundPosition, "-350px -550px");

assert.equal(productLoupeFrame(0, 0, 0, 100), null);

const capped = productLoupeFrame(10, 10, 80, 80, 176, 2);
assert.ok(capped);
assert.equal(capped.size, 80);

console.log("product loupe ok");
