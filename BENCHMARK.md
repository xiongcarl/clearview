# Ad Shield 4.3.1 synthetic render measurement

macOS Google Chrome 154.0.8037.98, headless, separate profile. A local HTTP page contains 3,000 normal articles (about 9,000 DOM elements), without external media or production ads.

| Configuration | Median navigation load event |
|---|---:|
| Filtering off | 9.8 ms |
| Five lists, enhanced protection, scriptlets, advanced cosmetics and optional direct denial on | 30.5 ms |

One warm-up and eight measured navigations per configuration. Measurement: `PerformanceNavigationTiming.loadEventEnd`. Raw samples/configuration: `verification/benchmark-v4.json`. All 3,000 articles remained present. Reproduce with `node tools/test-browser.mjs`.

This full timing profile includes optional direct denial; the ordinary default leaves it off. Off runs before full with shared caches/host conditions. This local observation does not measure all asynchronous filtering, startup compilation, public coverage, total CPU, memory, real network latency or another blocker. It is not a universal performance estimate.

The following 4.2.0/4.2.1 component comparison is historical, collected for the 4.2.1 release. Its raw source hashes and observations are retained; the exact comparison was not rerun for 4.2.2 or 4.3.0. The component runtime itself remains byte-identical to verified 4.2.1.

## Matched 4.2.0 / 4.2.1 component experience comparison

Same Mac Chrome, separate clean profiles, identical normal default settings (all five lists, enhanced protection, direct denial off). Each batch creates 150 open/closed components, with all full native sheets present and all ads hidden before completion. One first batch is treated as warm-up, then four measured batches; previous hosts are removed between batches and the last 150 remain for a five-second idle observation. Normal neighboring content remains visible in every run. The final comparison records the baseline first, then the optimized version; earlier exploratory runs also used the reverse order.

| Observation | 4.2.0 baseline | 4.2.1 optimized |
|---|---:|---:|
| Median four measured batch completion times | 870.6 ms | 62.8 ms |
| Initial fixture filtering, one observation | 512.3 ms | 518.3 ms |
| `reviewInline` wall time during five seconds idle | 513.8 ms | 15.8 ms |
| Page long tasks in the idle observation | 6 | 0 |

Long tasks are page tasks over 50 ms, recorded by a PerformanceObserver, not an attribution of all their time exclusively to the extension. Method counters wrap extension functions in the test-only isolated world; nested function durations overlap and must not be added as total CPU time. Polling is about 50 ms. Policy compilation, browser startup, network latency, production ad coverage, memory and real interaction latency are not measured by the batch median. The cold initial observation does not show the same degree of speed-up; repeated profiles/cache/order may affect results. This is a specific controlled comparison, not a claim to be the fastest blocker or a guarantee for every website.

Raw data: `verification/component-performance-baseline-release.json` and `verification/component-performance-optimized-release.json`, with source hashes, settings, samples, selector parity and long tasks. Reproduce: `node tools/test-component-performance.mjs` for the current folder, or `node tools/test-component-performance.mjs /absolute/path/to/older/ad-shield baseline` for an extracted older release. The tool hosts its own page, changes only its own fixture and profiling wrappers, and never opens the everyday Chrome profile.

## Current component batch completion

Historical 4.2.2 observation (retained in `verification/component-benchmark-4.2.2.json`): 150 website components, each with an ad and ordinary content, complete in 57.1 ms with basic settings and 57.8 ms with all five lists/enhanced protection/component filtering and direct denial off. All 150 normal neighbors remain visible in both configurations.

This is one completion observation per configuration, sampled at about 50 ms through DevTools. Full timing starts only after its full stylesheet is present. Fixture creation, discovery, filtering and polling are included; initial policy compilation, real networking, memory, production sites and continuous scrolling are not. Basic runs first and warms the page. Raw data: `verification/component-benchmark.json`; reproduce using `node tools/test-components.mjs` or the complete suite.

4.3.1 records 8 post-warmup navigations per mode: off median 18.45 ms, full median 30.5 ms, with all 3,000 normal articles retained. Other isolated Chrome checks were running during portions of the release verification. Do not use these values for a cross-release performance ranking. Historical 4.3.0 raw values are retained under versioned verification names.
