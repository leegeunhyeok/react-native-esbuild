# iOS

## Set Custom CLI

Open XCode, go to `Build Target > Build Phases > Bundle React Native code and images` and add `CLI_PATH` environment variable.

```bash
set -e

CLI_PATH="../node_modules/@react-native-esbuild/cli/dist/index.js"

WITH_ENVIRONMENT="../node_modules/react-native/scripts/xcode/with-environment.sh"
REACT_NATIVE_XCODE="../node_modules/react-native/scripts/react-native-xcode.sh"

/bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"
```

Export if you need to build from command line or external environment(eg. Fastlane, Bitrise, etc).

```bash
export CLI_PATH="$PROJECT_DIR/node_modules/@react-native-esbuild/cli/dist/index.js"
```
