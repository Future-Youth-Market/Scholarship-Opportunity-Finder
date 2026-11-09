import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import type {
  Listing,
  ResearchRecord,
  ReviewDecision,
} from "../../src/data/schema.ts";
import { selectListings, validatePublished } from "./review.ts";
export function scholarshipDataPlugin(root = process.cwd()): Plugin {
  let dev = false;
  const virtual = "virtual:fym-data",
    id = "\0" + virtual;
  return {
    name: "fym-scholarship-data",
    config(_config, env) {
      dev = env.command === "serve" && !env.isPreview;
    },
    resolveId(source) {
      if (source === virtual) return id;
    },
    load(source) {
      if (source !== id) return;
      if (!dev) {
        const approved = JSON.parse(
          readFileSync(resolve(root, "src/data/scholarships.json"), "utf8"),
        ) as Listing[];
        const decisions = JSON.parse(
          readFileSync(resolve(root, "data/reviews.json"), "utf8"),
        ) as ReviewDecision[];
        validatePublished(approved, decisions);
        return `export const preview=false; export const dataError=null; export default ${JSON.stringify(approved)};`;
      }
      try {
        const path = resolve(root, "data/private/research.json");
        const records = existsSync(path)
          ? (JSON.parse(readFileSync(path, "utf8")) as ResearchRecord[])
          : [];
        const decisions = JSON.parse(
          readFileSync(resolve(root, "data/reviews.json"), "utf8"),
        ) as ReviewDecision[];
        return `export const preview=true; export const dataError=null; export default ${JSON.stringify(selectListings(records, decisions, true))};`;
      } catch {
        return 'export const preview=true; export const dataError="Research data could not be loaded. Fix the import report and restart the local server."; export default [];';
      }
    },
    configureServer(server) {
      // Never serve raw ignored research files through Vite's filesystem endpoint.
      server.middlewares.use((req, res, next) => {
        let url: string;
        try {
          url = decodeURIComponent((req.url ?? "").split("?")[0]);
        } catch {
          res.statusCode = 400;
          res.end("Invalid URL");
          return;
        }
        if (/(?:data\/private|data\/incoming|reports|downloads)/i.test(url)) {
          res.statusCode = 403;
          res.end("Private source files are not served.");
        } else next();
      });
    },
  };
}
