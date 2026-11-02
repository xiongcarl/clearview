# 淨頁 Clearview 5.3.0

## 多語言
- 介面支援 **繁體中文、简体中文、English**，預設跟隨瀏覽器語言；設定頁右上角可手動切換，立即生效。
- 涵蓋彈出面板、設定頁、歡迎頁、元素選取工具、右鍵選單、鍵盤快捷鍵名稱、錯誤訊息，以及商店上的名稱與說明（manifest 使用 `__MSG_*__`）。
- 文字集中在 `_locales/<語言>/messages.json`，由 `tools/build-locales.py` 產生：繁中從頁面的 `data-i18n` 抽取，英文在腳本內，簡中由 OpenCC（台灣→大陸用語）轉換。腳本會檢查每個用到的鍵三種語言都有翻譯。
- 新增語言：在 `tools/build-locales.py` 加一份翻譯表，並在 `i18n.js` 的 `LANGS` 加上語言代碼。
