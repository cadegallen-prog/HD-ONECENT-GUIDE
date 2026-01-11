#!/bin/bash
cd "$(dirname "$0")"
echo "Starting type check..."
npx tsc --noEmit
echo "Type check complete: $?"
echo "Starting build..."
npm run build
echo "Build complete: $?"
