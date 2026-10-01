import assert from "node:assert/strict";
import { presentPortfolio } from "./portfolio";

const empty = presentPortfolio({}, "en");
assert.equal(empty.name, "Przemysław Gołębiewski");
assert.equal(empty.role, "visual artist");
assert.equal(empty.navAbout, "About");
assert.equal(empty.navGalleries, "Galleries");
assert.equal(empty.navContact, "Contact");
assert.equal(empty.aboutBody, "");
assert.equal(empty.intro, "");
assert.deepEqual(empty.works, []);

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

console.log("portfolio ok");
