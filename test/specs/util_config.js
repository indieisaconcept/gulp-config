/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var expect = require('chai').expect,
    config = require('../../lib/util').config,

    fixture = {
        source: {
            paths: {
                test: [1, 2, 3]
            },
            foo: {
                bar: 'world'
            },
            hello: '<%=foo.bar%>',
            bar: '<%=foo%>',
            buzz: '<%=paths.test%>'
        },
        expected: {
            paths: {
                test: [1, 2, 3]
            },
            foo: {
                bar: 'world'
            },
            hello: 'world',
            bar: {
                bar: 'world'
            },
            buzz: [1, 2, 3]
        }
    };

describe('util config', function () {

    it('returns a resolved config object', function () {
        var result = config(fixture.source);
        expect(result).to.be.a('object');
        expect(result).to.eql(fixture.expected);
    });

    it('throws an error if a non-object is passed', function () {
        expect(config()).to.throw;
        expect(config([])).to.throw;
    });

});