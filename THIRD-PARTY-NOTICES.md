# Third-party notices

Ad Shield-authored readable program source is distributed under GPL-3.0-or-later. Bundled third-party code retains the upstream licenses listed below. GPL v3 text is provided in `LICENSE`. Each external list retains its own license; the collection does not relicense the Fanboy source. No upstream endorsement is implied.

## HaGeZi DNS Blocklists / Multi LIGHT

Project and maintainer: HaGeZi, https://github.com/hagezi/dns-blocklists

Source: https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/light-onlydomains.txt

Snapshot version: 2026.1005.0837.00 (5 October 2026, 08:37 UTC). The original 64,048-domain list, header and provenance are preserved in `data/source-domains.txt`. Its GPL version 3 license is reproduced in `LICENSE`. Upstream component licensing: https://github.com/hagezi/dns-blocklists/blob/main/sources.md.

Modifications: merge the pre-existing core domains, deduplicate, sort, and compile groups of 250 domains into Chrome declarativeNetRequest rules. The combined offline list contains 64,068 domains. Transformation source: `common.js` and `tools/build-seed.mjs`.

## HaGeZi DNS Blocklists / Multi ULTIMATE (4.1)

Maintainer/project: HaGeZi, https://github.com/hagezi/dns-blocklists. Original source: https://raw.githubusercontent.com/hagezi/dns-blocklists/main/wildcard/ultimate-onlydomains.txt.

Snapshot version: 2026.1005.0851.46; 243,184 entries. Original text, header and provenance are preserved in `data/ultimate-domains.txt`, SHA-256 ca297c2b23e9aafefd9c2ca8bb8d0c946ce4d11a59eaac214c9574088d43f2a2. GPL version 3 text is supplied in `LICENSE`; upstream component licensing: https://github.com/hagezi/dns-blocklists/blob/main/sources.md.

Modifications: `tools/build-enhanced.mjs` validates the declared count and domains and compiles groups of up to 250 domains to 973 native Chrome rules, restricted to third-party requests. This is extension request filtering rather than an operating-system DNS setting. Individual site compatibility exemptions and a global control can disable this additional filtering without removing the basic lists.

## EasyList, EasyPrivacy and EasyList China

Projects: EasyList contributors, https://easylist.to/ and https://github.com/easylist/easylist; EasyList China contributors, https://github.com/easylist/easylistchina.

Sources and versions:

- EasyList: https://easylist.to/easylist/easylist.txt — 202610060000.
- EasyPrivacy: https://easylist.to/easylist/easyprivacy.txt — 202610052346.
- EasyList China: https://easylist-downloads.adblockplus.org/easylistchina.txt — 202610052352.

Upstream license page: https://easylist.to/pages/licence.html. These sources offer GPL-3.0-or-later or CC BY-SA 3.0; this distribution uses the GPL-3.0-or-later option, with GPL text in `LICENSE`. Original sources and notices are preserved in `data/filters/`.

## Fanboy's Annoyance List

Author/project: Fanboy and EasyList contributors. Homepage: https://easylist.to/; source: https://easylist-downloads.adblockplus.org/fanboy-annoyance.txt; version 202610052352.

The bundled source header specifies Creative Commons Attribution 3.0 Unported: https://creativecommons.org/licenses/by/3.0/. The legal code is reproduced in `data/filters/CC-BY-3.0.txt`, downloaded from https://creativecommons.org/licenses/by/3.0/legalcode.txt. Source and attribution notices remain in `data/filters/annoyances.txt`; the transformed rules and cosmetic data derived from it are provided under the same CC BY 3.0 terms.

## Changes to web filter sources

`tools/build-web-filters.mjs` converts the supported network subset to native Chrome declarativeNetRequest JSON, selects block/allow/allowAllRequests/upgradeScheme actions, normalizes IDs and global relative priorities with room for HEAD blocking and optional direct-denial counterparts, selects redirects only to packaged known resources, and extracts standard CSS selectors, domain scopes, exceptions and recognized generic-hiding exceptions. `tools/redirect-policy.mjs` preserves the relative allow/block/redirect priority hierarchy, rejects matching HTTP HEAD requests, and emits optional direct-denial counterparts without loading remote program code. Unsupported rules are omitted. Derived files: `data/web-rules/`, `data/web-cosmetics.json`, `data/web-actions.json` and `data/web-meta.json`. The metadata reports conversion errors and omitted cosmetic syntax. The complete unmodified source snapshots are included.

## Build-only dependencies

AdGuard Team / tsurlfilter: https://github.com/AdguardTeam/tsurlfilter.

- `@adguard/dnr-converter` 2.0.0: GPL-3.0-only, as stated in its package metadata. Official source: https://github.com/AdguardTeam/tsurlfilter/tree/master/packages/dnr-converter.
- `@adguard/re2-wasm` 1.2.0: Apache-2.0, as stated in its package metadata; build-only dependency. Source: https://github.com/AdguardTeam/re2-wasm.

Pinned dependency manifests are supplied in `tools/package.json` and `tools/package-lock.json` for reproducible installation. The converter, parser, RE2 and dependency tree are build-only. Selected Scriptlets functions, redirect resources, ExtendedCss and tldts are bundled locally at runtime as described below. No node_modules or build caches are distributed.

## uBlock Origin uAssets / site fixes (4.0)

Author/project: uBlock Origin contributors, https://github.com/uBlockOrigin/uAssets. Source: https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt and its named filter includes. License: GPL-3.0, as stated by the project and list headers; GPL text in `LICENSE`.

Original parent and include texts are preserved as `data/filters/fixes.txt` and `data/filters/fixes-*.txt`. The combined source SHA-256 is recorded in `data/advanced-meta.json`; the build selects Chromium desktop / MV3-compatible branches, disables HTML and IP-address capabilities, and recursively expands available includes. Not all uBO rules are supported.

Derived network, standard cosmetic and scriptlet records are compiled by `tools/build-web-filters.mjs` and `tools/build-advanced.mjs`. Scriptlets are converted with AdGuard's AST parser/converter, matched to packaged functions, and scoped by included/excluded hosts and recognized public-suffix entities. Unknown or lossy conversions are omitted. Selected three-argument XHR/fetch response aliases map to matching packaged implementations. `:remove()` cosmetic rules are made reversible by hiding. Metadata reports omissions.

## Runtime AdGuard Scriptlets and redirect resources (4.0)

AdGuard Team, `@adguard/scriptlets` 2.5.1, GPL-3.0. Project: https://github.com/AdguardTeam/Scriptlets. License reproduced in `vendor/SCRIPTLETS-LICENSE.txt`.

The selected self-contained function implementations are emitted into `fixes/lib.js` without minification, deduplicated by implementation while preserving the original rule name for compatibility. Known redirect files are copied unchanged to `vendor/redirects/`. Corresponding original source archive for tag v2.5.1 is supplied in `vendor/source/Scriptlets-2.5.1.tar.gz`, obtained from https://codeload.github.com/AdguardTeam/Scriptlets/tar.gz/refs/tags/v2.5.1. Pinned dependency manifests and local build scripts reproduce the generated code. Raw filter JavaScript is not executed.

## Runtime AdGuard ExtendedCss (4.0)

AdGuard Team, `@adguard/extended-css` 2.2.1, GPL-3.0. Project: https://github.com/AdguardTeam/ExtendedCss. The unminified browser distribution is copied unchanged to `vendor/extended-css.js`, retaining its copyright/license header. GPL text in `LICENSE`.

Corresponding preferred TypeScript source, build files and upstream notices are supplied in `vendor/source/ExtendedCss-2.2.1.tar.gz`, obtained from https://codeload.github.com/AdguardTeam/ExtendedCss/tar.gz/refs/tags/v2.2.1. Ad Shield controls when the engine is loaded, which selectors are applied, document-root protection, and disposal when rules are disabled.

## Runtime tldts / tldts-core (4.0)

Authors: Thomas Parisot, Rémi Berson and tldts contributors. Packages `tldts` and `tldts-core` 7.4.16, MIT. Project: https://github.com/remusao/tldts. License reproduced in `vendor/TLDTS-LICENSE.txt`; original TypeScript source, data trie and package notices are supplied in `vendor/source/tldts-7.4.16/` and `vendor/source/tldts-core-7.4.16/`.

The fixed browser UMD distribution is locally wrapped to expose `AdShieldDomainUtils` consistently without relying on the website's module system. Output: `vendor/publicsuffix.js`. ICANN suffix parsing (private suffixes disabled) is used for entity-scoped filter matching. The parser's public-suffix data is a dependency snapshot, not a runtime network lookup.

## Ad Shield component filtering (4.2)

`shadow-filtering.js` and component-aware picker/selector routing are original Ad Shield code, GPL-3.0-or-later. Standard cosmetic selectors from the above licensed snapshots are reused in shared constructed stylesheets inside website component roots. Extended procedural selectors are not converted into component rules. Document rules use CSS scope separately. No new downloaded executable code, external library or permission is added.

The 4.2.1 selector-candidate index and caches are original GPL-3.0-or-later code. They narrow only the native queries used for component display overrides; complete cosmetic stylesheets remain installed. CSS parsing/selection stays in the browser, with conservative fallback for selectors without a safely identified positive terminal token. The new experience probe and selector-equivalence fixtures are original tools; no new dependency or downloaded executable is introduced.

## Ad Shield cross-list cancellation (4.2.2)

`static-rule-policy.js`, `tools/badfilter-policy.mjs` and the native/build fixtures are original GPL-3.0-or-later code. The existing pinned AdGuard converter's public source-map API supplies source provenance and converted aliases. Only complete identical-source cancellation is compiled; all contributors of a merged native rule must match, and resource values are preserved. The raw native rule JSON is unchanged for this snapshot. Source and compiled IDs are retained in `data/badfilter-policy.json`; settings use Chrome's existing static-rule enable/disable API. No new dependency, permission or remote executable code is introduced.
