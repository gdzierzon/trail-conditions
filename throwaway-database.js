// The throwaway database the tests use. You don't need to read it or change it.
//
// What it does, in order:
//   1. Before the tests, starts a throwaway MongoDB (mongodb-memory-server), so your own databases and your Atlas
//      cluster are never touched. If MongoDB is installed on this computer (the course's
//      setup lesson), it uses that one. If not, the first run downloads one into a cache folder, once per computer,
//      as package.json's "config" asks.
//   2. Before every test, puts the six starting trails back, so each test starts from the same data.
//   3. After the last test, stops everything.
import { before, after, beforeEach } from "node:test";
import { existsSync, readdirSync } from "node:fs";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import { startingTrails } from "./trail-data.js";

// The mongod program the course's setup lesson installs, if this computer has it.
function installedMongoDB() {
  if (process.env.MONGOMS_SYSTEM_BINARY) {
    return undefined; // you named one yourself, and mongodb-memory-server uses that
  }
  const places = ["/opt/homebrew/bin/mongod", "/usr/local/bin/mongod", "/usr/bin/mongod"]; // macOS and Linux
  const windows = "C:\\Program Files\\MongoDB\\Server"; // one folder per version, such as 9.0
  if (process.platform === "win32" && existsSync(windows)) {
    const versions = readdirSync(windows).sort((a, b) => parseFloat(b) - parseFloat(a)); // newest first
    places.unshift(...versions.map((version) => `${windows}\\${version}\\bin\\mongod.exe`));
  }
  return places.find((place) => existsSync(place));
}

// Call this once at the top of a test file. It gives back db(), the throwaway database, for the tests to hand to
// createApp(db).
export function startThrowawayDatabase() {
  let server;
  let client;
  let db;

  before(async () => {
    const installed = installedMongoDB();
    server = await MongoMemoryServer.create(installed ? { binary: { systemBinary: installed } } : {});
    client = await MongoClient.connect(server.getUri());
    db = client.db("trail_conditions");
  });

  beforeEach(async () => {
    const trails = db.collection("trails");
    await trails.deleteMany({});
    await trails.insertMany(startingTrails.map((trail) => ({ ...trail })));
  });

  after(async () => {
    await client?.close();
    await server?.stop();
  });

  return { db: () => db };
}
