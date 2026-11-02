#!/usr/bin/env python3
"""Generate _locales/{zh_TW,zh_CN,en}/messages.json.

Traditional Chinese is the source: page strings are read from the data-i18n attributes in
popup.html, options.html and welcome.html; script-only strings live in JS_ZH below. English
lives in EN. Simplified Chinese is converted from Traditional with OpenCC (tw2sp) plus a few
term fixes. The script fails if any key used by the pages or scripts is missing a translation.

    pip3 install opencc-python-reimplemented
    python3 tools/build-locales.py
"""
import html, json, pathlib, re, sys
import opencc

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ['popup.html', 'options.html', 'welcome.html']
SCRIPTS = ['popup.js', 'options.js', 'background.js', 'content.js', 'user-filters.js', 'common.js', 'welcome.js']

# Strings used only from scripts or the manifest ($1, $2 … are filled at run time).
JS_ZH = {
  'ext_name': '淨頁 Clearview — 廣告攔截',
  'ext_desc': '攔截廣告、追蹤與彈窗廣告；支援台灣與中文網站、自訂過濾規則、右鍵隱藏元素、攔截統計與分站相容模式。',
  'cmd_start_picker': '選取並隱藏網頁元素',
  'cmd_toggle_site': '暫停或恢復此網站的攔截',
  'menu_hide_element': '隱藏這個元素…',
  'menu_toggle_site': '暫停／恢復此網站的攔截',
  'state_unreadable': '無法讀取設定', 'state_all_paused': '攔截已全面暫停', 'state_na': '此頁面不適用',
  'state_site_paused': '此網站已暫停攔截', 'state_compat': '相容模式防護中', 'state_active': '防護中',
  'common_no_response': '背景服務沒有回應', 'common_save_failed': '儲存失敗：$1', 'common_read_failed': '讀取失敗：$1',
  'common_updating': '正在下載並檢查清單…', 'common_update_failed': '更新失敗，保留原清單：$1',
  'common_init_partial': '部分初始化失敗：$1', 'common_last_update_failed': '上次更新失敗，仍使用舊清單：$1',
  'common_remove': '移除', 'common_enabled': '已啟用', 'common_disabled': '未啟用',
  'popup_milestone': '淨頁已經替你擋下 $1 個廣告與追蹤。淨頁免費、不追蹤你；如果它讓上網清爽一點，歡迎支持開發。',
  'popup_resume_site': '恢復此網站', 'popup_compat_off': '關閉此網站相容模式',
  'popup_list_info': '$1 個網域 · $2 條網頁規則 · $3', 'popup_updated_on': '更新於 $1', 'popup_builtin_list': '內建離線清單',
  'popup_saved': '設定已儲存。請重新載入頁面，讓彈窗與版面設定完整生效。',
  'popup_compat_full': '相容模式最多 200 個網站，請先移除不需要的項目。',
  'popup_whitelist_full': '白名單最多 200 個網域，請先移除不需要的項目。',
  'popup_sitemodes_full': '網站防彈窗設定最多 50 個網域。',
  'popup_picker_failed': '無法啟動', 'popup_reload_first': '請先重新載入網頁再試：$1',
  'popup_update_done': '清單更新完成。自訂規則與白名單已保留。',
  'opt_unsaved': '有未儲存的變更。', 'opt_remove_aria': '移除 $1',
  'opt_list_info': '$1 個網域 · 來源版本 $2 · $3', 'opt_recent_update': '最近更新 $1', 'opt_builtin_list': '使用內建離線清單',
  'opt_weblist_row': '$1 · $2 條網路規則 · $3 條元素規則 · $4', 'opt_network_on': '已啟用網路過濾', 'opt_network_off': '網路過濾未啟用',
  'opt_enhanced_info': '$1 個廣告／追蹤等網域 · 版本 $2 · $3；只過濾第三方請求，可能影響網站元件，可關閉或加入允許名單。',
  'opt_advanced_info': '$1 條網站腳本規則 · $2 條進階元素規則。支援部分上游語法；不保證所有網站或影片廣告。',
  'opt_last_error': '上次更新失敗，仍保留可用清單：$1',
  'opt_invalid_domain_in': '$1包含無效網域：$2', 'opt_max_domains': '$1最多 $2 個網域',
  'label_whitelist': '白名單', 'label_compat': '相容網站', 'label_block': '封鎖名單', 'label_allow': '允許名單',
  'opt_selector_invalid': '元素選擇器無效', 'opt_css_invalid': 'CSS 選擇器格式無效：$1',
  'opt_filter_status': '$1 條網路規則 · $2 條元素規則', 'opt_filter_problems': ' · $1 行有問題',
  'opt_filters_too_long': '我的過濾規則過長（上限 200,000 字元）',
  'opt_saved': '已儲存。請重新載入網頁，讓設定完整生效。',
  'log_block': '封鎖', 'log_allow': '放行', 'log_upgrade': '升級 HTTPS', 'log_redirect': '本機替代',
  'opt_add_to_block': '加入封鎖名單', 'opt_added_block': '已加入封鎖名單，請儲存設定。',
  'opt_logs_shown': '顯示 $1 筆近期規則命中。', 'opt_logs_off': '診斷記錄尚未啟用；勾選並儲存設定後，重新載入要檢查的網站。',
  'opt_logs_cleared': '紀錄已清除。', 'opt_enter_domain': '請輸入有效的網站網域。', 'opt_sitemodes_max': '網站專用設定最多 50 個。',
  'opt_mode_added': '網站模式已加入，請儲存設定。', 'opt_rule_added': '元素規則已加入，請儲存設定。',
  'opt_update_done': '清單更新完成。未儲存的表單內容仍保留。', 'opt_list_reset': '已恢復內建清單。自訂設定未變更。',
  'opt_exported': '設定已匯出到下載資料夾。', 'opt_backup_too_big': '備份檔過大', 'opt_backup_unsupported': '不是支援的淨頁備份',
  'opt_backup_bad_rules': '備份包含重複、無效或超過上限的規則', 'opt_backup_bad_compat': '備份包含無效的相容網站',
  'opt_import_failed': '匯入失敗：$1', 'opt_ready': '設定只存於本機。修改後請按「儲存設定」。',
  'opt_stats_since': '自 $1 起統計。數字只存於本機，不會上傳。', 'opt_stats_failed': '統計讀取失敗：$1',
  'opt_reset_confirm': '要清除所有攔截統計嗎？這不會影響任何設定。', 'opt_stats_reset': '統計已重設。', 'opt_not_set': '未設定',
  'uf_bad_domain': '無效的網域「$1」', 'uf_no_exceptions': '暫不支援例外元素規則，請改用白名單或相容模式',
  'uf_bad_cosmetic': '不支援這種元素規則語法（只支援 ##）', 'uf_selector_invalid': '元素選擇器無效或過長',
  'uf_generic_too_broad': '通用元素規則範圍過大', 'uf_bad_option': '不支援的選項「$1」', 'uf_regex_ascii': '正規表示式只能包含 ASCII 字元',
  'uf_too_broad': '網址規則範圍過大', 'uf_url_ascii': '網址規則只能包含 ASCII 字元（中文網域請改用 punycode）',
  'uf_max_lines': '最多 $1 行', 'uf_max_network': '網路規則最多 $1 條', 'uf_css_invalid': 'CSS 選擇器格式無效',
  'uf_line_error': '第 $1 行：$2', 'uf_myfilters_line': '我的過濾規則第 $1 行：$2',
  'bg_regex_unsupported': '瀏覽器不支援這個正規表示式', 'bg_list_server': '清單伺服器回應 $1', 'bg_list_too_big': '清單過大',
  'bg_list_shrunk': '清單數量異常減少；已保留舊清單', 'bg_site_paused': '此網站的攔截已暫停', 'bg_rule_invalid': '元素規則無效',
  'bg_rules_max': '元素規則最多 300 條', 'bg_invalid_tab': '無效的分頁', 'bg_picker_failed': '無法啟動元素選取',
  'bg_rule_quota': '超過瀏覽器的規則上限（Firefox 最多 3 萬條）。請關閉部分清單，例如 Fanboy 干擾元素或 HaGeZi ULTIMATE。',
  'bg_dynamic_quota': '自訂規則與網域清單合計超過瀏覽器上限，請減少「我的過濾規則」或額外封鎖的網域。',
  'bg_list_format': '清單來源或格式不符', 'bg_list_invalid': '清單不完整或包含無效網域；已保留舊清單',
  'picker_title': '選擇要隱藏的元素', 'picker_hint': '將滑鼠移到廣告上並點一下。Enter 確認，Esc 取消。',
  'picker_selected': '已選取。確認後會在此網站隱藏它。', 'picker_selected_many': '已選取，同樣的元素在這頁共有 $1 個，會一起隱藏。',
  'picker_repick': '重新選擇', 'picker_widen': '擴大範圍', 'picker_widen_title': '改選外層容器', 'picker_cancel': '取消',
  'picker_confirm': '隱藏這個元素', 'picker_save_failed': '保存失敗',
  'picker_not_unique': '無法唯一識別此元素，請選擇更小的範圍', 'picker_too_deep': '元件層數過深，請選擇外層容器',
  'picker_too_broad': '選擇器過長或範圍過大，請選擇較小的元素',
}
# Page strings whose HTML default differs from the message (run-time values).
ZH_OVERRIDE = {'opt_version_foot': '版本 $1 · 設定只存於本機'}

EN = {
  'ext_name': 'Clearview — Ad Blocker',
  'ext_desc': 'Blocks ads, trackers and pop-ups. Great on Chinese sites, with custom rules, right-click hiding and statistics.',
  'brand_short': 'Clearview', 'brand_sub': 'Ad blocker',
  'cmd_start_picker': 'Pick and hide an element', 'cmd_toggle_site': 'Pause or resume blocking on this site',
  'menu_hide_element': 'Hide this element…', 'menu_toggle_site': 'Pause / resume blocking on this site',
  'state_unreadable': 'Settings unavailable', 'state_all_paused': 'Blocking is paused everywhere', 'state_na': 'Not available on this page',
  'state_site_paused': 'Paused on this site', 'state_compat': 'Protected (compatibility mode)', 'state_active': 'Protected',
  'common_no_response': 'The background service did not respond', 'common_save_failed': 'Could not save: $1', 'common_read_failed': 'Could not load: $1',
  'common_updating': 'Downloading and checking the list…', 'common_update_failed': 'Update failed; the previous list is kept: $1',
  'common_init_partial': 'Partly failed to start: $1', 'common_last_update_failed': 'Last update failed; still using the previous list: $1',
  'common_remove': 'Remove', 'common_enabled': 'on', 'common_disabled': 'off', 'common_loading': 'Loading settings…',
  'common_support': 'Support Clearview', 'common_support_heart': '♥ Support Clearview', 'common_add': 'Add',
  'mode_inherit': 'Use default', 'mode_balanced': 'Standard', 'mode_strict': 'Strict', 'mode_off': 'Off',
  'popup_settings': 'Settings', 'popup_master_title': 'Master switch', 'popup_master_label': 'Block ads and trackers',
  'popup_page_protection': 'This page', 'popup_count_label': 'ads and trackers blocked on this page',
  'popup_stats': 'Statistics', 'popup_today': 'Today', 'popup_total': 'All time',
  'popup_support_button': 'Support Clearview', 'popup_later': 'Maybe later', 'popup_this_site': 'This site',
  'popup_pause_site': 'Pause on this site', 'popup_resume_site': 'Resume on this site', 'popup_hide_element': 'Hide an element',
  'popup_site_popup': 'Pop-ups here', 'popup_default_popup': 'Default',
  'popup_broken_title': 'Site looks broken?',
  'popup_broken_hint': 'Compatibility mode turns off element hiding and site fixes here and lets this site load its own requests; third-party ad networks stay blocked. Reload the page after switching.',
  'popup_compat_on': 'Use compatibility mode here', 'popup_compat_off': 'Turn off compatibility mode here',
  'popup_lists_title': 'Lists and extra protection', 'popup_lists_loading': 'Loading lists…',
  'popup_strict3p_hint': 'Stops 17 services from loading on other sites. May affect videos, support chats and consent dialogs.',
  'popup_apply_strong': 'Apply stronger blocking', 'popup_update_lists': 'Update lists', 'popup_reload': 'Reload page',
  'popup_milestone': 'Clearview has blocked $1 ads and trackers for you. It is free and never tracks you; if it makes the web calmer, please consider supporting it.',
  'popup_list_info': '$1 domains · $2 web rules · $3', 'popup_updated_on': 'updated $1', 'popup_builtin_list': 'built-in offline list',
  'popup_saved': 'Saved. Reload the page for pop-up and layout settings to take full effect.',
  'popup_compat_full': 'Compatibility mode holds up to 200 sites. Remove some first.',
  'popup_whitelist_full': 'The allowlist holds up to 200 domains. Remove some first.',
  'popup_sitemodes_full': 'Per-site pop-up settings hold up to 50 domains.',
  'popup_picker_failed': 'Could not start', 'popup_reload_first': 'Reload the page and try again: $1',
  'popup_update_done': 'Lists updated. Your rules and allowlist are kept.',
  'opt_page_title': 'Clearview · Settings', 'opt_skip': 'Skip to settings', 'opt_brand_aria': 'Top of Clearview settings', 'opt_nav_aria': 'Settings sections',
  'opt_stats_title': 'Statistics', 'opt_protection_title': 'Protection & pop-ups', 'opt_filters_title': 'Filter lists',
  'opt_myfilters_title': 'My filter rules', 'opt_sources_title': 'Domain list', 'opt_exceptions_title': 'Site exceptions',
  'opt_elements_title': 'Element hiding', 'opt_diag_title': 'Diagnostics', 'opt_backup_title': 'Backup & restore',
  'opt_version_foot': 'Version $1 · Settings stay on this device', 'opt_heading': 'Settings',
  'opt_language': 'Interface language', 'opt_language_auto': 'Browser language',
  'opt_intro': 'Browse quietly and keep only what you came for. Manage blocking, site exceptions and your own rules here; everything stays on this device.',
  'opt_stats_local': 'Statistics stay on this device.', 'opt_stat_total': 'All time', 'opt_stat_week': 'Last 7 days', 'opt_stat_14': 'Last 14 days',
  'opt_chart_aria': 'Blocked per day over the last 14 days', 'opt_top_sites': 'Sites with the most blocking',
  'opt_top_sites_empty': 'No data yet. Browse a few sites and come back.', 'opt_reset_stats': 'Reset statistics',
  'opt_protection_desc': 'The master switch and how pop-ups are handled.',
  'opt_enabled_title': 'Enable blocking', 'opt_enabled_desc': 'When off, all network filtering, element hiding and pop-up blocking pause.',
  'opt_hideads_title': 'Hide ad elements automatically', 'opt_hideads_desc': 'Hides ad slots and empty frames from the lists; your own element rules are kept separately.',
  'opt_badge_title': 'Show the blocked count on the toolbar icon', 'opt_badge_desc': 'A small number on the icon. The panel always shows it.',
  'opt_popupmode_title': 'Default pop-up blocking', 'opt_mode_balanced_long': 'Standard: native browser navigation (recommended)',
  'opt_mode_strict_long': 'Strict: may affect sign-in and redirects', 'opt_mode_off_long': 'Off (other blocking stays on)',
  'opt_popupmode_desc': 'Standard keeps links, sign-in windows and form redirects working while known pop-up ad networks are still blocked. Strict may block sign-in and authorisation, so turn it on only for specific sites. Reload pages after switching.',
  'opt_sitemodes_title': 'Per-site pop-up blocking', 'opt_sitemodes_desc': 'Includes subdomains; the more specific domain wins. Up to 50.',
  'opt_site_domain': 'Site domain', 'opt_site_mode': 'Site mode',
  'opt_filters_desc': 'Filtering by URL path, resource type and site. Lists update with each release.',
  'opt_list_easylist': 'The standard international ad list', 'opt_list_easyprivacy': 'Tracking and analytics requests',
  'opt_list_chinese_title': 'AdGuard Chinese', 'opt_list_chinese': 'Sites in Taiwan, Hong Kong and China (includes EasyList China)',
  'opt_list_fixes_title': 'uBlock fixes', 'opt_list_fixes': 'Site fixes, anti-adblock handling and false-positive exceptions',
  'opt_list_annoy_title': 'Fanboy Annoyances', 'opt_list_annoy': 'Cookie banners and newsletter pop-overs; more likely to over-hide',
  'opt_view_counts': 'Show rule counts per list', 'opt_group_elements': 'Elements and site scripts',
  'opt_scriptlets_title': 'Site script fixes', 'opt_scriptlets_desc': 'Handles video ads and anti-adblock detection (for example YouTube). Takes effect after reloading.',
  'opt_shadow_title': 'Hide ads inside site components', 'opt_shadow_desc': 'Also covers Shadow DOM components; paused in compatibility mode.',
  'opt_procedural_title': 'Advanced element matching', 'opt_procedural_desc': 'Finds ad elements by text, parent and style.',
  'opt_group_strong': 'Extra protection',
  'opt_direct_title': 'Block ad resources outright', 'opt_direct_desc': 'Rejects them instead of serving an empty local stand-in. May trigger anti-adblock notices.',
  'opt_enhanced_title': 'Stronger third-party blocking (HaGeZi ULTIMATE)',
  'opt_strict3p_title': 'Restrict extra third-party services', 'opt_strict3p_desc': 'Stops 17 mixed-use services from loading on other sites. May affect videos, support chats and cookie consent dialogs.',
  'opt_view_services': 'Show the restricted services (17)',
  'opt_recommended_title': 'Recommended full protection',
  'opt_recommended_desc': 'Turns on the main lists, element handling and site fixes. Pop-up mode, outright blocking, third-party restrictions and site exceptions are left as they are.',
  'opt_apply_one_click': 'Apply',
  'opt_myfilters_desc': 'Write your own rules in common Adblock Plus / uBlock Origin syntax, or paste a domain list. They take priority over the built-in lists; the allowlist still wins.',
  'opt_filters_placeholder': '! Comments start with an exclamation mark\n||ads.example.com^\n||example.com/banner/*$image,third-party\n@@||cdn.example.com^$script\nexample.com##.sponsored\n##.ad-slot-top',
  'opt_syntax_title': 'Supported syntax',
  'opt_syntax_1': '<code>||ads.example.com^</code> blocks a domain and its subdomains; you can also write <code>ads.example.com</code> or the hosts format <code>0.0.0.0 ads.example.com</code>.',
  'opt_syntax_2': '<code>||example.com/ads/*</code> and <code>/banner\\d+\\.gif/</code> block by URL or regular expression.',
  'opt_syntax_3': 'Lines starting with <code>@@</code> allow; <code>@@||example.com^$document</code> turns off network filtering on that site.',
  'opt_syntax_4': 'Options: <code>$script</code> <code>image</code> <code>stylesheet</code> <code>xhr</code> <code>frame</code> <code>media</code> <code>font</code> <code>websocket</code> <code>ping</code> <code>popup</code> <code>third-party</code> <code>first-party</code> <code>domain=a.com|~b.com</code> <code>important</code> <code>match-case</code>; prefix with <code>~</code> to exclude.',
  'opt_syntax_5': '<code>example.com,~shop.example.com##.ad</code> hides elements on given sites; <code>##.ad</code> applies everywhere. Advanced selectors such as <code>:has-text()</code> work too.',
  'opt_syntax_6': 'Up to 5,000 lines. Script injection (<code>##+js</code>) and element exceptions (<code>#@#</code>) are not supported.',
  'opt_sources_desc': 'Built-in HaGeZi Multi LIGHT covers ad, tracking and malicious domains. Updates download plain domain text only and never run remote code.',
  'opt_current_list': 'Current list', 'opt_autoupdate_title': 'Update daily', 'opt_autoupdate_desc': 'Checked once a day while the browser runs. Requires saving.',
  'opt_update_now': 'Update now', 'opt_reset_list': 'Restore built-in list',
  'opt_exceptions_desc': 'One domain per line, including subdomains. Reload pages after saving.',
  'opt_whitelist_title': 'Allowlist', 'opt_whitelist_desc': 'Turns blocking off completely on these sites. Up to 200.',
  'opt_compat_title': 'Compatibility mode', 'opt_compat_desc': 'Turns off element hiding and site fixes and lets the site load its own requests; third-party ad filtering stays on. Up to 200.',
  'opt_block_title': 'Extra domains to block', 'opt_block_desc': 'Up to 500.',
  'opt_allow_title': 'Domains to allow', 'opt_allow_desc': 'Wins over block rules; network requests only. Up to 500.',
  'opt_elements_desc': 'Right-click a page and choose “Hide this element…”, or pick from the toolbar panel. Rules apply to that site and its subdomains, up to 300.',
  'opt_element_domain': 'Element site domain', 'opt_css_selector': 'CSS selector',
  'opt_shortcuts_title': 'Keyboard shortcuts', 'opt_edit_shortcuts': 'Change shortcuts',
  'opt_diag_desc': 'Records the last 200 rule matches to help find false positives. Kept for this browser session only, with query strings removed.',
  'opt_logging_title': 'Record rule matches', 'opt_logging_desc': 'Requires saving; works only when the extension is loaded unpacked (developer mode).',
  'opt_view_logs': 'Show records', 'opt_clear_logs': 'Clear records',
  'opt_backup_desc': 'The JSON backup includes your site lists and rules. Importing replaces current settings but not the list version.',
  'opt_export': 'Export settings', 'opt_import': 'Import settings',
  'opt_support_desc': 'Clearview is free, ad-free and collects no browsing data. It is maintained by one person in their spare time. If it makes your web calmer, a donation keeps the list fixes and new features coming.',
  'opt_support_button': '♥ Donate',
  'opt_footer': 'Settings stay on this device. Updating lists connects to GitHub, which sees ordinary connection details; no browsing history, allowlists or settings are sent.',
  'opt_footer_source': 'Domain list source', 'opt_footer_privacy': 'Privacy policy', 'opt_footer_readme': 'Usage and limits',
  'opt_save': 'Save settings',
  'opt_unsaved': 'You have unsaved changes.', 'opt_remove_aria': 'Remove $1',
  'opt_list_info': '$1 domains · source version $2 · $3', 'opt_recent_update': 'last updated $1', 'opt_builtin_list': 'using the built-in offline list',
  'opt_weblist_row': '$1 · $2 network rules · $3 element rules · $4', 'opt_network_on': 'network filtering on', 'opt_network_off': 'network filtering off',
  'opt_enhanced_info': '$1 ad and tracking domains · version $2 · $3. Filters third-party requests only and may affect site widgets; turn it off or allow domains if needed.',
  'opt_advanced_info': '$1 site script rules · $2 advanced element rules. Supports part of the upstream syntax; not every site or video ad is guaranteed.',
  'opt_last_error': 'Last update failed; the working list is kept: $1',
  'opt_invalid_domain_in': '$1 has an invalid domain: $2', 'opt_max_domains': '$1 holds up to $2 domains',
  'label_whitelist': 'Allowlist', 'label_compat': 'Compatibility sites', 'label_block': 'Block list', 'label_allow': 'Allow list',
  'opt_selector_invalid': 'Invalid element selector', 'opt_css_invalid': 'Invalid CSS selector: $1',
  'opt_filter_status': '$1 network rules · $2 element rules', 'opt_filter_problems': ' · $1 lines need fixing',
  'opt_filters_too_long': 'My filter rules are too long (200,000 characters max)',
  'opt_saved': 'Saved. Reload pages for the settings to take full effect.',
  'log_block': 'Blocked', 'log_allow': 'Allowed', 'log_upgrade': 'Upgraded to HTTPS', 'log_redirect': 'Local stand-in',
  'opt_add_to_block': 'Add to block list', 'opt_added_block': 'Added to the block list. Save to apply.',
  'opt_logs_shown': 'Showing $1 recent rule matches.', 'opt_logs_off': 'Recording is off. Turn it on, save, then reload the site to check.',
  'opt_logs_cleared': 'Records cleared.', 'opt_enter_domain': 'Enter a valid site domain.', 'opt_sitemodes_max': 'Up to 50 per-site settings.',
  'opt_mode_added': 'Site mode added. Save to apply.', 'opt_rule_added': 'Element rule added. Save to apply.',
  'opt_update_done': 'Lists updated. Unsaved form changes are kept.', 'opt_list_reset': 'Built-in list restored. Your settings are unchanged.',
  'opt_exported': 'Settings exported to your Downloads folder.', 'opt_backup_too_big': 'The backup file is too large', 'opt_backup_unsupported': 'Not a supported Clearview backup',
  'opt_backup_bad_rules': 'The backup has duplicate, invalid or too many rules', 'opt_backup_bad_compat': 'The backup has invalid compatibility sites',
  'opt_import_failed': 'Import failed: $1', 'opt_ready': 'Settings stay on this device. Press “Save settings” after making changes.',
  'opt_stats_since': 'Counting since $1. Numbers stay on this device and are never uploaded.', 'opt_stats_failed': 'Could not load statistics: $1',
  'opt_reset_confirm': 'Clear all statistics? Your settings are not affected.', 'opt_stats_reset': 'Statistics reset.', 'opt_not_set': 'Not set',
  'uf_bad_domain': 'Invalid domain “$1”', 'uf_no_exceptions': 'Element exceptions are not supported yet; use the allowlist or compatibility mode',
  'uf_bad_cosmetic': 'Unsupported element rule syntax (only ## is supported)', 'uf_selector_invalid': 'Element selector is invalid or too long',
  'uf_generic_too_broad': 'Generic element rule is too broad', 'uf_bad_option': 'Unsupported option “$1”', 'uf_regex_ascii': 'Regular expressions must be ASCII',
  'uf_too_broad': 'URL rule is too broad', 'uf_url_ascii': 'URL rules must be ASCII (use punycode for non-Latin domains)',
  'uf_max_lines': 'Up to $1 lines', 'uf_max_network': 'Up to $1 network rules', 'uf_css_invalid': 'Invalid CSS selector',
  'uf_line_error': 'Line $1: $2', 'uf_myfilters_line': 'My filter rules, line $1: $2',
  'bg_regex_unsupported': 'the browser does not support this regular expression', 'bg_list_server': 'List server responded $1', 'bg_list_too_big': 'The list is too large',
  'bg_list_shrunk': 'The list shrank unexpectedly; the previous list is kept', 'bg_site_paused': 'Blocking is paused on this site', 'bg_rule_invalid': 'Invalid element rule',
  'bg_rules_max': 'Up to 300 element rules', 'bg_invalid_tab': 'Invalid tab', 'bg_picker_failed': 'Could not start the element picker',
  'bg_rule_quota': 'Too many rules for this browser (Firefox allows 30,000). Turn off a list such as Fanboy Annoyances or HaGeZi ULTIMATE.',
  'bg_dynamic_quota': 'Your rules and the domain list exceed the browser limit. Remove some of “My filter rules” or extra blocked domains.',
  'bg_list_format': 'Unexpected list source or format', 'bg_list_invalid': 'The list is incomplete or has invalid domains; the previous list is kept',
  'picker_title': 'Pick an element to hide', 'picker_hint': 'Point at the ad and click. Enter to confirm, Esc to cancel.',
  'picker_selected': 'Selected. Confirm to hide it on this site.', 'picker_selected_many': 'Selected. $1 matching elements on this page will be hidden together.',
  'picker_repick': 'Pick again', 'picker_widen': 'Widen', 'picker_widen_title': 'Select the surrounding container', 'picker_cancel': 'Cancel',
  'picker_confirm': 'Hide this element', 'picker_save_failed': 'Could not save',
  'picker_not_unique': 'This element cannot be identified uniquely; pick a smaller area', 'picker_too_deep': 'Components are nested too deeply; pick an outer container',
  'picker_too_broad': 'The selector is too long or too broad; pick a smaller element',
  'wel_page_title': 'Welcome to Clearview', 'wel_heading': 'Welcome — Clearview is already at work',
  'wel_lead': 'Ads, trackers and pop-up ads are blocked automatically, including on Chinese-language sites. No setup needed; just browse.',
  'wel_pin_title': 'Pin Clearview to the toolbar first',
  'wel_pin_desc': 'Click the puzzle-piece icon at the top right of your browser, then the pin next to “Clearview”. You will always see how much each page blocked.',
  'wel_tips_aria': 'Tips', 'wel_tip1_title': 'An ad slipped through?', 'wel_tip1_desc': 'Right-click it, choose “Hide this element…” and confirm. It will not come back on that site.',
  'wel_tip1_key': 'Pick an element', 'wel_tip2_title': 'Site looks odd?', 'wel_tip2_desc': 'Click Clearview in the toolbar to pause this site or use compatibility mode; other sites stay protected.',
  'wel_tip3_title': 'Want more control?', 'wel_tip3_desc': 'Add your own filter rules, manage lists, see statistics or export a backup.', 'wel_open_settings': 'Open settings →',
  'wel_promise_title': 'Our promise', 'wel_promise1_title': 'No browsing data collected', 'wel_promise1_desc': 'All filtering happens on your computer; settings and statistics stay on this device.',
  'wel_promise2_title': 'No “acceptable ads”', 'wel_promise2_desc': 'We never take money from advertisers to let anyone through.',
  'wel_promise3_title': 'Open source', 'wel_promise3_desc': 'Licensed under GPL-3.0; anyone can read and improve it.',
  'wel_support_title': 'Enjoying Clearview?', 'wel_support_desc': 'Clearview is free and maintained by one person in their spare time. If it makes your web calmer, buy me a coffee to keep list fixes and new features coming.',
  'wel_done': 'Start browsing',
}
# OpenCC (tw2sp) handles most terms; these are the remaining mainland usages.
CN_FIXES = [('缺省', '默认'), ('自订', '自定义'), ('扩充功能', '扩展程序'), ('插件', '扩展'), ('暂存', '缓存'), ('网域', '域名')]

def page_strings():
    found = {}
    def add(key, value):
        if key in found and found[key] != value:
            sys.exit(f'Conflicting text for {key}: {found[key]!r} vs {value!r}')
        found[key] = value
    for name in PAGES:
        text = (ROOT / name).read_text()
        for match in re.finditer(r'<(\w+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>([^<]*)</\1>', text):
            add(match[2], html.unescape(match[3]))
        for match in re.finditer(r'<(\w+)\b[^>]*\bdata-i18n-html="([^"]+)"[^>]*>(.*?)</\1>', text, re.S):
            add(match[2], match[3])
        for tag in re.finditer(r'<[^>]+>', text):
            for attribute in ['placeholder', 'title', 'aria-label', 'data-empty']:
                key = re.search(rf'\bdata-i18n-{attribute}="([^"]+)"', tag[0])
                value = re.search(rf'(?<![-\w]){attribute}="([^"]*)"', tag[0])
                if key and value:
                    add(key[1], html.unescape(value[1]))
    return found

def script_keys():
    keys = set()
    for name in SCRIPTS:
        text = (ROOT / name).read_text()
        keys |= set(re.findall(r"\b(?:t|L|I18N\.t)\('([a-z0-9_]+)'", text))
        keys |= set(re.findall(r"'((?:state|popup|opt|common|mode|picker|log|label|cmd|menu|bg|uf)_[a-z0-9_]+)'", text))
    keys |= {f'mode_{m}' for m in ['balanced', 'strict', 'off']} | {'cmd_start_picker', 'cmd_toggle_site', 'ext_name', 'ext_desc'}
    return {key for key in keys if not key.endswith('_')}

def main():
    zh = {**page_strings(), **JS_ZH, **ZH_OVERRIDE}
    needed = set(zh) | script_keys()
    missing = sorted(k for k in needed if k not in zh) + sorted(f'en:{k}' for k in needed if k not in EN)
    for locale_name, table in (('zh_TW', zh), ('en', EN)):
        if len(table['ext_desc']) > 132 or len(table['ext_name']) > 75:
            sys.exit(f'{locale_name}: name or description too long for the stores')
    if missing:
        sys.exit('Missing translations: ' + ', '.join(missing))
    converter = opencc.OpenCC('tw2sp')
    def to_cn(value):
        value = converter.convert(value)
        for old, new in CN_FIXES:
            value = value.replace(old, new)
        return value
    locales = {'zh_TW': zh, 'zh_CN': {k: to_cn(v) for k, v in zh.items()}, 'en': {k: EN[k] for k in zh}}
    for locale, table in locales.items():
        folder = ROOT / '_locales' / locale
        folder.mkdir(parents=True, exist_ok=True)
        data = {key: {'message': value} for key, value in sorted(table.items())}
        (folder / 'messages.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')
    unused = sorted(k for k in EN if k not in zh)
    print(f'{len(zh)} messages × {len(locales)} locales' + (f'; unused English keys: {", ".join(unused)}' if unused else ''))

main()
