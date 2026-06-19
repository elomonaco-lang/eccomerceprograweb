// Edge cases adicionales para mp-utils.js
// Cubre los casos límite del parsing de x-signature y el mapeo de status.

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import {
  verifyWebhookSignature,
  mapMpStatusToOrderStatus,
} from "../src/lib/mp-utils.js";

describe("verifyWebhookSignature — edge cases", () => {
  test("rechaza xSignature sin formato ts=...,v1=...", () => {
    const ok = verifyWebhookSignature({
      xSignature: "garbage-string-no-format",
      xRequestId: "req-1",
      dataId: "999",
      secret: "s",
    });
    assert.equal(ok, false);
  });

  test("rechaza xSignature con solo ts (falta v1)", () => {
    const ok = verifyWebhookSignature({
      xSignature: "ts=1700000000",
      xRequestId: "req-1",
      dataId: "999",
      secret: "s",
    });
    assert.equal(ok, false);
  });

  test("rechaza si v1 tiene longitud distinta a la firma esperada (anti-timing)", () => {
    const ok = verifyWebhookSignature({
      xSignature: "ts=1700000000,v1=ab", // muy corto
      xRequestId: "req-1",
      dataId: "999",
      secret: "s",
    });
    assert.equal(ok, false);
  });

  test("acepta firma válida SIN x-request-id (manifest omite request-id)", () => {
    const secret = "s";
    const dataId = "1";
    const ts = "1700000000";
    const manifest = `id:${dataId};ts:${ts};`;
    const v1 = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

    const ok = verifyWebhookSignature({
      xSignature: `ts=${ts},v1=${v1}`,
      xRequestId: null,
      dataId,
      secret,
    });
    assert.equal(ok, true);
  });

  test("rechaza si dataId difiere (manifest cambia → HMAC no matchea)", () => {
    const secret = "s";
    const ts = "1700000000";
    // Firma construida sobre dataId=A
    const manifest = `id:A;ts:${ts};`;
    const v1 = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

    // Pero pasamos dataId=B → debe rechazar
    const ok = verifyWebhookSignature({
      xSignature: `ts=${ts},v1=${v1}`,
      xRequestId: null,
      dataId: "B",
      secret,
    });
    assert.equal(ok, false);
  });

  test("rechaza si el secret no coincide", () => {
    const dataId = "1";
    const ts = "1700000000";
    const manifest = `id:${dataId};ts:${ts};`;
    const v1 = crypto
      .createHmac("sha256", "secret-correcto")
      .update(manifest)
      .digest("hex");

    const ok = verifyWebhookSignature({
      xSignature: `ts=${ts},v1=${v1}`,
      xRequestId: null,
      dataId,
      secret: "secret-equivocado",
    });
    assert.equal(ok, false);
  });
});

describe("mapMpStatusToOrderStatus — completitud de la tabla", () => {
  // Status documentados por MP que esperamos manejar explícitamente.
  const explicitMapping = [
    ["approved", "approved"],
    ["pending", "pending"],
    ["in_process", "pending"],
    ["authorized", "pending"],
    ["rejected", "rejected"],
    ["refunded", "refunded"],
    ["cancelled", "cancelled"],
    ["charged_back", "charged_back"],
  ];

  for (const [mp, internal] of explicitMapping) {
    test(`"${mp}" → "${internal}"`, () => {
      assert.equal(mapMpStatusToOrderStatus(mp), internal);
    });
  }

  test("status desconocido cae a pending (default seguro)", () => {
    assert.equal(mapMpStatusToOrderStatus("status_que_no_existe"), "pending");
    assert.equal(mapMpStatusToOrderStatus(""), "pending");
    assert.equal(mapMpStatusToOrderStatus(null), "pending");
    assert.equal(mapMpStatusToOrderStatus(undefined), "pending");
  });
});
