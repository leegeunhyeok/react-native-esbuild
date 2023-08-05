# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.0-alpha.18](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.17...v0.1.0-alpha.18) (2023-08-05)


### Features

* add bitwiseOptions ([786191d](https://github.com/leegeunhyeok/react-native-esbuild/commit/786191df504bba61c71685196e82d2b2ba4e268d))
* add scoped cache system ([8d1f0bd](https://github.com/leegeunhyeok/react-native-esbuild/commit/8d1f0bd3235f977a73f1f3725ce393fae244cf97))


### Miscellaneous Chores

* add cleanup script ([0f03232](https://github.com/leegeunhyeok/react-native-esbuild/commit/0f032326ad5a412942b77f40130d38a3efeff472))


### Code Refactoring

* improve config types ([4bacba6](https://github.com/leegeunhyeok/react-native-esbuild/commit/4bacba65c9609191490d89b488a9e00d3127ef38))
* separate config modules ([ce6d02d](https://github.com/leegeunhyeok/react-native-esbuild/commit/ce6d02d5c5e597469e75c8c6864b553afd53b501))



## [0.1.0-alpha.17](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2023-08-04)


### Code Refactoring

* remove cache option and now following dev option ([0bd385a](https://github.com/leegeunhyeok/react-native-esbuild/commit/0bd385a5931ddc69e258415d7f876bb96b6185de))



## [0.1.0-alpha.16](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2023-08-04)


### Features

* add transform options ([018a731](https://github.com/leegeunhyeok/react-native-esbuild/commit/018a7312679bfed118e6d26ffede696b293f4cb7))



## [0.1.0-alpha.15](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2023-08-04)


### Features

* improve esbuild log ([fa23610](https://github.com/leegeunhyeok/react-native-esbuild/commit/fa23610b9eed876974c8dc07e90baabe405b1df1))


### Miscellaneous Chores

* add rimraf for cleanup build directories ([13356fe](https://github.com/leegeunhyeok/react-native-esbuild/commit/13356fec1868b7634da86bca522e987b5bee2284))



## [0.1.0-alpha.14](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2023-08-04)


### Features

* add svg-transform-plugin ([0526207](https://github.com/leegeunhyeok/react-native-esbuild/commit/05262075d33d8df24a392e731a418435cf74c2bd))



## [0.1.0-alpha.12](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.11...v0.1.0-alpha.12) (2023-08-03)


### Code Refactoring

* add registerPlugins ([263219f](https://github.com/leegeunhyeok/react-native-esbuild/commit/263219f629b8535a1928e3ef5e87dc0ce797fe9d))
* **core:** move build-status-plugin to core ([7d23543](https://github.com/leegeunhyeok/react-native-esbuild/commit/7d2354325cdd52b014aecaaa327071300877a1fc))



## [0.1.0-alpha.11](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2023-08-03)


### Features

* copying assets when build complete ([db10be1](https://github.com/leegeunhyeok/react-native-esbuild/commit/db10be14be375910835def9efd07bf7e3efe6398))


### Bug Fixes

* **core:** change react native initialize order ([81b5a30](https://github.com/leegeunhyeok/react-native-esbuild/commit/81b5a3033d0f478dea69a20b2922b0e7bf736858))



## [0.1.0-alpha.10](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2023-08-01)


### Features

* **plugins:** implement asset-register-plugin ([9237cb4](https://github.com/leegeunhyeok/react-native-esbuild/commit/9237cb4802ffe4d9c2696292e6a63d276a1f44e1))



## [0.1.0-alpha.9](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2023-07-31)


### Features

* add core options ([3743760](https://github.com/leegeunhyeok/react-native-esbuild/commit/3743760d285b7e55db1cc634b53800be36c05d1d))
* change assetsDest to assetsDir ([2ec231b](https://github.com/leegeunhyeok/react-native-esbuild/commit/2ec231b7a63ee68f0acb9c16fba5dea6f355b62a))
* improve configs and implement start command ([936d33b](https://github.com/leegeunhyeok/react-native-esbuild/commit/936d33b2f916c22410aa7241ae53b634f83116ee))
* improve module resolution for react native polyfills ([300df3f](https://github.com/leegeunhyeok/react-native-esbuild/commit/300df3f0c6654764ed9539d13243346faa6559a9))


### Performance Improvements

* improve bundle performance ([72844d5](https://github.com/leegeunhyeok/react-native-esbuild/commit/72844d5b5d5529b1245a1642218b5ef9d41e3dd5))


### Code Refactoring

* cleanup import statement ([badc372](https://github.com/leegeunhyeok/react-native-esbuild/commit/badc372d6db1ddb8f3b68270829ea4be842c3c63))
* split config modules to each target ([f37427d](https://github.com/leegeunhyeok/react-native-esbuild/commit/f37427d3160b7eb995befbeea8116fe53cb9e1d5))



## [0.1.0-alpha.8](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2023-07-29)


### Reverts

* Revert "chore: change type to module" ([96c32ee](https://github.com/leegeunhyeok/react-native-esbuild/commit/96c32ee767cb0553b0bbe0ba3c631da3dbc308bf))



## [0.1.0-alpha.7](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2023-07-29)


### Miscellaneous Chores

* change type to module ([6d63e8a](https://github.com/leegeunhyeok/react-native-esbuild/commit/6d63e8af31f4e485247add463142d81f86c0c0b2))



## [0.1.0-alpha.5](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2023-07-29)


### Bug Fixes

* **config:** add missed esbuild options ([b1fda0d](https://github.com/leegeunhyeok/react-native-esbuild/commit/b1fda0d6e92186a3853b3c71b5687c35b13fd2e8))



## [0.1.0-alpha.3](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2023-07-29)


### Features

* **config:** add outfile to esbuild config ([638e6a2](https://github.com/leegeunhyeok/react-native-esbuild/commit/638e6a27c1f48c5d3ab76bfb63cdc13682d92842))


### Code Refactoring

* **config:** improve config types ([1c2c170](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c2c170d01c2beb2018ac745daaa3973a4368103))



## 0.1.0-alpha.1 (2023-07-29)


### Features

* add base configs for build ([3acf916](https://github.com/leegeunhyeok/react-native-esbuild/commit/3acf91623d33e9d1f8ee48568d66e57d329683ec))
* add sourcemap option ([bfb6c9e](https://github.com/leegeunhyeok/react-native-esbuild/commit/bfb6c9edc2338aa612e4f687b05d72e94bc70877))
* **core:** add request bundle option ([5a76eca](https://github.com/leegeunhyeok/react-native-esbuild/commit/5a76ecac1e07211c95ec356e5829bb0f671009c9))


### Bug Fixes

* circular dependency ([f764fe5](https://github.com/leegeunhyeok/react-native-esbuild/commit/f764fe51c4ec31efd8c89826200bbe275f956e86))
* process exit when error occurred ([a0ef5ab](https://github.com/leegeunhyeok/react-native-esbuild/commit/a0ef5ab055cab1828fe763473992d995bc65e23d))
* set react-native as external module ([add4a20](https://github.com/leegeunhyeok/react-native-esbuild/commit/add4a20a3de08c26d42f39afab20c1a890a9939b))


### Build System

* add esbuild scripts ([b38b2c0](https://github.com/leegeunhyeok/react-native-esbuild/commit/b38b2c06bf7f8594fd17675c8d23e38a7f1678fb))
* change base build config ([752e15a](https://github.com/leegeunhyeok/react-native-esbuild/commit/752e15af5560c6f5648344a2695257e819045d95))


### Code Refactoring

* change custom option variable names ([a0060dc](https://github.com/leegeunhyeok/react-native-esbuild/commit/a0060dcd3a59dc2899cbda90980c5c3aeb38de18))
* **config:** change swc config builder name ([da39399](https://github.com/leegeunhyeok/react-native-esbuild/commit/da39399595b0a686316146c2d91ec0c5c6ad5bdc))
* **config:** improve swc option builder ([6dc328a](https://github.com/leegeunhyeok/react-native-esbuild/commit/6dc328a6693edcb58d2a29dd401a4814430fb014))


### Miscellaneous Chores

* add dist directory to publish files ([1abbee2](https://github.com/leegeunhyeok/react-native-esbuild/commit/1abbee2dd1560ac7166903362c220263cd5d895a))
* add packages ([a2076de](https://github.com/leegeunhyeok/react-native-esbuild/commit/a2076def60774fb9b39cfe90f5af35b44148a46f))
* add prepack scripts ([3baa83b](https://github.com/leegeunhyeok/react-native-esbuild/commit/3baa83b9ce539c7c797a959a829aaf0e95d0d6d2))
* update tsconfig for type declaration ([7458d94](https://github.com/leegeunhyeok/react-native-esbuild/commit/7458d945fb3e8c3a5a7b29a00eda197556a5fa5d))
