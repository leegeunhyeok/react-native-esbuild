# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.0-alpha.20](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.19...v0.1.0-alpha.20) (2023-08-06)


### Bug Fixes

* **core:** assert bundle task in watch mode ([65d7dbe](https://github.com/leegeunhyeok/react-native-esbuild/commit/65d7dbe7c86a4edb1a5b7e76820f125de1ac9fb6))



## [0.1.0-alpha.19](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.18...v0.1.0-alpha.19) (2023-08-06)


### Features

* **core:** support platform scoped bundle ([1a7094b](https://github.com/leegeunhyeok/react-native-esbuild/commit/1a7094b51c1327fff6708f32638a78c078a74914))


### Bug Fixes

* **cli:** reset cache alias ([8f3b969](https://github.com/leegeunhyeok/react-native-esbuild/commit/8f3b969e69348485f39cb45e25ad5e1782d80dcc))


### Performance Improvements

* improve transform performance ([42670f2](https://github.com/leegeunhyeok/react-native-esbuild/commit/42670f2bfd4d82df623d45713012ccc21bb8678e))



## [0.1.0-alpha.18](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.17...v0.1.0-alpha.18) (2023-08-05)


### Features

* add bitwiseOptions ([786191d](https://github.com/leegeunhyeok/react-native-esbuild/commit/786191df504bba61c71685196e82d2b2ba4e268d))
* add mode to plugin context ([4dd2218](https://github.com/leegeunhyeok/react-native-esbuild/commit/4dd2218efcf3446a9ab516c9ab802bcefcb346ec))
* add scoped cache system ([8d1f0bd](https://github.com/leegeunhyeok/react-native-esbuild/commit/8d1f0bd3235f977a73f1f3725ce393fae244cf97))
* add taskId to plugin context ([5c64d22](https://github.com/leegeunhyeok/react-native-esbuild/commit/5c64d2284ade22fa24f11e3d10a17bc1d63b20ca))
* add unexpected exception handler ([1c21443](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c214430e1e286cffce4cec3fed758614b782878))
* check cache directory is exist ([1c273ef](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c273efe52aed75fb5ddd21b8937fa4adf8064aa))
* **core:** improve file system caching ([0ed3ebb](https://github.com/leegeunhyeok/react-native-esbuild/commit/0ed3ebbe2d547935f2b686d56dd1a04ef801d3d9))


### Miscellaneous Chores

* add cleanup script ([0f03232](https://github.com/leegeunhyeok/react-native-esbuild/commit/0f032326ad5a412942b77f40130d38a3efeff472))


### Code Refactoring

* change server listening log level to info ([7ac6cad](https://github.com/leegeunhyeok/react-native-esbuild/commit/7ac6cada527af0f4dc183e529d8674a09eb4da9b))
* change to return statement ([dc9a7bb](https://github.com/leegeunhyeok/react-native-esbuild/commit/dc9a7bb2e2df1430aa0986caaf6813d420d44245))
* cleanup bundle config ([36ebd85](https://github.com/leegeunhyeok/react-native-esbuild/commit/36ebd85b16d68561847d55377fcadaa2217bb4c0))
* improve config types ([4bacba6](https://github.com/leegeunhyeok/react-native-esbuild/commit/4bacba65c9609191490d89b488a9e00d3127ef38))
* improve plugin registration ([e292ebb](https://github.com/leegeunhyeok/react-native-esbuild/commit/e292ebb826bfa26d6ad84ad9d01aa02395357ed7))
* separate config modules ([ce6d02d](https://github.com/leegeunhyeok/react-native-esbuild/commit/ce6d02d5c5e597469e75c8c6864b553afd53b501))



## [0.1.0-alpha.17](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.16...v0.1.0-alpha.17) (2023-08-04)


### Bug Fixes

* wrong package name regexp ([4c5ceed](https://github.com/leegeunhyeok/react-native-esbuild/commit/4c5ceed218f8c248a6ee91cf303af0bebc788153))


### Code Refactoring

* clear spinner when build end ([d29e749](https://github.com/leegeunhyeok/react-native-esbuild/commit/d29e7492d13b25132fd47493d6093c34c13f31d5))
* remove cache option and now following dev option ([0bd385a](https://github.com/leegeunhyeok/react-native-esbuild/commit/0bd385a5931ddc69e258415d7f876bb96b6185de))
* seperate transformer modules ([4e09440](https://github.com/leegeunhyeok/react-native-esbuild/commit/4e0944043438565639b866cd077c7b0a590be780))



## [0.1.0-alpha.16](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.15...v0.1.0-alpha.16) (2023-08-04)


### Features

* add --reset-cache option ([3d08751](https://github.com/leegeunhyeok/react-native-esbuild/commit/3d087516a0d6e2724ee4c896d5632572d34b861c))
* add transform options ([018a731](https://github.com/leegeunhyeok/react-native-esbuild/commit/018a7312679bfed118e6d26ffede696b293f4cb7))
* remove whitespaces end of log message ([38fea8e](https://github.com/leegeunhyeok/react-native-esbuild/commit/38fea8e7ce72c5e3784fe9b7c9b50ba2eaa31826))



## [0.1.0-alpha.15](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.14...v0.1.0-alpha.15) (2023-08-04)


### Features

* improve esbuild log ([fa23610](https://github.com/leegeunhyeok/react-native-esbuild/commit/fa23610b9eed876974c8dc07e90baabe405b1df1))
* skip build-end event when first build ([9f87b35](https://github.com/leegeunhyeok/react-native-esbuild/commit/9f87b35ed15b365bc74c2f515c7271ead1b108ae))


### Bug Fixes

* resolve relative path assets ([dcb7fb0](https://github.com/leegeunhyeok/react-native-esbuild/commit/dcb7fb0ee1a9716ceff9132e412d951385434b5a))


### Miscellaneous Chores

* add rimraf for cleanup build directories ([13356fe](https://github.com/leegeunhyeok/react-native-esbuild/commit/13356fec1868b7634da86bca522e987b5bee2284))



## [0.1.0-alpha.14](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.13...v0.1.0-alpha.14) (2023-08-04)


### Features

* add log to landing component ([9bc2a6f](https://github.com/leegeunhyeok/react-native-esbuild/commit/9bc2a6fde933f574800ca49355b9379b206d88d0))
* add svg-transform-plugin ([0526207](https://github.com/leegeunhyeok/react-native-esbuild/commit/05262075d33d8df24a392e731a418435cf74c2bd))


### Bug Fixes

* log level limitation ([0e02fab](https://github.com/leegeunhyeok/react-native-esbuild/commit/0e02fabcd89b29b347e340385c4402bb0f71c456))
* resolving sacled asset ([0fc063d](https://github.com/leegeunhyeok/react-native-esbuild/commit/0fc063d19ce331eaf59892572f43780074faf37b))


### Miscellaneous Chores

* change main banner image ([59fc546](https://github.com/leegeunhyeok/react-native-esbuild/commit/59fc54640bcdaec74d8ad66dd66c4d83baa7d5c3))



## [0.1.0-alpha.13](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.12...v0.1.0-alpha.13) (2023-08-03)


### Features

* validate plugins ([a5b722c](https://github.com/leegeunhyeok/react-native-esbuild/commit/a5b722c48c31d5630aeac760f9ddc44f76e89e98))


### Bug Fixes

* missing hash ([466c957](https://github.com/leegeunhyeok/react-native-esbuild/commit/466c957b08555ba62fbd94d3002dbecf9cc0808c))



## [0.1.0-alpha.12](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.11...v0.1.0-alpha.12) (2023-08-03)


### Features

* **cli:** add cache clean command ([139417e](https://github.com/leegeunhyeok/react-native-esbuild/commit/139417e0374eed625382249a89466411a84292f3))
* **core:** add caching feature ([ccf193d](https://github.com/leegeunhyeok/react-native-esbuild/commit/ccf193d1890a59ece6924a67f067782ca1507b4c))
* **core:** add plugins option for customizing ([9b884cc](https://github.com/leegeunhyeok/react-native-esbuild/commit/9b884cc42e2ff19bb9514ca04f865f9b4472b623))
* **core:** extends event emitter for subscribe events ([cf91ef0](https://github.com/leegeunhyeok/react-native-esbuild/commit/cf91ef0729fd9dbfa9e83587f1b57cc3684a1468))
* now support hot reload ([2fae39d](https://github.com/leegeunhyeok/react-native-esbuild/commit/2fae39de39e9c4976dc8ae6c24f28335877d53cc))


### Bug Fixes

* add default output path ([69b6e2a](https://github.com/leegeunhyeok/react-native-esbuild/commit/69b6e2a123818e1be2a0928fff877f8f598852dd))


### Code Refactoring

* add registerPlugins ([263219f](https://github.com/leegeunhyeok/react-native-esbuild/commit/263219f629b8535a1928e3ef5e87dc0ce797fe9d))
* **core:** move build-status-plugin to core ([7d23543](https://github.com/leegeunhyeok/react-native-esbuild/commit/7d2354325cdd52b014aecaaa327071300877a1fc))



## [0.1.0-alpha.11](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.10...v0.1.0-alpha.11) (2023-08-03)


### Features

* add background color ([b3ee50d](https://github.com/leegeunhyeok/react-native-esbuild/commit/b3ee50db843d26e422413e0d4a1e8659e625e988))
* add log level ([5ee42f4](https://github.com/leegeunhyeok/react-native-esbuild/commit/5ee42f4f64906091e474de1b6572d8196434d7cb))
* add transform condition for reanimated ([c311bff](https://github.com/leegeunhyeok/react-native-esbuild/commit/c311bff4d89fd460f61270b1a87b851585584fef))
* **cli:** update base config values ([b4da292](https://github.com/leegeunhyeok/react-native-esbuild/commit/b4da29294d6bfe719dc7b526a13d9e2d6d801a7b))
* copying assets when build complete ([db10be1](https://github.com/leegeunhyeok/react-native-esbuild/commit/db10be14be375910835def9efd07bf7e3efe6398))
* default minify option to false ([5ac5c2e](https://github.com/leegeunhyeok/react-native-esbuild/commit/5ac5c2e30815df42d162598bad55d820badaed01))
* export colors ([916e62e](https://github.com/leegeunhyeok/react-native-esbuild/commit/916e62e9ab42c6011afe99529ff08e541dc7f2b7))
* improve build status logging ([94083f9](https://github.com/leegeunhyeok/react-native-esbuild/commit/94083f9dcbf3cb8533239611f2b79939faaa5d6a))
* now sharing logger configs ([ff0a199](https://github.com/leegeunhyeok/react-native-esbuild/commit/ff0a1993fc15c6735d5abe4c403018038a20026b))
* now support client logs ([632d206](https://github.com/leegeunhyeok/react-native-esbuild/commit/632d20672e51018f603af0dde8668acddc438db4))
* read asset data from assets cache ([3ae010a](https://github.com/leegeunhyeok/react-native-esbuild/commit/3ae010a94b3c45091d2bb3017e7b3143c98b3b53))
* reset assets before build ([0531960](https://github.com/leegeunhyeok/react-native-esbuild/commit/053196060e0611bcd984bdb158e2f409c8040365))
* update demo application ([393c077](https://github.com/leegeunhyeok/react-native-esbuild/commit/393c0772f2d4c04842ec164dc6d7c770f30a43b6))


### Bug Fixes

* android build issue ([d09e0e7](https://github.com/leegeunhyeok/react-native-esbuild/commit/d09e0e7f493dad117bbe24e26c8d4b06d0efe2c1))
* **core:** change react native initialize order ([81b5a30](https://github.com/leegeunhyeok/react-native-esbuild/commit/81b5a3033d0f478dea69a20b2922b0e7bf736858))
* react-native-community packages set as external module ([4bd944a](https://github.com/leegeunhyeok/react-native-esbuild/commit/4bd944a54d5493353b195c01aafee58acba18c8c))
* using react-native internal asset registry ([081bd83](https://github.com/leegeunhyeok/react-native-esbuild/commit/081bd838e3a2265880d611cbfb7b3939d7731a9c))


### Code Refactoring

* using colors in utils ([1c844fc](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c844fcd7bf8adf4daf0ca4793d6c5151e3c33cf))


### Miscellaneous Chores

* change description text ([d771d4b](https://github.com/leegeunhyeok/react-native-esbuild/commit/d771d4b080cabbb45b36693c032b467f26bcf984))



## [0.1.0-alpha.10](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.9...v0.1.0-alpha.10) (2023-08-01)


### Features

* **dev-server:** implement serve-asset-middleware ([dd6a48a](https://github.com/leegeunhyeok/react-native-esbuild/commit/dd6a48a588da4c40e0c6bfc3805b5c1a821bf3f5))
* enhance loading spinner ([83049d1](https://github.com/leegeunhyeok/react-native-esbuild/commit/83049d1a7d7d5c0ef955aad3fe4e07e1f8d0feda))
* **plugins:** implement asset-register-plugin ([9237cb4](https://github.com/leegeunhyeok/react-native-esbuild/commit/9237cb4802ffe4d9c2696292e6a63d276a1f44e1))
* update example application ([5d5e1fc](https://github.com/leegeunhyeok/react-native-esbuild/commit/5d5e1fcd68318ca2fa3f9750a9cbff3b31ecd9e9))


### Code Refactoring

* change log level ([a86a677](https://github.com/leegeunhyeok/react-native-esbuild/commit/a86a6774f63877c093e8363c00e899b83cd45783))
* separate plugin modules ([c7b8242](https://github.com/leegeunhyeok/react-native-esbuild/commit/c7b824216dde08d06b667f3c254109c71a009ec9))



## [0.1.0-alpha.9](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.8...v0.1.0-alpha.9) (2023-07-31)


### Features

* add ascii logo ([3e462be](https://github.com/leegeunhyeok/react-native-esbuild/commit/3e462bebc876961618a93ace12526e816d34150e))
* add buildStatusPlugin ([07142c0](https://github.com/leegeunhyeok/react-native-esbuild/commit/07142c0e3863f9c1472ff45f85b86aeaf16a58ad))
* add core options ([3743760](https://github.com/leegeunhyeok/react-native-esbuild/commit/3743760d285b7e55db1cc634b53800be36c05d1d))
* add error param to stderr log ([db5b5fe](https://github.com/leegeunhyeok/react-native-esbuild/commit/db5b5fe2aae111d98242753dd30c126b6c14eac0))
* add logger to packages ([fa789d0](https://github.com/leegeunhyeok/react-native-esbuild/commit/fa789d0d9414ec6356f5bf223960754027766be9))
* change assetsDest to assetsDir ([2ec231b](https://github.com/leegeunhyeok/react-native-esbuild/commit/2ec231b7a63ee68f0acb9c16fba5dea6f355b62a))
* implement logger ([e4b85ab](https://github.com/leegeunhyeok/react-native-esbuild/commit/e4b85ab5c9c860c59b23a601db19c4407d618904))
* improve configs and implement start command ([936d33b](https://github.com/leegeunhyeok/react-native-esbuild/commit/936d33b2f916c22410aa7241ae53b634f83116ee))
* improve module resolution for react native polyfills ([300df3f](https://github.com/leegeunhyeok/react-native-esbuild/commit/300df3f0c6654764ed9539d13243346faa6559a9))
* isCI moved to utils ([27415bc](https://github.com/leegeunhyeok/react-native-esbuild/commit/27415bc78c686fa00b85f4e2687e402e49aaf51b))
* now load config file before bundle ([7449cf3](https://github.com/leegeunhyeok/react-native-esbuild/commit/7449cf361dcba4e2e3425516bbcb594b7533f399))
* **plugins:** support custom babel transforming ([aac234e](https://github.com/leegeunhyeok/react-native-esbuild/commit/aac234e4fee2a0fb30923f38c823ca518d233467))
* **utils:** add setLogLevel ([9c93cbf](https://github.com/leegeunhyeok/react-native-esbuild/commit/9c93cbf24a23f0d31cbffc311875dc9e8315f837))


### Bug Fixes

* **cli:** remove invalid options ([3d8832b](https://github.com/leegeunhyeok/react-native-esbuild/commit/3d8832b3a7155fceaddad1283b14995071002a6f))
* url parse ([b91bc5a](https://github.com/leegeunhyeok/react-native-esbuild/commit/b91bc5a45aab16d43b36a674d383b041e8fbea62))
* wrong build script ([7c00fad](https://github.com/leegeunhyeok/react-native-esbuild/commit/7c00fadfeefa412db2096be23abdfd25fa10b807))


### Performance Improvements

* improve bundle performance ([72844d5](https://github.com/leegeunhyeok/react-native-esbuild/commit/72844d5b5d5529b1245a1642218b5ef9d41e3dd5))


### Miscellaneous Chores

* add @react-native-esbuild/cli to example ([d291b53](https://github.com/leegeunhyeok/react-native-esbuild/commit/d291b53751c47104d0a839fd069c869d9b934edc))
* add @react-native-esbuild/utils ([913768a](https://github.com/leegeunhyeok/react-native-esbuild/commit/913768a7e3f67d787cf0339e2c5fac8b94cebe81))
* add react-native-esbuild config ([c0d2753](https://github.com/leegeunhyeok/react-native-esbuild/commit/c0d27539d865c2599c0f31c29fc9c138de6e5fe5))
* change bundler description ([2e1432b](https://github.com/leegeunhyeok/react-native-esbuild/commit/2e1432bba7db39e7f09ad4915502718aec247fea))
* cleanup example application ([a3f52cc](https://github.com/leegeunhyeok/react-native-esbuild/commit/a3f52cc4f5229f18e32714bdbea9730ba9146fae))
* set hoistingLimits to example ([5fbc3f6](https://github.com/leegeunhyeok/react-native-esbuild/commit/5fbc3f63ba6032a88fdc7d57eb221f4d741dad14))


### Code Refactoring

* change log levels ([521e545](https://github.com/leegeunhyeok/react-native-esbuild/commit/521e5457f9535e4551f0b44da2c19a4eb7d64156))
* cleanup import statement ([badc372](https://github.com/leegeunhyeok/react-native-esbuild/commit/badc372d6db1ddb8f3b68270829ea4be842c3c63))
* split config modules to each target ([f37427d](https://github.com/leegeunhyeok/react-native-esbuild/commit/f37427d3160b7eb995befbeea8116fe53cb9e1d5))
* update basic external modules ([75ab87c](https://github.com/leegeunhyeok/react-native-esbuild/commit/75ab87cb8536ac015024dd256eeea2a88ffdbc45))
* using buildStatusPlugin ([3289c4f](https://github.com/leegeunhyeok/react-native-esbuild/commit/3289c4f013eae9b585e92b61752a576aeb18e85c))



## [0.1.0-alpha.8](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.7...v0.1.0-alpha.8) (2023-07-29)


### Bug Fixes

* **plugins:** reference default exports module correctly ([a90c211](https://github.com/leegeunhyeok/react-native-esbuild/commit/a90c211261cc019d1f4369a396907437853da775))


### Reverts

* Revert "chore: change type to module" ([96c32ee](https://github.com/leegeunhyeok/react-native-esbuild/commit/96c32ee767cb0553b0bbe0ba3c631da3dbc308bf))


### Miscellaneous Chores

* remove unnecessary config ([83c4b03](https://github.com/leegeunhyeok/react-native-esbuild/commit/83c4b0360cbf919376e351ea9314c594ee0a65c9))



## [0.1.0-alpha.7](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.6...v0.1.0-alpha.7) (2023-07-29)


### Bug Fixes

* **plugins:** invalid load result ([63a73b2](https://github.com/leegeunhyeok/react-native-esbuild/commit/63a73b266ea7d12acccbaa1a3e39fa232447c1db))


### Miscellaneous Chores

* change type to module ([6d63e8a](https://github.com/leegeunhyeok/react-native-esbuild/commit/6d63e8af31f4e485247add463142d81f86c0c0b2))



## [0.1.0-alpha.6](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.5...v0.1.0-alpha.6) (2023-07-29)


### Bug Fixes

* **plugins:** invalid dependency relations ([8e436c3](https://github.com/leegeunhyeok/react-native-esbuild/commit/8e436c3664de8a7f98c4403a0921b969cf6672fc))



## [0.1.0-alpha.5](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.4...v0.1.0-alpha.5) (2023-07-29)


### Features

* **cli:** add entry option ([c7225cb](https://github.com/leegeunhyeok/react-native-esbuild/commit/c7225cbe29737badb4a70cd718910c39d458fa99))


### Bug Fixes

* **config:** add missed esbuild options ([b1fda0d](https://github.com/leegeunhyeok/react-native-esbuild/commit/b1fda0d6e92186a3853b3c71b5687c35b13fd2e8))


### Miscellaneous Chores

* **cli:** replace wrong scripts ([c3a5d3a](https://github.com/leegeunhyeok/react-native-esbuild/commit/c3a5d3a565effed8ab6dd1d149972e2f4b44f0be))



## [0.1.0-alpha.4](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.3...v0.1.0-alpha.4) (2023-07-29)


### Bug Fixes

* **cli:** invalid banner (shebang) ([c1d268f](https://github.com/leegeunhyeok/react-native-esbuild/commit/c1d268fecccef80465ac4042382452c1f8923869))



## [0.1.0-alpha.3](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.2...v0.1.0-alpha.3) (2023-07-29)


### Features

* **config:** add outfile to esbuild config ([638e6a2](https://github.com/leegeunhyeok/react-native-esbuild/commit/638e6a27c1f48c5d3ab76bfb63cdc13682d92842))
* **core:** add plugins to bundler ([107c869](https://github.com/leegeunhyeok/react-native-esbuild/commit/107c869d07479c75dea8df52b30265c3a4a76fcd))


### Miscellaneous Chores

* add react-native to peer deps ([22baf4b](https://github.com/leegeunhyeok/react-native-esbuild/commit/22baf4b928d2ab87388a04c300777c7a379f0f1f))


### Code Refactoring

* **config:** improve config types ([1c2c170](https://github.com/leegeunhyeok/react-native-esbuild/commit/1c2c170d01c2beb2018ac745daaa3973a4368103))
* **plugins:** rename plugins ([7fcf1a5](https://github.com/leegeunhyeok/react-native-esbuild/commit/7fcf1a52b593bbb9019d70916971357ba87c5bfa))



## [0.1.0-alpha.2](https://github.com/leegeunhyeok/react-native-esbuild/compare/v0.1.0-alpha.1...v0.1.0-alpha.2) (2023-07-29)


### Bug Fixes

* wrong dependencies relations ([1df14b1](https://github.com/leegeunhyeok/react-native-esbuild/commit/1df14b1b06627bda74b4aa52df1a19ab72ba840b))


### Miscellaneous Chores

* ignore install-state.gz ([06e43af](https://github.com/leegeunhyeok/react-native-esbuild/commit/06e43af2e3df62da58f468b33905e4a97472dc5f))



## 0.1.0-alpha.1 (2023-07-29)


### Features

* add base configs for build ([3acf916](https://github.com/leegeunhyeok/react-native-esbuild/commit/3acf91623d33e9d1f8ee48568d66e57d329683ec))
* add sourcemap option ([bfb6c9e](https://github.com/leegeunhyeok/react-native-esbuild/commit/bfb6c9edc2338aa612e4f687b05d72e94bc70877))
* **cli:** add start and build commands ([33cff7d](https://github.com/leegeunhyeok/react-native-esbuild/commit/33cff7d69e07c676060477c949e4af1abfb33b4c))
* **cli:** implement build command ([d138ceb](https://github.com/leegeunhyeok/react-native-esbuild/commit/d138ceb78da3e4de8b1a25ed802a6c7b99d4a53d))
* **core:** add request bundle option ([5a76eca](https://github.com/leegeunhyeok/react-native-esbuild/commit/5a76ecac1e07211c95ec356e5829bb0f671009c9))
* **core:** implement base core module ([b8e7d35](https://github.com/leegeunhyeok/react-native-esbuild/commit/b8e7d35753b45b015a0009cb9919429348e6f50c))
* **core:** now throw signal when task is not started yet ([8a9f5dd](https://github.com/leegeunhyeok/react-native-esbuild/commit/8a9f5dd692799d43b672d8af496696d61f79a12f))
* **dev-server:** implement base dev server ([0fcb7eb](https://github.com/leegeunhyeok/react-native-esbuild/commit/0fcb7eb20152f0ff8662e7be17c70dbb2fddd54b))
* **plugins:** implement transform plugin ([92a8f60](https://github.com/leegeunhyeok/react-native-esbuild/commit/92a8f6003f04a650e3f1a5406e33cb8573232d85))


### Bug Fixes

* circular dependency ([f764fe5](https://github.com/leegeunhyeok/react-native-esbuild/commit/f764fe51c4ec31efd8c89826200bbe275f956e86))
* process exit when error occurred ([a0ef5ab](https://github.com/leegeunhyeok/react-native-esbuild/commit/a0ef5ab055cab1828fe763473992d995bc65e23d))
* set react-native as external module ([add4a20](https://github.com/leegeunhyeok/react-native-esbuild/commit/add4a20a3de08c26d42f39afab20c1a890a9939b))
* typescript config for build ([9cb2bfc](https://github.com/leegeunhyeok/react-native-esbuild/commit/9cb2bfc74ee3934a43464788a2af89e203bbaa4b))


### Build System

* add esbuild and add config for build cli ([18c541b](https://github.com/leegeunhyeok/react-native-esbuild/commit/18c541badad24585a5e7f2e1948499ff25dd717d))
* add esbuild scripts ([b38b2c0](https://github.com/leegeunhyeok/react-native-esbuild/commit/b38b2c06bf7f8594fd17675c8d23e38a7f1678fb))
* change base build config ([752e15a](https://github.com/leegeunhyeok/react-native-esbuild/commit/752e15af5560c6f5648344a2695257e819045d95))


### Miscellaneous Chores

* add dist directory to publish files ([1abbee2](https://github.com/leegeunhyeok/react-native-esbuild/commit/1abbee2dd1560ac7166903362c220263cd5d895a))
* add license ([20952d7](https://github.com/leegeunhyeok/react-native-esbuild/commit/20952d750b3f76a0377adc65b10b4d09a9eaf400))
* add packages ([a2076de](https://github.com/leegeunhyeok/react-native-esbuild/commit/a2076def60774fb9b39cfe90f5af35b44148a46f))
* add prepack scripts ([3baa83b](https://github.com/leegeunhyeok/react-native-esbuild/commit/3baa83b9ce539c7c797a959a829aaf0e95d0d6d2))
* add prettierignore ([8950cab](https://github.com/leegeunhyeok/react-native-esbuild/commit/8950caba9f58da8dd3a949fffc0fb32083401d8e))
* add react-native example project ([ed6517e](https://github.com/leegeunhyeok/react-native-esbuild/commit/ed6517e69cb71ffe2f70f05860ade0a206f07142))
* basic project setup ([f9e585f](https://github.com/leegeunhyeok/react-native-esbuild/commit/f9e585f5df4a745247f08ee8cf35e0884d18e5d1))
* commmit lint ([1468dd7](https://github.com/leegeunhyeok/react-native-esbuild/commit/1468dd72525780881921b35702b5123f4b642d70))
* create source-map package ([283a7dd](https://github.com/leegeunhyeok/react-native-esbuild/commit/283a7ddb50beda225b495e1904618ea8116d4477))
* migrate to yarn berry ([991bbb0](https://github.com/leegeunhyeok/react-native-esbuild/commit/991bbb0bd0e5c31d710ab7da2c1414d0decb1fcb))
* remove inquirer and add yargs ([9fcd1cf](https://github.com/leegeunhyeok/react-native-esbuild/commit/9fcd1cfa6cea6adcfb3618de14aa9354999e7061))
* set client to yarn ([c9df883](https://github.com/leegeunhyeok/react-native-esbuild/commit/c9df8839b15a1b8617386c51f117f7214a935784))
* update description ([b7f60e2](https://github.com/leegeunhyeok/react-native-esbuild/commit/b7f60e29b2f8d7933998ec6edac7ef0cbd8517a2))
* update gitignore ([063886b](https://github.com/leegeunhyeok/react-native-esbuild/commit/063886b872403d8ae0e1c0108c9412b6c3a048d4))
* update module resolve fields ([afb6a74](https://github.com/leegeunhyeok/react-native-esbuild/commit/afb6a749019a617591254106389448d5035e5ae0))
* update peer deps versions ([1aa7cb0](https://github.com/leegeunhyeok/react-native-esbuild/commit/1aa7cb0eca4e90ca15deb2667dc4946ae1cc3cd7))
* update tsconfig for type declaration ([7458d94](https://github.com/leegeunhyeok/react-native-esbuild/commit/7458d945fb3e8c3a5a7b29a00eda197556a5fa5d))


### Code Refactoring

* add prettier rules and apply eslint ([1d82f86](https://github.com/leegeunhyeok/react-native-esbuild/commit/1d82f869c0233c4c4320425eca35506b7bf7d441))
* change custom option variable names ([a0060dc](https://github.com/leegeunhyeok/react-native-esbuild/commit/a0060dcd3a59dc2899cbda90980c5c3aeb38de18))
* change shared script filename ([14096ca](https://github.com/leegeunhyeok/react-native-esbuild/commit/14096ca196e5ea63bcd4a4f98ecafdf21069f208))
* **cli:** split cli modules ([44e1973](https://github.com/leegeunhyeok/react-native-esbuild/commit/44e1973fbd46f3df4895acc2880d4a1c00ce00dc))
* **config:** change swc config builder name ([da39399](https://github.com/leegeunhyeok/react-native-esbuild/commit/da39399595b0a686316146c2d91ec0c5c6ad5bdc))
* **config:** improve swc option builder ([6dc328a](https://github.com/leegeunhyeok/react-native-esbuild/commit/6dc328a6693edcb58d2a29dd401a4814430fb014))
* **core:** split bundler module ([17c5f62](https://github.com/leegeunhyeok/react-native-esbuild/commit/17c5f62f31340788a21923f47d2f1e258c668b17))
