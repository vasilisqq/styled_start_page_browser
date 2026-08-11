#!/usr/bin/env bash
set -euo pipefail

# set-startpage.sh
#
# Настраивает браузер так, чтобы в качестве новой вкладки использовалась
# указанная страница. Запускать через sudo — пишет в системные директории.
# Только Linux.
#
# Firefox настраивается через AutoConfig (autoconfig.js + autoconfig.cfg):
# политика NewTabPage в policies.json только включает/выключает страницу
# новой вкладки и НЕ задаёт её URL.
# Chrome / Chromium / Edge настраиваются через managed-политику
# NewTabPageLocation.
#
# Использование:
#   sudo ./set-startpage.sh <URL> [browser]
#
# Примеры:
#   sudo ./set-startpage.sh "file:///home/user/styled_start_page_browser/index.html" firefox
#   sudo ./set-startpage.sh "https://example.com/startpage" chrome
#   sudo ./set-startpage.sh "file:///home/user/styled_start_page_browser/index.html" chromium

URL="${1:-}"
BROWSER="${2:-firefox}"

if [ -z "$URL" ]; then
  echo "Usage: sudo ./set-startpage.sh <URL> [firefox|chrome|chromium|edge]"
  echo "Example: sudo ./set-startpage.sh \"file:///home/user/styled_start_page_browser/index.html\" firefox"
  exit 1
fi

# ── Firefox: AutoConfig ─────────────────────────────────────────────
setup_firefox() {
  local url="$1"
  local dir="" candidate

  for candidate in \
    /usr/lib/firefox \
    /usr/lib64/firefox \
    /opt/firefox \
    /usr/lib/firefox-esr; do
    if [ -d "$candidate" ]; then
      dir="$candidate"
      break
    fi
  done

  if [ -z "$dir" ]; then
    echo "Firefox installation directory not found."
    echo "Checked: /usr/lib/firefox, /usr/lib64/firefox, /opt/firefox, /usr/lib/firefox-esr"
    exit 1
  fi

  mkdir -p "$dir/defaults/pref"

  # Включает загрузку autoconfig.cfg из корня каталога установки.
  cat > "$dir/defaults/pref/autoconfig.js" <<'JS'
pref("general.config.filename", "autoconfig.cfg");
pref("general.config.obscure_value", 0);
pref("general.config.sandbox_enabled", false);
JS

  # Переопределяет URL новой вкладки. Первая строка обязана быть комментарием.
  cat > "$dir/autoconfig.cfg" <<CFG
// The first line must be a comment.
try {
  ChromeUtils.defineESModuleGetters(this, {
    AboutNewTab: "resource:///modules/AboutNewTab.sys.mjs",
  });

  AboutNewTab.newTabURL = "$url";
} catch (e) {
  console.log("AutoConfig Error: ", e);
}
CFG

  chmod 644 "$dir/autoconfig.cfg" "$dir/defaults/pref/autoconfig.js"

  echo "Created/updated:"
  echo "  $dir/defaults/pref/autoconfig.js"
  echo "  $dir/autoconfig.cfg"
  echo "Restart Firefox if it was running."
}

# ── Chrome / Chromium / Edge: managed policy NewTabPageLocation ──────
merge_policy() {
  local file="$1" url="$2"

  if command -v python3 >/dev/null 2>&1; then
    python3 - "$file" "$url" <<'PY'
import json, sys
path, url = sys.argv[1], sys.argv[2]
try:
  with open(path, 'r') as f:
    data = json.load(f)
  if not isinstance(data, dict):
    data = {}
except (FileNotFoundError, json.JSONDecodeError):
  data = {}

data["NewTabPageLocation"] = url
with open(path, 'w') as f:
  json.dump(data, f, indent=2)
PY
  elif command -v jq >/dev/null 2>&1; then
    if [ -f "$file" ]; then
      jq --arg url "$url" '.NewTabPageLocation = $url' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    else
      jq -n --arg url "$url" '{NewTabPageLocation: $url}' > "$file"
    fi
  else
    echo "Neither python3 nor jq found. Writing a fresh policy file (existing policies will be overwritten)."
    printf '{\n  "NewTabPageLocation": "%s"\n}\n' "$url" > "$file"
  fi
}

case "$BROWSER" in
  firefox)
    setup_firefox "$URL"
    exit 0
    ;;
  chrome)
    POLICY_PATH="/etc/opt/chrome/policies/managed/policies.json"
    ;;
  chromium)
    POLICY_PATH="/etc/chromium/policies/managed/policies.json"
    ;;
  edge)
    POLICY_PATH="/etc/opt/edge/policies/managed/policies.json"
    ;;
  *)
    echo "Unsupported browser: $BROWSER"
    echo "Supported: firefox, chrome, chromium, edge"
    exit 1
    ;;
esac

mkdir -p "$(dirname "$POLICY_PATH")"
merge_policy "$POLICY_PATH" "$URL"

echo "Created/updated: $POLICY_PATH"
echo "Restart the browser if it was running."
