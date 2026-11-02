# 4.9.1 驗證

2026-10-24：465 項建置、瀏覽器、導覽、精準過濾與介面檢查通過；161 條正規表示式規則通過 Chrome 驗證。新增專項為受控缺陷情境，非全網攔截率。證據位於 `verification/v4.9.1/`，方法與限制見 [更新說明](CHANGES-4.9.1.md)。以下為歷史紀錄。

# 4.9.0 驗證

2026-10-23：Node 建置、Chrome 正規表示式驗證、實際請求與例外優先序、回歸、導覽、精準過濾及介面證據位於 `verification/v4.9.0/`。專項測試舊版 24／31，新版 31／31；這是指定缺陷情境，不是全網攔截率。方法與限制見 [4.9.0 更新說明](CHANGES-4.9.0.md)。以下為歷史紀錄。

# 4.8.1 驗證

2026-10-23：57 項精準過濾對照測試、瀏覽器回歸、導覽及介面檢查見 `verification/v4.8.1/`。同一組新情境在 4.8.0 為 36／57，4.8.1 為 57／57；這是指定缺陷與補強情境，不是全網攔截率。完整範圍與限制見 [4.8.1 更新說明](CHANGES-4.8.1.md)。以下為歷史紀錄。

# 4.8.0 驗證

2026-10-22：導覽與設定升級專項、瀏覽器回歸及介面檢查的結果位於 `verification/v4.8.0/`。請以 `release-summary.json` 的完成數為準。重現方式與限制見 [4.8.0 更新說明](CHANGES-4.8.0.md)。本機 Google 形狀的測試頁未執行真實帳戶授權；尚未確認使用者 Gmail／Google 登入結果。以下保留歷史紀錄。

# 4.7.1 最新驗證

53 項郵件安全跳轉檢查、44 組既有連結情境及 224 項瀏覽器回歸檢查通過。原始資料位於 `verification/v4.7.1/`，方法及限制見 [更新說明](CHANGES-4.7.1.md)。未在使用者帳戶載入新版驗證；以下為歷史紀錄。

# 4.7.0 最新驗證

2026-10-19 發佈核對：224 項瀏覽器回歸、173 項第三方服務及 15 項介面檢查通過。17 個服務在受控 Chrome 第三方請求測試中均受阻，原端點零請求；直接造訪、第一方與各例外可用。這不是公開測試網站的最新分數。原始結果見 `verification/v4.7.0/`；重現步驟與範圍見 [4.7.0 更新說明](CHANGES-4.7.0.md)。以下為歷史紀錄。

# 4.6.0 介面驗證

12 項介面操作與排版檢查：`verification/v4.6.0/`。核心引擎未修改，先前回歸結果保留於相應版本目錄。以下為歷史紀錄。

# 4.5.1 最新驗證

本次結果位於 `verification/v4.5.1/`，重現方式見 `CHANGES-4.5.1.md`。以下為先前版本的測試紀錄。

# 4.5.0 驗證

最新測試見 [CHANGES-4.5.0.md](CHANGES-4.5.0.md) 與 `verification/v4.5.0/`。下方為先前版本的歷史記錄。

# 4.4.0 驗證

最新方法、結果及限制見 [CHANGES-4.4.0.md](CHANGES-4.4.0.md)，原始結果見 `verification/v4.4.0/`。下方保留先前版本的驗證記錄。

# Ad Shield 4.3.1 verification

## Normal-link regression repair

The 4.3.0 strict MAIN guard intentionally prevented trusted plain `_blank` links, and its isolated observer granted intent only for modified/middle gestures. That combination broke normal email/document links. 4.3.1 preserves trusted plain-click and Enter intent for the selected URL. Strict scripted opening is limited to the exact selected HTTP/HTTPS destination, recent active browser user activation and a single opening. The triggering event's default action is cancelled only when the scripted destination is accepted, avoiding duplicate native/script openings. Different-destination and repeated calls return null. Synthetic gestures never grant intent.

Controlled fixtures reproduce the email-style anchor pattern including `_blank`, noopener/noreferrer and a redirect metadata attribute. They do not read authenticated Gmail or open the user's verification URL. `verification/links-before-4.3.0.json` records the baseline: plain mouse click, plain Enter and matching scripted opening each leave zero destination targets. `verification/links-current-4.3.1.json` records the repair and adverse cases. Normal links inside closed components, rewritten blank frames and foreign frames also survive. Existing borrowed-native, blob, background, synthetic, duplicate keyboard/menu and whitelist/pause cases remain checked. Native contextmenu command selection itself is not automated.

Several intermediate runs of the extended fixture produced no navigation for Cmd-click immediately after closing a plain-click foreground foreign-frame destination. The diagnostic frame did not receive that click; rescue closure counters did not change. Source activation alone did not reliably resolve it. The incomplete and native-off diagnostic logs are retained. The final harness also moves the pointer and allows routing to settle before pressing/releasing; its final 33 scenarios pass and include receipt of the trusted foreign-frame click. No extension runtime was changed for these fixture investigations. The precise cause of the missing event remains unestablished; these results do not prove every focus/routing condition.

Final browser regression: 2026-10-06T08:01:14.431Z — 224 assertions pass in Chrome/154.0.8037.98 with the 4.3.1 manifest and runtime. The final independent popup run completes 33 cases with no captured worker errors. UI screenshots in verification show version 4.3.1. Both runs use separate profiles; the public benchmarks are controlled local fixtures and do not establish general speed/battery claims.

Network lists, compatibility substitutions, default settings and declared permissions are unchanged. Default and direct 4.3.0 public observations are retained under explicit versioned names: direct mode reproduces 92%, 454/482 blocked and 28 reachable. A weighted score and reachability probes do not measure every visible advertisement. No list or test-site scoring logic was changed for this link repair. These scores were not rerun for 4.3.1; the native network data is byte-identical.

Limits: matching-URL anchors only for strict script opening; empty-window intermediates, non-anchor controls, changed destinations and some real authentication/payment/download flows can still need balanced mode and reload. This corrects the controlled link regression without claiming universal Gmail/account compatibility, all advertisements blocked or a strongest-product ranking. The earlier browser-created cleanup can still allow the first HTTP request or a brief new-tab flash.

## Previous 4.3.0 evidence and inherited coverage


Verified in an isolated macOS Google Chrome 154.0.8037.98 profile. **224 Chrome assertions passed**, timestamp 2026-10-06T07:10:10.835Z. No everyday browser profile, login, payment flow or account data was used or changed. The evidence covers actual requests, ordinary content and explicit limits; test-site scores are secondary observations.

## 4.3 popup behavior: actual Chrome navigation, not test scores

28 controlled experience scenarios use actual browser navigation events and surviving browser targets. The source was frozen for the final clean 224-assertion regression and standalone popup run. Only the literal UI version text was subsequently corrected; popup handlers and runtime code were unchanged. `verification/popup-current-4.3.0.json` and `verification/popup-baseline-4.2.2.json` contain the final paired observations, browser version, errors, source tab/frame IDs, new-tab events and original-server request counts. Reproduce: `node tools/test-popups.mjs`; for an extracted prior version: `node tools/test-popups.mjs /absolute/path/to/ad-shield --observe`. It uses its own profile and local server. No test website result or scoring logic is changed.

- Delivered 4.2.2 retains the controlled borrowed-native popup, blob popup, closed-component new-tab link and native popup from a foreign frame. With strict mode, 4.3.0 closes each new target while preserving the existing source page. The HTTP server still receives its first request before cleanup; this is not pre-request prevention and a tab may briefly appear.
- Real CDP mouse/key input preserves Cmd-click, middle-click, Shift-click, Cmd-Enter, closed-component links, rewritten blank-frame links and cross-origin frame links. A single keyboard gesture cannot permit a second native window to the same destination; synthetic modifiers do not issue trusted intent.
- Native right-click captures one exact destination candidate. A subsequent native open of that candidate survives; another open is closed, and a second physical contextmenu gesture grants a new candidate. The harness does not select the native context-menu item: it closes the menu and uses the captured raw native opening function to exercise the candidate. The DOM cannot tell which menu command was chosen, so the candidate is limited to one URL and expires after 30 seconds. Normal pointer/key candidates expire after about 2.5 seconds.
- Per-site off, balanced mode, popup off, global pause, top-site whitelist and embedded-frame whitelist preserve the controlled native window. Site compatibility retains strict cleanup. Existing MAIN guards still require page reload to be removed; the browser backstop uses current saved settings.
- A page opened before extension loading and a page still awaiting a deliberately held script retain normal explicit opening gestures. Startup observes eligible existing HTTP documents immediately instead of waiting for document idle. Unobserved/unsupported current documents are not subjected to blind closure.
- The test explicitly stops only this extension's worker through its own isolated Chrome `serviceworker-internals` Stop control, verifies a different worker target, then checks that Cmd-click survives and the borrowed popup is again cleaned up. This is an actual worker restart, not a counter reset or simulated callback.
- Recording uses isolated-world trusted events. It neither patches page prototypes nor exposes a page message bridge; bounded candidates are transient worker memory. Source document identity is checked before closure. Existing network/source snapshot files and permissions are byte-identical to 4.2.2 except the manifest version.
- An initial prototype full regression once timed out awaiting a settings response. Its output is retained in `verification/popup-prototype-timeout.log`; a diagnostic full run and the final clean source run both completed all 224 assertions. The timeout was not reproduced and its root cause is not established. The held-resource startup scenario specifically verifies the immediate-observation path, not every latency condition.

Limits: HTTP/HTTPS sources with an observed current top document; cleanup can also handle blank/blob/data targets. A vanished source, unsupported/protected source, very early unobserved navigation, chained popups from a transient unknown source, and same-tab scripted redirects can still escape. Native context-menu selection itself, real login/payment/download/video flows, every public site and comparative blocker coverage remain unverified. General modes intentionally permit some native windows. Strict mode can affect legitimate script windows; use the site's balanced mode and reload when needed.

## User-facing behavior

- Default mode uses packaged compatibility substitutions and enhanced third-party filtering. Direct-denial counterparts are disabled in the manifest as well as the cleaned default settings, avoiding a startup flash of this optional mode.
- The popup's one-click site compatibility control saves a working repair, restores an extra service and preserves core advertising blocking. Turning it off restores enhanced blocking.
- Compatibility includes cross-origin frames, preserves standard advertising CSS and automatic popup protection, withdraws automatic advanced hiding, restores the original site script on reload, and does not exempt unrelated sites.
- In both the repaired page and its cross-origin frame, an ad request returns the local substitute and the actual original advertisement fixture server receives no request. First-party service requests, ordinary scripts and neighboring content remain available.
- Explicit advertising script paths and dynamically inserted advertising/sponsored-image elements are blocked or hidden. Sponsored backgrounds and wrapped images are covered while ordinary background-image links and plain text links remain available; site pause restores the background advertisement. Manual allow, site pause and global controls still restore their corresponding functions.
- Genuine clicks, strict/general/site popup policies, deliberate modified links, ordinary iframe content, picker cancel/save/reload, manual selectors and restrictive style CSP are exercised.
- All five compiled lists and additional sets load in real Chrome; native network requests, storage, dynamic scripts and the settings UI are used. The headless popup controller is bound to an actual fixture tab to reproduce its native action-popup context.
- Scriptlets run before the first inline site script. Scoped JSON/response modifications preserve unmatched fields and requests; text/entity/public-suffix matching preserves normal neighboring elements; whole-document hiding is prevented.
- Whitelisting restores page and frame cosmetics/network behavior; settings, working domain rules and legacy backup imports persist correctly.
- Navigation/removal/closure races invoke actual Chrome APIs after the target disappears; stale jobs cancel without extension errors, stale CSS is removed from replacement pages, genuine permission failures remain visible and the queue recovers.
- Controlled valid/truncated/offline domain downloads preserve the last good list and custom settings; alarms are registered/removed without simulating a real 24-hour cycle. Diagnostics logs actual matches, strips query/fragment data and clears when disabled.
- The synthetic 3,000-article render fixture retains every article. See `BENCHMARK.md`.

Reproduce: `node tools/test-browser.mjs`. The tool hosts controlled local fixtures using names mapped to localhost, starts its own Chrome profile, and writes output under `testing-output`. The generated profile, caches and Chrome `_metadata` are excluded from the ZIP.

## Cross-list advertising corrections

- 27 shared native assertions exercise the default cancellation, source/target list toggles, actual advertising and ordinary script requests, manual domain allow, site pause, a saved compatibility exception, global pause and direct mode. They run within the complete suite; independently reproduce with `node tools/test-static-policy.mjs`.
- The existing snapshots contain 33 parsed badfilter records. Two cross-list matches cancel EasyList advertising allows, as requested by the site-fix snapshot. Complete source text, target IDs and any recognized declined cases are retained in `data/badfilter-policy.json`. No blanket allow or blanket deletion of exceptions is synthesized.
- A local server receives real Chrome requests under the filter's normal hostname and URL form, using the test profile's host resolver to map that hostname and port to the server. An earlier experimental URL containing a random explicit port correctly did not match the hostname/path blocker; the fixture now uses the normal URL form. No actual third-party page or advertising endpoint is contacted.
- With all five lists and enhanced protection on, direct mode off, the extracted delivered 4.2.1 loads the controlled advertising script and the local original server receives one request. 4.2.2 blocks it and the original server receives none. An ordinary script loads in both. Raw observations: `verification/static-policy-baseline.json` and `verification/static-policy-current.json`. Reproduce for either extracted folder: `node tools/test-static-policy.mjs /absolute/path/to/ad-shield --observe`. This is a specific supported-rule correction, not a broad website or cross-product coverage measurement.
- A test-only worker policy and one injected API rejection reproduce a failure after a real static ruleset update and a real new dynamic block. The actual settings transaction restores previous static IDs, dynamic rules, saved preferences and request behavior; a subsequent settings change succeeds. The shipped runtime contains no test API hooks. This proves the controlled error path, not every possible browser failure.
- 11 build assertions use the pinned converter and real source maps to check canceled advertising allows, retained blockers, order/alias equivalence, redirect resource values, HEAD/direct counterparts and partial-domain boundaries. The mixed-source guard uses a deliberately augmented source-map record; it is not a claim that this bundled snapshot contains such a merged cancellation. Reproduce after installing pinned build dependencies: `node tools/test-badfilter-build.mjs`.
- Cross-list cancellation currently requires identical full source patterns, flags, values and domain sets after recognized conversion/normalization. A partially canceled domain set, expanded-set equivalence or native rule with another contributor is retained; recognized declines are reported. This does not implement every badfilter interpretation. Same-list handling remains the upstream converter's behavior. `redirect-rule` and HTML response rewriting remain unsupported.
- The current offline staged maintenance command recompiles the snapshots and cancellation policy successfully. Existing compiled data remains byte-identical and the live folder is unchanged. Output: `verification/badfilter-maintenance-result.txt`; reproduce with `node tools/update-web-lists.mjs --offline --dry-run` after installing dependencies. This does not claim a fresh network download. Earlier controlled filesystem rollback/download evidence below remains historical.

## Component filtering and picker behavior

- 55 shared component assertions run inside the complete suite and the independent `tools/test-components.mjs` tool. Open, closed and nested roots, dynamically inserted/reconnected components, existing hosts that attach roots later, cross-origin frames and same-document SPA route changes are covered.
- Component CSS uses a shared constructed stylesheet. Site-owned stylesheets and normal blue text remain intact; website stylesheet replacement restores filtering without discarding its new sheet. Native input remains editable and the site's `attachShadow` is unchanged.
- A matching ad rewritten with inline `!important` is hidden again; disabling restores the last site-owned display value and priority. Reused elements that cease to match regain their content. No unrelated display property or empty style attribute is left behind.
- Turning component automation off, site/global pause and site compatibility withdraw their automatic styles. Custom nested rules remain when only automation or compatibility changes. Removing a custom rule restores the target; sibling components and ordinary document elements with the same IDs stay visible.
- Document CSS scope retains explicit `:root`, `html` and `:is()` selectors while preventing an ordinary document rule from leaking into a component. The actual deep picker click and Enter save the expected host chain, which works after reload and on a repaired site.
- Restrictive `style-src 'none'` and 150-component batches are exercised. These fixtures prove browser mechanisms and reversibility, not every website's components or every upstream rule. Component procedural/text selectors remain unsupported; discovery of an existing host's late root is periodic, and page workload can delay it. Continuous hostile rewrites can still expose advertising temporarily.
- Bulk discovery retains shadow-subtree jobs when coalescing light-DOM mutations. All 150 outer and 150 nested closed roots receive filtering with normal neighbors retained. Periodic traversal also discovers a late root attached inside an existing closed component. Removed bulk roots release their extension sheets.
- Candidate-cache changes preserve native class case semantics, reblock a newly matching class and restore the original important display when it ceases to match. A new root with an existing important ad style is filtered and restores its original value on withdrawal.
- Native queries agree across 36 selector cases (34 positive), including escapes, Unicode, quoted attributes, SVG, nested functional pseudos and selector lists. This is a conservative partial token index for override queries; complete native cosmetic sheets remain applied. Native CSS parsing/selection still resolves the conditions.
- A pure CSSOM stylesheet rewrite exposes the controlled ad without any DOM mutation, then periodic protection forces it hidden again and keeps normal blue content. Periodic protection was retained during the performance improvement.
- Own picker screenshot: `verification/component-picker-preview.png`. Original 4.1 archive was also probed: the same closed component ad remained visible, establishing this as a real added capability.

## Public reading checks

Reproduce: `node tools/test-reading.mjs reading`. The tool visits anonymous public pages with filtering off and with the final default settings, follows an observed article/document link, and records visible content and request failures. Own structured observations: `verification/public-reading-4.2.2.json`.

- Guardian and MDN links lead to the intended article/document with its heading and main content present in both configurations.
- The Guardian visits had 22 `ERR_BLOCKED_BY_CLIENT` failures with filtering and 0 with filtering off; MDN had 8 and 0. These are request counts, **not counts of removed ads**. Text/heading/visible-link observations are retained for inspection.
- MDN content and navigation remain visible, including a main container using `display: contents`.
- Guardian's Cookie/subscription-choice dialog still overlays the article. The homepage cannot scroll in either configuration while this dialog is present. We did not select consent or subscription options; this remains a reading limitation, not a successful overlay-removal claim.

These are smoke checks on two websites, not broad functional certification. No real account sign-in, payments, form submission or video playback was tested. Public content and results can change between visits.

## Public test-page observations

Reproduce: `node tools/test-public-sites.mjs default`. The 4.2.0 observations and their exact default configuration are retained in `verification/public-default.json`; 4.2.2 adds individual static-rule cancellation while preserving the compiled network list data and document CSS. These test-page scores were not rerun for 4.2.1, 4.2.2 or 4.3.0. The observed configuration (direct blocking off, enhanced filtering on, all five web lists on, strict popup mode).

| Website | Observed result |
|---|---|
| adblock.turtlecute.org | 132/132 blocked; no visible sponsored link |
| adblock-tester.com | 98/100 |
| superadblocktest.com | 87% weighted score; 438 blocked / 44 accessible of 482 checks |

The latter's raw blocked proportion is approximately 90.9%, different from its weighted score. These pages mix ad/tracking reachability, cosmetic and other checks. A packaged blank/compatibility response can resolve a fetch even though the original advertising request never leaves Chrome. The default was retained for website compatibility rather than replacing all substitutions merely to increase these scores. Normal-purpose video/CDN, embedded widgets and service hosts were not blanket-blocked to force 100%.

No page test logic, result labels, score variables or pass/fail UI is modified. Some sponsored-image hiding is ordinary cosmetic filtering applied to every matching page. Test results do not prove complete advertising removal or superiority to another blocker.

## Regression observation

The earlier response-rewrite failure was reproduced in a 32-navigation local startup probe: 31 premature readiness checks accepted the initial complete `about:blank`; 3 debug-issued requests ran before the real document's scriptlet installation and returned unmodified data. All three rewrote correctly after waiting for the actual fixture and its first inline script. The complete suite now requires the actual host, complete real document and inline fixture marker before asserting the targeted and unmatched responses. The response engine is unchanged. Own observations: `verification/xhr-startup-observation.json`. This correction concerns test readiness; it is not proof for every real website startup.

A separate concurrent 4.2 validation run returned Chrome’s `Internal error` during a settings change. Its cause was not established; the later complete runs passed, and API errors remain visible.

## Maintenance and archive checks

Controlled download/filesystem transaction evidence retained from the verified 4.1 release (those fault fixtures were not rerun for 4.2.2; the current modified builder was separately verified by the offline staged dry run above): the staging builder successfully recompiles five web lists, site scripts, the bundled ULTIMATE snapshot and local advertising patterns without changing the live package. Controlled maintenance fixtures confirm complete replacement with a previous-version backup, rollback after a mid-commit failure, preservation of the older backup and rejection of a truncated ULTIMATE download before any data changes. Their final output is in `verification/updater-result.txt`. Source downloads used to create the bundled snapshots came from the named official HTTPS sources; the maintenance network-download test is controlled, not a newly downloaded freshness claim.

Delivered JavaScript syntax, native rule IDs, bundled redirect targets, archive integrity and version consistency are checked. Popup/options images are visually inspected. No guarantee is made for every upstream rule, CSP variant, frame startup race, other browser, shared Chrome quota, store acceptance or YouTube advertising. No cross-product benchmark establishes the strongest blocker.

## Current 4.3 public reading observation

Anonymous Guardian and MDN homepage/article observations with filtering off/on are retained in `verification/public-reading.json`. They record headings, main content and request failures; failures are not ad counts. Cookie/subscription overlays can remain. No account, consent selection, purchase or video playback was performed. These pages do not prove universal website compatibility.
