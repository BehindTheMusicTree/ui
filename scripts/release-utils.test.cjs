const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { section, artifactExists } = require('./release-utils.cjs');

test('changelog requires one populated section and stops at the next version', () => {
  assert.equal(section('## [Unreleased]\n\n### Fixed\n- Fix\n\n## [1.0.0]\nOld', '## [Unreleased]'), '### Fixed\n- Fix');
  for (const text of ['', '## [Unreleased]\n\n### Fixed\n', '## [Unreleased]\nA\n## [Unreleased]\nB']) {
    assert.throws(() => section(text, '## [Unreleased]'));
  }
});

test('registry absence, identical artifact and partial-publication conflicts', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-registry-'));
  const archive = path.join(dir, 'package.tgz');
  fs.writeFileSync(archive, 'archive');
  const integrity = `sha512-${crypto.createHash('sha512').update('archive').digest('base64')}`;
  const metadata = { name: '@behindthemusictree/ui', version: '1.2.3', dist: { integrity } };
  const response = (status, body = metadata) => async url => {
    assert.equal(url, 'https://registry.npmjs.org/@behindthemusictree%2fui/1.2.3');
    return { status, ok: status === 200, json: async () => body };
  };
  try {
    assert.equal(await artifactExists(archive, '1.2.3', response(404)), false);
    assert.equal(await artifactExists(archive, '1.2.3', response(200)), true);
    for (const status of [401, 403, 429, 500]) await assert.rejects(artifactExists(archive, '1.2.3', response(status)));
    for (const bad of [{ ...metadata, version: '1.2.4' }, { ...metadata, name: 'wrong' }, { ...metadata, dist: {} }]) {
      await assert.rejects(artifactExists(archive, '1.2.3', response(200, bad)));
    }
    await assert.rejects(artifactExists(archive, '1.2.3', async () => { throw new Error('network'); }));
    await assert.rejects(artifactExists(archive, '1.2.3', async () => ({ status: 200, ok: true, json: async () => { throw new Error('invalid JSON'); } })));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});
