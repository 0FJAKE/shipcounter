#!/usr/bin/env node
// Bump the shipped-apps count and push it live.
//
//   npm run ship        -> increment the count by 1
//   npm run ship -- 12  -> set the count to exactly 12
//
// It edits SHIPPED_COUNT in app/page.tsx, commits, and pushes to GitHub,
// which triggers an automatic Vercel deploy.

import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = join(root, "app", "page.tsx");
const pattern = /const SHIPPED_COUNT = (\d+);/;

const src = readFileSync(pagePath, "utf8");
const match = src.match(pattern);
if (!match) {
  console.error("Could not find `const SHIPPED_COUNT = <number>;` in app/page.tsx");
  process.exit(1);
}

const current = Number(match[1]);
const arg = process.argv[2];
let next;
if (arg === undefined) {
  next = current + 1;
} else if (/^\d+$/.test(arg)) {
  next = Number(arg);
} else {
  console.error(`Invalid count "${arg}" — pass a whole number, or nothing to add 1.`);
  process.exit(1);
}

if (next === current) {
  console.log(`Count is already ${current}. Nothing to do.`);
  process.exit(0);
}

writeFileSync(pagePath, src.replace(pattern, `const SHIPPED_COUNT = ${next};`));
console.log(`Count: ${current} -> ${next}`);

const git = (...args) => execFileSync("git", args, { cwd: root, stdio: "inherit" });
git("add", "app/page.tsx");
git("commit", "-m", `Ship: count now ${next}`);
git("push");

console.log(`\n✅ Pushed. Vercel is redeploying — your site will show ${next} in ~1 minute.`);
