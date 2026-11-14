# 更新紀錄 · Changelog

每一版的完整說明與量測數據在 [`docs/changes/`](docs/changes/)。
Full notes and measurements for each version are in [`docs/changes/`](docs/changes/).

## 5.6.4 — 2026-11-15
- 背景程式的修正索引改成二進位：載入時間 4.9 ms → 1.2 ms，記憶體少約三成；攔截內容不變。
- The worker's fix index is now binary: loads in 1.2 ms instead of 4.9 ms and uses about 30% less memory. Blocking is unchanged.
- [詳細 · Details](docs/changes/CHANGES-5.6.4.md)

## 5.6.3 — 2026-11-11
- 預設多擋 34 個廣告、追蹤與遙測主機（只擋其他網站對它們的請求）。
- Blocks 34 more ad, tracker and telemetry hosts as third parties.
- [詳細 · Details](docs/changes/CHANGES-5.6.3.md)

## 5.6.2 — 2026-11-11
- 修正 5.6.0 起你點的連結可能被當成彈出視窗關掉的問題。
- 多擋 TikTok、Yandex 的 4 個追蹤主機。
- Fixes links you click being closed as pop-ups (since 5.6.0); blocks four more TikTok and Yandex trackers.
- [詳細 · Details](docs/changes/CHANGES-5.6.2.md)

## 5.6.1 — 2026-11-11
- 修正擴充功能錯誤頁出現的統計配額錯誤（只影響統計數字）。
- Fixes a statistics quota error shown on the extensions page.
- [詳細 · Details](docs/changes/CHANGES-5.6.1.md)

## 5.6.0 — 2026-11-11
- 支援清單裡的彈出視窗規則（3,032 條）、改樣式規則（685 條）與移除屬性規則（92 條）。
- 過濾清單更新到 2026-11-10。
- Applies the lists' pop-up, `:style()` and `:remove-attr()/:remove-class()` rules; lists updated to 2026-11-10.
- [詳細 · Details](docs/changes/CHANGES-5.6.0.md)

## 5.5.0 — 2026-11-10
- 效能版：測試頁上擴充功能在頁面內的執行時間由約 185 ms 降到約 38 ms，攔截內容不變。
- Performance release: in-page script time on a test page dropped from about 185 ms to 38 ms.
- [詳細 · Details](docs/changes/CHANGES-5.5.0.md)

## 5.4.0 – 5.4.3 — 2026-11-05
- 5.4.0 重寫過濾引擎：頁面記憶體 10.3 MB → 1.7 MB，廣告隱藏時間 49 ms → 14 ms。
- 5.4.1 修正 5.4.0 在 YouTube 觸發「廣告封鎖」警告的問題。
- 5.4.2、5.4.3：錯誤訊息修正、補上台灣與中國廣告網域。
- New filtering engine (5.4.0); YouTube warning fix (5.4.1); more Taiwan and China ad domains (5.4.3).
- [5.4.0](docs/changes/CHANGES-5.4.0.md) · [5.4.1](docs/changes/CHANGES-5.4.1.md) · [5.4.2](docs/changes/CHANGES-5.4.2.md) · [5.4.3](docs/changes/CHANGES-5.4.3.md)

## 5.3.x — 2026-11-02
- 介面支援繁體中文、简体中文、English。Interface in Traditional Chinese, Simplified Chinese and English.
- [5.3.0](docs/changes/CHANGES-5.3.0.md) · [5.3.1](docs/changes/CHANGES-5.3.1.md)

## 5.2.0 及更早 · and earlier
- 5.2.0：攔截統計、我的過濾規則、右鍵隱藏元素、鍵盤快捷鍵。Statistics, custom filters, right-click hiding, shortcuts.
- 5.0.0：改名淨頁 Clearview（原 Ad Shield）。Renamed from Ad Shield.
- 更早的版本見 [`docs/HISTORY.md`](docs/HISTORY.md) 與 [`docs/changes/`](docs/changes/)。
