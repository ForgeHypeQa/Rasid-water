#!/bin/sh
# Assembles the single-file app from src/ and vendor/ (Leaflet 1.9.4, BSD-2)
cd "$(dirname "$0")"
{
  sed '/<\/style>/,$d' src/01-head.html
  echo "/* Leaflet 1.9.4 (BSD-2) */"; cat vendor/leaflet.css
  sed -n '/<\/style>/,/<script>/p' src/01-head.html | sed '$d'
  echo "<script>"; cat vendor/leaflet.js; echo; echo "</script>"
  echo "<script>"
  cat src/02-core.js src/02b-map.js src/03-customer.js src/04-driver.js src/05-admin.js src/06-tail.html
} > index.html
echo "built index.html"
