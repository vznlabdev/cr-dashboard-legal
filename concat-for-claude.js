#!/usr/bin/env node
/**
 * Concatenate entire project into one file for Claude.
 *
 * Run:
 *   node concat-for-claude.js
 *   → writes to cr-dashboard-legal-full.txt in this folder
 *
 * To write directly to your Desktop:
 *   OUT_TO_DESKTOP=1 node concat-for-claude.js
 *
 * Then move or upload cr-dashboard-legal-full.txt to Claude.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname);
// Write to Desktop if possible, else project root
const desktop = path.join(process.env.HOME || require("os").homedir(), "Desktop", "cr-dashboard-legal-full.txt");
const ROOT_OUT = path.join(ROOT, "cr-dashboard-legal-full.txt");
const OUT_PATH = process.env.OUT_TO_DESKTOP === "1" ? desktop : ROOT_OUT;

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "out",
  "build",
  ".git",
  "coverage",
  ".vercel",
  ".nyc_output",
  "__snapshots__",
]);

const SKIP_FILES = new Set([
  "package-lock.json",
  "concat-for-claude.js",
  ".DS_Store",
]);

const INCLUDE_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".css",
  ".mjs",
  ".cjs",
  ".md",
]);

const INCLUDE_ROOT_FILES = [
  "package.json",
  "tsconfig.json",
  "components.json",
  "postcss.config.mjs",
  "eslint.config.mjs",
  "jest.config.js",
  "jest.setup.js",
  ".prettierrc",
  ".prettierignore",
  ".eslintignore",
  ".gitignore",
  "next.config.ts",
  "next.config.js",
  "docker-compose.yml",
  "Dockerfile",
  ".dockerignore",
  ".lintstagedrc.js",
  ".npmrc",
];

const ROOT_EXT = new Set([...INCLUDE_EXT, ".yml", ".yaml"]);

function getAllFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      getAllFiles(full, files);
    } else if (e.isFile()) {
      if (SKIP_FILES.has(e.name)) continue;
      const ext = path.extname(e.name);
      if (INCLUDE_EXT.has(ext) || INCLUDE_ROOT_FILES.includes(e.name)) {
        files.push(full);
      }
    }
  }
  return files;
}

function collectPaths() {
  const paths = [];
  for (const name of INCLUDE_ROOT_FILES) {
    const full = path.join(ROOT, name);
    if (fs.existsSync(full)) paths.push(full);
  }
  // Root-level .md, .ts, .yml, etc.
  try {
    for (const name of fs.readdirSync(ROOT)) {
      const full = path.join(ROOT, name);
      if (fs.statSync(full).isFile() && ROOT_EXT.has(path.extname(name)) && !SKIP_FILES.has(name)) {
        if (!paths.includes(full)) paths.push(full);
      }
    }
  } catch (_) {}
  const srcDir = path.join(ROOT, "src");
  if (fs.existsSync(srcDir)) {
    getAllFiles(srcDir, paths);
  }
  const publicDir = path.join(ROOT, "public");
  if (fs.existsSync(publicDir)) {
    getAllFiles(publicDir, paths);
  }
  const githubDir = path.join(ROOT, ".github");
  if (fs.existsSync(githubDir)) {
    getAllFiles(githubDir, paths);
  }
  return paths.sort();
}

function relativePath(fullPath) {
  return path.relative(ROOT, fullPath).replace(/\\/g, "/");
}

function main() {
  const paths = collectPaths();
  const sep = "\n";
  const block = (rel, content) =>
    `\n${"=".repeat(80)}\nFILE: ${rel}\n${"=".repeat(80)}\n${content}\n`;

  let out = `# cr-dashboard-legal — full project concatenation\nGenerated: ${new Date().toISOString()}\nTotal files: ${paths.length}\n`;

  for (const full of paths) {
    const rel = relativePath(full);
    let content;
    try {
      content = fs.readFileSync(full, "utf8");
    } catch (err) {
      content = `[Error reading file: ${err.message}]`;
    }
    out += block(rel, content);
  }

  fs.writeFileSync(OUT_PATH, out, "utf8");
  console.log("Written:", OUT_PATH);
  console.log("Size:", (out.length / 1024).toFixed(1), "KB");
  console.log("Files:", paths.length);
}

main();
