set -e
BUILD_ID=${BUILD_ID:-${GITHUB_RUN_NUMBER}}
configuration="${1:-production}"
PACKAGE_NAME="$(< package.json \
   grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[", ]//g')"
PACKAGE_VERSION="$(< package.json \
   grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[", ]//g').${BUILD_ID:-0}.$configuration"
npm run env
node --max_old_space_size=3000 node_modules/@angular/cli/bin/ng build --configuration "$configuration"
#npm run test && npm run build:static
