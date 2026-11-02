from pathlib import Path
# Both modes share the maintained source, including trusted-link compatibility.
root = Path(__file__).resolve().parent.parent
source = (root / "tools/guard-template.js").read_text()
for mode in ("standard", "strict"):
    (root / f"guard-{mode}.js").write_text(source.replace("STRICT_MODE", "true" if mode == "strict" else "false"))
