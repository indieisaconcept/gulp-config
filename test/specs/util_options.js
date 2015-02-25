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

    current = {
        level: 'one'
    };

describe('util options', function () {

    it('is a function', function () {
        expect(options).to.be.a('function');
    });

    it('returns an object', function () {
        var result = options.call(current, {});
        expect(result).to.eql(current);
    });

    it('does not override options if key already exists', function () {

        var result = options.call(current, {
                level: 'two'
            });

        expect(result.level).to.eql('one');

    });

    it('adds additional defaults if not set', function () {

        var result = options.call(current, {
                additional: 'level'
            });

        expect(result.additional).to.eql('level');

    });

});
