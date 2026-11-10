# Building Clearview

Clearview is plain JavaScript; there is no bundler or minifier. The runtime files in the
package are the files in this folder. Some data files are generated from public filter lists
and are committed here together with the tools that produce them.

## Release packages

Requirements: Python 3.9+.

```
python3 tools/build-package.py chromium clearview-chromium.zip   # Chrome, Edge, Opera
python3 tools/build-package.py firefox  clearview-firefox.zip    # AMO
```

Give a folder instead of a `.zip` to get an unpacked build; its contents are replaced in place.

The script copies only the runtime files and repacks the static rules: rules that differ only in
the blocked domain are merged into one rule with `requestDomains`, and rules that differ only in
the initiator site are merged into one rule with `initiatorDomains`. Both merges match exactly the
same requests. No code is changed. For Firefox it also writes the manifest (event-page background,
gecko ID, data-collection declaration) and drops rules using `responseHeaders`, which Firefox does
not support.

## Interface languages

```
pip3 install opencc-python-reimplemented
python3 tools/build-locales.py
```

Writes `_locales/{zh_TW,zh_CN,en}/messages.json` from the pages' `data-i18n` attributes and
the tables in the script.

## Generated data and third-party code

| File | Produced by | Source |
|---|---|---|
| `data/web-rules/*.json`, `data/web-cosmetics.json` (build input, not packaged), `data/web-actions.json` (build input, not packaged), `data/badfilter-policy.json` | `tools/build-web-filters.mjs` (uses `build-cosmetics.mjs`, `badfilter-policy.mjs`) | List snapshots in `data/filters/` (EasyList, EasyPrivacy, AdGuard Chinese, uBlock filters, Fanboy Annoyances) |
| `data/engine/generic-*.css`, `data/engine/meta.json`, `data/engine/s/*.json`, `data/engine/rule-actions.json` | `tools/build-engine.mjs` | `data/web-cosmetics.json`, `data/web-actions.json`, `data/extended-cosmetics.json` |
| `fixes/lib.js`, `fixes/data-*.js`, `data/engine/fix-keys.json`, `data/extended-cosmetics.json` | `tools/build-advanced.mjs` | Same list snapshots plus `@adguard/scriptlets` 2.5.1 |
| `data/enhanced-rules.json` | `tools/build-enhanced.mjs` | `data/ultimate-domains.txt` (HaGeZi ULTIMATE) |
| `data/engine/popups.json` | `tools/build-popups.mjs` | `$popup` rules in `data/filters/` |
| `rules.json`, `data/seed-meta.json` | `tools/build-seed.mjs` | `data/source-domains.txt` (HaGeZi Multi LIGHT) |
| `vendor/extended-css.js` | unmodified `@adguard/extended-css` 2.2.1 | `vendor/source/ExtendedCss-2.2.1.tar.gz` |
| `vendor/publicsuffix.js` | built from `tldts` 7.4.16 | `vendor/source/tldts-*` |
| `vendor/redirects/*` | unmodified resources from `@adguard/scriptlets` 2.5.1 | `vendor/source/Scriptlets-2.5.1.tar.gz` |

To regenerate them (Node.js 20+):

```
cd tools
npm ci
node build-web-filters.mjs
node build-advanced.mjs
node build-engine.mjs
```

`fixes/lib.js` contains the AdGuard scriptlet library. The occurrences of `eval` in it
are the `noeval` scriptlet, which replaces a page's `window.eval` to block it, and a filter
argument string; the extension itself never evaluates remote or dynamic code.

License: GPL-3.0-or-later (see LICENSE and THIRD-PARTY-NOTICES.md).

`tools/test-engine-golden.mjs` checks that the per-host engine selects exactly what a full walk of
`data/web-cosmetics.json` selects.
