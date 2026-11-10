# 淨頁 Clearview 5.6.2

- **修正 5.6.0 的誤關：使用者點的連結不再被當成彈出視窗。** 5.6.0 起，網頁開的新分頁只要目標在清單的
  `$popup` 規則裡就會被關閉，連使用者自己點的連結也一樣。例如 EasyList 有 `||canyoublockit.com^$popup`，
  從 Google 搜尋結果點進該站的連結會直接消失。現在開新分頁時會先向開啟它的頁面確認：滑鼠所在或鍵盤聚焦的
  連結如果正是這個網址，就不關，之後轉址到哪裡也不管。無法向頁面確認時一律不關。
  腳本自己開的視窗（包括點別的連結時偷開的）照舊依清單關閉。
- `tools/test-list-rules.mjs` 加入這兩種情況。
- 預設多擋 4 個追蹤網域（只擋其他網站對它們的請求，直接開啟這些網站不受影響）：`business-api.tiktok.com`、
  `ads.tiktok.com`、`appmetrica.yandex.ru`、`metrika.yandex.ru`。Turtlecute 測試由 126/130 變成 130/130。
  `yandex.ru` 本身沒有被封鎖。
