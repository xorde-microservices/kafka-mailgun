#!/bin/sh

BUILD_DATE=$(date '+%Y-%m-%d %H:%M:%S')

### Add Git branch-commit-date to package.json and build.txt
node ci/helpers/setJsonValue.js package.json build.branch "$GIT_BRANCH"
node ci/helpers/setJsonValue.js package.json build.commit "$GIT_COMMIT"
node ci/helpers/setJsonValue.js package.json build.date "$BUILD_DATE" tabs
cat package.json

echo "BUILD_SIGNATURE=${GIT_COMMIT}:${GIT_BRANCH}@${BUILD_DATE}" > build.txt
cat build.txt
