import type { Listing, ReviewDecision } from "../src/data/schema.ts";
import { readJson } from "./lib/files.ts";
import { validatePublished } from "./lib/review.ts";
const data = readJson<Listing[]>("src/data/scholarships.json"),
  reviews = readJson<ReviewDecision[]>("data/reviews.json");
validatePublished(data, reviews);
console.log(
  `Public dataset: ${data.length} approved records; matching content-bound decisions confirmed.`,
);
