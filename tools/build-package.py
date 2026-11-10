#!/usr/bin/env python3
"""Build a release package from the source tree.

    python3 tools/build-package.py chromium <output.zip | output-dir>
    python3 tools/build-package.py firefox  <output.zip | output-dir>

Both targets ship only runtime files and repack the static rules: rules that differ only in
the blocked domain (||domain^) merge into one rule with requestDomains, rules that differ only
in the initiator merge into one with initiatorDomains. Both merges match exactly the same
requests, and far fewer rules mean less memory and a much smaller install.

Firefox also gets:
- an event page: the manifest lists the shared scripts in background.scripts
  (background.js skips importScripts when it is not a service worker);
- browser_specific_settings.gecko with the add-on ID, minimum version and the data-collection
  declaration AMO requires;
- no rules using conditions it does not implement (responseHeaders);
- no text file over AMO's parse limit.
"""
import json, pathlib, re, shutil, sys, tempfile, zipfile

REPO = pathlib.Path(__file__).resolve().parent.parent
ROOT = REPO / 'extension'
# Documents that ship in every package but live at the top of the repository.
REPO_DOCS = ['LICENSE', 'README.md', 'PRIVACY.md', 'THIRD-PARTY-NOTICES.md', 'BUILD.md']
GECKO_ID = '{4b5c2b8e-6f0a-4d7e-9a43-2f1d6c8e7a51}'
BACKGROUND = ['vendor/publicsuffix.js', 'i18n.js', 'common.js', 'user-filters.js', 'cosmetic-engine.js',
              'static-rule-policy.js', 'popup-rescue.js', 'popup-filter.js', 'background.js']
EXCLUDE_DIRS = {'tools', 'docs', 'testing-output', 'verification', '.previous-web-lists', '_metadata', 'node_modules', '.git'}
EXCLUDE_FILES = {'CHANGELOG.md', 'BENCHMARK.md', 'TESTING.md', 'STORE-LISTING.md', 'HISTORY.md', '.DS_Store', '.gitignore',
                 'web-filtering.js', 'web-cosmetics.json', 'web-actions.json'}
UNSUPPORTED_CONDITIONS = {'responseHeaders', 'excludedResponseHeaders'}
# AMO does not parse text files over 5 MB; keep every file below this.
MAX_TEXT_BYTES = 4_800_000
DOMAIN_ONLY = re.compile(r'^\|\|([a-z0-9.-]+)\^$')
FIREFOX_DEFAULT_ON = {'ads', 'local_ads', 'easylist', 'easyprivacy', 'chinese', 'fixes'}


def compress(rules, keep_ids):
    """Merge rules that differ only in the blocked domain or only in initiatorDomains.
    Rules the badfilter policy disables by ID keep their IDs."""
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
        if relative.parts[:2] in (('data', 'filters'), ('vendor', 'source')) or (relative.parts[0] == 'data' and relative.suffix == '.txt'):
            continue
        yield relative


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in ('chromium', 'firefox'):
        sys.exit(__doc__)
    firefox = sys.argv[1] == 'firefox'
    output = pathlib.Path(sys.argv[2]).resolve()
    manifest = json.loads((ROOT / 'manifest.json').read_text())
    resources = manifest['declarative_net_request']['rule_resources']
    rulesets = {entry['path']: entry['id'] for entry in resources}
    keep = {}
    for changes in json.loads((ROOT / 'data/badfilter-policy.json').read_text())['origins'].values():
        for target, ids in changes.items():
            keep.setdefault(target, set()).update(ids)
    if firefox:
        manifest.pop('minimum_chrome_version', None)
        manifest['background'] = {'scripts': BACKGROUND}
        # Statistics: Firefox lacks getMatchedRules, so blocked requests are observed (not altered) via webRequest.
        manifest['permissions'].append('webRequest')
        manifest['browser_specific_settings'] = {'gecko': {
            'id': GECKO_ID, 'strict_min_version': '128.0',
            'data_collection_permissions': {'required': ['none']}}}
    actions = {}
    dropped = before = after = 0
    with tempfile.TemporaryDirectory() as temp:
        stage = pathlib.Path(temp)
        for name in REPO_DOCS:
            shutil.copy2(REPO / name, stage / name)
        for relative in runtime_files():
            target = stage / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            if str(relative) not in rulesets:
                shutil.copy2(ROOT / relative, target)
                continue
            ruleset = rulesets[str(relative)]
            rules = json.loads((ROOT / relative).read_text())
            supported = [rule for rule in rules if not (firefox and UNSUPPORTED_CONDITIONS & set(rule['condition']))]
            dropped += len(rules) - len(supported)
            packed = compress(supported, keep.get(ruleset, set()))
            before += len(rules); after += len(packed)
            actions[ruleset] = {str(rule['id']): rule['action']['type'] for rule in packed if rule['action']['type'] != 'block'}
            chunks = split_rules(packed) if firefox else [packed]
            target.write_text(json.dumps(chunks[0], separators=(',', ':')))
            # Extra parts become rulesets <id>_2, <id>_3 … enabled together with the first.
            entry = next(x for x in resources if x['id'] == ruleset)
            for index, chunk in enumerate(chunks[1:], start=2):
                if ruleset != 'enhanced':
                    sys.exit(f'{relative} needs splitting, but only the enhanced ruleset supports parts')
                part_path = relative.with_name(f'{relative.stem}-{index}.json')
                (stage / part_path).write_text(json.dumps(chunk, separators=(',', ':')))
                resources.append({**entry, 'id': f'{ruleset}_{index}', 'path': part_path.as_posix()})
        # Rule IDs changed for the merged lists; the stats need the new ones.
        known = json.loads((ROOT / 'data/engine/rule-actions.json').read_text())
        (stage / 'data/engine/rule-actions.json').write_text(json.dumps({ruleset: actions[ruleset] for ruleset in known}, separators=(',', ':')))
        if firefox:
            too_big = [p.relative_to(stage) for p in stage.rglob('*') if p.is_file() and p.suffix in ('.js', '.json', '.css', '.html', '.txt', '.md') and p.stat().st_size > MAX_TEXT_BYTES]
            if too_big:
                sys.exit('Files over the AMO 5 MB parse limit: ' + ', '.join(map(str, too_big)))
            # Only the default lists start enabled, so a fresh install stays under Firefox's 30,000-rule limit
            # before the background applies the user's settings.
            for entry in resources:
                entry['enabled'] = entry['id'] in FIREFOX_DEFAULT_ON
        (stage / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
        if output.suffix == '.zip':
            output.parent.mkdir(parents=True, exist_ok=True)
            output.unlink(missing_ok=True)
            with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
                for path in sorted(stage.rglob('*')):
                    if path.is_file():
                        archive.write(path, path.relative_to(stage).as_posix())
            size = f'{output.stat().st_size / 1e6:.1f} MB'
        else:
            # Replace the contents in place: the browser identifies an unpacked extension by its folder.
            output.mkdir(parents=True, exist_ok=True)
            for child in output.iterdir():
                shutil.rmtree(child) if child.is_dir() else child.unlink()
            shutil.copytree(stage, output, dirs_exist_ok=True)
            size = f'{sum(p.stat().st_size for p in output.rglob("*") if p.is_file()) / 1e6:.1f} MB unpacked'
    print(f'{output} ({size}); {before} rules -> {after}; dropped {dropped} with unsupported conditions')


main()
