#!/bin/sh

### check if script is being run from project directory
if [ ! -f "package.json" ]; then
  echo "Please run this script from your project directory."
  echo "Example: ci/docker/builder.sh"
  exit
fi

npm install --legacy-peer-deps
npm run prebuild
npm run build

source ci/scripts/git-details.sh
