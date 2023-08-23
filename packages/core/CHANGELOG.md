# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.0-alpha.30](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.29...v0.1.0-alpha.30) (2023-08-23)


### Features

* add @react-native-esubild/transformer package ([8845c76](https://github.com/leegeunhyeok/react-native-esbuild/commit/8845c76ae026bc103e7adbb6083a5809a7fb46f5))
* change global object name ([08d9931](https://github.com/leegeunhyeok/react-native-esbuild/commit/08d9931712693e30a35ce6c38549c07f17fd3e13))
* indent initial scripts ([bc1c9f0](https://github.com/leegeunhyeok/react-native-esbuild/commit/bc1c9f0e01a80a02e9bad068b867d4bbe13e5c02))
* minify polyfills ([2e989e2](https://github.com/leegeunhyeok/react-native-esbuild/commit/2e989e2c07053b59407e8607081aa48c719e5a8e))


### Performance Improvements

* simplify transform polyfills ([4b2a328](https://github.com/leegeunhyeok/react-native-esbuild/commit/4b2a328f4d8f056b5f16a140d39f669c2b62ca75))



## [0.1.0-alpha.29](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.28...v0.1.0-alpha.29) (2023-08-17)


### Features

* inject react native polyfills only once ([5b54909](https://github.com/leegeunhyeok/react-native-esbuild/commit/5b5490943ba7a7ea9bdda6d76281b3752224e36d))


### Performance Improvements

* do not rebuild when each bundle or sourcemap requests ([0fd58e2](https://github.com/leegeunhyeok/react-native-esbuild/commit/0fd58e25ddec6dcbd433bb94ce6c496be7ccc5f4))


### Miscellaneous Chores

* bump version up pacakges ([e235610](https://github.com/leegeunhyeok/react-native-esbuild/commit/e235610379fbf8f5c6978ecded5dbe6549834975))


### Code Refactoring

* relocate internal directory ([03e6c06](https://github.com/leegeunhyeok/react-native-esbuild/commit/03e6c060c6263a27b36107166f9a8d689e4579c9))
* relocate transformers ([8a2a19c](https://github.com/leegeunhyeok/react-native-esbuild/commit/8a2a19c4cf1695888fac2828807dddeeb014b7c8))
* update transformer context type ([2c78cf5](https://github.com/leegeunhyeok/react-native-esbuild/commit/2c78cf549bb3d876a06c59d06ab5b85f77170471))



## [0.1.0-alpha.28](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.27...v0.1.0-alpha.28) (2023-08-15)


### Features

* handle for sourcemap request ([ca92e0c](https://github.com/leegeunhyeok/react-native-esbuild/commit/ca92e0ca801927061f73dc972b8088b10c264a98))



## [0.1.0-alpha.26](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.25...v0.1.0-alpha.26) (2023-08-10)


### Features

* add on, off type definition ([91873e8](https://github.com/leegeunhyeok/react-native-esbuild/commit/91873e8235711466c2bae381448bdaa6e247ff83))
* **core:** add build-status-change event ([a19ff22](https://github.com/leegeunhyeok/react-native-esbuild/commit/a19ff227b2aa0a1b1a40a759b3b2ee576ced485a))
* now support multipart/mixed response for send bundle ([cc60cc8](https://github.com/leegeunhyeok/react-native-esbuild/commit/cc60cc891f3a4bb061ad5632734b13d63c165c63))
* update build-end event payload ([e0c641b](https://github.com/leegeunhyeok/react-native-esbuild/commit/e0c641bb5fac33a10a7943f1a3d46850c3eb9853))


### Bug Fixes

* **core:** build twice when build-end event was fired ([0d06678](https://github.com/leegeunhyeok/react-native-esbuild/commit/0d06678434460791dc063f0126bdfafd92e1b340))


### Code Refactoring

* **core:** add type definition of event emitter ([722c89e](https://github.com/leegeunhyeok/react-native-esbuild/commit/722c89ed025da67ced0cc80a286b3abfb66ceb8a))
* rename bitwiseOptions to getIdByOptions ([8055d6a](https://github.com/leegeunhyeok/react-native-esbuild/commit/8055d6a32e1f716615bd91385931ee99b5cf0d83))
* rename taskId to id ([1a75b1f](https://github.com/leegeunhyeok/react-native-esbuild/commit/1a75b1f28d1d72dbf9b84ccca8b4d6290d2815b3))
* rename to BundleMode ([b2d3563](https://github.com/leegeunhyeok/react-native-esbuild/commit/b2d3563cd9ee5b05a37b138d2efbe7d39fdbff4e))



## [0.1.0-alpha.22](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.21...v0.1.0-alpha.22) (2023-08-09)


### Features

* add root ([acde580](https://github.com/leegeunhyeok/react-native-esbuild/commit/acde580db75bffd27e5c12ea11d483bc585ea87a))
* add root option to transformers ([68c8c52](https://github.com/leegeunhyeok/react-native-esbuild/commit/68c8c524daa458fad5d5f060ffcaba3ca40b2344))
* add setEnvironment ([2372662](https://github.com/leegeunhyeok/react-native-esbuild/commit/237266258553547e7638d6b499aa44e40f33e37f))



## [0.1.0-alpha.21](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.20...v0.1.0-alpha.21) (2023-08-08)


### Performance Improvements

* improve regexp ([5202582](https://github.com/leegeunhyeok/react-native-esbuild/commit/5202582535d4bff46f3b9a44d12ab9a83c924d36))



## [0.1.0-alpha.20](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2023-08-06)


### Bug Fixes

* **core:** assert bundle task in watch mode ([65d7dbe](https://github.com/leegeunhyeok/react-native-esbuild/commit/65d7dbe7c86a4edb1a5b7e76820f125de1ac9fb6))



## [0.1.0-alpha.19](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2023-08-06)


### Features

* **core:** support platform scoped bundle ([1a7094b](https://github.com/leegeunhyeok/react-native-esbuild/commit/1a7094b51c1327fff6708f32638a78c078a74914))



## [0.1.0-alpha.18](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.17...v0.1.0-alpha.18) (2023-08-05)


### Features

* add bitwiseOptions ([786191d](https://github.com/leegeunhyeok/react-native-esbuild/commit/786191df504bba61c71685196e82d2b2ba4e268d))
* add mode to plugin context ([4dd2218](https://github.com/leegeunhyeok/react-native-esbuild/commit/4dd2218efcf3446a9ab516c9ab802bcefcb346ec))
* add scoped cache system ([8d1f0bd](https://github.com/leegeunhyeok/react-native-esbuild/commit/8d1f0bd3235f977a73f1f3725ce393fae244cf97))
* add taskId to plugin context ([5c64d22](https://github.com/leegeunhyeok/react-native-esbuild/commit/5c64d2284ade22fa24f11e3d10a17bc1d63b20ca))
* check cache directory is exist ([1c273ef](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c273efe52aed75fb5ddd21b8937fa4adf8064aa))
* **core:** improve file system caching ([0ed3ebb](https://github.com/leegeunhyeok/react-native-esbuild/commit/0ed3ebbe2d547935f2b686d56dd1a04ef801d3d9))


### Miscellaneous Chores

* add cleanup script ([0f03232](https://github.com/leegeunhyeok/react-native-esbuild/commit/0f032326ad5a412942b77f40130d38a3efeff472))


### Code Refactoring

* change to return statement ([dc9a7bb](https://github.com/leegeunhyeok/react-native-esbuild/commit/dc9a7bb2e2df1430aa0986caaf6813d420d44245))
* cleanup bundle config ([36ebd85](https://github.com/leegeunhyeok/react-native-esbuild/commit/36ebd85b16d68561847d55377fcadaa2217bb4c0))
* improve config types ([4bacba6](https://github.com/leegeunhyeok/react-native-esbuild/commit/4bacba65c9609191490d89b488a9e00d3127ef38))
* improve plugin registration ([e292ebb](https://github.com/leegeunhyeok/react-native-esbuild/commit/e292ebb826bfa26d6ad84ad9d01aa02395357ed7))



## [0.1.0-alpha.17](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2023-08-04)


### Code Refactoring

* clear spinner when build end ([d29e749](https://github.com/leegeunhyeok/react-native-esbuild/commit/d29e7492d13b25132fd47493d6093c34c13f31d5))



## [0.1.0-alpha.16](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2023-08-04)


### Features

* add --reset-cache option ([3d08751](https://github.com/leegeunhyeok/react-native-esbuild/commit/3d087516a0d6e2724ee4c896d5632572d34b861c))



## [0.1.0-alpha.15](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2023-08-04)


### Features

* improve esbuild log ([fa23610](https://github.com/leegeunhyeok/react-native-esbuild/commit/fa23610b9eed876974c8dc07e90baabe405b1df1))
* skip build-end event when first build ([9f87b35](https://github.com/leegeunhyeok/react-native-esbuild/commit/9f87b35ed15b365bc74c2f515c7271ead1b108ae))


### Miscellaneous Chores

* add rimraf for cleanup build directories ([13356fe](https://github.com/leegeunhyeok/react-native-esbuild/commit/13356fec1868b7634da86bca522e987b5bee2284))



## [0.1.0-alpha.14](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2023-08-04)

**Note:** Version bump only for package @react-native-esbuild/core





## [0.1.0-alpha.13](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.12...v0.1.0-alpha.13) (2023-08-03)


### Features

* validate plugins ([a5b722c](https://github.com/leegeunhyeok/react-native-esbuild/commit/a5b722c48c31d5630aeac760f9ddc44f76e89e98))



## [0.1.0-alpha.12](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.11...v0.1.0-alpha.12) (2023-08-03)


### Features

* **core:** add caching feature ([ccf193d](https://github.com/leegeunhyeok/react-native-esbuild/commit/ccf193d1890a59ece6924a67f067782ca1507b4c))
* **core:** add plugins option for customizing ([9b884cc](https://github.com/leegeunhyeok/react-native-esbuild/commit/9b884cc42e2ff19bb9514ca04f865f9b4472b623))
* **core:** extends event emitter for subscribe events ([cf91ef0](https://github.com/leegeunhyeok/react-native-esbuild/commit/cf91ef0729fd9dbfa9e83587f1b57cc3684a1468))


### Code Refactoring

* add registerPlugins ([263219f](https://github.com/leegeunhyeok/react-native-esbuild/commit/263219f629b8535a1928e3ef5e87dc0ce797fe9d))
* **core:** move build-status-plugin to core ([7d23543](https://github.com/leegeunhyeok/react-native-esbuild/commit/7d2354325cdd52b014aecaaa327071300877a1fc))



## [0.1.0-alpha.11](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2023-08-03)


### Code Refactoring

* using colors in utils ([1c844fc](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c844fcd7bf8adf4daf0ca4793d6c5151e3c33cf))


### Miscellaneous Chores

* change description text ([d771d4b](https://github.com/leegeunhyeok/react-native-esbuild/commit/d771d4b080cabbb45b36693c032b467f26bcf984))



## [0.1.0-alpha.10](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2023-08-01)


### Features

* **plugins:** implement asset-register-plugin ([9237cb4](https://github.com/leegeunhyeok/react-native-esbuild/commit/9237cb4802ffe4d9c2696292e6a63d276a1f44e1))



## [0.1.0-alpha.9](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2023-07-31)


### Features

* add ascii logo ([3e462be](https://github.com/leegeunhyeok/react-native-esbuild/commit/3e462bebc876961618a93ace12526e816d34150e))
* add logger to packages ([fa789d0](https://github.com/leegeunhyeok/react-native-esbuild/commit/fa789d0d9414ec6356f5bf223960754027766be9))
* change assetsDest to assetsDir ([2ec231b](https://github.com/leegeunhyeok/react-native-esbuild/commit/2ec231b7a63ee68f0acb9c16fba5dea6f355b62a))
* improve configs and implement start command ([936d33b](https://github.com/leegeunhyeok/react-native-esbuild/commit/936d33b2f916c22410aa7241ae53b634f83116ee))
* isCI moved to utils ([27415bc](https://github.com/leegeunhyeok/react-native-esbuild/commit/27415bc78c686fa00b85f4e2687e402e49aaf51b))
* now load config file before bundle ([7449cf3](https://github.com/leegeunhyeok/react-native-esbuild/commit/7449cf361dcba4e2e3425516bbcb594b7533f399))


### Miscellaneous Chores

* change bundler description ([2e1432b](https://github.com/leegeunhyeok/react-native-esbuild/commit/2e1432bba7db39e7f09ad4915502718aec247fea))


### Code Refactoring

* using buildStatusPlugin ([3289c4f](https://github.com/leegeunhyeok/react-native-esbuild/commit/3289c4f013eae9b585e92b61752a576aeb18e85c))



## [0.1.0-alpha.8](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2023-07-29)


### Reverts

* Revert "chore: change type to module" ([96c32ee](https://github.com/leegeunhyeok/react-native-esbuild/commit/96c32ee767cb0553b0bbe0ba3c631da3dbc308bf))



## [0.1.0-alpha.7](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2023-07-29)


### Miscellaneous Chores

* change type to module ([6d63e8a](https://github.com/leegeunhyeok/react-native-esbuild/commit/6d63e8af31f4e485247add463142d81f86c0c0b2))



## [0.1.0-alpha.6](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.5...v0.1.0-alpha.6) (2023-07-29)

**Note:** Version bump only for package @react-native-esbuild/core





## [0.1.0-alpha.5](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2023-07-29)

**Note:** Version bump only for package @react-native-esbuild/core





## [0.1.0-alpha.3](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2023-07-29)


### Features

* **config:** add outfile to esbuild config ([638e6a2](https://github.com/leegeunhyeok/react-native-esbuild/commit/638e6a27c1f48c5d3ab76bfb63cdc13682d92842))
* **core:** add plugins to bundler ([107c869](https://github.com/leegeunhyeok/react-native-esbuild/commit/107c869d07479c75dea8df52b30265c3a4a76fcd))


### Miscellaneous Chores

* add react-native to peer deps ([22baf4b](https://github.com/leegeunhyeok/react-native-esbuild/commit/22baf4b928d2ab87388a04c300777c7a379f0f1f))



## [0.1.0-alpha.2](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2023-07-29)


### Bug Fixes

* wrong dependencies relations ([1df14b1](https://github.com/leegeunhyeok/react-native-esbuild/commit/1df14b1b06627bda74b4aa52df1a19ab72ba840b))



## 0.1.0-alpha.1 (2023-07-29)


### Features

* **core:** add request bundle option ([5a76eca](https://github.com/leegeunhyeok/react-native-esbuild/commit/5a76ecac1e07211c95ec356e5829bb0f671009c9))
* **core:** implement base core module ([b8e7d35](https://github.com/leegeunhyeok/react-native-esbuild/commit/b8e7d35753b45b015a0009cb9919429348e6f50c))
* **core:** now throw signal when task is not started yet ([8a9f5dd](https://github.com/leegeunhyeok/react-native-esbuild/commit/8a9f5dd692799d43b672d8af496696d61f79a12f))


### Bug Fixes

* circular dependency ([f764fe5](https://github.com/leegeunhyeok/react-native-esbuild/commit/f764fe51c4ec31efd8c89826200bbe275f956e86))
* process exit when error occurred ([a0ef5ab](https://github.com/leegeunhyeok/react-native-esbuild/commit/a0ef5ab055cab1828fe763473992d995bc65e23d))


### Build System

* add esbuild scripts ([b38b2c0](https://github.com/leegeunhyeok/react-native-esbuild/commit/b38b2c06bf7f8594fd17675c8d23e38a7f1678fb))
* change base build config ([752e15a](https://github.com/leegeunhyeok/react-native-esbuild/commit/752e15af5560c6f5648344a2695257e819045d95))


### Code Refactoring

* **core:** split bundler module ([17c5f62](https://github.com/leegeunhyeok/react-native-esbuild/commit/17c5f62f31340788a21923f47d2f1e258c668b17))


### Miscellaneous Chores

* add dist directory to publish files ([1abbee2](https://github.com/leegeunhyeok/react-native-esbuild/commit/1abbee2dd1560ac7166903362c220263cd5d895a))
* add prepack scripts ([3baa83b](https://github.com/leegeunhyeok/react-native-esbuild/commit/3baa83b9ce539c7c797a959a829aaf0e95d0d6d2))
* basic project setup ([f9e585f](https://github.com/leegeunhyeok/react-native-esbuild/commit/f9e585f5df4a745247f08ee8cf35e0884d18e5d1))
* update description ([b7f60e2](https://github.com/leegeunhyeok/react-native-esbuild/commit/b7f60e29b2f8d7933998ec6edac7ef0cbd8517a2))
* update module resolve fields ([afb6a74](https://github.com/leegeunhyeok/react-native-esbuild/commit/afb6a749019a617591254106389448d5035e5ae0))
* update peer deps versions ([1aa7cb0](https://github.com/leegeunhyeok/react-native-esbuild/commit/1aa7cb0eca4e90ca15deb2667dc4946ae1cc3cd7))
* update tsconfig for type declaration ([7458d94](https://github.com/leegeunhyeok/react-native-esbuild/commit/7458d945fb3e8c3a5a7b29a00eda197556a5fa5d))
