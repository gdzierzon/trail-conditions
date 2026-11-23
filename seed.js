// Puts Willow Creek Parks' six trails into the database MONGODB_URI names, such as your Atlas cluster.
// Run it once with: npm run seed (it reads .env). Running it again adds nothing: the trails are already there.
// Ready to use: you don't need to change this file.
import { MongoClient } from "mongodb";
import { loadConfig } from "./config.js";
import { startingTrails } from "./trail-data.js";

let config;
try {
  config = loadConfig(process.env);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const client = new MongoClient(config.mongodbUri);
try {
  const trails = client.db("trail_conditions").collection("trails");
  const count = await trails.countDocuments();
  if (count > 0) {
    console.log(`The trails collection already holds ${count} trails, so nothing was added.`);
  } else {
    const result = await trails.insertMany(startingTrails);
    console.log(`Added ${result.insertedCount} trails to the trail_conditions database.`);
  }
} finally {
  await client.close();
}
