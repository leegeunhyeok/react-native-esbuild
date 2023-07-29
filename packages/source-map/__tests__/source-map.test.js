'use strict';

const sourceMap = require('..');
const assert = require('assert').strict;

assert.strictEqual(sourceMap(), 'Hello from sourceMap');
console.info('sourceMap tests passed');
