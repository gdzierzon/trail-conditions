// The trail routes' tests. Run every test with: npm test (run npm install once first).
// The trail routes are finished, so these tests pass from the start: they're here so you notice at once if a change
// breaks something that already worked. Your own work is checked in ready-for-a-host.test.js.
// No server needs to be running, and no port is used. The tests use a throwaway MongoDB (throwaway-database.js),
// so your own databases and your Atlas cluster are never touched. You don't need to change this file.
import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "./app.js";
import { startThrowawayDatabase } from "./throwaway-database.js";
import { startingTrails } from "./trail-data.js";

const database = startThrowawayDatabase();

const trail = (slug) => startingTrails.find((t) => t.slug === slug);
const byName = (trails) => [...trails].sort((a, b) => a.name.localeCompare(b.name));

// Checks the parts every answer shares: its status code and its Content-Type header.
function assertJson(response, status, what) {
  assert.equal(response.status, status,
    `${what} should answer ${status}, but it answered ${response.status} with ${JSON.stringify(response.body)}.`);
  assert.match(response.headers["content-type"] ?? "(none)", /application\/json/, `${what} should answer with JSON.`);
}

test("API 1) GET /trails answers 200 with all 6 trails, sorted by name", async () => {
  const response = await request(createApp(database.db())).get("/trails");
  assertJson(response, 200, "GET /trails");
  assert.deepEqual(response.body, byName(startingTrails));
});

test("API 2) GET /trails?status=muddy answers 200 with the 2 muddy trails: Lookout Ridge Trail and Meadow View Loop", async () => {
  const response = await request(createApp(database.db())).get("/trails?status=muddy");
  assertJson(response, 200, "GET /trails?status=muddy");
  assert.deepEqual(response.body, [trail("lookout-ridge"), trail("meadow-view-loop")]);
});

test("API 3) GET /trails?status=icy answers 400 with \"status must be open, muddy or closed.\"", async () => {
  const response = await request(createApp(database.db())).get("/trails?status=icy");
  assertJson(response, 400, "GET /trails?status=icy");
  assert.deepEqual(response.body, { status: 400, title: "Bad Request", detail: "status must be open, muddy or closed." });
});

test("API 4) GET /trails/bear-hollow answers 200 with Bear Hollow Trail, closed", async () => {
  const response = await request(createApp(database.db())).get("/trails/bear-hollow");
  assertJson(response, 200, "GET /trails/bear-hollow");
  assert.deepEqual(response.body, trail("bear-hollow"));
});

test("API 5) GET /trails/moon-trail answers 404 with \"There's no trail called moon-trail.\"", async () => {
  const response = await request(createApp(database.db())).get("/trails/moon-trail");
  assertJson(response, 404, "GET /trails/moon-trail");
  assert.deepEqual(response.body, { status: 404, title: "Not Found", detail: "There's no trail called moon-trail." });
});
