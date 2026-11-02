# 淨頁 Clearview 隱私權政策

最後更新：2026-11-01

淨頁 Clearview（以下稱「本擴充功能」）是在瀏覽器內執行的廣告與追蹤攔截工具。

## 我們收集的資料
**沒有。** 本擴充功能不收集、不傳送、不出售任何個人資料或瀏覽紀錄。

- 所有網頁過濾都在你的電腦上由 Chrome 的 declarativeNetRequest 與本機腳本完成。
- 設定、白名單、自訂規則與攔截統計只儲存在你的瀏覽器（`chrome.storage`），不會上傳。
- 攔截統計只記錄「數量」與「網站網域」，不記錄完整網址或頁面內容。

## 網路連線
本擴充功能只會在你按「更新清單」或開啟「每日自動更新」時，連線到 GitHub（raw.githubusercontent.com）下載公開的網域清單純文字檔。這個請求不包含任何個人資料、設定或瀏覽紀錄；GitHub 會看到一般連線資訊（例如 IP 位址），適用其隱私權政策。

## 權限用途
| 權限 | 用途 |
|---|---|
| 存取所有網站 | 在你瀏覽的網頁上攔截廣告請求與隱藏廣告元素 |
| declarativeNetRequest / Feedback | 以瀏覽器內建規則引擎攔截請求，並計算每頁攔截數 |
| scripting | 注入元素隱藏樣式、網站修正與元素選取工具 |
| webNavigation | 判斷頁面與框架，確保樣式套用到正確的頁面 |
| storage | 在本機保存設定與統計 |
| alarms | 定期更新清單與彙整統計 |
| contextMenus | 右鍵選單「隱藏這個元素」與「暫停此網站」 |

## 聯絡
如有疑問，請透過擴充功能商店頁面上的聯絡方式與開發者聯繫。

---

# Clearview Privacy Policy (English)

Last updated: 2026-11-02

Clearview is a browser extension that blocks ads, trackers and pop-up ads.

## Data we collect
**None.** Clearview does not collect, transmit or sell any personal data or browsing history.

- All filtering runs on your computer through the browser's built-in declarativeNetRequest engine and bundled scripts.
- Settings, allowlists, custom rules and statistics are stored only in your browser (`chrome.storage`) and are never uploaded.
- Statistics record only counts and site domains, never full URLs or page content.

## Network connections
Clearview connects to GitHub (raw.githubusercontent.com) only when you press "Update now" or turn on daily updates, to download a public plain-text domain list. The request contains no personal data, settings or browsing history. GitHub sees ordinary connection details such as your IP address, under its own privacy policy. No remote code is downloaded or executed.

## Contact
For questions, use the contact details on the extension's store page.
