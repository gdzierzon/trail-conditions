// Tests for your work: is the API ready for a host? Run every test with: npm test (run npm install once first).
// They check the health route in app.js, loadConfig in config.js, the start script in package.json, .gitignore
// and .env.example. No server needs to be running, and no port is used: Supertest hands each request to the app createApp(db) builds, and
// the tests use a throwaway MongoDB (throwaway-database.js). You don't need to change this file.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import request from "supertest";
import { MongoClient } from "mongodb";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { startThrowawayDatabase } from "./throwaway-database.js";

const database = startThrowawayDatabase();

// A made-up connection string for the loadConfig tests. Nothing connects to it.
const uri = "mongodb://localhost:27017/trails-test";
const missingUri = "MONGODB_URI is missing: set it in .env on your computer, or in your host's environment variables.";

// Reads a file in this folder as text, or gives back null when it isn't there.
function readText(name) {
  const url = new URL(name, import.meta.url);
  return existsSync(url) ? readFileSync(url, "utf8") : null;
}

// Checks the parts every answer shares: its status code and its Content-Type header.
function assertJson(response, status, what) {
  assert.equal(response.status, status,
    `${what} should answer ${status}, but it answered ${response.status} with ${JSON.stringify(response.body)}.`);
  assert.match(response.headers["content-type"] ?? "(none)", /application\/json/, `${what} should answer with JSON.`);
}

test("1) GET /health answers 200 with { status: \"ok\" } when the database answers", async () => {
  const response = await request(createApp(database.db())).get("/health");
  assertJson(response, 200, "GET /health");
  assert.deepEqual(response.body, { status: "ok" });
});

test("2) GET /health answers 503 with { status: \"unavailable\" } when the database doesn't answer", async () => {
  // A database at an address where nothing is listening, that gives up after half a second.
  const nowhere = new MongoClient("mongodb://127.0.0.1:1", { serverSelectionTimeoutMS: 500 });
  try {
    const response = await request(createApp(nowhere.db("trail_conditions"))).get("/health");
    assertJson(response, 503, "GET /health, with a database that doesn't answer,");
    assert.deepEqual(response.body, { status: "unavailable" },
      "Catch the error pingDatabase() throws, and answer 503 instead of letting the request fail.");
  } finally {
    await nowhere.close();
  }
});

test("3) loadConfig with PORT \"10000\" gives port 10000, a number, as Render's PORT does", () => {
  const config = loadConfig({ PORT: "10000", MONGODB_URI: uri });
  assert.equal(config.port, 10000, `port should be the number 10000, but it was ${JSON.stringify(config.port)}.`);
});

test("4) loadConfig with no PORT gives port 3100, and mongodbUri exactly as MONGODB_URI holds it", () => {
  const config = loadConfig({ MONGODB_URI: uri });
  assert.deepEqual(config, { port: 3100, mongodbUri: uri },
    "With no PORT, port should be 3100, and mongodbUri should be MONGODB_URI as it was given.");
});

test("5) loadConfig with an empty PORT, \"\", gives port 3100, and mongodbUri exactly as MONGODB_URI holds it", () => {
  const config = loadConfig({ PORT: "", MONGODB_URI: uri });
  assert.deepEqual(config, { port: 3100, mongodbUri: uri },
    "An empty PORT counts as not set, so port should be 3100, and mongodbUri should be MONGODB_URI as it was given.");
});

test("6) loadConfig with no MONGODB_URI throws \"MONGODB_URI is missing: …\"", () => {
  assert.throws(() => loadConfig({ PORT: "10000" }), { message: missingUri },
    `With no MONGODB_URI, loadConfig should throw an Error with the message: ${missingUri}`);
});

test("7) loadConfig with an empty MONGODB_URI, \"\", throws \"MONGODB_URI is missing: …\"", () => {
  assert.throws(() => loadConfig({ MONGODB_URI: "" }), { message: missingUri },
    `An empty MONGODB_URI counts as missing, so loadConfig should throw an Error with the message: ${missingUri}`);
});

test("8) loadConfig with PORT \"abc\" throws \"PORT must be a whole number, such as 3100.\"", () => {
  assert.throws(() => loadConfig({ PORT: "abc", MONGODB_URI: uri }), { message: "PORT must be a whole number, such as 3100." });
});

test("9) npm start runs server.js without --env-file=.env or --watch, since a host has no .env file", () => {
  const start = JSON.parse(readText("package.json")).scripts?.start ?? "(none)";
  assert.match(start, /server\.js/, `The start script should run server.js, but it is: ${start}`);
  assert.doesNotMatch(start, /--env-file=/,
    `The start script is "${start}". On a host there's no .env file, and node stops with ".env: not found". Leave --env-file to the dev script.`);
  assert.doesNotMatch(start, /--watch/, `The start script is "${start}". A host runs it once: --watch is for your own computer.`);
});

test("10) .gitignore has a line .env, so Git never commits your password", () => {
  const lines = (readText(".gitignore") ?? "").split(/\r?\n/).map((line) => line.trim());
  assert.ok(lines.includes(".env"), "Add a line that says .env to .gitignore.");
  assert.ok(lines.includes("node_modules/"), "Keep the node_modules/ line in .gitignore too.");
});

test("11) .env.example has a MONGODB_URI line with <placeholders>, not a real password", () => {
  const text = readText(".env.example");
  assert.notEqual(text, null, "Make a file named .env.example in this folder.");
  const line = text.split(/\r?\n/).find((l) => l.startsWith("MONGODB_URI="));
  assert.ok(line, "Add a line that starts MONGODB_URI= to .env.example.");
  assert.match(line, /<[^>]+>/,
    "The MONGODB_URI line should show placeholders in angle brackets, such as <db_password>, never your real connection string.");
});
