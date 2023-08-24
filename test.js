/* eslint-disable no-console */
/* eslint-disable no-sequences */
/* eslint-disable no-param-reassign */
const __getOwnPropNames = Object.getOwnPropertyNames;

/* esm wrapper */
const __esm = (fn2, res) =>
  function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])((fn2 = 0))), res;
  };

/* commonjs wrapper */
const __commonJS = (cb, mod) =>
  function __require2() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])(
          (mod = { exports: { __t: null } }).exports,
          mod,
        ),
      mod.exports
    );
  };

(function init() {
  const require_cjs = __commonJS({
    'node_modules/cjs/index.js'(exports, _module) {
      'use strict';
      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      function printCjs() {
        console.log('from cjs!!', exports, _module);
      }

      exports.printCjs = printCjs;
    },
  });

  // eslint-disable-next-line no-var
  var printEsm;
  const require_esm = __esm({
    'node_modules/esm/index.mjs'() {
      console.log('mjs imported');

      printEsm = function printEsm() {
        console.log('from mjs!!');
      };
    },
  });

  require_cjs();
  require_cjs();
  require_cjs();
  require_cjs();

  require_cjs().printCjs();

  require_esm();
  require_esm();
  require_esm();
  require_esm();
})();
