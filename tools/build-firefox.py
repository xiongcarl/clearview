#!/usr/bin/env python3
"""Build the Firefox (AMO) package from the Chrome source tree.

    python3 tools/build-firefox.py <output.zip>

Differences from the Chrome package:
- background runs as an event page: manifest lists the shared scripts in background.scripts
  (background.js skips importScripts when it is not a service worker);
- browser_specific_settings.gecko carries the add-on ID, minimum version and the
  data-collection declaration AMO requires;
- static rules using conditions Firefox does not implement (responseHeaders) are dropped.
"""
import json, pathlib, re, shutil, sys, tempfile, zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
GECKO_ID = '{4b5c2b8e-6f0a-4d7e-9a43-2f1d6c8e7a51}'
BACKGROUND = ['vendor/publicsuffix.js', 'i18n.js', 'common.js', 'user-filters.js', 'web-filtering.js',
              'static-rule-policy.js', 'popup-rescue.js', 'background.js']
EXCLUDE_DIRS = {'tools', 'testing-output', 'verification', '.previous-web-lists', '_metadata', 'node_modules'}
EXCLUDE_FILES = {'BENCHMARK.md', 'TESTING.md', 'STORE-LISTING.md', '.DS_Store'}
UNSUPPORTED_CONDITIONS = {'responseHeaders', 'excludedResponseHeaders'}
# AMO does not parse text files over 5 MB; keep every file below this.
MAX_TEXT_BYTES = 4_800_000
DOMAIN_ONLY = re.compile(r'^\|\|([a-z0-9.-]+)\^$')


def compress(rules, keep_ids):
    """Firefox enables at most 30,000 static rules. Merge rules that differ only in the blocked
    domain (||domain^ → requestDomains) or only in initiatorDomains; both merges match exactly the
    same requests. Rules the badfilter policy disables by ID keep their IDs."""
    kept, by_domain, by_initiator = [], {}, {}
    for rule in rules:
        condition = dict(rule['condition'])
        key_base = (rule['action']['type'], json.dumps(rule['action'], sort_keys=True), rule.get('priority', 1))
        mergeable = rule['id'] not in keep_ids and rule['action']['type'] in ('block', 'allow')
        match = DOMAIN_ONLY.match(condition.get('urlFilter', ''))
        if mergeable and match and 'requestDomains' not in condition and not condition.get('isUrlFilterCaseSensitive'):
            condition.pop('urlFilter')
            by_domain.setdefault(key_base + (json.dumps(condition, sort_keys=True),), []).append(match[1])
        elif mergeable and 'initiatorDomains' in condition and 'excludedInitiatorDomains' not in condition:
            initiators = condition.pop('initiatorDomains')
            by_initiator.setdefault(key_base + (json.dumps(condition, sort_keys=True),), []).extend(initiators)
        else:
            kept.append(rule)
    next_id = max([rule['id'] for rule in rules] + [0]) + 1
    merged = []
    def add(key, condition):
        nonlocal next_id
        merged.append({'id': next_id, 'priority': key[2], 'action': json.loads(key[1]), 'condition': condition})
        next_id += 1
    for key, domains in by_domain.items():
        domains = sorted(set(domains))
        for start in range(0, len(domains), 1000):
            add(key, {**json.loads(key[3]), 'requestDomains': domains[start:start + 1000]})
    for key, initiators in by_initiator.items():
        add(key, {**json.loads(key[3]), 'initiatorDomains': sorted(set(initiators))})
    return kept + merged


def split_rules(rules):
    chunks, current, size = [], [], 0
    for rule in rules:
        length = len(json.dumps(rule, separators=(',', ':'))) + 1
        if current and size + length > MAX_TEXT_BYTES:
            chunks.append(current); current, size = [], 0
        current.append(rule); size += length
    return chunks + [current]


def runtime_files():
    for path in sorted(ROOT.rglob('*')):
        relative = path.relative_to(ROOT)
        if path.is_dir() or EXCLUDE_DIRS & set(relative.parts):
            continue
        if relative.name in EXCLUDE_FILES or relative.name.startswith(('CHANGES-', 'SCREENSHOT-REVIEW-')):
            continue
        if relative.parts[:2] == ('data', 'filters') or (relative.parts[0] == 'data' and relative.suffix == '.txt'):
            continue
        yield relative


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    output = pathlib.Path(sys.argv[1]).resolve()
    manifest = json.loads((ROOT / 'manifest.json').read_text())
    rulesets = {entry['path']: entry['id'] for entry in manifest['declarative_net_request']['rule_resources']}
    keep = {}
    for changes in json.loads((ROOT / 'data/badfilter-policy.json').read_text())['origins'].values():
        for target, ids in changes.items():
            keep.setdefault(target, set()).update(ids)
    actions = {}
    manifest.pop('minimum_chrome_version', None)
    manifest['background'] = {'scripts': BACKGROUND}
    # Statistics: Firefox lacks getMatchedRules, so blocked requests are observed (not altered) via webRequest.
    manifest['permissions'].append('webRequest')
    manifest['browser_specific_settings'] = {'gecko': {
        'id': GECKO_ID, 'strict_min_version': '128.0',
        'data_collection_permissions': {'required': ['none']}}}
    dropped = before = after = 0
    with tempfile.TemporaryDirectory() as temp:
        stage = pathlib.Path(temp)
        for relative in runtime_files():
            target = stage / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            if str(relative) == 'data/web-cosmetics.json':
                # One file per list; background.js loads them separately on Firefox.
                for list_id, data in json.loads((ROOT / relative).read_text()).items():
                    part = stage / 'data/web-cosmetics' / f'{list_id}.json'
                    part.parent.mkdir(parents=True, exist_ok=True)
                    part.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
                continue
            if str(relative) in rulesets:
                ruleset = rulesets[str(relative)]
                rules = json.loads((ROOT / relative).read_text())
                supported = [rule for rule in rules if not UNSUPPORTED_CONDITIONS & set(rule['condition'])]
                dropped += len(rules) - len(supported)
                packed = compress(supported, keep.get(ruleset, set()))
                before += len(rules); after += len(packed)
                actions[ruleset] = {str(rule['id']): rule['action']['type'] for rule in packed}
                chunks = split_rules(packed)
                target.write_text(json.dumps(chunks[0], separators=(',', ':')))
                # Extra parts become rulesets <id>_2, <id>_3 … enabled together with the first.
                entry = next(x for x in manifest['declarative_net_request']['rule_resources'] if x['id'] == ruleset)
                for index, chunk in enumerate(chunks[1:], start=2):
                    if ruleset != 'enhanced':
                        sys.exit(f'{relative} needs splitting, but only the enhanced ruleset supports parts')
                    part_path = relative.with_name(f'{relative.stem}-{index}.json')
                    (stage / part_path).write_text(json.dumps(chunk, separators=(',', ':')))
                    manifest['declarative_net_request']['rule_resources'].append({**entry, 'id': f'{ruleset}_{index}', 'path': part_path.as_posix()})
            else:
                shutil.copy2(ROOT / relative, target)
        # The popup counts blocked requests by rule ID; IDs changed for the merged web lists.
        web_actions = json.loads((ROOT / 'data/web-actions.json').read_text())
        (stage / 'data/web-actions.json').write_text(json.dumps({ruleset: actions[ruleset] for ruleset in web_actions}, separators=(',', ':')))
        too_big = [p.relative_to(stage) for p in stage.rglob('*') if p.is_file() and p.suffix in ('.js', '.json', '.css', '.html', '.txt', '.md') and p.stat().st_size > MAX_TEXT_BYTES]
        if too_big:
            sys.exit('Files over the AMO 5 MB parse limit: ' + ', '.join(map(str, too_big)))
        # Only the default lists start enabled, so a fresh install stays under Firefox's 30,000-rule limit
        # before the background applies the user's settings.
        default_on = {'ads', 'local_ads', 'easylist', 'easyprivacy', 'chinese', 'fixes'}
        for entry in manifest['declarative_net_request']['rule_resources']:
            entry['enabled'] = entry['id'] in default_on
        (stage / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
        output.parent.mkdir(parents=True, exist_ok=True)
        if output.exists():
            output.unlink()
        with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
            for path in sorted(stage.rglob('*')):
                if path.is_file():
                    archive.write(path, path.relative_to(stage).as_posix())
    print(f'{output} ({output.stat().st_size / 1e6:.1f} MB); {before} rules -> {after}; dropped {dropped} with unsupported conditions')


main()
