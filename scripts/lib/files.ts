import {
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { dirname } from "node:path";
export function readJson<T>(path: string, fallback?: T): T {
  if (!existsSync(path) && fallback !== undefined) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}
export function atomicWrite(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.${process.pid}.tmp`;
  writeFileSync(temp, JSON.stringify(value, null, 2) + "\n");
  renameSync(temp, path);
}
