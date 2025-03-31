#!/usr/bin/env bash
set -euo pipefail

cd app
npm run test:ci; status=$?
exit $status
