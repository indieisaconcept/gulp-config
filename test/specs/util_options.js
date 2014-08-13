/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var expect  = require('chai').expect,
    options = require('../../lib/util').options,

    fixture = {
        level: 'one'
    };

describe('util options', function () {

    it('is a function', function () {
        expect(options).to.be.a('function');
    });

    it('returns an object', function () {
        var result = options.call(fixture, {});
        expect(result).to.eql(fixture);
    });

    it('returns a merged object', function () {
        var result = options.call(fixture, {
            level: 'two'
        });
        expect(result.level).to.eql('two');
    });

});
