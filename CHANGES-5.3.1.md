# 淨頁 Clearview 5.3.1

## Firefox 版
- 新增 `tools/build-firefox.py`：從同一份原始碼產生 Firefox（AMO）套件。
  - 背景改為事件頁（background.scripts），加入 gecko ID、最低版本 128 與資料收集聲明。
  - Firefox 的靜態規則上限是 3 萬條（Chrome 約 33 萬）。建置時把只差在網域的規則合併成 `requestDomains`，只差在來源網站的合併 `initiatorDomains`，比對結果相同：13.2 萬條 → 約 3.1 萬條，預設啟用約 2.6 萬條。
  - 移除 Firefox 不支援的 `responseHeaders` 規則（23 條）。
  - badfilter 會按 ID 停用的 38 條規則保留原樣；統計用的規則對照表重新產生。
- Firefox 沒有 `getMatchedRules`：改用 webRequest 觀察被規則取消（NS_ERROR_ABORT）或導向本機替代資源的請求來計數，同一分頁同一網址 3 秒內只算一次。
- 以 Firefox 140 ESR（Tor Browser 的 Gecko 引擎）實測：清單啟用、網路攔截、元素隱藏、自訂規則、右鍵選取、統計、三語介面皆正常。

## 共用修正
- 跨瀏覽器判斷 `AdShield.IS_FIREFOX`：Firefox 不使用 `matchOriginAsFallback` 與 CSS `@scope`；工具列攔截數與診斷記錄只在支援的瀏覽器顯示。
- 超過瀏覽器規則上限時顯示清楚的提示，而非英文錯誤。Firefox 的自訂網路規則上限為 4,000 條（動態規則總額 5,000）。
- 語言檔中的 `<code>` 等標記改以 DOM 節點建立，不再使用 innerHTML。
