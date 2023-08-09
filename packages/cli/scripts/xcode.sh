#!/bin/bash

# https://github.com/facebook/react-native/blob/v0.72.3/packages/react-native/scripts/react-native-xcode.sh

case "$CONFIGURATION" in
  *Debug*)
    if [[ "$PLATFORM_NAME" == *simulator ]]; then
      if [[ "$FORCE_BUNDLING" ]]; then
        echo "FORCE_BUNDLING enabled; continuing to bundle."
      else
        echo "Skipping bundling in Debug for the Simulator (since the packager bundles for you). Use the FORCE_BUNDLING flag to change this behavior."
        exit 0;
      fi
    else
      echo "Bundling for physical device. Use the SKIP_BUNDLING flag to change this behavior."
    fi

    DEV=true
    ;;
  "")
    echo "$0 must be invoked by Xcode"
    exit 1
    ;;
  *)
    DEV=false
    ;;
esac

DEST=$CONFIGURATION_BUILD_DIR/$UNLOCALIZED_RESOURCES_FOLDER_PATH
CLI_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENTRY_FILE="$(cd "$CLI_DIR/../../.." && pwd)/index.js"
BUNDLE_FILE="$DEST/main.jsbundle"

node "$CLI_DIR/dist/index.js" bundle \
  --entry-file=$ENTRY_FILE \
  --bundle-output=$BUNDLE_FILE \
  --assets-dest=$DEST \
  --dev=$DEV \
  --platform=ios \
  --reset-cache \
  --verbose
