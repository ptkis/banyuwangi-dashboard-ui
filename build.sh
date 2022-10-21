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

# Prevent "Error: Cannot perform an interactive login from a non TTY device"
[ -z "$DOCKER_HUB_PASSWORD" ] && echo "Please set DOCKER_HUB_PASSWORD in repository secret"

echo "$DOCKER_HUB_PASSWORD" | docker login -u ptkis --password-stdin
docker build . -t "ptkis/$PACKAGE_NAME:latest-$configuration"
docker tag "ptkis/$PACKAGE_NAME:latest-$configuration" "ptkis/$PACKAGE_NAME:$PACKAGE_VERSION"
docker push "ptkis/$PACKAGE_NAME:latest-$configuration" && \
docker push "ptkis/$PACKAGE_NAME:$PACKAGE_VERSION"
