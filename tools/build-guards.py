from pathlib import Path
# Both modes share the maintained source, including trusted-link compatibility.
repo = Path(__file__).resolve().parent.parent
root = repo / "extension"
source = (repo / "tools/guard-template.js").read_text()
for mode in ("standard", "strict"):
    (root / f"guard-{mode}.js").write_text(source.replace("STRICT_MODE", "true" if mode == "strict" else "false"))
