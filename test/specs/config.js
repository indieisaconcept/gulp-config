/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var config = require('../../lib'),
    sinon  = require('sinon'),
    expect = require('chai').expect,

    // mock gulp for testing

    gulp = sinon.stub({
        task: function () {},
        tasks: {}
    }),

    helper;

describe('gulp-config', function () {

    before(function () {
        helper = config(gulp);
    });

    it('is defined', function () {
        expect(config).to.be.a('function');
    });

    it('creates a config helper', function () {
        expect(helper).to.be.a('function');
    });

    it('extends gulp with gulp-utils', function () {
        expect(gulp.util).to.be.a('object');
    });

});