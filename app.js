// Willow Creek Parks' trail conditions API: the finished version.
// Other answers work as well, such as the health check in its own router, as long as every request below gets
// its answer.
//
// The trail routes are finished and tested (trails.test.js). GET /health is the one to add: a host such as Render
// sends it to ask "are you working?", and sends visitors only to a server that answers 200.
//
// createApp(db) builds the app around the database it's given: server.js gives it your MongoDB, and the tests give
// it a throwaway one (or one that never answers). trails, the repository it makes from db, does the database work.
//
//   GET /trails                 200, every trail, sorted by name
//   GET /trails?status=muddy    200, only the trails with that status (open, muddy or closed)
//   GET /trails?status=icy      400, { "status": 400, "title": "Bad Request", "detail": "status must be open, muddy or closed." }
//   GET /trails/bear-hollow     200, that one trail
//   GET /trails/moon-trail      404, { "status": 404, "title": "Not Found", "detail": "There's no trail called moon-trail." }
//   GET /health                 200, { "status": "ok" } when await trails.pingDatabase() succeeds
//                               503, { "status": "unavailable" } when it throws, because the database didn't answer
//   anything else               404, { "status": 404, "title": "Not Found", "detail": "There's nothing at /the-path." }
import express from "express";
import { STATUS_CODES } from "node:http";
import { createTrailsRepository } from "./trails.js";

// Every error answer has the course's one shape: { status, title, detail }.
function sendProblem(res, status, detail) {
  res.status(status).json({ status, title: STATUS_CODES[status], detail });
}

export function createApp(db) {
  const trails = createTrailsRepository(db);
  const app = express();

  const statuses = ["open", "muddy", "closed"];

  app.get("/trails", async (req, res) => {
    const { status } = req.query;
    if (status !== undefined && !statuses.includes(status)) {
      return sendProblem(res, 400, "status must be open, muddy or closed.");
    }
    res.json(await trails.listTrails(status));
  });

  app.get("/trails/:slug", async (req, res) => {
    const trail = await trails.findTrail(req.params.slug);
    if (trail === null) {
      return sendProblem(res, 404, `There's no trail called ${req.params.slug}.`);
    }
    res.json(trail);
  });

  app.get("/health", async (req, res) => {
    try {
      await trails.pingDatabase();
      res.json({ status: "ok" });
    } catch {
      res.status(503).json({ status: "unavailable" });
    }
  });

  app.use((req, res) => {
    sendProblem(res, 404, `There's nothing at ${req.path}.`);
  });

  return app;
}
