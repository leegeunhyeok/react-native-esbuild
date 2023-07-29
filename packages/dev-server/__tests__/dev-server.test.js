'use strict';

const devServer = require('..');
const assert = require('assert').strict;

assert.strictEqual(devServer(), 'Hello from devServer');
console.info('devServer tests passed');
