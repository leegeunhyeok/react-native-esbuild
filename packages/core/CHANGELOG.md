# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.0-alpha.42](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.12...v0.1.0-alpha.42) (2023-10-27)

### Features

- implements hot reload ([4d99921](https://github.com/leegeunhyeok/react-native-esbuild/commit/4d9992124a7207dca378d4a115476f14102b5811)), closes [#38](https://github.com/leegeunhyeok/react-native-esbuild/issues/38)

### Miscellaneous Chores

- lint error fix ([30fcbd1](https://github.com/leegeunhyeok/react-native-esbuild/commit/30fcbd1eeca38b4160e3338fd47b140f420ada17))

### Code Refactoring

- add module metadata ([a960c14](https://github.com/leegeunhyeok/react-native-esbuild/commit/a960c14dd358390e4dfa9037382b098bed185a09))

## [0.1.0-beta.12](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.11...v0.1.0-beta.12) (2023-10-25)

### Features

- skip printing logo in jest worker ([c9c7daa](https://github.com/leegeunhyeok/react-native-esbuild/commit/c9c7daa00639bec38121aa9bf35c3e559a01a95e))

## [0.1.0-beta.11](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.10...v0.1.0-beta.11) (2023-10-25)

### Build System

- **deps:** bump version up packages ([09e5ba3](https://github.com/leegeunhyeok/react-native-esbuild/commit/09e5ba3314e668de48284ac115229292e282a085))

## [0.1.0-beta.10](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.9...v0.1.0-beta.10) (2023-10-24)

### Features

- add logger.nl ([82ac30e](https://github.com/leegeunhyeok/react-native-esbuild/commit/82ac30ec26498efc848820cfb300605d337804d5))
- improve build status log ([e25578f](https://github.com/leegeunhyeok/react-native-esbuild/commit/e25578f6d72311133b2a92274f20eaed400e5892))
- **jest:** add @react-native-esbuild/jest ([53b1874](https://github.com/leegeunhyeok/react-native-esbuild/commit/53b1874fbdaa639b4f21ac0394285317075288c5))
- remove convertSvg and enable it by default ([f2d068a](https://github.com/leegeunhyeok/react-native-esbuild/commit/f2d068a686b4809cad19743cc3bf08d13cca4f49))
- reset cache after initialize ([1856495](https://github.com/leegeunhyeok/react-native-esbuild/commit/1856495a6448a2640544ec58ed08b552e4946036))
- **transformer:** add sync transformer ([b591d39](https://github.com/leegeunhyeok/react-native-esbuild/commit/b591d39af4eb3c6483f345c190561d879ea1429a))

### Miscellaneous Chores

- remove unused code and update comments ([7e03116](https://github.com/leegeunhyeok/react-native-esbuild/commit/7e03116882a9018fdeef1cd137bcc4b169d24d54))
- update prepack script ([7c155dd](https://github.com/leegeunhyeok/react-native-esbuild/commit/7c155dd1190b3909112895bed8e2fbc916559b6f))

### Code Refactoring

- add plugin presets ([383bc9d](https://github.com/leegeunhyeok/react-native-esbuild/commit/383bc9dec38bc5e08c2247c8b24e748e582bd524))
- enable strictBindCallApply and update bind functions ([114a94d](https://github.com/leegeunhyeok/react-native-esbuild/commit/114a94d866ae2389685f3d03dc67e2524be46447))
- enhance load configuration ([de388d1](https://github.com/leegeunhyeok/react-native-esbuild/commit/de388d1acecde85166c382588b266a72ffd7f8e0))
- function based transformer presets ([fb56af9](https://github.com/leegeunhyeok/react-native-esbuild/commit/fb56af93c9a014be97b53965001d7b62a1e74749))
- import orders ([26d4e45](https://github.com/leegeunhyeok/react-native-esbuild/commit/26d4e454abb89b1b7d2e0eadaf15b27b124a34b5))
- move transformer types and add transform rule helpers ([b6d08d2](https://github.com/leegeunhyeok/react-native-esbuild/commit/b6d08d23fc0e265430bdcd30839a8035cbf0b3f0))
- **transformer:** add transform option presets ([4596996](https://github.com/leegeunhyeok/react-native-esbuild/commit/45969965bf3528a3a6c79d2edfd8b19f2814ad97))
- **transformer:** remove custom options ([2ca9a8b](https://github.com/leegeunhyeok/react-native-esbuild/commit/2ca9a8bb2256aba592a2c4f1357204b714f5ccf5))

## [0.1.0-beta.9](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.8...v0.1.0-beta.9) (2023-10-22)

### Features

- add resolver extension configs ([3c303fa](https://github.com/leegeunhyeok/react-native-esbuild/commit/3c303faff1214d8201789c47e8ac78ef17879e8b))
- add SharedStorage ([50c64c1](https://github.com/leegeunhyeok/react-native-esbuild/commit/50c64c1d239322882ffe50a57b8470189367c494))
- **core:** add resolver config ([f8e753d](https://github.com/leegeunhyeok/react-native-esbuild/commit/f8e753d1681852e96598e9d2cc8de06e2a4e9693))
- initialize before serve ([8993689](https://github.com/leegeunhyeok/react-native-esbuild/commit/899368955fe939c65689d833ef76799ecab61c66))
- supports task boundary shared data ([a8d91c8](https://github.com/leegeunhyeok/react-native-esbuild/commit/a8d91c88c5079acbae3f1b554527893f48e27945))

### Bug Fixes

- set watcher shared data only on change event ([7ff0675](https://github.com/leegeunhyeok/react-native-esbuild/commit/7ff06759b093437e4ada7d1cd4e84ffcedf66ef0))

### Miscellaneous Chores

- change react-native peer deps version to any ([7b2570b](https://github.com/leegeunhyeok/react-native-esbuild/commit/7b2570ba51ffaa5027b54a4782d3d49db614faa6))
- remove unused directive and log ([67fb681](https://github.com/leegeunhyeok/react-native-esbuild/commit/67fb681392cd6770da9b0ae24998e5e3ecc35679))

### Code Refactoring

- add Storage interface ([d27172a](https://github.com/leegeunhyeok/react-native-esbuild/commit/d27172a9b5e2eca1d85a625fadfdab73ca4ca696))
- handle errors and type assertions ([486ee8c](https://github.com/leegeunhyeok/react-native-esbuild/commit/486ee8c05f2910f90c29335d8a58c1e9987737e2))
- move transformer options to each tranform module ([5d8cc9b](https://github.com/leegeunhyeok/react-native-esbuild/commit/5d8cc9ba0e870e47cbbd4d8591f1bc643df1f25c))
- rename getBundle to getBundleResult ([b293094](https://github.com/leegeunhyeok/react-native-esbuild/commit/b293094000dbac39e8b77e6ba9854ce455ef0795))

### Build System

- **deps:** bump version up transform packages ([205d3ff](https://github.com/leegeunhyeok/react-native-esbuild/commit/205d3ff2dc0c8df62e3d0ddfce2576e726256c94))

## [0.1.0-beta.8](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.7...v0.1.0-beta.8) (2023-10-10)

### Bug Fixes

- **core:** post processing skipped ([0adb206](https://github.com/leegeunhyeok/react-native-esbuild/commit/0adb206e66ea453a20a1e216430af12e2b82a509))

## [0.1.0-beta.7](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.6...v0.1.0-beta.7) (2023-10-10)

### Bug Fixes

- **core:** exit on build successful in bundle mode ([5dbc68c](https://github.com/leegeunhyeok/react-native-esbuild/commit/5dbc68cb22d5c6f7edf66dee16f3b05f197f3cf8))

## [0.1.0-beta.6](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.5...v0.1.0-beta.6) (2023-10-09)

### Features

- add config option ([5ccf07b](https://github.com/leegeunhyeok/react-native-esbuild/commit/5ccf07be808b5c8b22f1e516e5757e3f968dc365))
- supports symbolicate for web ([4a63b94](https://github.com/leegeunhyeok/react-native-esbuild/commit/4a63b941aa4bb497cfbc937c88c99d3ce844f9d9))

### Code Refactoring

- move some utilities to static methods ([5660f79](https://github.com/leegeunhyeok/react-native-esbuild/commit/5660f793bb2bf34842afa781bec37fda4d0fc01c))
- remove useless log ([2f5d825](https://github.com/leegeunhyeok/react-native-esbuild/commit/2f5d8252911f7303a03f275ac90d4385cae64f9b))

## [0.1.0-beta.5](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.4...v0.1.0-beta.5) (2023-10-08)

### Miscellaneous Chores

- remove version range ([aad21c4](https://github.com/leegeunhyeok/react-native-esbuild/commit/aad21c4fa02e61db75484b89835da84c1dc7b925))

## [0.1.0-beta.4](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.3...v0.1.0-beta.4) (2023-10-08)

### Features

- add bundle progress limit up to 100 ([9383c8a](https://github.com/leegeunhyeok/react-native-esbuild/commit/9383c8a4b4db21c2366026eeb8102ef3e692a2f1))
- improve warning and error log format ([3c174a6](https://github.com/leegeunhyeok/react-native-esbuild/commit/3c174a6ca9aa85743bcbd3c933c1415afc84613f))
- print warnings and errors after build ([0a4aa3e](https://github.com/leegeunhyeok/react-native-esbuild/commit/0a4aa3e3b713e321537e42051c7b54680805a365))
- web support ([1723b0c](https://github.com/leegeunhyeok/react-native-esbuild/commit/1723b0c6b30e1c1bb1f5781cc11a093822a60f3d)), closes [#36](https://github.com/leegeunhyeok/react-native-esbuild/issues/36)

### Bug Fixes

- invalid error response on multipart type ([c65897b](https://github.com/leegeunhyeok/react-native-esbuild/commit/c65897b861862b1e4d2d4abc22fe034e70905af4))
- preserving esbuild bundle context ([43c9053](https://github.com/leegeunhyeok/react-native-esbuild/commit/43c9053febee7b7f8bf622256d1625b2e6b82dc6))

### Code Refactoring

- add summary log templates ([515121a](https://github.com/leegeunhyeok/react-native-esbuild/commit/515121ab7dc443cb99e2c615a41bd4cf188053fc))
- **cli:** parse arfv using zod ([159e6b0](https://github.com/leegeunhyeok/react-native-esbuild/commit/159e6b080589383834d8b5b8f8d4578b6265837d))
- exports esbuild label ([0bc7905](https://github.com/leegeunhyeok/react-native-esbuild/commit/0bc7905878d90b9afadb9af16db93965fcf9915a))
- literal column value to constant ([66740bb](https://github.com/leegeunhyeok/react-native-esbuild/commit/66740bb03aabb4586af21035924600e2b5804f52))

## [0.1.0-beta.3](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.2...v0.1.0-beta.3) (2023-10-04)

**Note:** Version bump only for package @react-native-esbuild/core

## [0.1.0-beta.2](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.1...v0.1.0-beta.2) (2023-10-04)

### Features

- add printVersion ([947742e](https://github.com/leegeunhyeok/react-native-esbuild/commit/947742ee1c9f43433bd187a56ec1114ae8e482da))
- improve error handling ([aab9a75](https://github.com/leegeunhyeok/react-native-esbuild/commit/aab9a754a79f5ac2d6e8ea60d5198815f23ad037)), closes [#13](https://github.com/leegeunhyeok/react-native-esbuild/issues/13)

## [0.1.0-beta.1](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-beta.0...v0.1.0-beta.1) (2023-10-03)

### ⚠ BREAKING CHANGES

- change `enabled` option to `disabled`

### Features

- add esbuild plugin configuration ([c7ef4d2](https://github.com/leegeunhyeok/react-native-esbuild/commit/c7ef4d2e9fd095b2e3cf6cca779367dbfe42156d))
- change enabled option to disabled ([09a3820](https://github.com/leegeunhyeok/react-native-esbuild/commit/09a382007092eb9b6cf6c0d287622cfe52a2b78b))
- each logger now has its own level ([3baca7e](https://github.com/leegeunhyeok/react-native-esbuild/commit/3baca7ef9c4d8820b2cf932858027a56674940d7))
- improve build progress ([cfd9ed8](https://github.com/leegeunhyeok/react-native-esbuild/commit/cfd9ed82ed31c1b49ece5a32275cd8b24f21f14f))
- improve logging ([7f93e19](https://github.com/leegeunhyeok/react-native-esbuild/commit/7f93e19a82dbadd80529356041a126698e99bcac)), closes [#26](https://github.com/leegeunhyeok/react-native-esbuild/issues/26)
- print logo when is tty environment ([a5f1a4f](https://github.com/leegeunhyeok/react-native-esbuild/commit/a5f1a4f24c17b91d3d4a6c3108576954c9599026))
- support grouped console log ([a1e7a44](https://github.com/leegeunhyeok/react-native-esbuild/commit/a1e7a4461b94e2bef33e7cfe02e614c3628445a7)), closes [#28](https://github.com/leegeunhyeok/react-native-esbuild/issues/28)

### Code Refactoring

- logger levels ([cf0e79c](https://github.com/leegeunhyeok/react-native-esbuild/commit/cf0e79cffb4965e42bcd4ee5182677e988208a9a))
- move extension constants to internal package ([be450bd](https://github.com/leegeunhyeok/react-native-esbuild/commit/be450bdfda652aa380f8873cc0b8fcc824551ad0))
- rename config types to options ([7512fae](https://github.com/leegeunhyeok/react-native-esbuild/commit/7512faeb3f7a19365bbf7f9c2ed929e7abe4f538))
- root based local cache directory ([b30e324](https://github.com/leegeunhyeok/react-native-esbuild/commit/b30e32423cf626dcaed123f4b1d55abdc726e677))

## [0.1.0-beta.0](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.39...v0.1.0-beta.0) (2023-09-25)

### Code Refactoring

- change function declaration to arrow function ([9aeae13](https://github.com/leegeunhyeok/react-native-esbuild/commit/9aeae1368cdfde8d998b85ebfd609be13b05a50f))

### Build System

- set packages as external ([dd4417f](https://github.com/leegeunhyeok/react-native-esbuild/commit/dd4417fe07c7bd87357246914743067343fdeccb)), closes [#22](https://github.com/leegeunhyeok/react-native-esbuild/issues/22)

## [0.1.0-alpha.39](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.38...v0.1.0-alpha.39) (2023-09-24)

### Features

- **core:** add reporter config ([23a7854](https://github.com/leegeunhyeok/react-native-esbuild/commit/23a78548a4faa31f76ae2b015336ad912b4a7bf6))
- improve build status logs ([fad15a5](https://github.com/leegeunhyeok/react-native-esbuild/commit/fad15a51fae4c2bbfdef5276338011ab3278a1aa))
- skip interactive message when not in tty ([098d0c6](https://github.com/leegeunhyeok/react-native-esbuild/commit/098d0c666577a4e88b6c5cc193ff6c59c5923682))

### Code Refactoring

- add logger config ([5a26157](https://github.com/leegeunhyeok/react-native-esbuild/commit/5a261577d2b9374d7a054fc32d2e2b78ecf7f812))
- **core:** event based client log reporter ([84fe917](https://github.com/leegeunhyeok/react-native-esbuild/commit/84fe917abb8cec0ebcafb0c8afcd2fdfa33a184e))
- **core:** modulize build status plugin ([d078c4c](https://github.com/leegeunhyeok/react-native-esbuild/commit/d078c4c4123c7eaaf8d6d1fcda80544014052729))
- modularization transform plugin ([e099e62](https://github.com/leegeunhyeok/react-native-esbuild/commit/e099e62678e176bb4f219c0031329722055e8cf7))
- move bundler config types to core pacakge ([0924b6f](https://github.com/leegeunhyeok/react-native-esbuild/commit/0924b6f04fe59c538d18d5f49abaedc3a61df61d))
- rename getConfig to getConfigFromGlobal ([6089254](https://github.com/leegeunhyeok/react-native-esbuild/commit/608925414bc787222fb0c7118253670bed5ba53f))

## [0.1.0-alpha.38](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.37...v0.1.0-alpha.38) (2023-09-24)

### Features

- improve configurations ([79c9a68](https://github.com/leegeunhyeok/react-native-esbuild/commit/79c9a687b63ed52244e2dc2f4a7a50f6e5983afd))

## [0.1.0-alpha.37](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.36...v0.1.0-alpha.37) (2023-09-23)

**Note:** Version bump only for package @react-native-esbuild/core

## [0.1.0-alpha.35](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.34...v0.1.0-alpha.35) (2023-09-22)

### Bug Fixes

- **core:** change to non-strict mode ([d786ee0](https://github.com/leegeunhyeok/react-native-esbuild/commit/d786ee00994331fdb0374dbae2cbd1db5691da22))

## [0.1.0-alpha.34](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.33...v0.1.0-alpha.34) (2023-09-22)

### Code Refactoring

- update build summary log format ([76d29f0](https://github.com/leegeunhyeok/react-native-esbuild/commit/76d29f082adc7fddd42902425c6ab11338f1dce5))

## [0.1.0-alpha.33](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.32...v0.1.0-alpha.33) (2023-09-22)

### Code Refactoring

- move internal helpers to pacakge ([3f377dc](https://github.com/leegeunhyeok/react-native-esbuild/commit/3f377dceadcfa719f8e9a7e249d0bfc9fbfa1fa6))
- update bundle config type ([274558e](https://github.com/leegeunhyeok/react-native-esbuild/commit/274558e958bf8c4b04abb58df5473d3470b38026))

## [0.1.0-alpha.32](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.31...v0.1.0-alpha.32) (2023-09-20)

### Features

- **cli:** now support interactive mode ([e3195cb](https://github.com/leegeunhyeok/react-native-esbuild/commit/e3195cb09eca057b1541173ea6b7400710fcc39e)), closes [#12](https://github.com/leegeunhyeok/react-native-esbuild/issues/12)

### Code Refactoring

- logging build status ([f9941b7](https://github.com/leegeunhyeok/react-native-esbuild/commit/f9941b710ae29caa1e074ae733cb268b14d3128e))

## [0.1.0-alpha.31](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.30...v0.1.0-alpha.31) (2023-09-19)

### Features

- add --metafile option for esbuild metafile ([a696fab](https://github.com/leegeunhyeok/react-native-esbuild/commit/a696fabe44e122fb866ca92d7a2518f0fd23cc0c)), closes [#8](https://github.com/leegeunhyeok/react-native-esbuild/issues/8)

### Bug Fixes

- replace stale bundle correctly when after rebuild ([2052f55](https://github.com/leegeunhyeok/react-native-esbuild/commit/2052f5563f7adb147172332506bba55311b4db19))

### Miscellaneous Chores

- bump version up packages ([b0c87fd](https://github.com/leegeunhyeok/react-native-esbuild/commit/b0c87fd8694b6c725267d66494d761809da27111))

### Code Refactoring

- apply eslint rules ([4792d4a](https://github.com/leegeunhyeok/react-native-esbuild/commit/4792d4a1662ad87fa052b93c709703a8d5f6fe46))

## [0.1.0-alpha.30](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.29...v0.1.0-alpha.30) (2023-08-23)

### Features

- add @react-native-esubild/transformer package ([8845c76](https://github.com/leegeunhyeok/react-native-esbuild/commit/8845c76ae026bc103e7adbb6083a5809a7fb46f5))
- change global object name ([08d9931](https://github.com/leegeunhyeok/react-native-esbuild/commit/08d9931712693e30a35ce6c38549c07f17fd3e13))
- indent initial scripts ([bc1c9f0](https://github.com/leegeunhyeok/react-native-esbuild/commit/bc1c9f0e01a80a02e9bad068b867d4bbe13e5c02))
- minify polyfills ([2e989e2](https://github.com/leegeunhyeok/react-native-esbuild/commit/2e989e2c07053b59407e8607081aa48c719e5a8e))

### Performance Improvements

- simplify transform polyfills ([4b2a328](https://github.com/leegeunhyeok/react-native-esbuild/commit/4b2a328f4d8f056b5f16a140d39f669c2b62ca75))

## [0.1.0-alpha.29](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.28...v0.1.0-alpha.29) (2023-08-17)

### Features

- inject react native polyfills only once ([5b54909](https://github.com/leegeunhyeok/react-native-esbuild/commit/5b5490943ba7a7ea9bdda6d76281b3752224e36d))

### Performance Improvements

- do not rebuild when each bundle or sourcemap requests ([0fd58e2](https://github.com/leegeunhyeok/react-native-esbuild/commit/0fd58e25ddec6dcbd433bb94ce6c496be7ccc5f4))

### Miscellaneous Chores

- bump version up pacakges ([e235610](https://github.com/leegeunhyeok/react-native-esbuild/commit/e235610379fbf8f5c6978ecded5dbe6549834975))

### Code Refactoring

- relocate internal directory ([03e6c06](https://github.com/leegeunhyeok/react-native-esbuild/commit/03e6c060c6263a27b36107166f9a8d689e4579c9))
- relocate transformers ([8a2a19c](https://github.com/leegeunhyeok/react-native-esbuild/commit/8a2a19c4cf1695888fac2828807dddeeb014b7c8))
- update transformer context type ([2c78cf5](https://github.com/leegeunhyeok/react-native-esbuild/commit/2c78cf549bb3d876a06c59d06ab5b85f77170471))

## [0.1.0-alpha.28](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.27...v0.1.0-alpha.28) (2023-08-15)

### Features

- handle for sourcemap request ([ca92e0c](https://github.com/leegeunhyeok/react-native-esbuild/commit/ca92e0ca801927061f73dc972b8088b10c264a98))

## [0.1.0-alpha.26](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.25...v0.1.0-alpha.26) (2023-08-10)

### Features

- add on, off type definition ([91873e8](https://github.com/leegeunhyeok/react-native-esbuild/commit/91873e8235711466c2bae381448bdaa6e247ff83))
- **core:** add build-status-change event ([a19ff22](https://github.com/leegeunhyeok/react-native-esbuild/commit/a19ff227b2aa0a1b1a40a759b3b2ee576ced485a))
- now support multipart/mixed response for send bundle ([cc60cc8](https://github.com/leegeunhyeok/react-native-esbuild/commit/cc60cc891f3a4bb061ad5632734b13d63c165c63))
- update build-end event payload ([e0c641b](https://github.com/leegeunhyeok/react-native-esbuild/commit/e0c641bb5fac33a10a7943f1a3d46850c3eb9853))

### Bug Fixes

- **core:** build twice when build-end event was fired ([0d06678](https://github.com/leegeunhyeok/react-native-esbuild/commit/0d06678434460791dc063f0126bdfafd92e1b340))

### Code Refactoring

- **core:** add type definition of event emitter ([722c89e](https://github.com/leegeunhyeok/react-native-esbuild/commit/722c89ed025da67ced0cc80a286b3abfb66ceb8a))
- rename bitwiseOptions to getIdByOptions ([8055d6a](https://github.com/leegeunhyeok/react-native-esbuild/commit/8055d6a32e1f716615bd91385931ee99b5cf0d83))
- rename taskId to id ([1a75b1f](https://github.com/leegeunhyeok/react-native-esbuild/commit/1a75b1f28d1d72dbf9b84ccca8b4d6290d2815b3))
- rename to BundleMode ([b2d3563](https://github.com/leegeunhyeok/react-native-esbuild/commit/b2d3563cd9ee5b05a37b138d2efbe7d39fdbff4e))

## [0.1.0-alpha.22](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.21...v0.1.0-alpha.22) (2023-08-09)

### Features

- add root ([acde580](https://github.com/leegeunhyeok/react-native-esbuild/commit/acde580db75bffd27e5c12ea11d483bc585ea87a))
- add root option to transformers ([68c8c52](https://github.com/leegeunhyeok/react-native-esbuild/commit/68c8c524daa458fad5d5f060ffcaba3ca40b2344))
- add setEnvironment ([2372662](https://github.com/leegeunhyeok/react-native-esbuild/commit/237266258553547e7638d6b499aa44e40f33e37f))

## [0.1.0-alpha.21](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.20...v0.1.0-alpha.21) (2023-08-08)

### Performance Improvements

- improve regexp ([5202582](https://github.com/leegeunhyeok/react-native-esbuild/commit/5202582535d4bff46f3b9a44d12ab9a83c924d36))

## [0.1.0-alpha.20](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2023-08-06)

### Bug Fixes

- **core:** assert bundle task in watch mode ([65d7dbe](https://github.com/leegeunhyeok/react-native-esbuild/commit/65d7dbe7c86a4edb1a5b7e76820f125de1ac9fb6))

## [0.1.0-alpha.19](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2023-08-06)

### Features

- **core:** support platform scoped bundle ([1a7094b](https://github.com/leegeunhyeok/react-native-esbuild/commit/1a7094b51c1327fff6708f32638a78c078a74914))

## [0.1.0-alpha.18](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.17...v0.1.0-alpha.18) (2023-08-05)

### Features

- add bitwiseOptions ([786191d](https://github.com/leegeunhyeok/react-native-esbuild/commit/786191df504bba61c71685196e82d2b2ba4e268d))
- add mode to plugin context ([4dd2218](https://github.com/leegeunhyeok/react-native-esbuild/commit/4dd2218efcf3446a9ab516c9ab802bcefcb346ec))
- add scoped cache system ([8d1f0bd](https://github.com/leegeunhyeok/react-native-esbuild/commit/8d1f0bd3235f977a73f1f3725ce393fae244cf97))
- add taskId to plugin context ([5c64d22](https://github.com/leegeunhyeok/react-native-esbuild/commit/5c64d2284ade22fa24f11e3d10a17bc1d63b20ca))
- check cache directory is exist ([1c273ef](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c273efe52aed75fb5ddd21b8937fa4adf8064aa))
- **core:** improve file system caching ([0ed3ebb](https://github.com/leegeunhyeok/react-native-esbuild/commit/0ed3ebbe2d547935f2b686d56dd1a04ef801d3d9))

### Miscellaneous Chores

- add cleanup script ([0f03232](https://github.com/leegeunhyeok/react-native-esbuild/commit/0f032326ad5a412942b77f40130d38a3efeff472))

### Code Refactoring

- change to return statement ([dc9a7bb](https://github.com/leegeunhyeok/react-native-esbuild/commit/dc9a7bb2e2df1430aa0986caaf6813d420d44245))
- cleanup bundle config ([36ebd85](https://github.com/leegeunhyeok/react-native-esbuild/commit/36ebd85b16d68561847d55377fcadaa2217bb4c0))
- improve config types ([4bacba6](https://github.com/leegeunhyeok/react-native-esbuild/commit/4bacba65c9609191490d89b488a9e00d3127ef38))
- improve plugin registration ([e292ebb](https://github.com/leegeunhyeok/react-native-esbuild/commit/e292ebb826bfa26d6ad84ad9d01aa02395357ed7))

## [0.1.0-alpha.17](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2023-08-04)

### Code Refactoring

- clear spinner when build end ([d29e749](https://github.com/leegeunhyeok/react-native-esbuild/commit/d29e7492d13b25132fd47493d6093c34c13f31d5))

## [0.1.0-alpha.16](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2023-08-04)

### Features

- add --reset-cache option ([3d08751](https://github.com/leegeunhyeok/react-native-esbuild/commit/3d087516a0d6e2724ee4c896d5632572d34b861c))

## [0.1.0-alpha.15](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2023-08-04)

### Features

- improve esbuild log ([fa23610](https://github.com/leegeunhyeok/react-native-esbuild/commit/fa23610b9eed876974c8dc07e90baabe405b1df1))
- skip build-end event when first build ([9f87b35](https://github.com/leegeunhyeok/react-native-esbuild/commit/9f87b35ed15b365bc74c2f515c7271ead1b108ae))

### Miscellaneous Chores

- add rimraf for cleanup build directories ([13356fe](https://github.com/leegeunhyeok/react-native-esbuild/commit/13356fec1868b7634da86bca522e987b5bee2284))

## [0.1.0-alpha.14](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2023-08-04)

**Note:** Version bump only for package @react-native-esbuild/core

## [0.1.0-alpha.13](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.12...v0.1.0-alpha.13) (2023-08-03)

### Features

- validate plugins ([a5b722c](https://github.com/leegeunhyeok/react-native-esbuild/commit/a5b722c48c31d5630aeac760f9ddc44f76e89e98))

## [0.1.0-alpha.12](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.11...v0.1.0-alpha.12) (2023-08-03)

### Features

- **core:** add caching feature ([ccf193d](https://github.com/leegeunhyeok/react-native-esbuild/commit/ccf193d1890a59ece6924a67f067782ca1507b4c))
- **core:** add plugins option for customizing ([9b884cc](https://github.com/leegeunhyeok/react-native-esbuild/commit/9b884cc42e2ff19bb9514ca04f865f9b4472b623))
- **core:** extends event emitter for subscribe events ([cf91ef0](https://github.com/leegeunhyeok/react-native-esbuild/commit/cf91ef0729fd9dbfa9e83587f1b57cc3684a1468))

### Code Refactoring

- add registerPlugins ([263219f](https://github.com/leegeunhyeok/react-native-esbuild/commit/263219f629b8535a1928e3ef5e87dc0ce797fe9d))
- **core:** move build-status-plugin to core ([7d23543](https://github.com/leegeunhyeok/react-native-esbuild/commit/7d2354325cdd52b014aecaaa327071300877a1fc))

## [0.1.0-alpha.11](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2023-08-03)

### Code Refactoring

- using colors in utils ([1c844fc](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c844fcd7bf8adf4daf0ca4793d6c5151e3c33cf))

### Miscellaneous Chores

- change description text ([d771d4b](https://github.com/leegeunhyeok/react-native-esbuild/commit/d771d4b080cabbb45b36693c032b467f26bcf984))

## [0.1.0-alpha.10](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2023-08-01)

### Features

- **plugins:** implement asset-register-plugin ([9237cb4](https://github.com/leegeunhyeok/react-native-esbuild/commit/9237cb4802ffe4d9c2696292e6a63d276a1f44e1))

## [0.1.0-alpha.9](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2023-07-31)

### Features

- add ascii logo ([3e462be](https://github.com/leegeunhyeok/react-native-esbuild/commit/3e462bebc876961618a93ace12526e816d34150e))
- add logger to packages ([fa789d0](https://github.com/leegeunhyeok/react-native-esbuild/commit/fa789d0d9414ec6356f5bf223960754027766be9))
- change assetsDest to assetsDir ([2ec231b](https://github.com/leegeunhyeok/react-native-esbuild/commit/2ec231b7a63ee68f0acb9c16fba5dea6f355b62a))
- improve configs and implement start command ([936d33b](https://github.com/leegeunhyeok/react-native-esbuild/commit/936d33b2f916c22410aa7241ae53b634f83116ee))
- isCI moved to utils ([27415bc](https://github.com/leegeunhyeok/react-native-esbuild/commit/27415bc78c686fa00b85f4e2687e402e49aaf51b))
- now load config file before bundle ([7449cf3](https://github.com/leegeunhyeok/react-native-esbuild/commit/7449cf361dcba4e2e3425516bbcb594b7533f399))

### Miscellaneous Chores

- change bundler description ([2e1432b](https://github.com/leegeunhyeok/react-native-esbuild/commit/2e1432bba7db39e7f09ad4915502718aec247fea))

### Code Refactoring

- using buildStatusPlugin ([3289c4f](https://github.com/leegeunhyeok/react-native-esbuild/commit/3289c4f013eae9b585e92b61752a576aeb18e85c))

## [0.1.0-alpha.8](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2023-07-29)

### Reverts

- Revert "chore: change type to module" ([96c32ee](https://github.com/leegeunhyeok/react-native-esbuild/commit/96c32ee767cb0553b0bbe0ba3c631da3dbc308bf))

## [0.1.0-alpha.7](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2023-07-29)

### Miscellaneous Chores

- change type to module ([6d63e8a](https://github.com/leegeunhyeok/react-native-esbuild/commit/6d63e8af31f4e485247add463142d81f86c0c0b2))

## [0.1.0-alpha.6](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.5...v0.1.0-alpha.6) (2023-07-29)

**Note:** Version bump only for package @react-native-esbuild/core

## [0.1.0-alpha.5](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2023-07-29)

**Note:** Version bump only for package @react-native-esbuild/core

## [0.1.0-alpha.3](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2023-07-29)

### Features

- **config:** add outfile to esbuild config ([638e6a2](https://github.com/leegeunhyeok/react-native-esbuild/commit/638e6a27c1f48c5d3ab76bfb63cdc13682d92842))
- **core:** add plugins to bundler ([107c869](https://github.com/leegeunhyeok/react-native-esbuild/commit/107c869d07479c75dea8df52b30265c3a4a76fcd))

### Miscellaneous Chores

- add react-native to peer deps ([22baf4b](https://github.com/leegeunhyeok/react-native-esbuild/commit/22baf4b928d2ab87388a04c300777c7a379f0f1f))

## [0.1.0-alpha.2](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2023-07-29)

### Bug Fixes

- wrong dependencies relations ([1df14b1](https://github.com/leegeunhyeok/react-native-esbuild/commit/1df14b1b06627bda74b4aa52df1a19ab72ba840b))

## 0.1.0-alpha.1 (2023-07-29)

### Features

- **core:** add request bundle option ([5a76eca](https://github.com/leegeunhyeok/react-native-esbuild/commit/5a76ecac1e07211c95ec356e5829bb0f671009c9))
- **core:** implement base core module ([b8e7d35](https://github.com/leegeunhyeok/react-native-esbuild/commit/b8e7d35753b45b015a0009cb9919429348e6f50c))
- **core:** now throw signal when task is not started yet ([8a9f5dd](https://github.com/leegeunhyeok/react-native-esbuild/commit/8a9f5dd692799d43b672d8af496696d61f79a12f))

### Bug Fixes

- circular dependency ([f764fe5](https://github.com/leegeunhyeok/react-native-esbuild/commit/f764fe51c4ec31efd8c89826200bbe275f956e86))
- process exit when error occurred ([a0ef5ab](https://github.com/leegeunhyeok/react-native-esbuild/commit/a0ef5ab055cab1828fe763473992d995bc65e23d))

### Build System

- add esbuild scripts ([b38b2c0](https://github.com/leegeunhyeok/react-native-esbuild/commit/b38b2c06bf7f8594fd17675c8d23e38a7f1678fb))
- change base build config ([752e15a](https://github.com/leegeunhyeok/react-native-esbuild/commit/752e15af5560c6f5648344a2695257e819045d95))

### Code Refactoring

- **core:** split bundler module ([17c5f62](https://github.com/leegeunhyeok/react-native-esbuild/commit/17c5f62f31340788a21923f47d2f1e258c668b17))

### Miscellaneous Chores

- add dist directory to publish files ([1abbee2](https://github.com/leegeunhyeok/react-native-esbuild/commit/1abbee2dd1560ac7166903362c220263cd5d895a))
- add prepack scripts ([3baa83b](https://github.com/leegeunhyeok/react-native-esbuild/commit/3baa83b9ce539c7c797a959a829aaf0e95d0d6d2))
- basic project setup ([f9e585f](https://github.com/leegeunhyeok/react-native-esbuild/commit/f9e585f5df4a745247f08ee8cf35e0884d18e5d1))
- update description ([b7f60e2](https://github.com/leegeunhyeok/react-native-esbuild/commit/b7f60e29b2f8d7933998ec6edac7ef0cbd8517a2))
- update module resolve fields ([afb6a74](https://github.com/leegeunhyeok/react-native-esbuild/commit/afb6a749019a617591254106389448d5035e5ae0))
- update peer deps versions ([1aa7cb0](https://github.com/leegeunhyeok/react-native-esbuild/commit/1aa7cb0eca4e90ca15deb2667dc4946ae1cc3cd7))
- update tsconfig for type declaration ([7458d94](https://github.com/leegeunhyeok/react-native-esbuild/commit/7458d945fb3e8c3a5a7b29a00eda197556a5fa5d))
