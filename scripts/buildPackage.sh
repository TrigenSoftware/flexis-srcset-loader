#!/bin/bash

set -e

trigen-scripts build
rm -rf package
mv lib package
cp src/runtime.d.ts package
cp src/types.d.ts package
cp LICENSE package
cp package.json package
cp README.md package
