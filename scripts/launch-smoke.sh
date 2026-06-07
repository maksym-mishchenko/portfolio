#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:3010}"

pages=(
  "/"
  "/about"
  "/resume"
  "/blog"
  "/case-studies"
  "/case-studies/mcpgate-v1-1"
  "/case-studies/mcpgate-v1-1/share"
  "/now"
  "/blog/feed.xml"
  "/sitemap.xml"
  "/robots.txt"
)

for path in "${pages[@]}"; do
  url="${BASE_URL}${path}"
  status="$(curl -sS -o /dev/null -w "%{http_code}" "$url")"
  if [[ "$status" != "200" ]]; then
    echo "FAIL $status $url"
    exit 1
  fi
  echo "OK $status $url"
done

contact_status="$(curl -sS -o /dev/null -w "%{http_code}" \
  -X POST "${BASE_URL}/api/contact" \
  -H "Content-Type: application/json" \
  --data '{"name":"","email":"not-an-email","message":""}')"

if [[ "$contact_status" != "400" && "$contact_status" != "429" ]]; then
  echo "FAIL $contact_status ${BASE_URL}/api/contact invalid input"
  exit 1
fi

echo "OK $contact_status ${BASE_URL}/api/contact invalid input"
