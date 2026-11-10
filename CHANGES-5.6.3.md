# 淨頁 Clearview 5.6.3

- 預設多擋 34 個廣告、追蹤與遙測主機（只擋其他網站對它們的請求，直接開啟不受影響）：廣告平台
  （`ads.microsoft.com`、`ads.x.com`、`ads.snapchat.com`、`ads.huawei.com`、Vungle、AppLovin、Liftoff、
  Chartboost、Pangle、InMobi、Adjust、Quantcast）、追蹤（`analytics.twitter.com`、`snap.licdn.com`、
  `prd.jwpltx.com`、Braze、Dynamic Yield 的回報端點、Skimlinks 與 VigLink 的轉址主機）以及作業系統和
  智慧電視的遙測主機（Microsoft、Apple、LG、Roku）。
- superadblocktest.com 由 79% 變成 84%（405 → 429／482）。44 個真實網站的 4,210 個請求裡沒有任何一個
  因此多被擋下，也就是這些主機在一般瀏覽中本來就幾乎不出現。

## 刻意不擋的
該測試剩下的項目多半擋了會弄壞網站，所以不處理：
- 登入與社群：`accounts.google.com`、`www.facebook.com`、`graph.facebook.com`、`connect.facebook.net`、Instagram。
- 影片：`redirector.googlevideo.com`、`s.youtube.com`、`dai.google.com`、JW Player 的播放器檔案。
- Cookie 同意視窗（OneTrust、Cookiebot、Usercentrics、TrustArc 等）：不少網站要等它載入才顯示內容。
- A/B 測試與功能開關（Optimizely、LaunchDarkly、PostHog）、電子報連結（Mailchimp）、客服視窗（Intercom）、
  推播（OneSignal）、`a.klaviyo.com`（訂閱表單送出的位址）。
