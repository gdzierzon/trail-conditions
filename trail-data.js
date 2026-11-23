// The six trails Willow Creek Parks starts with, each with its latest report. Ready to use.
// seed.js puts them into your database, and the tests load them into their throwaway database.
// status is always one of three words: "open", "muddy" or "closed".
export const startingTrails = [
  {
    slug: "cedar-falls-loop",
    name: "Cedar Falls Loop",
    miles: 3.2,
    status: "open",
    lastReport: { date: "2026-11-14", note: "Dry and clear all the way to the falls." },
  },
  {
    slug: "lookout-ridge",
    name: "Lookout Ridge Trail",
    miles: 5.8,
    status: "muddy",
    lastReport: { date: "2026-11-15", note: "Muddy past the second bridge. Wear boots." },
  },
  {
    slug: "creekside-path",
    name: "Creekside Path",
    miles: 1.5,
    status: "open",
    lastReport: { date: "2026-11-15", note: "Paved and dry. Good for strollers." },
  },
  {
    slug: "bear-hollow",
    name: "Bear Hollow Trail",
    miles: 4.1,
    status: "closed",
    lastReport: { date: "2026-11-12", note: "Closed for a fallen tree near mile 2." },
  },
  {
    slug: "meadow-view-loop",
    name: "Meadow View Loop",
    miles: 2.4,
    status: "muddy",
    lastReport: { date: "2026-11-16", note: "Soft ground in the low meadow after rain." },
  },
  {
    slug: "summit-switchbacks",
    name: "Summit Switchbacks",
    miles: 7.3,
    status: "open",
    lastReport: { date: "2026-11-16", note: "Clear to the top. Windy at the summit." },
  },
];
