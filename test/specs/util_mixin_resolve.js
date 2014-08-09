/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var expect  = require('chai').expect,
    resolve = require('../../lib/util/mixin/resolve'),

    fixture = {
        foo: {
            bar: 'buzz'
        }
    };

describe('util mixin resolve', function () {

    it('returns a valid value if found', function() {
        var result = resolve('foo.bar', fixture);
        expect(result).to.eql('buzz');
    });

    it('returns a undefined if value not found', function() {
        var result = resolve('foo.buzz', fixture);
        return expect(result).to.be.undefined;
    });

});