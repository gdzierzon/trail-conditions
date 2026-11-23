# Exercise: Trail Conditions Online

Exercise code for the lesson **Exercise: Trail Conditions Online** in the Node.js in Depth course on [ask-codey.com](https://www.ask-codey.com).

**Live link:** add yours here once it's online, such as `https://your-service-name.onrender.com/trails`

Hikers keep phoning Willow Creek Parks' ranger station to ask which trails are muddy. The parks department's trails API is finished and tested, but it only runs on a laptop. You'll get it ready for a host: settings read from the environment, a `/health` route, a start script that needs no `.env` file, and the database password kept out of Git. Tests check each one. Then you'll put it online with a free MongoDB Atlas cluster and Render's free web service, and put the live link above.

## What's here

- `config.js`: `loadConfig(env)`, which reads the API's settings from the environment. For now it ignores the environment, so it only works on a laptop. The comment at the top lists exactly what it should do. For you to finish.
- `app.js`: `createApp(db)`, which builds the Express app around the database it's given. The trail routes are finished. The comment at the top lists every request, including `GET /health`, which is yours to add.
- `package.json`: the project's settings and scripts. Its `start` script is yours to fix. Its packages are pinned at exact versions: Express and the MongoDB driver, with Supertest and mongodb-memory-server for the tests.
- `.gitignore`: the files Git leaves out. Yours to finish.
- `trails.js`: the trails, kept in MongoDB's `trails` collection: `createTrailsRepository(db)`, with `listTrails`, `findTrail` and `pingDatabase`. Ready to use.
- `trail-data.js`: Willow Creek Parks' six starting trails. Ready to use.
- `server.js`: reads the settings with `loadConfig`, connects to MongoDB and starts the API. Ready to use.
- `seed.js`: puts the six trails into your database (your Atlas cluster), once, with `npm run seed`. Ready to use.
- `trails.insomnia.json`: the requests to try, as an Insomnia collection, on your computer and online.
- `ready-for-a-host.test.js`: the tests for your work. You don't need to change this file.
- `trails.test.js`: the tests for the finished trail routes, which pass from the start. You don't need to change this file.
- `throwaway-database.js`: starts the throwaway MongoDB the tests use. You don't need to read or change it.
- `package-lock.json`: the exact version of every package, for `npm ci`.

## Before you start

In VS Code's terminal, in this folder, install the packages:

```bash
npm install
```

It makes a `node_modules` folder. That folder is in `.gitignore`, so Git leaves it out: `npm install` makes it again on any computer.

## Run it

To run the API yourself (the tests don't need this), make `.env.example` (step 5 below), copy it to a new file named `.env`, and put a connection string in it: your Atlas cluster's, or `mongodb://localhost:27017` for the MongoDB on your computer. Then put the trails into that database, once, and start the API:

```bash
npm run seed
npm run dev
```

The terminal says `The trails API is listening on port 3100` and keeps running. `npm run dev` reads `.env` and restarts each time you save. In Insomnia, click **Import** in your `Node.js in Depth` project, choose `trails.insomnia.json`, and send any request; its description says what to expect. Stop the server with **Ctrl+C**.

## Check your work

```bash
npm test
```

No server needs to be running, and you don't need `.env`: the tests start their own throwaway MongoDB. At first the 11 tests in `ready-for-a-host.test.js` fail, and the 5 trail-route tests pass: that is expected. Each step below turns its tests green. A failing test's message says what it expected, for example *GET /health should answer 200, but it answered 404.*

If you installed MongoDB on your computer in the course's setup lesson, the tests use it. If you didn't, the first `npm test` downloads MongoDB 9.0.8 for the tests (nearly 1 GB on Windows, about 180 MB on a Mac) and keeps it for every exercise after this one.

## The rules

1. Finish `loadConfig(env)` in `config.js`, exactly as its comment says, error messages included.
2. Add `GET /health` to `app.js`: `200` with `{ "status": "ok" }` when `await trails.pingDatabase()` succeeds, and `503` with `{ "status": "unavailable" }` when it throws.
3. Fix the `start` script in `package.json`, so it runs `server.js` with neither `--env-file=.env` nor `--watch`. Leave `dev` and `seed` as they are.
4. Add a line `.env` to `.gitignore`, keeping `node_modules/`.
5. Make `.env.example`, with a line that starts `MONGODB_URI=` and shows the Atlas connection string with placeholders in angle brackets, such as `<db_password>`. Never put your real connection string in it, or in any file Git can see.
6. Don't change `trails.js`, `trail-data.js`, `server.js`, `seed.js` or the tests.

## Tips

- `!env.MONGODB_URI` is true when the setting is missing and when it's empty.
- Environment variables are always text: `Number("10000")` gives `10000`, `Number("abc")` gives `NaN`, and `Number.isInteger(port)` is true only for a whole number.
- The health route needs `try` and `catch` around `await trails.pingDatabase()`. `trails` is the repository `createApp` already makes from `db`.
- On a host there's no `.env` file: Render supplies `MONGODB_URI` and `PORT` as environment variables, so the `start` script runs plain `node server.js`.

## Put it online

When every test is green:

1. Make a free MongoDB Atlas cluster, with a database user and `0.0.0.0/0` in its IP access list, as the lesson *A Free MongoDB Atlas Cluster* shows. Choose the option labeled **Free**; if a screen asks for a credit card, stop: this exercise never needs a paid plan.
2. Copy `.env.example` to `.env`, put your own connection string in it, and run `npm run seed` once. It says `Added 6 trails to the trail_conditions database.`
3. Try it on your computer with `npm run dev` and the `trails.insomnia.json` collection in Insomnia.
4. Push your work to a public repository of your own on GitHub (the lesson page shows the Git commands).
5. On render.com, make a web service from that repository, as the lesson *Put Your API Online with Render* shows: build command `npm ci`, start command `npm start`, the **Free** instance type, `MONGODB_URI` as an environment variable holding your connection string, and `/health` as the health check path.
6. When the deploy is live, put your address in `base_url`, in the collection's **Base Environment**, and send the requests again. A free service sleeps after 15 minutes with no requests, so the first answer after that takes about a minute.
7. Put your live link on the **Live link** line at the top of this README, then commit and push. Render deploys again by itself.

## Hand it in

When it works and it's online, push your solution to a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. The lesson page shows the Git commands, step by step.
