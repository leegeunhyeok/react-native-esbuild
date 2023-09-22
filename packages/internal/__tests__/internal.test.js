'use strict';

const internal = require('..');
const assert = require('assert').strict;

assert.strictEqual(internal(), 'Hello from internal');
console.info('internal tests passed');
