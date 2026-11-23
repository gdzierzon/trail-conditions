// Starts the trails API with the routes in app.js and the trails in MongoDB. Ready to use: you don't need to change
// this file.
// On your computer: npm run dev, which reads .env (copy .env.example to .env first).
// On a host such as Render: npm start, with MONGODB_URI set in the host's environment variables and PORT set by
// the host.
import { MongoClient } from "mongodb";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";

let config;
try {
  config = loadConfig(process.env);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const client = await MongoClient.connect(config.mongodbUri);
const app = createApp(client.db("trail_conditions"));

app.listen(config.port, () => {
  console.log(`The trails API is listening on port ${config.port}`);
});
