import assert from "node:assert/strict";
import {
  ABOUT_URL,
  CREATOR_HOST,
  STUDIO_ORIGIN,
  aboutHref,
  decideHostRoute,
  isAboutHref,
  opensInNewTab,
  resolvePublicHref,
  studioHref,
} from "./links";

assert.equal(resolvePublicHref("/about", "path"), "/about");
assert.equal(resolvePublicHref("/about#originals", "path"), "/about#originals");
assert.equal(resolvePublicHref("/journal", "path"), "/journal");
assert.equal(resolvePublicHref("/", "path"), "/");

assert.equal(resolvePublicHref("/about", "host"), `${STUDIO_ORIGIN}/about`);
assert.equal(resolvePublicHref("/about#originals", "host"), `${STUDIO_ORIGIN}/about#originals`);
assert.equal(resolvePublicHref("/journal", "host"), `${STUDIO_ORIGIN}/journal`);
assert.equal(resolvePublicHref("/", "host"), `${STUDIO_ORIGIN}/`);
assert.equal(resolvePublicHref("https://shop.lelekstudio.com", "host"), "https://shop.lelekstudio.com");
assert.equal(resolvePublicHref("https://www.lelekstudio.com/about", "host"), "https://www.lelekstudio.com/about");
assert.equal(
  resolvePublicHref("https://lelekstudio.com/about#originals", "host"),
  "https://lelekstudio.com/about#originals",
);
assert.equal(aboutHref("originals", "host"), `${STUDIO_ORIGIN}/about#originals`);
assert.equal(aboutHref("", "path"), "/about");
assert.equal(studioHref("/contact", "path"), "/contact");
assert.equal(studioHref("/contact", "host"), `${STUDIO_ORIGIN}/contact`);

assert.equal(isAboutHref("/about"), true);
assert.equal(isAboutHref("/about#originals"), true);
assert.equal(isAboutHref("/journal"), false);
assert.equal(isAboutHref(ABOUT_URL), true);
assert.equal(isAboutHref(`${STUDIO_ORIGIN}/journal`), false);

assert.deepEqual(decideHostRoute(CREATOR_HOST, "/"), { action: "rewrite", pathname: "/portfolio" });
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/about"), { action: "rewrite", pathname: "/portfolio/about" });
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/galleries"), {
  action: "rewrite",
  pathname: "/portfolio/galleries",
});
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/contact", "?from=nav"), {
  action: "rewrite",
  pathname: "/portfolio/contact",
});
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/portfolio"), {
  action: "redirect",
  destination: `${ABOUT_URL}/`,
});
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/portfolio/about", "?x=1"), {
  action: "redirect",
  destination: `${ABOUT_URL}/about?x=1`,
});
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/about/extra"), {
  action: "redirect",
  destination: `${ABOUT_URL}/about`,
});
assert.deepEqual(decideHostRoute("www.lelekstudio.com", "/about"), { action: "continue" });
assert.deepEqual(decideHostRoute("www.lelekstudio.com", "/galleries"), { action: "continue" });
assert.deepEqual(decideHostRoute("www.lelekstudio.com", "/portfolio/galleries"), {
  action: "redirect",
  destination: `${ABOUT_URL}/galleries`,
});
assert.deepEqual(decideHostRoute("lelekstudio.com", "/about", "?x=1"), { action: "continue" });
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/journal", "?y=2"), {
  action: "redirect",
  destination: `${STUDIO_ORIGIN}/journal?y=2`,
});
assert.deepEqual(decideHostRoute(CREATOR_HOST, "/api/proxy/settings/public"), { action: "continue" });
assert.deepEqual(decideHostRoute("localhost:3000", "/about"), { action: "continue" });
assert.deepEqual(decideHostRoute(`www.${CREATOR_HOST}`, "/"), {
  action: "redirect",
  destination: `${ABOUT_URL}/`,
});
assert.deepEqual(decideHostRoute(`www.${CREATOR_HOST}`, "/about"), {
  action: "redirect",
  destination: `${ABOUT_URL}/about`,
});
assert.deepEqual(decideHostRoute("www.lelekstudio.com", "/collections"), {
  action: "redirect",
  destination: `${STUDIO_ORIGIN}/about#originals`,
});
assert.deepEqual(decideHostRoute("preview.vercel.app", "/about"), { action: "continue" });

assert.equal(opensInNewTab("https://shop.lelekstudio.com"), true);
assert.equal(opensInNewTab("https://www.shop.lelekstudio.com/x"), true);
assert.equal(opensInNewTab(ABOUT_URL), true);
assert.equal(opensInNewTab(`${ABOUT_URL}/galleries`), true);
assert.equal(opensInNewTab("/about"), false);
assert.equal(opensInNewTab(`${STUDIO_ORIGIN}/contact`), false);
assert.equal(opensInNewTab("mailto:lelekstudio@lelekstudio.com"), false);
assert.equal(opensInNewTab("https://custom-shop.example/all", "https://custom-shop.example"), true);
assert.equal(opensInNewTab("https://other.example", "https://custom-shop.example"), false);

console.log("links ok");
