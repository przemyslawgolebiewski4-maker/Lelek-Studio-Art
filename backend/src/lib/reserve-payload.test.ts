import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildReservePublicPayload } from "../lib/reserve-payload";
import { INSTANCE_CODE_RE, normalizeCatalogCode } from "../lib/instance-code";

describe("buildReservePublicPayload", () => {
  const base = {
    title: "Soft Drip Cup",
    catalogCode: "CE-001",
    instanceCode: "CE-001-01",
    category: "ceramics",
    material: "250ml",
    price: 31,
    imageUrl: "/img.jpg",
    description: "Stoneware cup",
    locationName: "Kawiarnia Sowa",
    exhibitionEndDate: "2026-09-30T00:00:00.000Z",
    revolutPaymentLink: "https://checkout.revolut.com/pay/secret",
  } as const;

  it("includes revolutPaymentLink only when available", () => {
    const available = buildReservePublicPayload({
      ...base,
      exhibitionStatus: "available",
    });
    assert.equal(available.revolutPaymentLink, base.revolutPaymentLink);
    assert.ok("revolutPaymentLink" in available);

    const reserved = buildReservePublicPayload({
      ...base,
      exhibitionStatus: "reserved",
    });
    assert.equal("revolutPaymentLink" in reserved, false);

    const sold = buildReservePublicPayload({
      ...base,
      exhibitionStatus: "sold",
    });
    assert.equal("revolutPaymentLink" in sold, false);
  });
});

describe("instance code validation", () => {
  it("accepts CE-001-01 shaped codes", () => {
    assert.equal(INSTANCE_CODE_RE.test("CE-001-01"), true);
    assert.equal(INSTANCE_CODE_RE.test("SI-011-99"), true);
    assert.equal(INSTANCE_CODE_RE.test("ce-001-01"), false);
    assert.equal(INSTANCE_CODE_RE.test("CE-001"), false);
    assert.equal(INSTANCE_CODE_RE.test("CE-001-1"), false);
    assert.equal(INSTANCE_CODE_RE.test('{"$gt":""}'), false);
  });

  it("normalizes catalog codes", () => {
    assert.equal(normalizeCatalogCode("ce-001"), "CE-001");
    assert.equal(normalizeCatalogCode("bad"), null);
  });
});
