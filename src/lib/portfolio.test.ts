import assert from "node:assert/strict";
import { photosFromProducts, portfolioStructuredData, presentPortfolio } from "./portfolio";

const empty = presentPortfolio({}, "en");
assert.equal(empty.name, "Przemysław Gołębiewski");
assert.equal(empty.role, "visual artist");
assert.equal(empty.navAbout, "About");
assert.equal(empty.navGalleries, "Galleries");
assert.equal(empty.navContact, "Contact");
assert.equal(empty.aboutBody, "");
assert.equal(empty.intro, "");
assert.equal(empty.seoTitle, "");
assert.equal(empty.geoSummary, "");
assert.equal(empty.aeoAnswer, "");
assert.deepEqual(empty.aeoItems, []);
assert.deepEqual(empty.works, []);

const structured = portfolioStructuredData(
  {
    ...empty,
    geoSummary: "Visual artist working in Berlin.",
    geoPlace: "Berlin",
    geoSameAs: ["https://shop.lelekstudio.com"],
    aeoQuestion: "Who is Przemysław Gołębiewski?",
    aeoAnswer: "A visual artist.",
  },
  ["https://www.instagram.com/lelek.studio_/", "https://shop.lelekstudio.com"],
);
const graph = structured["@graph"] as Array<Record<string, unknown>>;
assert.equal(graph[0]?.description, "Visual artist working in Berlin.");
assert.equal((graph[0]?.homeLocation as { name: string }).name, "Berlin");
assert.equal((graph[0]?.sameAs as string[]).length, 2);
assert.equal(graph[1]?.["@type"], "FAQPage");

const pl = presentPortfolio({}, "pl");
assert.equal(pl.name, "Przemysław Gołębiewski");
assert.equal(pl.role, "artysta wizualny");
assert.equal(pl.navAbout, "O mnie");
assert.equal(pl.navGalleries, "Galerie");
assert.equal(pl.navContact, "Kontakt");

const custom = presentPortfolio(
  {
    name: "Studio Name",
    role: "visual artist",
    i18n: { pl: { role: "własna rola", navAbout: "" } },
    works: [
      { image: "", title: "Skip" },
      { image: "https://cdn.example/a.jpg", title: "Vessel", caption: "2024", alt: "Clay vessel", titlePl: "Naczynie" },
      "nope",
    ],
    contactEmail: "  hello@example.com ",
  },
  "pl",
);
assert.equal(custom.name, "Studio Name");
assert.equal(custom.role, "własna rola");
assert.equal(custom.navAbout, "O mnie");
assert.equal(custom.works.length, 1);
assert.equal(custom.works[0]?.title, "Naczynie");
assert.equal(custom.works[0]?.caption, "2024");
assert.equal(custom.contactEmail, "hello@example.com");

const photos = photosFromProducts([
  { isPortfolio: false, title: "Skip", images: ["https://cdn.example/skip.jpg"] },
  {
    isPortfolio: true,
    title: "Vessel",
    catalog: "CE-001",
    imageAlt: "Clay vessel",
    images: [" https://cdn.example/a.jpg ", "", "https://cdn.example/b.jpg"],
    currentGallery: { name: "Partner", url: "https://gallery.example/show" },
  },
  {
    isPortfolio: true,
    title: "Held",
    soldOut: true,
    images: ["https://cdn.example/sold.jpg", "https://cdn.example/sold-2.jpg"],
    currentGallery: { name: "Hidden", url: "https://gallery.example/hidden" },
  },
  { isPortfolio: true, title: "Empty", images: [] },
]);
assert.equal(photos.length, 2);
assert.equal(photos[0]?.image, "https://cdn.example/a.jpg");
assert.equal(photos[0]?.title, "Vessel");
assert.equal(photos[0]?.caption, "CE-001");
assert.equal(photos[0]?.alt, "Clay vessel");
assert.equal(photos[0]?.galleryName, "Partner");
assert.equal(photos[0]?.galleryUrl, "https://gallery.example/show");
assert.equal(photos[0]?.soldOut, false);
assert.equal(photos[1]?.image, "https://cdn.example/sold.jpg");
assert.equal(photos[1]?.soldOut, true);
assert.equal(photos[1]?.galleryUrl, "");

console.log("portfolio ok");
