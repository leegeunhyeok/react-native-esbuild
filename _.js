const a = require('./a');
const b = require('./b');

// eslint-disable-next-line func-names
(function () {
  process.stdout.write(`${a.A_VALUE}\n`);
  process.stdout.write(`${b.B_VALUE}\n`);

  a();
  b();

  process.stdout.write('hello world!');
})();
