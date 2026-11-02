# Ad Shield 4.8.1 — 精準攔截與正常內容保留

日期：2026-10-23

這版以實際可見廣告、正常內容與網站功能為目標，不新增測試網站專用封鎖，不追求連線測試滿分。維持 4.8.0 的原生跳轉、Google 登入服務例外及預設設定。

## 本次改善

- **補上明確的廣告元件**：隱藏 `amp-embed` 中明確標為 `adsense`、`doubleclick`、`a9` 的廣告，以及包含已識別廣告的 `amp-sticky-ad` 黏底容器。一般嵌入內容、影片元件及未識別容器保留。一般文件與封閉 Shadow DOM 都適用，動態插入及用途改變會重新判斷。
- **降低商品／推薦連結誤隱藏**：移除只靠 `rel="sponsored"` 加圖片或背景圖片就隱藏整個連結的兩條泛用規則。它也可能用於帶佣金的正常推薦連結，不能單獨作為必須隱藏的依據。已有明確廣告選擇器仍生效。
- **收窄網址比對**：三條本機廣告路徑規則改為匹配真正 URL 路徑及完整檔名，只處理 script／XHR。網址查詢參數提到廣告檔案、JSON、source map 或相似設定檔，不再被這三條規則誤判。既有廣告 JS 路徑仍被阻止，原端點不收到請求。
- **保留控制權**：新增過濾服從 EasyList 開關、上游隱藏例外、網站暫停及相容模式。手動規則與既有進階選項保持不變；從 4.8.0 升級不會再次重置設定。

這些是明確情境的補強，不代表所有網站攔截率提升某個百分比，也不承諾影片內廣告或所有廣告都能攔截。視覺隱藏與網路阻止分開驗證；隱藏元件本身不等於其所有網路請求被阻止。

## 驗證

使用相同測試工具比較 4.8.0 與 4.8.1：57 項精準攔截／正常內容／例外檢查，由舊版 36 項符合新預期，提升至新版 57 項全數符合。新增測試刻意覆蓋這次改善的情境，並非隨機抽樣的全網攔截率。

另執行 224 項完整瀏覽器回歸、34 項導覽與設定升級檢查，以及 15 項介面檢查。原始結果與版本資訊見 `verification/v4.8.1/release-summary.json`。公開新聞與 MDN 閱讀檢查另列在 `reading.json`；只檢查匿名內容可見與文章導覽，不代表登入、付款、影片或每個互動皆已驗證。

可重現工具：

- `node tools/test-precision.mjs`：完整新情境；加上舊版來源資料夾及 `--baseline` 可記錄舊版差異。
- `node tools/test-browser.mjs`：完整回歸。
- `node tools/test-navigation.mjs`：導覽與升級。
- `node tools/preview-ui.mjs`：介面。
- `node tools/test-reading.mjs precision-481`：公開匿名閱讀。

需要 macOS Chrome、Node.js；導覽測試另需 openssl。測試使用獨立瀏覽器資料夾，不使用使用者帳戶。未在使用者實際 Gmail／Google 帳戶確認新版；保留 4.8.0 的修復並重新跑受控導覽測試。

## 安裝

解壓縮 `ad-shield-v4.8.1.zip`。要保留設定，將裡面 `ad-shield` 的檔案更新到原先載入的擴充功能資料夾，再在 Chrome 擴充功能管理頁重新載入。也可停用舊版後載入新版包含 `manifest.json` 的資料夾；不同載入位置可能使用不同擴充功能 ID，設定不一定沿用。

確認面板顯示 **4.8.1**，重新整理已開啟的網頁，不要同時啟用舊版。不需要重新套用加強模式或打開額外服務限制。既有全域／單站暫停仍會保留；要測試攔截時請恢復相應開關。

## 規則依據

- [AMP ad／embed 官方文件](https://amp.dev/documentation/components/amp-ad)：元件、廣告類型與嵌入行為。
- [AMP sticky ad 官方文件](https://amp.dev/documentation/components/amp-sticky-ad)：黏底廣告容器。
- [Google 關於 affiliate 連結標記的說明](https://developers.google.com/search/blog/2021/07/link-tagging-and-link-spam-update)：`sponsored` 也用於聯盟推薦。

保留原有開源來源與授權。上游清單、核心引擎、登入例外及權限均未變更；只有本機規則資料、測試、版本及說明更新。
