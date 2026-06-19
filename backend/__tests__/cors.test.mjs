// Tests del helper de CORS.
// El módulo lee ALLOWED_ORIGINS de process.env al importarse, por eso seteamos
// la env antes de hacer el dynamic import.
//
// Correr con: npm test

import { test, describe } from "node:test";
import assert from "node:assert/strict";

async function importCors(allowed) {
  process.env.ALLOWED_ORIGINS = allowed;
  // Cache-bust con query string para que cada test cargue el módulo limpio
  // (los ESM imports se cachean por specifier; node:test no aisla módulos).
  const mod = await import(`../src/lib/cors.js?cache=${Math.random()}`);
  return mod;
}

describe("corsHeaders", () => {
  test("acepta origen incluido en la lista", async () => {
    const { corsHeaders } = await importCors(
      "https://musictrack.vercel.app,http://localhost:3000"
    );
    const h = corsHeaders("https://musictrack.vercel.app");
    assert.equal(h["Access-Control-Allow-Origin"], "https://musictrack.vercel.app");
  });

  test("rechaza origen no listado y cae al primer allowed", async () => {
    const { corsHeaders } = await importCors(
      "https://musictrack.vercel.app,http://localhost:3000"
    );
    const h = corsHeaders("https://evil.com");
    assert.equal(h["Access-Control-Allow-Origin"], "https://musictrack.vercel.app");
  });

  test("comodín * permite cualquier origen", async () => {
    const { corsHeaders } = await importCors("*");
    const h = corsHeaders("https://random-domain.example");
    assert.equal(h["Access-Control-Allow-Origin"], "https://random-domain.example");
  });

  test("devuelve métodos y headers permitidos", async () => {
    const { corsHeaders } = await importCors("http://localhost:3000");
    const h = corsHeaders("http://localhost:3000");
    assert.equal(h["Access-Control-Allow-Methods"], "GET, POST, OPTIONS");
    assert.equal(
      h["Access-Control-Allow-Headers"],
      "Content-Type, Authorization"
    );
    assert.equal(h["Access-Control-Max-Age"], "86400");
  });

  test("origen null/undefined cae al primer allowed (no rompe)", async () => {
    const { corsHeaders } = await importCors("https://musictrack.vercel.app");
    const h = corsHeaders(null);
    assert.equal(h["Access-Control-Allow-Origin"], "https://musictrack.vercel.app");
  });
});

describe("handleOptions", () => {
  test("responde 204 con headers de CORS", async () => {
    const { handleOptions } = await importCors("http://localhost:3000");
    const req = new Request("http://localhost:3001/api/products", {
      method: "OPTIONS",
      headers: { origin: "http://localhost:3000" },
    });
    const res = handleOptions(req);
    assert.equal(res.status, 204);
    assert.equal(res.headers.get("Access-Control-Allow-Origin"), "http://localhost:3000");
    assert.equal(res.headers.get("Access-Control-Allow-Methods"), "GET, POST, OPTIONS");
  });
});
