import assert from "node:assert/strict";
import {
  ABOUT_URL,
  CREATOR_HOST,
  STUDIO_ORIGIN,
  aboutHref,
  decideHostRoute,
  isAboutHref,
  resolvePublicHref,
  studioHref,
} from "./links";

assert.equal(resolvePublicHref("/about", "path"), "/about");
assert.equal(resolvePublicHref("/about#originals", "path"), "/about#originals");
assert.equal(resolvePublicHref("/journal", "path"), "/journal");
assert.equal(resolvePublicHref("/", "path"), "/");

assert.equal(resolvePublicHref("/about", "host"), ABOUT_URL);
assert.equal(resolvePublicHref("/about#originals", "host"), `${ABOUT_URL}/#originals`);
assert.equal(resolvePublicHref("/journal", "host"), `${STUDIO_ORIGIN}/journal`);
assert.equal(resolvePublicHref("/", "host"), `${STUDIO_ORIGIN}/`);
assert.equal(resolvePublicHref("https://shop.lelekstudio.com", "host"), "https://shop.lelekstudio.com");
assert.equal(resolvePublicHref("https://www.lelekstudio.com/about", "host"), ABOUT_URL);
assert.equal(
  resolvePublicHref("https://lelekstudio.com/about#originals", "host"),
  `${ABOUT_URL}/#originals`,
);
assert.equal(aboutHref("originals", "host"), `${ABOUT_URL}/#originals`);
assert.equal(aboutHref("", "path"), "/about");
assert.equal(studioHref("/contact", "path"), "/contact");
assert.equal(studioHref("/contact", "host"), `${STUDIO_ORIGIN}/contact`);

assert.equal(isAboutHref("/about"), true);
assert.equal(isAboutHref("/about#originals"), true);
assert.equal(isAboutHref("/journal"), false);
assert.equal(isAboutHref(ABOUT_URL), true);
assert.equal(isAboutHref(`${STUDIO_ORIGIN}/journal`), false);

assert.deepEqual(decideHostRoute(CREATOR_HOST, "/"), { action: "rewrite", pathname: "/about" });
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/about"), {
  action: "redirect",
  destination: ABOUT_URL,
});
assert.deepEqual(decideHostRoute("www.lelekstudio.com", "/about"), {
  action: "redirect",
  destination: ABOUT_URL,
});
assert.deepEqual(decideHostRoute("lelekstudio.com", "/about", "?x=1"), {
  action: "redirect",
  destination: `${ABOUT_URL}/?x=1`,
});
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/journal", "?y=2"), {
  action: "redirect",
  destination: `${STUDIO_ORIGIN}/journal?y=2`,
});
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/api/proxy/settings/public"), { action: "continue" });
assert.deepEqual(decideHostRoute("localhost:3000", "/about"), { action: "continue" });
assert.deepEqual(decideHostRoute(`www.${CREATOR_HOST}`, "/"), {
  action: "redirect",
  destination: ABOUT_URL,
});
assert.deepEqual(decideHostRoute("www.lelekstudio.com", "/collections"), {
  action: "redirect",
  destination: `${ABOUT_URL}/#originals`,
});
assert.deepEqual(decideHostRoute("preview.vercel.app", "/about"), { action: "continue" });

console.log("links ok");
