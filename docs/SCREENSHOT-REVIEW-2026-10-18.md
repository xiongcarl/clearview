# 2026-10-18 截圖中的 17 項可連線結果

截圖顯示 Protection Score 95%、482 項檢查、17 項 Reachable。由總數減去可連線數可得 465 項未通過連線，原始比例約 96.5%。網站說明指出，Protection Score 是加權模組分數；Reachable 是該主機或探測看起來可連線，並不直接表示看到了廣告。網站也不能將攔截成效歸因於某一個插件，結果可能受瀏覽器、DNS 與其他防護影響。[測試網站說明](https://superadblocktest.com/)

這張截圖沒有完整請求路徑、資源類型、來源頁面或使用者當時的插件設定，不能僅憑網域判定是規則漏攔。以下是官方用途與本插件 2026-10-17 清單的靜態核對；不是對這些線上服務的實際播放、登入或交易測試。

| 圖中網域 | 核對結果與處理判斷 |
| --- | --- |
| `s.youtube.com` | 現有 EasyPrivacy 對 `youtube.com/api/stats/ads?` 等特定路徑有規則；截圖不含路徑，不能判斷本次是否命中這些條件。 |
| `redirector.googlevideo.com` | Google 官方文件確認其可用於廣告影音 CDN；插件上游修正已有帶 `source=dclk_video_ads`、限定來源網站的規則。需核對實際路徑及來源，不能把相關廣告傳送與所有其他影音請求混為一談。[Google 文件](https://support.google.com/admanager/answer/15685916?hl=en) |
| `quantcast.com` | EasyPrivacy 已包含 `quantcast.com/?log`，EasyList 另有第三方 `aboutads.quantcast.com` 規則。公司主網域可連線，不等於上述請求都被允許。 |
| `bnc.lt` | Branch 官方文件將其列為舊版深層連結網域；整站封鎖可能阻止使用者點擊的正常目的地。[Branch 文件](https://help.branch.io/account-hub/basic-link-configuration) |
| `i.instagram.com` | 本次未取得足以確認截圖中完整請求用途的官方證據，保留待核對，不新增整站封鎖。 |
| `ngfts.lge.com` | 本次未取得足以確認截圖中完整請求用途的官方證據，保留待核對，不把網域名稱當作充分證據。 |
| `cdn.cookielaw.org` | OneTrust 的 Cookie 同意管理資源。封鎖整個來源也會影響同意介面的資源載入；應依網站流程處理。[OneTrust 文件](https://developer.onetrust.com/onetrust/docs/content-security-policy-cdn) |
| `consent.trustarc.com` | 現有 EasyPrivacy 已限制 `/analytics?`、`/bannermsg?`、`/noticemsg?` 等路徑；Annoyances 另有特定來源網站的規則。不能從根網域連通推導這些路徑未被過濾。 |
| `cdn.privacy-mgmt.com` | Sourcepoint 同意管理端點；現有清單包含特定網站攔截與相容性例外。需保留網站條件，避免擴大規則。[Sourcepoint 文件](https://docs.sourcepoint.com/hc/en-us/articles/4405412419731-Client-configuration-parameters) |
| `go.skimresources.com` | 現有 EasyList 對 `skimresources.com` 的第三方腳本／子框架有規則，並非全部資源類型；截圖未顯示探測類型，因此不能由 Reachable 推論所有相關腳本漏攔。 |
| `cdn.dynamicyield.com` | 現有 EasyPrivacy 已包含該主網域的 `/batch?`、`/clog`、`/imp?` 等事件路徑，以及其他追蹤子網域。需要區分探測的是 CDN 根路徑還是事件端點。 |
| `clientstream.launchdarkly.com` | 官方端點表將其列為客戶端功能設定更新串流；分析事件使用另一類端點。不能把功能設定串流一律當廣告。[LaunchDarkly 端點文件](https://github.com/launchdarkly/ld-relay/blob/v8/docs/endpoints.md) |
| `click.mailchimp.com` | 截圖沒有完整跳轉網址；本次尚未確認該精確請求是否為追蹤、目的地跳轉或其他用途，不新增無條件封鎖。 |
| `widget.intercom.io` | 官方整合以此載入 Intercom 元件。封鎖可能讓網站的客服／訊息功能無法出現；可依使用者偏好逐站處理。[Intercom 文件](https://www.intercom.com/help/en/articles/170-integrate-intercom-in-a-single-page-app) |
| `static.klaviyo.com` | 官方文件確認 `/onsite/js/…/klaviyo.js` 可用於站內行為追蹤；現有清單另有追蹤端點規則。這是值得進一步核對完整路徑的項目，但根網域連通測試不足以驗證整個整合的攔截情況。[Klaviyo 文件](https://developers.klaviyo.com/en/docs/guide_to_setting_up_api_based_website_activity_events) |
| `dai.google.com` | Google DAI API 回傳影片串流資訊與 manifest，與動態廣告插入有關；整站封鎖也可能中斷串流建立。現有修正已針對部分網站及特定路徑處理。[Google DAI 文件](https://developers.google.com/ad-manager/dynamic-ad-insertion/api/full-service/video-player-live) |
| `ssl.p.jwpcdn.com` | JW Player 官方歷史版本以此提供播放器程式。現有插件修正則針對 `/vast.js`、`/freewheel.js` 等廣告模組，避免直接封鎖整個播放器來源。[JW Player 官方發布紀錄](https://github.com/jwplayer/jwplayer/releases) |

本次 4.6.0 交付改進介面，保留 4.5.1 的過濾規則與正常連結修復。沒有為測試分數新增全站封鎖或針對測試網站特殊處理。若要繼續補精準規則，下一份證據應是實際有廣告的頁面，以及對應請求的完整 URL、類型與來源；優先確認廣告／追蹤端點，再驗證一般內容仍正常。
