# 淨頁 Clearview 5.6.6

2026-11-17

## 改了什麼 · What changed
- 背景程式的修正索引從 `data/engine/fix-keys.bin` 改成 `data/engine/fix-index.json`，內容是同一串位元組的 base64 字串。
- 原因：上傳 5.6.5 到 Opera 附加元件商店時被退回，訊息是 `Invalid type on file: data/engine/fix-keys.bin`。Opera 不收二進位檔。
- The worker's fix index moved from `data/engine/fix-keys.bin` to `data/engine/fix-index.json`, holding the same bytes as one base64 string. Opera's store rejected 5.6.5 with `Invalid type on file: data/engine/fix-keys.bin`.

## 量測 · Measurements
- 重新執行 `tools/build-advanced.mjs` 產生的索引與轉換後的檔案相同；`tools/test-fix-index.mjs` 通過（24,612 個鍵）。
- 解碼加上建表：約 0.15 ms（Node，取 80 次最快值）。檔案 98 KB → 131 KB。
- 打包內的檔案類型與 Opera 曾接受的 5.4.3 相同。
- 回歸測試：site-fixes、list-rules、browser 223、navigation 34、components 55 通過。
- Decoding plus building the table takes about 0.15 ms. The package's file types now match 5.4.3, which Opera accepted. Regression suites above pass.

## 沒變的 · Unchanged
- 攔截規則、網站修正與介面都和 5.6.5 相同。Rules, site fixes and the interface are the same as 5.6.5.
