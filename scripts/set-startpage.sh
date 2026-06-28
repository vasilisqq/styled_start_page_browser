#!/usr/bin/env bash
set -euo pipefail

# set-startpage.sh
#
# Настраивает браузер так, чтобы в качестве новой вкладки использовалась
# указанная страница. Запускать через sudo, потому что записывает
# system-wide policies.json.
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

merge_json() {
  local file="$1"
  local key="$2"
  local value="$3"

  if command -v python3 >/dev/null 2>&1; then
    python3 - "$file" "$key" "$value" <<'PY'
import json, sys
path, key, value = sys.argv[1], sys.argv[2], sys.argv[3]
try:
  with open(path, 'r') as f:
    data = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
  data = {}

data[key] = value
with open(path, 'w') as f:
  json.dump(data, f, indent=2)
PY
  elif command -v jq >/dev/null 2>&1; then
    if [ -f "$file" ]; then
      jq ".${key} = \"$value\"" "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    else
      jq -n "{${key}: \"$value\"}" > "$file"
    fi
  else
    echo "Neither python3 nor jq found. Writing a simple policy file (other policies may be overwritten)."
    echo "{\"${key}\":\"${value}\"}" > "$file"
  fi
}

case "$BROWSER" in
  firefox)
    POLICY_KEY="NewTabPage"
    POLICY_PATHS=(
      "/usr/lib/firefox/distribution/policies.json"
      "/usr/lib64/firefox/distribution/policies.json"
    )
    ;;
  chrome)
    POLICY_KEY="NewTabPageLocation"
    POLICY_PATHS=(
      "/etc/opt/chrome/policies/managed/policies.json"
    )
    ;;
  chromium)
    POLICY_KEY="NewTabPageLocation"
    POLICY_PATHS=(
      "/etc/chromium/policies/managed/policies.json"
    )
    ;;
  edge)
    POLICY_KEY="NewTabPageLocation"
    POLICY_PATHS=(
      "/etc/opt/edge/policies/managed/policies.json"
    )
    ;;
  *)
    echo "Unsupported browser: $BROWSER"
    echo "Supported: firefox, chrome, chromium, edge"
    exit 1
    ;;
esac

for path in "${POLICY_PATHS[@]}"; do
  dir=$(dirname "$path")
  if [ -d "$dir" ] || [ ! -e "$dir" ]; then
    mkdir -p "$dir"

    if [ "$BROWSER" = "firefox" ]; then
      # Firefox policies.json оборачивает политики в объект "policies"
      if [ -f "$path" ]; then
        python3 - "$path" "$URL" <<'PY'
import json, sys
path, url = sys.argv[1], sys.argv[2]
try:
  with open(path, 'r') as f:
    data = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
  data = {}

if "policies" not in data or not isinstance(data["policies"], dict):
  data["policies"] = {}

data["policies"]["NewTabPage"] = url
with open(path, 'w') as f:
  json.dump(data, f, indent=2)
PY
      else
        echo "{\"policies\":{\"NewTabPage\":\"$URL\"}}" > "$path"
      fi
    else
      merge_json "$path" "$POLICY_KEY" "$URL"
    fi

    echo "Created/updated: $path"
    echo "Restart the browser if it was running."
    exit 0
  fi
done

echo "Could not find a suitable policies.json location for $BROWSER."
exit 1
