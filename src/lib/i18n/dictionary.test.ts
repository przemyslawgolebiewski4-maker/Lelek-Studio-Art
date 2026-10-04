import assert from "node:assert/strict";
import { polishCopyEntries, polishHasLongDash, suggestPl } from "./dictionary";
import { MESSAGES } from "./messages";

const polishValues = [
  ...polishCopyEntries().map(([, pl]) => pl),
  ...Object.values(MESSAGES.pl),
];

for (const value of polishValues) {
  assert.equal(polishHasLongDash(value), false, `long dash in: ${value}`);
}

assert.equal(suggestPl("The process comes first."), "Najpierw jest proces.");
assert.equal(suggestPl("A space is never just a space."), "Przestrzeń nigdy nie jest tylko przestrzenią.");
assert.equal(suggestPl("For architects & interior designers"), "Dla architektów i projektantów wnętrz");
assert.equal(suggestPl("Shop"), "Sklep");
assert.equal(suggestPl("Not a known sentence"), "");

const enKeys = Object.keys(MESSAGES.en).sort();
const plKeys = Object.keys(MESSAGES.pl).sort();
assert.deepEqual(plKeys, enKeys);

console.log(`i18n ok: ${polishValues.length} Polish strings`);
