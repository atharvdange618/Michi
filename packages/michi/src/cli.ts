#!/usr/bin/env tsx
import * as path from "node:path";
import { writeRouteTreeFile } from "./codegen";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: michi codegen [options]

Options:
  --routes-dir <path>  Route files directory  (default: src/routes)
  --out-file <path>    Output file path       (default: src/routeTree.gen.ts)
  -h, --help           Show this help message`);
  process.exit(0);
}

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const cwd = process.cwd();
const routesDir = path.resolve(cwd, getArg("--routes-dir") ?? "src/routes");
const outFile = path.resolve(cwd, getArg("--out-file") ?? "src/routeTree.gen.ts");

writeRouteTreeFile(routesDir, outFile);
console.log(`routeTree generated from ${path.relative(cwd, routesDir)} → ${path.relative(cwd, outFile)}`);
