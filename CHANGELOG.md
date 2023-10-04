# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.0-beta.2](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.1...v0.1.0-beta.2) (2023-10-04)

### Features

- add printVersion ([947742e](https://github.com/leegeunhyeok/react-native-esbuild/commit/947742ee1c9f43433bd187a56ec1114ae8e482da))
- improve error handling ([aab9a75](https://github.com/leegeunhyeok/react-native-esbuild/commit/aab9a754a79f5ac2d6e8ea60d5198815f23ad037)), closes [#13](https://github.com/leegeunhyeok/react-native-esbuild/issues/13)

### Bug Fixes

- serve-asset-middleware url patterns ([d171b91](https://github.com/leegeunhyeok/react-native-esbuild/commit/d171b9160f4305fbb0034a3cbe8a623143981c0c))
- wrong scoped log level ([f07474e](https://github.com/leegeunhyeok/react-native-esbuild/commit/f07474e2fc0e90962b47511473bdf3070a127f71))

### Code Refactoring

- improve report build status ([2c2835c](https://github.com/leegeunhyeok/react-native-esbuild/commit/2c2835c94031e8f9975000bf60f92db4dea54c7d))
- update cli command descriptions ([ed48fe6](https://github.com/leegeunhyeok/react-native-esbuild/commit/ed48fe6bde9bc88c50645ffdb6c86312ba18df27))

## [0.1.0-beta.1](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.0...v0.1.0-beta.1) (2023-10-03)

### ⚠ BREAKING CHANGES

- change `enabled` option to `disabled`

### Features

- add esbuild plugin configuration ([c7ef4d2](https://github.com/leegeunhyeok/react-native-esbuild/commit/c7ef4d2e9fd095b2e3cf6cca779367dbfe42156d))
- add getBuildStatusCachePath ([57dd3b4](https://github.com/leegeunhyeok/react-native-esbuild/commit/57dd3b4b2cb1a9a046241c7b61c2f09f72385851))
- basic setup ([e30ce79](https://github.com/leegeunhyeok/react-native-esbuild/commit/e30ce798b01bc4d47d3a0c07056ef8fe9c85e44c)), closes [#24](https://github.com/leegeunhyeok/react-native-esbuild/issues/24)
- change enabled option to disabled ([09a3820](https://github.com/leegeunhyeok/react-native-esbuild/commit/09a382007092eb9b6cf6c0d287622cfe52a2b78b))
- each logger now has its own level ([3baca7e](https://github.com/leegeunhyeok/react-native-esbuild/commit/3baca7ef9c4d8820b2cf932858027a56674940d7))
- enable vercel analytics ([2782af7](https://github.com/leegeunhyeok/react-native-esbuild/commit/2782af75187d63f84fb5d35fb7bbaaecb870fbbd))
- improve build progress ([cfd9ed8](https://github.com/leegeunhyeok/react-native-esbuild/commit/cfd9ed82ed31c1b49ece5a32275cd8b24f21f14f))
- improve logging ([7f93e19](https://github.com/leegeunhyeok/react-native-esbuild/commit/7f93e19a82dbadd80529356041a126698e99bcac)), closes [#26](https://github.com/leegeunhyeok/react-native-esbuild/issues/26)
- print logo when is tty environment ([a5f1a4f](https://github.com/leegeunhyeok/react-native-esbuild/commit/a5f1a4f24c17b91d3d4a6c3108576954c9599026))
- support grouped console log ([a1e7a44](https://github.com/leegeunhyeok/react-native-esbuild/commit/a1e7a4461b94e2bef33e7cfe02e614c3628445a7)), closes [#28](https://github.com/leegeunhyeok/react-native-esbuild/issues/28)

### Miscellaneous Chores

- add issue templates ([7b14908](https://github.com/leegeunhyeok/react-native-esbuild/commit/7b1490846471cc2a6afd6d8152d51e4d2aedd7b0))
- bump version up nx ([8972dfc](https://github.com/leegeunhyeok/react-native-esbuild/commit/8972dfc50cb766e2b85aa123839386d3fea439e8))
- fix logo images ([caf7c9d](https://github.com/leegeunhyeok/react-native-esbuild/commit/caf7c9dee5c2af659ce6e0f5d8b5cd3e35916d37))
- setup docusaurus template ([997ba43](https://github.com/leegeunhyeok/react-native-esbuild/commit/997ba43e42116130fd3f2e0466c57aa8a120e820))
- update domain ([ec1696f](https://github.com/leegeunhyeok/react-native-esbuild/commit/ec1696fe04b1aed1ae164279d6b6a2986acf803d))

### Code Refactoring

- logger levels ([cf0e79c](https://github.com/leegeunhyeok/react-native-esbuild/commit/cf0e79cffb4965e42bcd4ee5182677e988208a9a))
- move extension constants to internal package ([be450bd](https://github.com/leegeunhyeok/react-native-esbuild/commit/be450bdfda652aa380f8873cc0b8fcc824551ad0))
- rename config types to options ([7512fae](https://github.com/leegeunhyeok/react-native-esbuild/commit/7512faeb3f7a19365bbf7f9c2ed929e7abe4f538))
- root based local cache directory ([b30e324](https://github.com/leegeunhyeok/react-native-esbuild/commit/b30e32423cf626dcaed123f4b1d55abdc726e677))

## [0.1.0-beta.0](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.39...v0.1.0-beta.0) (2023-09-25)

### Features

- **cli:** strict mode enabled ([7ac4110](https://github.com/leegeunhyeok/react-native-esbuild/commit/7ac4110523dea4add998cee4119cee8dadb423bb))

### Miscellaneous Chores

- add comments to setEnvironment ([c9a0f7e](https://github.com/leegeunhyeok/react-native-esbuild/commit/c9a0f7e3f75fbc5548f1566c8c1b636f23fb30cf))

### Code Refactoring

- change description of no-op options ([4b50901](https://github.com/leegeunhyeok/react-native-esbuild/commit/4b50901c43cb765532a18a3177cf2029e9986539))
- change function declaration to arrow function ([9aeae13](https://github.com/leegeunhyeok/react-native-esbuild/commit/9aeae1368cdfde8d998b85ebfd609be13b05a50f))
- cli helpers ([70115b3](https://github.com/leegeunhyeok/react-native-esbuild/commit/70115b36dc4f65210d95291900ab1c60bcd00ea4))
- getAssetRegistrationScript move to internal pacakge ([208993d](https://github.com/leegeunhyeok/react-native-esbuild/commit/208993db17edd76ae84623076e8e2aa440e2b460))
- modulization helpers ([b2eea03](https://github.com/leegeunhyeok/react-native-esbuild/commit/b2eea036c479a8ad7bb5fcf8bf07524109b087d2))
- update eslint directive comments ([f43db6b](https://github.com/leegeunhyeok/react-native-esbuild/commit/f43db6bbef36f087d0371ac7e1696acb24c6080d))

### Build System

- set packages as external ([dd4417f](https://github.com/leegeunhyeok/react-native-esbuild/commit/dd4417fe07c7bd87357246914743067343fdeccb)), closes [#22](https://github.com/leegeunhyeok/react-native-esbuild/issues/22)

## [0.1.0-alpha.39](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.38...v0.1.0-alpha.39) (2023-09-24)

### Features

- **core:** add reporter config ([23a7854](https://github.com/leegeunhyeok/react-native-esbuild/commit/23a78548a4faa31f76ae2b015336ad912b4a7bf6))
- improve build status logs ([fad15a5](https://github.com/leegeunhyeok/react-native-esbuild/commit/fad15a51fae4c2bbfdef5276338011ab3278a1aa))
- improve logs on interactive mode ([34c5f33](https://github.com/leegeunhyeok/react-native-esbuild/commit/34c5f331071eecf1e980068c63582a82e7b6c75d))
- skip interactive message when not in tty ([098d0c6](https://github.com/leegeunhyeok/react-native-esbuild/commit/098d0c666577a4e88b6c5cc193ff6c59c5923682))

### Code Refactoring

- add logger config ([5a26157](https://github.com/leegeunhyeok/react-native-esbuild/commit/5a261577d2b9374d7a054fc32d2e2b78ecf7f812))
- **core:** event based client log reporter ([84fe917](https://github.com/leegeunhyeok/react-native-esbuild/commit/84fe917abb8cec0ebcafb0c8afcd2fdfa33a184e))
- **core:** modulize build status plugin ([d078c4c](https://github.com/leegeunhyeok/react-native-esbuild/commit/d078c4c4123c7eaaf8d6d1fcda80544014052729))
- error logging format ([14dc80b](https://github.com/leegeunhyeok/react-native-esbuild/commit/14dc80b742a6de6e6dd19fe6b0999ce2851a85b6))
- modularization transform plugin ([e099e62](https://github.com/leegeunhyeok/react-native-esbuild/commit/e099e62678e176bb4f219c0031329722055e8cf7))
- move bundler config types to core pacakge ([0924b6f](https://github.com/leegeunhyeok/react-native-esbuild/commit/0924b6f04fe59c538d18d5f49abaedc3a61df61d))
- rename getConfig to getConfigFromGlobal ([6089254](https://github.com/leegeunhyeok/react-native-esbuild/commit/608925414bc787222fb0c7118253670bed5ba53f))
- use dayjs as timestamp formatter ([6ceb753](https://github.com/leegeunhyeok/react-native-esbuild/commit/6ceb753632369606e2c98a34ccf6782612b9f625))

## [0.1.0-alpha.38](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.37...v0.1.0-alpha.38) (2023-09-24)

### Features

- **cli:** add options for react-native cli compatibility ([9c18fff](https://github.com/leegeunhyeok/react-native-esbuild/commit/9c18fffe537a8a810e41aab045cad3b1eba3a661))
- improve configurations ([79c9a68](https://github.com/leegeunhyeok/react-native-esbuild/commit/79c9a687b63ed52244e2dc2f4a7a50f6e5983afd))

### Miscellaneous Chores

- add lint scripts to root ([2a26af9](https://github.com/leegeunhyeok/react-native-esbuild/commit/2a26af9ddf57efc6f62fbb863051938f3d0e5df7))
- update some comments ([234083f](https://github.com/leegeunhyeok/react-native-esbuild/commit/234083f25049db4b9b124fd1de54bd05d4da2cca))

### Code Refactoring

- cli option types ([4d7c346](https://github.com/leegeunhyeok/react-native-esbuild/commit/4d7c3468ccb509215164bc29cf5c6d0c265b67f1))

## [0.1.0-alpha.37](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.36...v0.1.0-alpha.37) (2023-09-23)

### Bug Fixes

- **plugins:** some issue on resolve platform specified assets ([562b3ec](https://github.com/leegeunhyeok/react-native-esbuild/commit/562b3ec651eb6cb1c68f4714cdf9817d42e114fa))

## [0.1.0-alpha.36](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.35...v0.1.0-alpha.36) (2023-09-23)

### Bug Fixes

- **plugins:** resolve platform speficied assets ([2519196](https://github.com/leegeunhyeok/react-native-esbuild/commit/251919674008d4c9079f2d29e557319936100cd7))

## [0.1.0-alpha.35](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.34...v0.1.0-alpha.35) (2023-09-22)

### Bug Fixes

- **cli:** parsing issue on bundle-output ([853ac53](https://github.com/leegeunhyeok/react-native-esbuild/commit/853ac53171ce6de61721629f63070ced0b7cb69c))
- **core:** change to non-strict mode ([d786ee0](https://github.com/leegeunhyeok/react-native-esbuild/commit/d786ee00994331fdb0374dbae2cbd1db5691da22))

## [0.1.0-alpha.34](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.33...v0.1.0-alpha.34) (2023-09-22)

### Features

- print log when assets-dest is not set ([978fb96](https://github.com/leegeunhyeok/react-native-esbuild/commit/978fb9689acb2f7c1fea8c6900930f593d6f564b))

### Miscellaneous Chores

- swc helper move to dependency ([264cb62](https://github.com/leegeunhyeok/react-native-esbuild/commit/264cb62f6b51fd00df64e9f6db71935c0fb4eada))

### Code Refactoring

- **cli:** remove alias ([b5e31ad](https://github.com/leegeunhyeok/react-native-esbuild/commit/b5e31adc08149e5d52322cac114e897103148657))
- update build summary log format ([76d29f0](https://github.com/leegeunhyeok/react-native-esbuild/commit/76d29f082adc7fddd42902425c6ab11338f1dce5))

## [0.1.0-alpha.33](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.32...v0.1.0-alpha.33) (2023-09-22)

### Bug Fixes

- live reload via turbo modules ([a45af96](https://github.com/leegeunhyeok/react-native-esbuild/commit/a45af96609c4b96c45e96cb7a1ab6fbad10f50c8))

### Miscellaneous Chores

- add internal package ([34beece](https://github.com/leegeunhyeok/react-native-esbuild/commit/34beece6511f8c16a44be005a6104c3d1449ca9c))
- bump version up react-native to 0.72.4 ([04234d1](https://github.com/leegeunhyeok/react-native-esbuild/commit/04234d1941286e979c88be2f5dfbae08c922861a))
- update example app scripts ([4e8d45b](https://github.com/leegeunhyeok/react-native-esbuild/commit/4e8d45ba5aece874b465d69a44068c524aa3c6d9))

### Code Refactoring

- add command interface ([9eba04f](https://github.com/leegeunhyeok/react-native-esbuild/commit/9eba04f5f6918d02a0278418b7357552a8a42a94))
- change window to global object ([33e7763](https://github.com/leegeunhyeok/react-native-esbuild/commit/33e7763c87de2509d39e89f011fced65a9bfeae5))
- move internal helpers to pacakge ([3f377dc](https://github.com/leegeunhyeok/react-native-esbuild/commit/3f377dceadcfa719f8e9a7e249d0bfc9fbfa1fa6))
- update bundle config type ([274558e](https://github.com/leegeunhyeok/react-native-esbuild/commit/274558e958bf8c4b04abb58df5473d3470b38026))

## [0.1.0-alpha.32](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.31...v0.1.0-alpha.32) (2023-09-20)

### Features

- **cli:** now support interactive mode ([e3195cb](https://github.com/leegeunhyeok/react-native-esbuild/commit/e3195cb09eca057b1541173ea6b7400710fcc39e)), closes [#12](https://github.com/leegeunhyeok/react-native-esbuild/issues/12)

### Code Refactoring

- **cli:** split commands ([528c709](https://github.com/leegeunhyeok/react-native-esbuild/commit/528c70923761067001433de817e6a410e5c60882))
- logging build status ([f9941b7](https://github.com/leegeunhyeok/react-native-esbuild/commit/f9941b710ae29caa1e074ae733cb268b14d3128e))

## [0.1.0-alpha.31](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.30...v0.1.0-alpha.31) (2023-09-19)

### Features

- add --metafile option for esbuild metafile ([a696fab](https://github.com/leegeunhyeok/react-native-esbuild/commit/a696fabe44e122fb866ca92d7a2518f0fd23cc0c)), closes [#8](https://github.com/leegeunhyeok/react-native-esbuild/issues/8)
- add --timestamp option for print timestamp ([92ca30c](https://github.com/leegeunhyeok/react-native-esbuild/commit/92ca30c1f1aab1cc5a75614c6edcd56eaa3d8f89))
- index-page-middleware ([649c641](https://github.com/leegeunhyeok/react-native-esbuild/commit/649c6417ff47379138f1d2bd97ed1edc3449c429)), closes [#9](https://github.com/leegeunhyeok/react-native-esbuild/issues/9)

### Bug Fixes

- auto reload on update ([863fd4b](https://github.com/leegeunhyeok/react-native-esbuild/commit/863fd4bd9165109a3c2c714ad6c84d46482e77dd))
- replace stale bundle correctly when after rebuild ([2052f55](https://github.com/leegeunhyeok/react-native-esbuild/commit/2052f5563f7adb147172332506bba55311b4db19))
- unwrap iife for hermes optimization ([220233f](https://github.com/leegeunhyeok/react-native-esbuild/commit/220233f9afc738b6ddb4b2ac0edaac5f4f499632)), closes [#5](https://github.com/leegeunhyeok/react-native-esbuild/issues/5)

### Miscellaneous Chores

- bump version up packages ([b0c87fd](https://github.com/leegeunhyeok/react-native-esbuild/commit/b0c87fd8694b6c725267d66494d761809da27111))
- **example:** bump packages version ([0d9eb45](https://github.com/leegeunhyeok/react-native-esbuild/commit/0d9eb4563618010f4b54390ef72522b4a4295873))
- remove unused file ([85af9a0](https://github.com/leegeunhyeok/react-native-esbuild/commit/85af9a07824801181e03b5880e71601b259c3c40))
- remove unused module ([11738fe](https://github.com/leegeunhyeok/react-native-esbuild/commit/11738fe371230c35898768a90406bfd69fcc2fb3))
- update tsconfig for config files ([30a8495](https://github.com/leegeunhyeok/react-native-esbuild/commit/30a84958380ec9550b0b9c511f3c7f20b6d2bcf0))

### Code Refactoring

- apply eslint rules ([4792d4a](https://github.com/leegeunhyeok/react-native-esbuild/commit/4792d4a1662ad87fa052b93c709703a8d5f6fe46))
- remove reporter logs ([0b0f9dc](https://github.com/leegeunhyeok/react-native-esbuild/commit/0b0f9dc7c3ce60549a55721815f9370f952743e4))
- rename hermes-transfomer-plugin ([d4eeabf](https://github.com/leegeunhyeok/react-native-esbuild/commit/d4eeabf2f5c8927780d3f21ac98a6fa709e27dbc))

## [0.1.0-alpha.30](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.29...v0.1.0-alpha.30) (2023-08-23)

### Features

- add @react-native-esubild/transformer package ([8845c76](https://github.com/leegeunhyeok/react-native-esbuild/commit/8845c76ae026bc103e7adbb6083a5809a7fb46f5))
- add native logger (android) ([0e61e71](https://github.com/leegeunhyeok/react-native-esbuild/commit/0e61e717ba6c0d371efbf1abdcfb11223135781b))
- change global object name ([08d9931](https://github.com/leegeunhyeok/react-native-esbuild/commit/08d9931712693e30a35ce6c38549c07f17fd3e13))
- disable live reload when request sourcemap ([6c93115](https://github.com/leegeunhyeok/react-native-esbuild/commit/6c93115bf0d3059c260569f8250f43a2b064c0b2))
- indent initial scripts ([bc1c9f0](https://github.com/leegeunhyeok/react-native-esbuild/commit/bc1c9f0e01a80a02e9bad068b867d4bbe13e5c02))
- minify polyfills ([2e989e2](https://github.com/leegeunhyeok/react-native-esbuild/commit/2e989e2c07053b59407e8607081aa48c719e5a8e))

### Performance Improvements

- simplify transform polyfills ([4b2a328](https://github.com/leegeunhyeok/react-native-esbuild/commit/4b2a328f4d8f056b5f16a140d39f669c2b62ca75))

### Miscellaneous Chores

- bracket spaces ([0c9be37](https://github.com/leegeunhyeok/react-native-esbuild/commit/0c9be3733db20c9a78b9fc8316e51ff4498d3599))
- remove unused file ([c19c805](https://github.com/leegeunhyeok/react-native-esbuild/commit/c19c8053f558597f6c7c479c28048cd78a65e770))

## [0.1.0-alpha.29](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.28...v0.1.0-alpha.29) (2023-08-17)

### Features

- inject react native polyfills only once ([5b54909](https://github.com/leegeunhyeok/react-native-esbuild/commit/5b5490943ba7a7ea9bdda6d76281b3752224e36d))
- specify global object by platform ([8abf893](https://github.com/leegeunhyeok/react-native-esbuild/commit/8abf893bde650808bcee201ed6b40081ffa6136f))

### Performance Improvements

- do not rebuild when each bundle or sourcemap requests ([0fd58e2](https://github.com/leegeunhyeok/react-native-esbuild/commit/0fd58e25ddec6dcbd433bb94ce6c496be7ccc5f4))

### Miscellaneous Chores

- bump version up pacakges ([e235610](https://github.com/leegeunhyeok/react-native-esbuild/commit/e235610379fbf8f5c6978ecded5dbe6549834975))
- update pods ([3534553](https://github.com/leegeunhyeok/react-native-esbuild/commit/3534553a4b6f0c357b1308113a40b331e18c95fc))

### Code Refactoring

- add reactNativeInternal ([f553bdf](https://github.com/leegeunhyeok/react-native-esbuild/commit/f553bdff0d95b9e9240e66ab18bc82c9deaf33e2))
- relocate internal directory ([03e6c06](https://github.com/leegeunhyeok/react-native-esbuild/commit/03e6c060c6263a27b36107166f9a8d689e4579c9))
- relocate transformers ([8a2a19c](https://github.com/leegeunhyeok/react-native-esbuild/commit/8a2a19c4cf1695888fac2828807dddeeb014b7c8))
- update transformer context type ([2c78cf5](https://github.com/leegeunhyeok/react-native-esbuild/commit/2c78cf549bb3d876a06c59d06ab5b85f77170471))

## [0.1.0-alpha.28](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.27...v0.1.0-alpha.28) (2023-08-15)

### Features

- handle for sourcemap request ([ca92e0c](https://github.com/leegeunhyeok/react-native-esbuild/commit/ca92e0ca801927061f73dc972b8088b10c264a98))
- implement symbolicate-middleware ([ebc5e83](https://github.com/leegeunhyeok/react-native-esbuild/commit/ebc5e83d6c65306bf26659d9cabe67b24889156a))
- improve update build status ([3e31ae8](https://github.com/leegeunhyeok/react-native-esbuild/commit/3e31ae89f5f714365f9e0f3c99d295292dccfe07))
- **symbolicate:** add symbolicateStackTrace ([3a8c296](https://github.com/leegeunhyeok/react-native-esbuild/commit/3a8c2967c0cddd97ebc68a59b56e2a604e4d4586))

### Bug Fixes

- send bundle state condition ([5029c15](https://github.com/leegeunhyeok/react-native-esbuild/commit/5029c1568d41565c67601e30da222131d75fa0d0))
- set response header when not support multipart format ([e58bcf9](https://github.com/leegeunhyeok/react-native-esbuild/commit/e58bcf9c87b2a6906df7859c54949eca4497d20b))

### Code Refactoring

- change default host to localhost ([53c5c91](https://github.com/leegeunhyeok/react-native-esbuild/commit/53c5c915a9694a19dbb51c38acdf507101c7bdb6))
- cleanup serve-bundle-middleware ([7515593](https://github.com/leegeunhyeok/react-native-esbuild/commit/75155934751778b8efcdb817de24fed35d1e74c3))
- rename handler to wss ([77c0714](https://github.com/leegeunhyeok/react-native-esbuild/commit/77c07143891aa4c5ea5b1252ec8ab4a0affca7e7))
- serve-bundle-middleware ([8287a54](https://github.com/leegeunhyeok/react-native-esbuild/commit/8287a54ef2faf9abd6e7b0f73e80c72dd7a8f2aa))

### Miscellaneous Chores

- remove source-map package (to be renamed) ([b9810b1](https://github.com/leegeunhyeok/react-native-esbuild/commit/b9810b13eeb67427d62e8465086c082459600abe))

## [0.1.0-alpha.27](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.26...v0.1.0-alpha.27) (2023-08-10)

### Features

- add react-navigation devtool ([2994679](https://github.com/leegeunhyeok/react-native-esbuild/commit/29946795ce290966d4e60c5bd7549f93a6e221c6))
- support flipper log ([79efa17](https://github.com/leegeunhyeok/react-native-esbuild/commit/79efa17345c927bc8dab66cf352b99909009308f))
- support hermes debugging ([aec0615](https://github.com/leegeunhyeok/react-native-esbuild/commit/aec061558018cabad9be487b75933a625bf8ccb8))

### Miscellaneous Chores

- change log level ([5774524](https://github.com/leegeunhyeok/react-native-esbuild/commit/57745243cd63c8581e531eca68a0bed9cb54e9fe))

## [0.1.0-alpha.26](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.25...v0.1.0-alpha.26) (2023-08-10)

### Features

- add logging on hot reload middleware ([b451be2](https://github.com/leegeunhyeok/react-native-esbuild/commit/b451be2037c95f361d8ced798dc22a374885ee57))
- add on, off type definition ([91873e8](https://github.com/leegeunhyeok/react-native-esbuild/commit/91873e8235711466c2bae381448bdaa6e247ff83))
- **core:** add build-status-change event ([a19ff22](https://github.com/leegeunhyeok/react-native-esbuild/commit/a19ff227b2aa0a1b1a40a759b3b2ee576ced485a))
- now support multipart/mixed response for send bundle ([cc60cc8](https://github.com/leegeunhyeok/react-native-esbuild/commit/cc60cc891f3a4bb061ad5632734b13d63c165c63))
- print request headers when verbose mode ([21aee9f](https://github.com/leegeunhyeok/react-native-esbuild/commit/21aee9fbed75c48e2046cff64f176df0e9dd15e1))
- response 400 when asset name is invalid ([32fc281](https://github.com/leegeunhyeok/react-native-esbuild/commit/32fc2818ae5f3a12d023827b846607035a79dac6))
- update build-end event payload ([e0c641b](https://github.com/leegeunhyeok/react-native-esbuild/commit/e0c641bb5fac33a10a7943f1a3d46850c3eb9853))

### Bug Fixes

- **core:** build twice when build-end event was fired ([0d06678](https://github.com/leegeunhyeok/react-native-esbuild/commit/0d06678434460791dc063f0126bdfafd92e1b340))

### Code Refactoring

- **core:** add type definition of event emitter ([722c89e](https://github.com/leegeunhyeok/react-native-esbuild/commit/722c89ed025da67ced0cc80a286b3abfb66ceb8a))
- early return on middlewares ([c634b70](https://github.com/leegeunhyeok/react-native-esbuild/commit/c634b70da87bbae1ecc1536681e5f345132d61ce))
- rename bitwiseOptions to getIdByOptions ([8055d6a](https://github.com/leegeunhyeok/react-native-esbuild/commit/8055d6a32e1f716615bd91385931ee99b5cf0d83))
- rename taskId to id ([1a75b1f](https://github.com/leegeunhyeok/react-native-esbuild/commit/1a75b1f28d1d72dbf9b84ccca8b4d6290d2815b3))
- rename to BundleMode ([b2d3563](https://github.com/leegeunhyeok/react-native-esbuild/commit/b2d3563cd9ee5b05a37b138d2efbe7d39fdbff4e))
- wrap toSafetyMiddleware on initialize ([f4c0c3d](https://github.com/leegeunhyeok/react-native-esbuild/commit/f4c0c3dce451b48b126866806883b9a1bda49c89))

## [0.1.0-alpha.25](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.24...v0.1.0-alpha.25) (2023-08-09)

### Bug Fixes

- use basename as suffix striped name ([3a59aa2](https://github.com/leegeunhyeok/react-native-esbuild/commit/3a59aa20f6afd059218a9f727599260bb4f62358))

## [0.1.0-alpha.24](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.23...v0.1.0-alpha.24) (2023-08-09)

### Bug Fixes

- strip exist scale suffix before resolve ([8e95268](https://github.com/leegeunhyeok/react-native-esbuild/commit/8e9526873a4b098db23f1522a203a722e91b79ba))

## [0.1.0-alpha.23](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.22...v0.1.0-alpha.23) (2023-08-09)

### Bug Fixes

- improve scaled asset resolve logic ([ac770d8](https://github.com/leegeunhyeok/react-native-esbuild/commit/ac770d8d0fe8e14f892f1d2a8ff1861bf506a3aa))
- remove unnecessary dot on suffix ([21d70a0](https://github.com/leegeunhyeok/react-native-esbuild/commit/21d70a0250f744f3503ed831dc1f14d7c2a39646))

### Code Refactoring

- add resolveAssetPath ([d1ca035](https://github.com/leegeunhyeok/react-native-esbuild/commit/d1ca0359fb72b09b628cb2d5c0c87f76268f181c))

## [0.1.0-alpha.22](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.21...v0.1.0-alpha.22) (2023-08-09)

### Features

- add asset hash and dimensions ([3b4b7fb](https://github.com/leegeunhyeok/react-native-esbuild/commit/3b4b7fbb9fc324751410106e6b6d073452a2ae01))
- add http request logger ([4224296](https://github.com/leegeunhyeok/react-native-esbuild/commit/4224296c774293ab4692323b456b67ac1fe709a8))
- add root ([acde580](https://github.com/leegeunhyeok/react-native-esbuild/commit/acde580db75bffd27e5c12ea11d483bc585ea87a))
- add root option to transformers ([68c8c52](https://github.com/leegeunhyeok/react-native-esbuild/commit/68c8c524daa458fad5d5f060ffcaba3ca40b2344))
- add setEnvironment ([2372662](https://github.com/leegeunhyeok/react-native-esbuild/commit/237266258553547e7638d6b499aa44e40f33e37f))
- cleanup esbuild options ([7ff4cd5](https://github.com/leegeunhyeok/react-native-esbuild/commit/7ff4cd5d08bb66db964945976218b459dc3dae96))
- early return when fully transformed ([2cae9ef](https://github.com/leegeunhyeok/react-native-esbuild/commit/2cae9ef5b05a1d94db5c2079f086b521f711ced8))
- follow @react-native-community/cli options ([723a0fd](https://github.com/leegeunhyeok/react-native-esbuild/commit/723a0fda5f4c462c7d1bda0afc084ed48a5b7d3e))
- load config from root ([33b11c8](https://github.com/leegeunhyeok/react-native-esbuild/commit/33b11c81692a5790cf78eb31e35b2515b5a0bfea))
- move sourcemap to specified path ([e672fe3](https://github.com/leegeunhyeok/react-native-esbuild/commit/e672fe3c38f46393dbf811ac3140c0083a12aedb))
- remove output dir assertion ([c21b6da](https://github.com/leegeunhyeok/react-native-esbuild/commit/c21b6da59be51d8531cb729b10e959e6df5f15eb))
- resolve assets for release build ([ac2f3a3](https://github.com/leegeunhyeok/react-native-esbuild/commit/ac2f3a3ad62933df7267fdafdd9d832fda4dbb71))

### Bug Fixes

- wrong minify default value ([59a74eb](https://github.com/leegeunhyeok/react-native-esbuild/commit/59a74eb063688bbb05ad059b1e6c7fdb37aa522f))

### Performance Improvements

- short circuit evaluation ([60009bd](https://github.com/leegeunhyeok/react-native-esbuild/commit/60009bda3b7afbadd852b9e744bed7c2546b062c))

### Code Refactoring

- add Transformer type ([08506b0](https://github.com/leegeunhyeok/react-native-esbuild/commit/08506b0c303db2f2333de8b1d5bea38178a0e5f6))
- remove transform helpers ([133dec2](https://github.com/leegeunhyeok/react-native-esbuild/commit/133dec22fec03acb7db8cc5751996ca70fc3d63f))

### Miscellaneous Chores

- update reanimated ([6b6fc89](https://github.com/leegeunhyeok/react-native-esbuild/commit/6b6fc89f5882dba9fb73cda7ac74bbe8f946a4ca))

### Build System

- add release scheme ([084f446](https://github.com/leegeunhyeok/react-native-esbuild/commit/084f446917f024046865814cbc11c044557faba2))
- add xcode build helper script ([1d59181](https://github.com/leegeunhyeok/react-native-esbuild/commit/1d591817c7bcea71d5b189cd5c01f3405dd284ae))

## [0.1.0-alpha.21](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.20...v0.1.0-alpha.21) (2023-08-08)

### Features

- disable swc loose option ([ab1da4d](https://github.com/leegeunhyeok/react-native-esbuild/commit/ab1da4d8fbfbc9028e1de074e9df1d9dee96ff24))
- strip flow syntax using sucrase ([3e7b107](https://github.com/leegeunhyeok/react-native-esbuild/commit/3e7b107be6f9274200cfc753a67421c5eda8b328))

### Bug Fixes

- wrong **DEV** value ([620c9b4](https://github.com/leegeunhyeok/react-native-esbuild/commit/620c9b4c40d3d97f5676a5114e19c586e06738fb))

### Performance Improvements

- improve regexp ([5202582](https://github.com/leegeunhyeok/react-native-esbuild/commit/5202582535d4bff46f3b9a44d12ab9a83c924d36))

### Miscellaneous Chores

- remove newline ([c7549bf](https://github.com/leegeunhyeok/react-native-esbuild/commit/c7549bf47370580370185b3c0efa71312c866c93))

### Code Refactoring

- cleanup transformer ([4a672a9](https://github.com/leegeunhyeok/react-native-esbuild/commit/4a672a96ce823cdb697c8d0c896010a2347b4c9e))

## [0.1.0-alpha.20](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2023-08-06)

### Bug Fixes

- **core:** assert bundle task in watch mode ([65d7dbe](https://github.com/leegeunhyeok/react-native-esbuild/commit/65d7dbe7c86a4edb1a5b7e76820f125de1ac9fb6))

## [0.1.0-alpha.19](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2023-08-06)

### Features

- **core:** support platform scoped bundle ([1a7094b](https://github.com/leegeunhyeok/react-native-esbuild/commit/1a7094b51c1327fff6708f32638a78c078a74914))

### Bug Fixes

- **cli:** reset cache alias ([8f3b969](https://github.com/leegeunhyeok/react-native-esbuild/commit/8f3b969e69348485f39cb45e25ad5e1782d80dcc))

### Performance Improvements

- improve transform performance ([42670f2](https://github.com/leegeunhyeok/react-native-esbuild/commit/42670f2bfd4d82df623d45713012ccc21bb8678e))

## [0.1.0-alpha.18](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.17...v0.1.0-alpha.18) (2023-08-05)

### Features

- add bitwiseOptions ([786191d](https://github.com/leegeunhyeok/react-native-esbuild/commit/786191df504bba61c71685196e82d2b2ba4e268d))
- add mode to plugin context ([4dd2218](https://github.com/leegeunhyeok/react-native-esbuild/commit/4dd2218efcf3446a9ab516c9ab802bcefcb346ec))
- add scoped cache system ([8d1f0bd](https://github.com/leegeunhyeok/react-native-esbuild/commit/8d1f0bd3235f977a73f1f3725ce393fae244cf97))
- add taskId to plugin context ([5c64d22](https://github.com/leegeunhyeok/react-native-esbuild/commit/5c64d2284ade22fa24f11e3d10a17bc1d63b20ca))
- add unexpected exception handler ([1c21443](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c214430e1e286cffce4cec3fed758614b782878))
- check cache directory is exist ([1c273ef](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c273efe52aed75fb5ddd21b8937fa4adf8064aa))
- **core:** improve file system caching ([0ed3ebb](https://github.com/leegeunhyeok/react-native-esbuild/commit/0ed3ebbe2d547935f2b686d56dd1a04ef801d3d9))

### Miscellaneous Chores

- add cleanup script ([0f03232](https://github.com/leegeunhyeok/react-native-esbuild/commit/0f032326ad5a412942b77f40130d38a3efeff472))

### Code Refactoring

- change server listening log level to info ([7ac6cad](https://github.com/leegeunhyeok/react-native-esbuild/commit/7ac6cada527af0f4dc183e529d8674a09eb4da9b))
- change to return statement ([dc9a7bb](https://github.com/leegeunhyeok/react-native-esbuild/commit/dc9a7bb2e2df1430aa0986caaf6813d420d44245))
- cleanup bundle config ([36ebd85](https://github.com/leegeunhyeok/react-native-esbuild/commit/36ebd85b16d68561847d55377fcadaa2217bb4c0))
- improve config types ([4bacba6](https://github.com/leegeunhyeok/react-native-esbuild/commit/4bacba65c9609191490d89b488a9e00d3127ef38))
- improve plugin registration ([e292ebb](https://github.com/leegeunhyeok/react-native-esbuild/commit/e292ebb826bfa26d6ad84ad9d01aa02395357ed7))
- separate config modules ([ce6d02d](https://github.com/leegeunhyeok/react-native-esbuild/commit/ce6d02d5c5e597469e75c8c6864b553afd53b501))

## [0.1.0-alpha.17](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2023-08-04)

### Bug Fixes

- wrong package name regexp ([4c5ceed](https://github.com/leegeunhyeok/react-native-esbuild/commit/4c5ceed218f8c248a6ee91cf303af0bebc788153))

### Code Refactoring

- clear spinner when build end ([d29e749](https://github.com/leegeunhyeok/react-native-esbuild/commit/d29e7492d13b25132fd47493d6093c34c13f31d5))
- remove cache option and now following dev option ([0bd385a](https://github.com/leegeunhyeok/react-native-esbuild/commit/0bd385a5931ddc69e258415d7f876bb96b6185de))
- seperate transformer modules ([4e09440](https://github.com/leegeunhyeok/react-native-esbuild/commit/4e0944043438565639b866cd077c7b0a590be780))

## [0.1.0-alpha.16](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2023-08-04)

### Features

- add --reset-cache option ([3d08751](https://github.com/leegeunhyeok/react-native-esbuild/commit/3d087516a0d6e2724ee4c896d5632572d34b861c))
- add transform options ([018a731](https://github.com/leegeunhyeok/react-native-esbuild/commit/018a7312679bfed118e6d26ffede696b293f4cb7))
- remove whitespaces end of log message ([38fea8e](https://github.com/leegeunhyeok/react-native-esbuild/commit/38fea8e7ce72c5e3784fe9b7c9b50ba2eaa31826))

## [0.1.0-alpha.15](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2023-08-04)

### Features

- improve esbuild log ([fa23610](https://github.com/leegeunhyeok/react-native-esbuild/commit/fa23610b9eed876974c8dc07e90baabe405b1df1))
- skip build-end event when first build ([9f87b35](https://github.com/leegeunhyeok/react-native-esbuild/commit/9f87b35ed15b365bc74c2f515c7271ead1b108ae))

### Bug Fixes

- resolve relative path assets ([dcb7fb0](https://github.com/leegeunhyeok/react-native-esbuild/commit/dcb7fb0ee1a9716ceff9132e412d951385434b5a))

### Miscellaneous Chores

- add rimraf for cleanup build directories ([13356fe](https://github.com/leegeunhyeok/react-native-esbuild/commit/13356fec1868b7634da86bca522e987b5bee2284))

## [0.1.0-alpha.14](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2023-08-04)

### Features

- add log to landing component ([9bc2a6f](https://github.com/leegeunhyeok/react-native-esbuild/commit/9bc2a6fde933f574800ca49355b9379b206d88d0))
- add svg-transform-plugin ([0526207](https://github.com/leegeunhyeok/react-native-esbuild/commit/05262075d33d8df24a392e731a418435cf74c2bd))

### Bug Fixes

- log level limitation ([0e02fab](https://github.com/leegeunhyeok/react-native-esbuild/commit/0e02fabcd89b29b347e340385c4402bb0f71c456))
- resolving sacled asset ([0fc063d](https://github.com/leegeunhyeok/react-native-esbuild/commit/0fc063d19ce331eaf59892572f43780074faf37b))

### Miscellaneous Chores

- change main banner image ([59fc546](https://github.com/leegeunhyeok/react-native-esbuild/commit/59fc54640bcdaec74d8ad66dd66c4d83baa7d5c3))

## [0.1.0-alpha.13](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.12...v0.1.0-alpha.13) (2023-08-03)

### Features

- validate plugins ([a5b722c](https://github.com/leegeunhyeok/react-native-esbuild/commit/a5b722c48c31d5630aeac760f9ddc44f76e89e98))

### Bug Fixes

- missing hash ([466c957](https://github.com/leegeunhyeok/react-native-esbuild/commit/466c957b08555ba62fbd94d3002dbecf9cc0808c))

## [0.1.0-alpha.12](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.11...v0.1.0-alpha.12) (2023-08-03)

### Features

- **cli:** add cache clean command ([139417e](https://github.com/leegeunhyeok/react-native-esbuild/commit/139417e0374eed625382249a89466411a84292f3))
- **core:** add caching feature ([ccf193d](https://github.com/leegeunhyeok/react-native-esbuild/commit/ccf193d1890a59ece6924a67f067782ca1507b4c))
- **core:** add plugins option for customizing ([9b884cc](https://github.com/leegeunhyeok/react-native-esbuild/commit/9b884cc42e2ff19bb9514ca04f865f9b4472b623))
- **core:** extends event emitter for subscribe events ([cf91ef0](https://github.com/leegeunhyeok/react-native-esbuild/commit/cf91ef0729fd9dbfa9e83587f1b57cc3684a1468))
- now support hot reload ([2fae39d](https://github.com/leegeunhyeok/react-native-esbuild/commit/2fae39de39e9c4976dc8ae6c24f28335877d53cc))

### Bug Fixes

- add default output path ([69b6e2a](https://github.com/leegeunhyeok/react-native-esbuild/commit/69b6e2a123818e1be2a0928fff877f8f598852dd))

### Code Refactoring

- add registerPlugins ([263219f](https://github.com/leegeunhyeok/react-native-esbuild/commit/263219f629b8535a1928e3ef5e87dc0ce797fe9d))
- **core:** move build-status-plugin to core ([7d23543](https://github.com/leegeunhyeok/react-native-esbuild/commit/7d2354325cdd52b014aecaaa327071300877a1fc))

## [0.1.0-alpha.11](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2023-08-03)

### Features

- add background color ([b3ee50d](https://github.com/leegeunhyeok/react-native-esbuild/commit/b3ee50db843d26e422413e0d4a1e8659e625e988))
- add log level ([5ee42f4](https://github.com/leegeunhyeok/react-native-esbuild/commit/5ee42f4f64906091e474de1b6572d8196434d7cb))
- add transform condition for reanimated ([c311bff](https://github.com/leegeunhyeok/react-native-esbuild/commit/c311bff4d89fd460f61270b1a87b851585584fef))
- **cli:** update base config values ([b4da292](https://github.com/leegeunhyeok/react-native-esbuild/commit/b4da29294d6bfe719dc7b526a13d9e2d6d801a7b))
- copying assets when build complete ([db10be1](https://github.com/leegeunhyeok/react-native-esbuild/commit/db10be14be375910835def9efd07bf7e3efe6398))
- default minify option to false ([5ac5c2e](https://github.com/leegeunhyeok/react-native-esbuild/commit/5ac5c2e30815df42d162598bad55d820badaed01))
- export colors ([916e62e](https://github.com/leegeunhyeok/react-native-esbuild/commit/916e62e9ab42c6011afe99529ff08e541dc7f2b7))
- improve build status logging ([94083f9](https://github.com/leegeunhyeok/react-native-esbuild/commit/94083f9dcbf3cb8533239611f2b79939faaa5d6a))
- now sharing logger configs ([ff0a199](https://github.com/leegeunhyeok/react-native-esbuild/commit/ff0a1993fc15c6735d5abe4c403018038a20026b))
- now support client logs ([632d206](https://github.com/leegeunhyeok/react-native-esbuild/commit/632d20672e51018f603af0dde8668acddc438db4))
- read asset data from assets cache ([3ae010a](https://github.com/leegeunhyeok/react-native-esbuild/commit/3ae010a94b3c45091d2bb3017e7b3143c98b3b53))
- reset assets before build ([0531960](https://github.com/leegeunhyeok/react-native-esbuild/commit/053196060e0611bcd984bdb158e2f409c8040365))
- update demo application ([393c077](https://github.com/leegeunhyeok/react-native-esbuild/commit/393c0772f2d4c04842ec164dc6d7c770f30a43b6))

### Bug Fixes

- android build issue ([d09e0e7](https://github.com/leegeunhyeok/react-native-esbuild/commit/d09e0e7f493dad117bbe24e26c8d4b06d0efe2c1))
- **core:** change react native initialize order ([81b5a30](https://github.com/leegeunhyeok/react-native-esbuild/commit/81b5a3033d0f478dea69a20b2922b0e7bf736858))
- react-native-community packages set as external module ([4bd944a](https://github.com/leegeunhyeok/react-native-esbuild/commit/4bd944a54d5493353b195c01aafee58acba18c8c))
- using react-native internal asset registry ([081bd83](https://github.com/leegeunhyeok/react-native-esbuild/commit/081bd838e3a2265880d611cbfb7b3939d7731a9c))

### Code Refactoring

- using colors in utils ([1c844fc](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c844fcd7bf8adf4daf0ca4793d6c5151e3c33cf))

### Miscellaneous Chores

- change description text ([d771d4b](https://github.com/leegeunhyeok/react-native-esbuild/commit/d771d4b080cabbb45b36693c032b467f26bcf984))

## [0.1.0-alpha.10](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2023-08-01)

### Features

- **dev-server:** implement serve-asset-middleware ([dd6a48a](https://github.com/leegeunhyeok/react-native-esbuild/commit/dd6a48a588da4c40e0c6bfc3805b5c1a821bf3f5))
- enhance loading spinner ([83049d1](https://github.com/leegeunhyeok/react-native-esbuild/commit/83049d1a7d7d5c0ef955aad3fe4e07e1f8d0feda))
- **plugins:** implement asset-register-plugin ([9237cb4](https://github.com/leegeunhyeok/react-native-esbuild/commit/9237cb4802ffe4d9c2696292e6a63d276a1f44e1))
- update example application ([5d5e1fc](https://github.com/leegeunhyeok/react-native-esbuild/commit/5d5e1fcd68318ca2fa3f9750a9cbff3b31ecd9e9))

### Code Refactoring

- change log level ([a86a677](https://github.com/leegeunhyeok/react-native-esbuild/commit/a86a6774f63877c093e8363c00e899b83cd45783))
- separate plugin modules ([c7b8242](https://github.com/leegeunhyeok/react-native-esbuild/commit/c7b824216dde08d06b667f3c254109c71a009ec9))

## [0.1.0-alpha.9](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2023-07-31)

### Features

- add ascii logo ([3e462be](https://github.com/leegeunhyeok/react-native-esbuild/commit/3e462bebc876961618a93ace12526e816d34150e))
- add buildStatusPlugin ([07142c0](https://github.com/leegeunhyeok/react-native-esbuild/commit/07142c0e3863f9c1472ff45f85b86aeaf16a58ad))
- add core options ([3743760](https://github.com/leegeunhyeok/react-native-esbuild/commit/3743760d285b7e55db1cc634b53800be36c05d1d))
- add error param to stderr log ([db5b5fe](https://github.com/leegeunhyeok/react-native-esbuild/commit/db5b5fe2aae111d98242753dd30c126b6c14eac0))
- add logger to packages ([fa789d0](https://github.com/leegeunhyeok/react-native-esbuild/commit/fa789d0d9414ec6356f5bf223960754027766be9))
- change assetsDest to assetsDir ([2ec231b](https://github.com/leegeunhyeok/react-native-esbuild/commit/2ec231b7a63ee68f0acb9c16fba5dea6f355b62a))
- implement logger ([e4b85ab](https://github.com/leegeunhyeok/react-native-esbuild/commit/e4b85ab5c9c860c59b23a601db19c4407d618904))
- improve configs and implement start command ([936d33b](https://github.com/leegeunhyeok/react-native-esbuild/commit/936d33b2f916c22410aa7241ae53b634f83116ee))
- improve module resolution for react native polyfills ([300df3f](https://github.com/leegeunhyeok/react-native-esbuild/commit/300df3f0c6654764ed9539d13243346faa6559a9))
- isCI moved to utils ([27415bc](https://github.com/leegeunhyeok/react-native-esbuild/commit/27415bc78c686fa00b85f4e2687e402e49aaf51b))
- now load config file before bundle ([7449cf3](https://github.com/leegeunhyeok/react-native-esbuild/commit/7449cf361dcba4e2e3425516bbcb594b7533f399))
- **plugins:** support custom babel transforming ([aac234e](https://github.com/leegeunhyeok/react-native-esbuild/commit/aac234e4fee2a0fb30923f38c823ca518d233467))
- **utils:** add setLogLevel ([9c93cbf](https://github.com/leegeunhyeok/react-native-esbuild/commit/9c93cbf24a23f0d31cbffc311875dc9e8315f837))

### Bug Fixes

- **cli:** remove invalid options ([3d8832b](https://github.com/leegeunhyeok/react-native-esbuild/commit/3d8832b3a7155fceaddad1283b14995071002a6f))
- url parse ([b91bc5a](https://github.com/leegeunhyeok/react-native-esbuild/commit/b91bc5a45aab16d43b36a674d383b041e8fbea62))
- wrong build script ([7c00fad](https://github.com/leegeunhyeok/react-native-esbuild/commit/7c00fadfeefa412db2096be23abdfd25fa10b807))

### Performance Improvements

- improve bundle performance ([72844d5](https://github.com/leegeunhyeok/react-native-esbuild/commit/72844d5b5d5529b1245a1642218b5ef9d41e3dd5))

### Miscellaneous Chores

- add @react-native-esbuild/cli to example ([d291b53](https://github.com/leegeunhyeok/react-native-esbuild/commit/d291b53751c47104d0a839fd069c869d9b934edc))
- add @react-native-esbuild/utils ([913768a](https://github.com/leegeunhyeok/react-native-esbuild/commit/913768a7e3f67d787cf0339e2c5fac8b94cebe81))
- add react-native-esbuild config ([c0d2753](https://github.com/leegeunhyeok/react-native-esbuild/commit/c0d27539d865c2599c0f31c29fc9c138de6e5fe5))
- change bundler description ([2e1432b](https://github.com/leegeunhyeok/react-native-esbuild/commit/2e1432bba7db39e7f09ad4915502718aec247fea))
- cleanup example application ([a3f52cc](https://github.com/leegeunhyeok/react-native-esbuild/commit/a3f52cc4f5229f18e32714bdbea9730ba9146fae))
- set hoistingLimits to example ([5fbc3f6](https://github.com/leegeunhyeok/react-native-esbuild/commit/5fbc3f63ba6032a88fdc7d57eb221f4d741dad14))

### Code Refactoring

- change log levels ([521e545](https://github.com/leegeunhyeok/react-native-esbuild/commit/521e5457f9535e4551f0b44da2c19a4eb7d64156))
- cleanup import statement ([badc372](https://github.com/leegeunhyeok/react-native-esbuild/commit/badc372d6db1ddb8f3b68270829ea4be842c3c63))
- split config modules to each target ([f37427d](https://github.com/leegeunhyeok/react-native-esbuild/commit/f37427d3160b7eb995befbeea8116fe53cb9e1d5))
- update basic external modules ([75ab87c](https://github.com/leegeunhyeok/react-native-esbuild/commit/75ab87cb8536ac015024dd256eeea2a88ffdbc45))
- using buildStatusPlugin ([3289c4f](https://github.com/leegeunhyeok/react-native-esbuild/commit/3289c4f013eae9b585e92b61752a576aeb18e85c))

## [0.1.0-alpha.8](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2023-07-29)

### Bug Fixes

- **plugins:** reference default exports module correctly ([a90c211](https://github.com/leegeunhyeok/react-native-esbuild/commit/a90c211261cc019d1f4369a396907437853da775))

### Reverts

- Revert "chore: change type to module" ([96c32ee](https://github.com/leegeunhyeok/react-native-esbuild/commit/96c32ee767cb0553b0bbe0ba3c631da3dbc308bf))

### Miscellaneous Chores

- remove unnecessary config ([83c4b03](https://github.com/leegeunhyeok/react-native-esbuild/commit/83c4b0360cbf919376e351ea9314c594ee0a65c9))

## [0.1.0-alpha.7](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2023-07-29)

### Bug Fixes

- **plugins:** invalid load result ([63a73b2](https://github.com/leegeunhyeok/react-native-esbuild/commit/63a73b266ea7d12acccbaa1a3e39fa232447c1db))

### Miscellaneous Chores

- change type to module ([6d63e8a](https://github.com/leegeunhyeok/react-native-esbuild/commit/6d63e8af31f4e485247add463142d81f86c0c0b2))

## [0.1.0-alpha.6](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.5...v0.1.0-alpha.6) (2023-07-29)

### Bug Fixes

- **plugins:** invalid dependency relations ([8e436c3](https://github.com/leegeunhyeok/react-native-esbuild/commit/8e436c3664de8a7f98c4403a0921b969cf6672fc))

## [0.1.0-alpha.5](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2023-07-29)

### Features

- **cli:** add entry option ([c7225cb](https://github.com/leegeunhyeok/react-native-esbuild/commit/c7225cbe29737badb4a70cd718910c39d458fa99))

### Bug Fixes

- **config:** add missed esbuild options ([b1fda0d](https://github.com/leegeunhyeok/react-native-esbuild/commit/b1fda0d6e92186a3853b3c71b5687c35b13fd2e8))

### Miscellaneous Chores

- **cli:** replace wrong scripts ([c3a5d3a](https://github.com/leegeunhyeok/react-native-esbuild/commit/c3a5d3a565effed8ab6dd1d149972e2f4b44f0be))

## [0.1.0-alpha.4](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.3...v0.1.0-alpha.4) (2023-07-29)

### Bug Fixes

- **cli:** invalid banner (shebang) ([c1d268f](https://github.com/leegeunhyeok/react-native-esbuild/commit/c1d268fecccef80465ac4042382452c1f8923869))

## [0.1.0-alpha.3](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2023-07-29)

### Features

- **config:** add outfile to esbuild config ([638e6a2](https://github.com/leegeunhyeok/react-native-esbuild/commit/638e6a27c1f48c5d3ab76bfb63cdc13682d92842))
- **core:** add plugins to bundler ([107c869](https://github.com/leegeunhyeok/react-native-esbuild/commit/107c869d07479c75dea8df52b30265c3a4a76fcd))

### Miscellaneous Chores

- add react-native to peer deps ([22baf4b](https://github.com/leegeunhyeok/react-native-esbuild/commit/22baf4b928d2ab87388a04c300777c7a379f0f1f))

### Code Refactoring

- **config:** improve config types ([1c2c170](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c2c170d01c2beb2018ac745daaa3973a4368103))
- **plugins:** rename plugins ([7fcf1a5](https://github.com/leegeunhyeok/react-native-esbuild/commit/7fcf1a52b593bbb9019d70916971357ba87c5bfa))

## [0.1.0-alpha.2](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2023-07-29)

### Bug Fixes

- wrong dependencies relations ([1df14b1](https://github.com/leegeunhyeok/react-native-esbuild/commit/1df14b1b06627bda74b4aa52df1a19ab72ba840b))

### Miscellaneous Chores

- ignore install-state.gz ([06e43af](https://github.com/leegeunhyeok/react-native-esbuild/commit/06e43af2e3df62da58f468b33905e4a97472dc5f))

## 0.1.0-alpha.1 (2023-07-29)

### Features

- add base configs for build ([3acf916](https://github.com/leegeunhyeok/react-native-esbuild/commit/3acf91623d33e9d1f8ee48568d66e57d329683ec))
- add sourcemap option ([bfb6c9e](https://github.com/leegeunhyeok/react-native-esbuild/commit/bfb6c9edc2338aa612e4f687b05d72e94bc70877))
- **cli:** add start and build commands ([33cff7d](https://github.com/leegeunhyeok/react-native-esbuild/commit/33cff7d69e07c676060477c949e4af1abfb33b4c))
- **cli:** implement build command ([d138ceb](https://github.com/leegeunhyeok/react-native-esbuild/commit/d138ceb78da3e4de8b1a25ed802a6c7b99d4a53d))
- **core:** add request bundle option ([5a76eca](https://github.com/leegeunhyeok/react-native-esbuild/commit/5a76ecac1e07211c95ec356e5829bb0f671009c9))
- **core:** implement base core module ([b8e7d35](https://github.com/leegeunhyeok/react-native-esbuild/commit/b8e7d35753b45b015a0009cb9919429348e6f50c))
- **core:** now throw signal when task is not started yet ([8a9f5dd](https://github.com/leegeunhyeok/react-native-esbuild/commit/8a9f5dd692799d43b672d8af496696d61f79a12f))
- **dev-server:** implement base dev server ([0fcb7eb](https://github.com/leegeunhyeok/react-native-esbuild/commit/0fcb7eb20152f0ff8662e7be17c70dbb2fddd54b))
- **plugins:** implement transform plugin ([92a8f60](https://github.com/leegeunhyeok/react-native-esbuild/commit/92a8f6003f04a650e3f1a5406e33cb8573232d85))

### Bug Fixes

- circular dependency ([f764fe5](https://github.com/leegeunhyeok/react-native-esbuild/commit/f764fe51c4ec31efd8c89826200bbe275f956e86))
- process exit when error occurred ([a0ef5ab](https://github.com/leegeunhyeok/react-native-esbuild/commit/a0ef5ab055cab1828fe763473992d995bc65e23d))
- set react-native as external module ([add4a20](https://github.com/leegeunhyeok/react-native-esbuild/commit/add4a20a3de08c26d42f39afab20c1a890a9939b))
- typescript config for build ([9cb2bfc](https://github.com/leegeunhyeok/react-native-esbuild/commit/9cb2bfc74ee3934a43464788a2af89e203bbaa4b))

### Build System

- add esbuild and add config for build cli ([18c541b](https://github.com/leegeunhyeok/react-native-esbuild/commit/18c541badad24585a5e7f2e1948499ff25dd717d))
- add esbuild scripts ([b38b2c0](https://github.com/leegeunhyeok/react-native-esbuild/commit/b38b2c06bf7f8594fd17675c8d23e38a7f1678fb))
- change base build config ([752e15a](https://github.com/leegeunhyeok/react-native-esbuild/commit/752e15af5560c6f5648344a2695257e819045d95))

### Miscellaneous Chores

- add dist directory to publish files ([1abbee2](https://github.com/leegeunhyeok/react-native-esbuild/commit/1abbee2dd1560ac7166903362c220263cd5d895a))
- add license ([20952d7](https://github.com/leegeunhyeok/react-native-esbuild/commit/20952d750b3f76a0377adc65b10b4d09a9eaf400))
- add packages ([a2076de](https://github.com/leegeunhyeok/react-native-esbuild/commit/a2076def60774fb9b39cfe90f5af35b44148a46f))
- add prepack scripts ([3baa83b](https://github.com/leegeunhyeok/react-native-esbuild/commit/3baa83b9ce539c7c797a959a829aaf0e95d0d6d2))
- add prettierignore ([8950cab](https://github.com/leegeunhyeok/react-native-esbuild/commit/8950caba9f58da8dd3a949fffc0fb32083401d8e))
- add react-native example project ([ed6517e](https://github.com/leegeunhyeok/react-native-esbuild/commit/ed6517e69cb71ffe2f70f05860ade0a206f07142))
- basic project setup ([f9e585f](https://github.com/leegeunhyeok/react-native-esbuild/commit/f9e585f5df4a745247f08ee8cf35e0884d18e5d1))
- commmit lint ([1468dd7](https://github.com/leegeunhyeok/react-native-esbuild/commit/1468dd72525780881921b35702b5123f4b642d70))
- create source-map package ([283a7dd](https://github.com/leegeunhyeok/react-native-esbuild/commit/283a7ddb50beda225b495e1904618ea8116d4477))
- migrate to yarn berry ([991bbb0](https://github.com/leegeunhyeok/react-native-esbuild/commit/991bbb0bd0e5c31d710ab7da2c1414d0decb1fcb))
- remove inquirer and add yargs ([9fcd1cf](https://github.com/leegeunhyeok/react-native-esbuild/commit/9fcd1cfa6cea6adcfb3618de14aa9354999e7061))
- set client to yarn ([c9df883](https://github.com/leegeunhyeok/react-native-esbuild/commit/c9df8839b15a1b8617386c51f117f7214a935784))
- update description ([b7f60e2](https://github.com/leegeunhyeok/react-native-esbuild/commit/b7f60e29b2f8d7933998ec6edac7ef0cbd8517a2))
- update gitignore ([063886b](https://github.com/leegeunhyeok/react-native-esbuild/commit/063886b872403d8ae0e1c0108c9412b6c3a048d4))
- update module resolve fields ([afb6a74](https://github.com/leegeunhyeok/react-native-esbuild/commit/afb6a749019a617591254106389448d5035e5ae0))
- update peer deps versions ([1aa7cb0](https://github.com/leegeunhyeok/react-native-esbuild/commit/1aa7cb0eca4e90ca15deb2667dc4946ae1cc3cd7))
- update tsconfig for type declaration ([7458d94](https://github.com/leegeunhyeok/react-native-esbuild/commit/7458d945fb3e8c3a5a7b29a00eda197556a5fa5d))

### Code Refactoring

- add prettier rules and apply eslint ([1d82f86](https://github.com/leegeunhyeok/react-native-esbuild/commit/1d82f869c0233c4c4320425eca35506b7bf7d441))
- change custom option variable names ([a0060dc](https://github.com/leegeunhyeok/react-native-esbuild/commit/a0060dcd3a59dc2899cbda90980c5c3aeb38de18))
- change shared script filename ([14096ca](https://github.com/leegeunhyeok/react-native-esbuild/commit/14096ca196e5ea63bcd4a4f98ecafdf21069f208))
- **cli:** split cli modules ([44e1973](https://github.com/leegeunhyeok/react-native-esbuild/commit/44e1973fbd46f3df4895acc2880d4a1c00ce00dc))
- **config:** change swc config builder name ([da39399](https://github.com/leegeunhyeok/react-native-esbuild/commit/da39399595b0a686316146c2d91ec0c5c6ad5bdc))
- **config:** improve swc option builder ([6dc328a](https://github.com/leegeunhyeok/react-native-esbuild/commit/6dc328a6693edcb58d2a29dd401a4814430fb014))
- **core:** split bundler module ([17c5f62](https://github.com/leegeunhyeok/react-native-esbuild/commit/17c5f62f31340788a21923f47d2f1e258c668b17))
