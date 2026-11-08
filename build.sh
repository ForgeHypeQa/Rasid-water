#!/bin/sh
# Assembles the single-file app from the parts in src/
cat src/01-head.html src/02-core.js src/03-customer.js src/04-driver.js src/05-admin.js src/06-tail.html > index.html
echo "built index.html"
