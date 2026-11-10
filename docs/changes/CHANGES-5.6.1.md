# 淨頁 Clearview 5.6.1

- 修正 `chrome://extensions` 出現的 `Stats: ... MAX_GETMATCHEDRULES_CALLS_PER_INTERVAL quota` 錯誤。
  Chrome 每 10 分鐘只允許 20 次統計查詢，而且重新載入擴充功能後照樣累計；我們自己的計數卻會在重新載入時
  歸零，短時間內多次重新載入或常開彈出視窗就會超過。現在超過時不再報錯，改顯示已存的數字，等這段時間過去
  再繼續統計。只影響統計，不影響攔截。這個問題從 5.3.1 以前就存在。
