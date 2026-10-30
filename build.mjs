// Builds the public copy of this demo into dist/: only the files the site needs,
// with JavaScript obfuscated and HTML/CSS minified, so the readable source stays in the private repo.
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from "node:fs";
import { minify } from "html-minifier-terser";
import JavaScriptObfuscator from "javascript-obfuscator";

const SHIP = JSON.parse(readFileSync("ship.json", "utf8")); // the only files that go online

const obfuscate = (code) =>
  JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: false, // keeps the demo fast on phones
    deadCodeInjection: false,
    stringArray: true,
    stringArrayEncoding: ["base64"],
    stringArrayThreshold: 0.75,
    identifierNamesGenerator: "hexadecimal",
    renameGlobals: false, // inline onclick handlers and the service worker keep working
    selfDefending: false,
    unicodeEscapeSequence: false,
  }).getObfuscatedCode();

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");

for (const file of SHIP) {
  if (!existsSync(file)) continue;
  const out = `dist/${file}`;
  if (file.endsWith(".html")) {
    let html = readFileSync(file, "utf8");
    // Obfuscate every inline <script> (not JSON or external ones)
    html = html.replace(/<script(?![^>]*\bsrc=)(?![^>]*type=["']application\/(?:ld\+)?json)([^>]*)>([\s\S]*?)<\/script>/gi, (m, attrs, code) =>
      code.trim() ? `<script${attrs}>${obfuscate(code)}</script>` : m,
    );
    html = await minify(html, { collapseWhitespace: true, removeComments: true, minifyCSS: true, minifyJS: false, conservativeCollapse: true });
    writeFileSync(out, html);
  } else if (file.endsWith(".js")) {
    writeFileSync(out, obfuscate(readFileSync(file, "utf8")));
  } else {
    copyFileSync(file, out);
  }
}
console.log(`dist/ ready with ${SHIP.length} files`);
