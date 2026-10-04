import assert from "node:assert/strict";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, resolveInstagramHandle, resolveInstagramUrl } from "./config";

assert.equal(INSTAGRAM_URL, "https://www.instagram.com/lelek.studio_/");
assert.equal(INSTAGRAM_HANDLE, "@lelek.studio_");

assert.equal(resolveInstagramUrl(undefined), INSTAGRAM_URL);
assert.equal(resolveInstagramUrl(""), INSTAGRAM_URL);
assert.equal(resolveInstagramUrl("https://www.instagram.com/lelek.studio_/"), INSTAGRAM_URL);
assert.equal(resolveInstagramUrl("https://instagram.com/lelek.studio_"), INSTAGRAM_URL);
assert.equal(resolveInstagramUrl("https://www.instagram.com/Lelek.Studio_/"), INSTAGRAM_URL);
assert.equal(resolveInstagramUrl("https://www.instagram.com/lelek.berlin/"), INSTAGRAM_URL);
assert.equal(resolveInstagramUrl("https://www.instagram.com/lelek.studio.berlin/"), INSTAGRAM_URL);
assert.equal(resolveInstagramUrl("https://www.instagram.com/lelek.studio/"), INSTAGRAM_URL);
assert.equal(resolveInstagramUrl("https://www.instagram.com/claystories.berlin/"), INSTAGRAM_URL);
assert.equal(resolveInstagramUrl("https://www.instagram.com/someone.else/"), "https://www.instagram.com/someone.else/");
assert.equal(resolveInstagramUrl("https://shop.lelekstudio.com"), "https://shop.lelekstudio.com");

assert.equal(resolveInstagramHandle(undefined), INSTAGRAM_HANDLE);
assert.equal(resolveInstagramHandle("@lelek.studio_"), INSTAGRAM_HANDLE);
assert.equal(resolveInstagramHandle("@lelek.berlin"), INSTAGRAM_HANDLE);
assert.equal(resolveInstagramHandle("@lelek.studio.berlin"), INSTAGRAM_HANDLE);
assert.equal(resolveInstagramHandle("@claystories.berlin"), INSTAGRAM_HANDLE);
assert.equal(resolveInstagramHandle("@someone.else"), "@someone.else");
assert.equal(resolveInstagramHandle("Clay Stories Berlin"), "Clay Stories Berlin");

console.log("config ok");
