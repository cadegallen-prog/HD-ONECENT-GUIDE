#!/usr/bin/env node
/**
 * Builds bookmarklet.txt from pc-extractor.src.js
 * Run: node tools/bookmarklets/build-bookmarklet.js
 */
const { readFileSync, writeFileSync } = require("fs")
const { resolve } = require("path")

const dir = __dirname
const src = readFileSync(resolve(dir, "pc-extractor.src.js"), "utf8")

// Strip block comments, single-line comments (but not inside strings/regex),
// collapse whitespace, and prepend javascript: protocol
const minified = src
  // Remove block comments
  .replace(/\/\*[\s\S]*?\*\//g, "")
  // Remove single-line comments (only when line starts with optional whitespace + //)
  .replace(/^\s*\/\/.*$/gm, "")
  // Collapse newlines and multiple spaces into single space
  .replace(/\s*\n\s*/g, "")
  .replace(/\s{2,}/g, " ")
  .trim()

const bookmarklet = "javascript:" + minified

// Validate syntax
try {
  new Function(minified)
} catch (e) {
  console.error("SYNTAX ERROR in minified output:", e.message)
  process.exit(1)
}

writeFileSync(resolve(dir, "bookmarklet.txt"), bookmarklet + "\n", "utf8")
console.log(`bookmarklet.txt written (${bookmarklet.length} chars)`)
