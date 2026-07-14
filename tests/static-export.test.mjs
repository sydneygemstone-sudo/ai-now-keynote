import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("exports a self-contained GitHub Pages entry", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

  assert.match(html, /AI NOW/);
  assert.match(html, /能力全景图/);
  assert.match(html, /\/ai-now-keynote\/_next\/static\//);
  assert.doesNotMatch(html, /src="\/(dukou|showcase)/);
  assert.doesNotMatch(html, /href="\/dukou-demo\.html/);

  await access(new URL("../out/dukou-demo.html", import.meta.url));
  await access(new URL("../out/showcase/openai-gpt56.jpg", import.meta.url));
  await access(new URL("../out/dukou/bg-ending.jpg", import.meta.url));
});
