// The trails, kept in MongoDB's trails collection. Ready to use: you don't need to change this file.
// createTrailsRepository(db) gives back three functions for the database it's given. app.js's createApp(db) makes
// one, so every route uses the database server.js (or a test) handed it.
export function createTrailsRepository(db) {
  const trails = db.collection("trails");

  return {
    // Every trail, sorted by name, or only those whose status is the one given ("open", "muddy" or "closed").
    listTrails(status) {
      const filter = status === undefined ? {} : { status };
      return trails.find(filter, { projection: { _id: 0 } }).sort({ name: 1 }).toArray();
    },

    // One trail by its slug, such as "cedar-falls-loop", or null when there's no such trail.
    findTrail(slug) {
      return trails.findOne({ slug }, { projection: { _id: 0 } });
    },

    // Asks the database to answer. It resolves when the database answers, and throws when it doesn't.
    async pingDatabase() {
      await db.command({ ping: 1 });
    },
  };
}
