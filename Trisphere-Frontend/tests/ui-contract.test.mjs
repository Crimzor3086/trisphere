import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const srcRoot = join(root, 'src');

function walk(dir, predicate, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, predicate, files);
    else if (predicate(full)) files.push(full);
  }
  return files;
}

const sourceFiles = walk(srcRoot, (file) => /\.(tsx|ts)$/.test(file));
const pageFiles = walk(join(srcRoot, 'app'), (file) => file.endsWith('page.tsx'));

function read(file) {
  return readFileSync(file, 'utf8');
}

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test('all JSX buttons are functional controls', () => {
  const inert = [];

  for (const file of sourceFiles) {
    const contents = read(file);
    const buttons = contents.match(/<button\b[\s\S]*?>/g) ?? [];

    for (const button of buttons) {
      const functional =
        /onClick=/.test(button) ||
        /type=["']submit["']/.test(button) ||
        /disabled=/.test(button) ||
        /aria-pressed=/.test(button);

      if (!functional) inert.push(`${relative(root, file)}: ${button.replace(/\s+/g, ' ')}`);
    }
  }

  assert.deepEqual(inert, []);
});

test('app pages use the shared shell instead of legacy page navbars', () => {
  const offenders = pageFiles
    .filter((file) => /Navbar|<Navbar/.test(read(file)))
    .map((file) => relative(root, file));

  assert.deepEqual(offenders, []);
});

test('pages keep the premium dark platform surface', () => {
  const offenders = pageFiles
    .filter((file) => {
      const contents = read(file);
      return !/bg-midnight/.test(contents) || !/text-foreground/.test(contents);
    })
    .map((file) => relative(root, file));

  assert.deepEqual(offenders, []);
});

test('no placeholder links or dynamic Tailwind color classes ship in UI source', () => {
  const offenders = [];

  for (const file of sourceFiles) {
    const contents = read(file);
    if (/href=["']#/.test(contents)) offenders.push(`${relative(root, file)} uses placeholder href`);
    if (/(bg|text|border)-\$\{/.test(contents)) offenders.push(`${relative(root, file)} uses dynamic color class`);
  }

  assert.deepEqual(offenders, []);
});

test('Tailwind exposes the unified TriSphere color tokens', () => {
  const config = read(join(root, 'tailwind.config.js'));
  for (const token of ['midnight', 'surface', 'card', 'sidebar', 'border', 'primary', 'secondary', 'accent', 'registry', 'copilot']) {
    assert.match(config, new RegExp(`${token}:`), `${token} token missing`);
  }
});

let failures = 0;

for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`not ok - ${name}`);
    console.error(error);
  }
}

if (failures > 0) {
  process.exitCode = 1;
}
