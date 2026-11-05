const fs = require('node:fs');
const crypto = require('node:crypto');

function section(text, heading) {
  const lines = text.split(/\r?\n/);
  const indexes = lines.flatMap((line, index) => line === heading ? [index] : []);
  if (indexes.length !== 1) throw new Error(`Expected exactly one ${heading} heading`);
  const start = indexes[0] + 1;
  let end = start;
  while (end < lines.length && !lines[end].startsWith('## ')) end++;
  const body = lines.slice(start, end).join('\n').trim();
  if (!body.replace(/^#{1,6}\s.*$/gm, '').trim()) throw new Error(`${heading} is empty`);
  return body;
}

function version() {
  const value = JSON.parse(fs.readFileSync('packages/ui/package.json', 'utf8')).version;
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value)) {
    throw new Error('Package version must be stable SemVer');
  }
  return value;
}

async function artifactExists(archive, packageVersion, fetchImpl = fetch) {
  const response = await fetchImpl(`https://registry.npmjs.org/@behindthemusictree%2fui/${packageVersion}`, { signal: AbortSignal.timeout(30000) });
  if (response.status === 404) return false;
  if (!response.ok) throw new Error(`Registry lookup failed: HTTP ${response.status}`);
  const metadata = await response.json();
  const integrity = `sha512-${crypto.createHash('sha512').update(fs.readFileSync(archive)).digest('base64')}`;
  if (metadata.name !== '@behindthemusictree/ui' || metadata.version !== packageVersion ||
      metadata.dist?.integrity !== integrity) {
    throw new Error('Existing npm artifact does not match the prepared archive; investigate without moving the tag');
  }
  return true;
}

async function main() {
  const command = process.argv[2];
  const currentVersion = version();
  const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
  if (command === 'check') {
    section(changelog, '## [Unreleased]');
    const index = ['major', 'minor', 'patch'].indexOf(process.argv[3]);
    if (index < 0) throw new Error('Expected major, minor or patch');
    const parts = currentVersion.split('.').map(BigInt);
    parts[index] += 1n;
    for (let i = index + 1; i < 3; i++) parts[i] = 0n;
    const nextVersion = parts.join('.');
    if (changelog.split(/\r?\n/).some(line => line.startsWith(`## [${nextVersion}]`))) {
      throw new Error(`Changelog already contains ${nextVersion}`);
    }
  } else if (command === 'prepare') {
    section(changelog, '## [Unreleased]');
    if (new RegExp(`^## \\[${currentVersion.replaceAll('.', '\\.')}\\]`, 'm').test(changelog)) {
      throw new Error(`Changelog already contains ${currentVersion}`);
    }
    fs.writeFileSync('CHANGELOG.md', changelog.replace(/^## \[Unreleased\]$/m,
      `## [Unreleased]\n\n## [${currentVersion}] - ${new Date().toISOString().slice(0, 10)}`));
  } else if (command === 'notes') {
    if (process.env.GITHUB_REF_NAME !== `v${currentVersion}`) throw new Error('Tag and package version differ');
    const headings = changelog.split(/\r?\n/).filter(line => line.startsWith(`## [${currentVersion}]`));
    if (headings.length !== 1) throw new Error('Expected one version changelog section');
    fs.writeFileSync(process.argv[3], section(changelog, headings[0]) + '\n');
  } else if (command === 'registry') {
    const exists = await artifactExists(process.argv[3], currentVersion);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `exists=${exists}\n`);
  } else {
    throw new Error('Expected check, prepare, notes or registry command');
  }
}

module.exports = { section, artifactExists };
if (require.main === module) main().catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
