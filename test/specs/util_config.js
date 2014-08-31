/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var expect   = require('chai').expect,
    config   = require('../../lib/util').config,
    expander = require('expander'),

    fixture = {
        source: {
            paths: {
                test: [1, 2, 3]
            },
            foo: {
                bar: 'hello',
                buzz: 'world'
            },
            interpolation: '<%=foo.bar%> <%=foo.buzz%>',
            bar: '<%=foo%>',
            buzz: '<%=paths.test%>'
        },
        expected: {
            paths: {
                test: [1, 2, 3]
            },
            foo: {
                bar: 'hello',
                buzz: 'world'
            },
            interpolation: 'hello world',
            bar: {
                bar: 'hello',
                buzz: 'world'
            },
            buzz: [1, 2, 3]
        }
    };

describe('util config', function () {

    it('returns a resolved config object', function () {
        var result = config(fixture.source);
        expect(result).to.be.a('function');
        expect(result()).to.eql(fixture.expected);
    });

    it('throws an error if a non-object is passed', function () {
        expect(config).to.throw;
        expect(config.bind(null, [])).to.throw;
    });

});
