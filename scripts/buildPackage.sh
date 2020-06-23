#!/bin/bash

set -e

trigen-scripts build
rm -rf package
mv lib package
cp LICENSE package
cp package.json package
cp README.md package
