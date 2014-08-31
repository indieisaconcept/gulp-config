/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var expect = require('chai').expect,
    util   = require('../../lib/util');

describe('util', function () {

    ['_', 'format', 'glob', 'config'].forEach(function (method) {
        it('has an "' + method + '" method', function () {
            expect(util[method]).to.be.a('function');
        })
    });

});
