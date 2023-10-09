# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.0-beta.6](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.5...v0.1.0-beta.6) (2023-10-09)

### Features

- supports symbolicate for web ([4a63b94](https://github.com/leegeunhyeok/react-native-esbuild/commit/4a63b941aa4bb497cfbc937c88c99d3ce844f9d9))

## [0.1.0-beta.5](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.4...v0.1.0-beta.5) (2023-10-08)

### Miscellaneous Chores

- remove version range ([aad21c4](https://github.com/leegeunhyeok/react-native-esbuild/commit/aad21c4fa02e61db75484b89835da84c1dc7b925))

## [0.1.0-beta.4](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.3...v0.1.0-beta.4) (2023-10-08)

### Features

- add root option to dev server ([cd8681b](https://github.com/leegeunhyeok/react-native-esbuild/commit/cd8681b9b62121939c33ea31dd6630bafdf611c6))
- web support ([1723b0c](https://github.com/leegeunhyeok/react-native-esbuild/commit/1723b0c6b30e1c1bb1f5781cc11a093822a60f3d)), closes [#36](https://github.com/leegeunhyeok/react-native-esbuild/issues/36)

### Bug Fixes

- invalid error response on multipart type ([c65897b](https://github.com/leegeunhyeok/react-native-esbuild/commit/c65897b861862b1e4d2d4abc22fe034e70905af4))
- preserving esbuild bundle context ([43c9053](https://github.com/leegeunhyeok/react-native-esbuild/commit/43c9053febee7b7f8bf622256d1625b2e6b82dc6))

### Miscellaneous Chores

- update dev server logo ([33f49d1](https://github.com/leegeunhyeok/react-native-esbuild/commit/33f49d17f86f498d7902e06e645674e0b4d021e3))

## [0.1.0-beta.3](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.2...v0.1.0-beta.3) (2023-10-04)

### Bug Fixes

- serve-bundle middleware ([ccc51c3](https://github.com/leegeunhyeok/react-native-esbuild/commit/ccc51c395dcf1f061f02a67e6259979471a60647))

## [0.1.0-beta.2](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.1...v0.1.0-beta.2) (2023-10-04)

### Features

- add printVersion ([947742e](https://github.com/leegeunhyeok/react-native-esbuild/commit/947742ee1c9f43433bd187a56ec1114ae8e482da))
- improve error handling ([aab9a75](https://github.com/leegeunhyeok/react-native-esbuild/commit/aab9a754a79f5ac2d6e8ea60d5198815f23ad037)), closes [#13](https://github.com/leegeunhyeok/react-native-esbuild/issues/13)

### Bug Fixes

- serve-asset-middleware url patterns ([d171b91](https://github.com/leegeunhyeok/react-native-esbuild/commit/d171b9160f4305fbb0034a3cbe8a623143981c0c))

### Code Refactoring

- improve report build status ([2c2835c](https://github.com/leegeunhyeok/react-native-esbuild/commit/2c2835c94031e8f9975000bf60f92db4dea54c7d))

## [0.1.0-beta.1](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.0...v0.1.0-beta.1) (2023-10-03)

### Features

- improve build progress ([cfd9ed8](https://github.com/leegeunhyeok/react-native-esbuild/commit/cfd9ed82ed31c1b49ece5a32275cd8b24f21f14f))
- improve logging ([7f93e19](https://github.com/leegeunhyeok/react-native-esbuild/commit/7f93e19a82dbadd80529356041a126698e99bcac)), closes [#26](https://github.com/leegeunhyeok/react-native-esbuild/issues/26)
- support grouped console log ([a1e7a44](https://github.com/leegeunhyeok/react-native-esbuild/commit/a1e7a4461b94e2bef33e7cfe02e614c3628445a7)), closes [#28](https://github.com/leegeunhyeok/react-native-esbuild/issues/28)

### Code Refactoring

- logger levels ([cf0e79c](https://github.com/leegeunhyeok/react-native-esbuild/commit/cf0e79cffb4965e42bcd4ee5182677e988208a9a))
- rename config types to options ([7512fae](https://github.com/leegeunhyeok/react-native-esbuild/commit/7512faeb3f7a19365bbf7f9c2ed929e7abe4f538))
- root based local cache directory ([b30e324](https://github.com/leegeunhyeok/react-native-esbuild/commit/b30e32423cf626dcaed123f4b1d55abdc726e677))

## [0.1.0-beta.0](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.39...v0.1.0-beta.0) (2023-09-25)

### Code Refactoring

- change function declaration to arrow function ([9aeae13](https://github.com/leegeunhyeok/react-native-esbuild/commit/9aeae1368cdfde8d998b85ebfd609be13b05a50f))
- modulization helpers ([b2eea03](https://github.com/leegeunhyeok/react-native-esbuild/commit/b2eea036c479a8ad7bb5fcf8bf07524109b087d2))

### Build System

- set packages as external ([dd4417f](https://github.com/leegeunhyeok/react-native-esbuild/commit/dd4417fe07c7bd87357246914743067343fdeccb)), closes [#22](https://github.com/leegeunhyeok/react-native-esbuild/issues/22)

## [0.1.0-alpha.39](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.38...v0.1.0-alpha.39) (2023-09-24)

### Features

- improve build status logs ([fad15a5](https://github.com/leegeunhyeok/react-native-esbuild/commit/fad15a51fae4c2bbfdef5276338011ab3278a1aa))

### Code Refactoring

- **core:** event based client log reporter ([84fe917](https://github.com/leegeunhyeok/react-native-esbuild/commit/84fe917abb8cec0ebcafb0c8afcd2fdfa33a184e))

## [0.1.0-alpha.38](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.37...v0.1.0-alpha.38) (2023-09-24)

### Code Refactoring

- cli option types ([4d7c346](https://github.com/leegeunhyeok/react-native-esbuild/commit/4d7c3468ccb509215164bc29cf5c6d0c265b67f1))

## [0.1.0-alpha.37](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.36...v0.1.0-alpha.37) (2023-09-23)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.35](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.34...v0.1.0-alpha.35) (2023-09-22)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.34](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.33...v0.1.0-alpha.34) (2023-09-22)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.33](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.32...v0.1.0-alpha.33) (2023-09-22)

### Bug Fixes

- live reload via turbo modules ([a45af96](https://github.com/leegeunhyeok/react-native-esbuild/commit/a45af96609c4b96c45e96cb7a1ab6fbad10f50c8))

### Code Refactoring

- change window to global object ([33e7763](https://github.com/leegeunhyeok/react-native-esbuild/commit/33e7763c87de2509d39e89f011fced65a9bfeae5))
- update bundle config type ([274558e](https://github.com/leegeunhyeok/react-native-esbuild/commit/274558e958bf8c4b04abb58df5473d3470b38026))

## [0.1.0-alpha.32](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.31...v0.1.0-alpha.32) (2023-09-20)

### Features

- **cli:** now support interactive mode ([e3195cb](https://github.com/leegeunhyeok/react-native-esbuild/commit/e3195cb09eca057b1541173ea6b7400710fcc39e)), closes [#12](https://github.com/leegeunhyeok/react-native-esbuild/issues/12)

## [0.1.0-alpha.31](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.30...v0.1.0-alpha.31) (2023-09-19)

### Features

- index-page-middleware ([649c641](https://github.com/leegeunhyeok/react-native-esbuild/commit/649c6417ff47379138f1d2bd97ed1edc3449c429)), closes [#9](https://github.com/leegeunhyeok/react-native-esbuild/issues/9)

### Bug Fixes

- auto reload on update ([863fd4b](https://github.com/leegeunhyeok/react-native-esbuild/commit/863fd4bd9165109a3c2c714ad6c84d46482e77dd))

### Miscellaneous Chores

- bump version up packages ([b0c87fd](https://github.com/leegeunhyeok/react-native-esbuild/commit/b0c87fd8694b6c725267d66494d761809da27111))

### Code Refactoring

- apply eslint rules ([4792d4a](https://github.com/leegeunhyeok/react-native-esbuild/commit/4792d4a1662ad87fa052b93c709703a8d5f6fe46))
- remove reporter logs ([0b0f9dc](https://github.com/leegeunhyeok/react-native-esbuild/commit/0b0f9dc7c3ce60549a55721815f9370f952743e4))

## [0.1.0-alpha.30](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.29...v0.1.0-alpha.30) (2023-08-23)

### Features

- disable live reload when request sourcemap ([6c93115](https://github.com/leegeunhyeok/react-native-esbuild/commit/6c93115bf0d3059c260569f8250f43a2b064c0b2))

## [0.1.0-alpha.29](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.28...v0.1.0-alpha.29) (2023-08-17)

### Miscellaneous Chores

- bump version up pacakges ([e235610](https://github.com/leegeunhyeok/react-native-esbuild/commit/e235610379fbf8f5c6978ecded5dbe6549834975))

## [0.1.0-alpha.28](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.27...v0.1.0-alpha.28) (2023-08-15)

### Features

- handle for sourcemap request ([ca92e0c](https://github.com/leegeunhyeok/react-native-esbuild/commit/ca92e0ca801927061f73dc972b8088b10c264a98))
- implement symbolicate-middleware ([ebc5e83](https://github.com/leegeunhyeok/react-native-esbuild/commit/ebc5e83d6c65306bf26659d9cabe67b24889156a))
- improve update build status ([3e31ae8](https://github.com/leegeunhyeok/react-native-esbuild/commit/3e31ae89f5f714365f9e0f3c99d295292dccfe07))

### Bug Fixes

- send bundle state condition ([5029c15](https://github.com/leegeunhyeok/react-native-esbuild/commit/5029c1568d41565c67601e30da222131d75fa0d0))
- set response header when not support multipart format ([e58bcf9](https://github.com/leegeunhyeok/react-native-esbuild/commit/e58bcf9c87b2a6906df7859c54949eca4497d20b))

### Code Refactoring

- change default host to localhost ([53c5c91](https://github.com/leegeunhyeok/react-native-esbuild/commit/53c5c915a9694a19dbb51c38acdf507101c7bdb6))
- cleanup serve-bundle-middleware ([7515593](https://github.com/leegeunhyeok/react-native-esbuild/commit/75155934751778b8efcdb817de24fed35d1e74c3))
- rename handler to wss ([77c0714](https://github.com/leegeunhyeok/react-native-esbuild/commit/77c07143891aa4c5ea5b1252ec8ab4a0affca7e7))
- serve-bundle-middleware ([8287a54](https://github.com/leegeunhyeok/react-native-esbuild/commit/8287a54ef2faf9abd6e7b0f73e80c72dd7a8f2aa))

## [0.1.0-alpha.27](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.26...v0.1.0-alpha.27) (2023-08-10)

### Features

- support flipper log ([79efa17](https://github.com/leegeunhyeok/react-native-esbuild/commit/79efa17345c927bc8dab66cf352b99909009308f))
- support hermes debugging ([aec0615](https://github.com/leegeunhyeok/react-native-esbuild/commit/aec061558018cabad9be487b75933a625bf8ccb8))

### Miscellaneous Chores

- change log level ([5774524](https://github.com/leegeunhyeok/react-native-esbuild/commit/57745243cd63c8581e531eca68a0bed9cb54e9fe))

## [0.1.0-alpha.26](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.25...v0.1.0-alpha.26) (2023-08-10)

### Features

- add logging on hot reload middleware ([b451be2](https://github.com/leegeunhyeok/react-native-esbuild/commit/b451be2037c95f361d8ced798dc22a374885ee57))
- now support multipart/mixed response for send bundle ([cc60cc8](https://github.com/leegeunhyeok/react-native-esbuild/commit/cc60cc891f3a4bb061ad5632734b13d63c165c63))
- print request headers when verbose mode ([21aee9f](https://github.com/leegeunhyeok/react-native-esbuild/commit/21aee9fbed75c48e2046cff64f176df0e9dd15e1))
- response 400 when asset name is invalid ([32fc281](https://github.com/leegeunhyeok/react-native-esbuild/commit/32fc2818ae5f3a12d023827b846607035a79dac6))
- update build-end event payload ([e0c641b](https://github.com/leegeunhyeok/react-native-esbuild/commit/e0c641bb5fac33a10a7943f1a3d46850c3eb9853))

### Bug Fixes

- **core:** build twice when build-end event was fired ([0d06678](https://github.com/leegeunhyeok/react-native-esbuild/commit/0d06678434460791dc063f0126bdfafd92e1b340))

### Code Refactoring

- **core:** add type definition of event emitter ([722c89e](https://github.com/leegeunhyeok/react-native-esbuild/commit/722c89ed025da67ced0cc80a286b3abfb66ceb8a))
- early return on middlewares ([c634b70](https://github.com/leegeunhyeok/react-native-esbuild/commit/c634b70da87bbae1ecc1536681e5f345132d61ce))
- wrap toSafetyMiddleware on initialize ([f4c0c3d](https://github.com/leegeunhyeok/react-native-esbuild/commit/f4c0c3dce451b48b126866806883b9a1bda49c89))

## [0.1.0-alpha.22](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.21...v0.1.0-alpha.22) (2023-08-09)

### Features

- add http request logger ([4224296](https://github.com/leegeunhyeok/react-native-esbuild/commit/4224296c774293ab4692323b456b67ac1fe709a8))

## [0.1.0-alpha.21](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.20...v0.1.0-alpha.21) (2023-08-08)

### Miscellaneous Chores

- remove newline ([c7549bf](https://github.com/leegeunhyeok/react-native-esbuild/commit/c7549bf47370580370185b3c0efa71312c866c93))

## [0.1.0-alpha.20](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2023-08-06)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.19](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2023-08-06)

### Features

- **core:** support platform scoped bundle ([1a7094b](https://github.com/leegeunhyeok/react-native-esbuild/commit/1a7094b51c1327fff6708f32638a78c078a74914))

## [0.1.0-alpha.18](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.17...v0.1.0-alpha.18) (2023-08-05)

### Miscellaneous Chores

- add cleanup script ([0f03232](https://github.com/leegeunhyeok/react-native-esbuild/commit/0f032326ad5a412942b77f40130d38a3efeff472))

### Code Refactoring

- change server listening log level to info ([7ac6cad](https://github.com/leegeunhyeok/react-native-esbuild/commit/7ac6cada527af0f4dc183e529d8674a09eb4da9b))
- change to return statement ([dc9a7bb](https://github.com/leegeunhyeok/react-native-esbuild/commit/dc9a7bb2e2df1430aa0986caaf6813d420d44245))
- cleanup bundle config ([36ebd85](https://github.com/leegeunhyeok/react-native-esbuild/commit/36ebd85b16d68561847d55377fcadaa2217bb4c0))
- improve config types ([4bacba6](https://github.com/leegeunhyeok/react-native-esbuild/commit/4bacba65c9609191490d89b488a9e00d3127ef38))

## [0.1.0-alpha.17](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2023-08-04)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.16](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2023-08-04)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.15](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2023-08-04)

### Miscellaneous Chores

- add rimraf for cleanup build directories ([13356fe](https://github.com/leegeunhyeok/react-native-esbuild/commit/13356fec1868b7634da86bca522e987b5bee2284))

## [0.1.0-alpha.14](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2023-08-04)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.13](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.12...v0.1.0-alpha.13) (2023-08-03)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.12](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.11...v0.1.0-alpha.12) (2023-08-03)

### Features

- now support hot reload ([2fae39d](https://github.com/leegeunhyeok/react-native-esbuild/commit/2fae39de39e9c4976dc8ae6c24f28335877d53cc))

### Code Refactoring

- add registerPlugins ([263219f](https://github.com/leegeunhyeok/react-native-esbuild/commit/263219f629b8535a1928e3ef5e87dc0ce797fe9d))

## [0.1.0-alpha.11](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2023-08-03)

### Features

- now support client logs ([632d206](https://github.com/leegeunhyeok/react-native-esbuild/commit/632d20672e51018f603af0dde8668acddc438db4))
- read asset data from assets cache ([3ae010a](https://github.com/leegeunhyeok/react-native-esbuild/commit/3ae010a94b3c45091d2bb3017e7b3143c98b3b53))

## [0.1.0-alpha.10](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2023-08-01)

### Features

- **dev-server:** implement serve-asset-middleware ([dd6a48a](https://github.com/leegeunhyeok/react-native-esbuild/commit/dd6a48a588da4c40e0c6bfc3805b5c1a821bf3f5))

### Code Refactoring

- change log level ([a86a677](https://github.com/leegeunhyeok/react-native-esbuild/commit/a86a6774f63877c093e8363c00e899b83cd45783))

## [0.1.0-alpha.9](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2023-07-31)

### Features

- add logger to packages ([fa789d0](https://github.com/leegeunhyeok/react-native-esbuild/commit/fa789d0d9414ec6356f5bf223960754027766be9))
- improve configs and implement start command ([936d33b](https://github.com/leegeunhyeok/react-native-esbuild/commit/936d33b2f916c22410aa7241ae53b634f83116ee))

### Bug Fixes

- url parse ([b91bc5a](https://github.com/leegeunhyeok/react-native-esbuild/commit/b91bc5a45aab16d43b36a674d383b041e8fbea62))

### Code Refactoring

- change log levels ([521e545](https://github.com/leegeunhyeok/react-native-esbuild/commit/521e5457f9535e4551f0b44da2c19a4eb7d64156))
- update basic external modules ([75ab87c](https://github.com/leegeunhyeok/react-native-esbuild/commit/75ab87cb8536ac015024dd256eeea2a88ffdbc45))
- using buildStatusPlugin ([3289c4f](https://github.com/leegeunhyeok/react-native-esbuild/commit/3289c4f013eae9b585e92b61752a576aeb18e85c))

## [0.1.0-alpha.8](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2023-07-29)

### Reverts

- Revert "chore: change type to module" ([96c32ee](https://github.com/leegeunhyeok/react-native-esbuild/commit/96c32ee767cb0553b0bbe0ba3c631da3dbc308bf))

## [0.1.0-alpha.7](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2023-07-29)

### Miscellaneous Chores

- change type to module ([6d63e8a](https://github.com/leegeunhyeok/react-native-esbuild/commit/6d63e8af31f4e485247add463142d81f86c0c0b2))

## [0.1.0-alpha.6](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.5...v0.1.0-alpha.6) (2023-07-29)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.5](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2023-07-29)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.3](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2023-07-29)

**Note:** Version bump only for package @react-native-esbuild/dev-server

## [0.1.0-alpha.2](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2023-07-29)

### Bug Fixes

- wrong dependencies relations ([1df14b1](https://github.com/leegeunhyeok/react-native-esbuild/commit/1df14b1b06627bda74b4aa52df1a19ab72ba840b))

## 0.1.0-alpha.1 (2023-07-29)

### Features

- **dev-server:** implement base dev server ([0fcb7eb](https://github.com/leegeunhyeok/react-native-esbuild/commit/0fcb7eb20152f0ff8662e7be17c70dbb2fddd54b))

### Bug Fixes

- circular dependency ([f764fe5](https://github.com/leegeunhyeok/react-native-esbuild/commit/f764fe51c4ec31efd8c89826200bbe275f956e86))
- process exit when error occurred ([a0ef5ab](https://github.com/leegeunhyeok/react-native-esbuild/commit/a0ef5ab055cab1828fe763473992d995bc65e23d))

### Build System

- add esbuild scripts ([b38b2c0](https://github.com/leegeunhyeok/react-native-esbuild/commit/b38b2c06bf7f8594fd17675c8d23e38a7f1678fb))
- change base build config ([752e15a](https://github.com/leegeunhyeok/react-native-esbuild/commit/752e15af5560c6f5648344a2695257e819045d95))

### Miscellaneous Chores

- add dist directory to publish files ([1abbee2](https://github.com/leegeunhyeok/react-native-esbuild/commit/1abbee2dd1560ac7166903362c220263cd5d895a))
- add packages ([a2076de](https://github.com/leegeunhyeok/react-native-esbuild/commit/a2076def60774fb9b39cfe90f5af35b44148a46f))
- add prepack scripts ([3baa83b](https://github.com/leegeunhyeok/react-native-esbuild/commit/3baa83b9ce539c7c797a959a829aaf0e95d0d6d2))
- update module resolve fields ([afb6a74](https://github.com/leegeunhyeok/react-native-esbuild/commit/afb6a749019a617591254106389448d5035e5ae0))
- update peer deps versions ([1aa7cb0](https://github.com/leegeunhyeok/react-native-esbuild/commit/1aa7cb0eca4e90ca15deb2667dc4946ae1cc3cd7))
- update tsconfig for type declaration ([7458d94](https://github.com/leegeunhyeok/react-native-esbuild/commit/7458d945fb3e8c3a5a7b29a00eda197556a5fa5d))
