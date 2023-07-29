'use strict';

const plugins = require('..');
const assert = require('assert').strict;

assert.strictEqual(plugins(), 'Hello from plugins');
console.info('plugins tests passed');
