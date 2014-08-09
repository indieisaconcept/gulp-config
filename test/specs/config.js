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

    gulp = {
        stub: sinon.stub({
            task: function () {},
            tasks: {}
        }),
        orig: require('gulp')
    },

    fixture = {
        test: {
            options: {},
            foo: ['some/path/**/.js']
        }
    },

    helper;

describe('gulp-config', function () {

    before(function () {
        helper = config(gulp.stub);
    });

    it('is defined', function () {
        expect(config).to.be.a('function');
    });

    it('creates a config helper', function () {
        expect(helper).to.be.a('function');
    });

    it('extends gulp with gulp-utils', function () {
        expect(gulp.stub.util).to.be.a('object');
    });

    describe('tasks', function () {

        it('registers a task', function (done) {

            var helper = config(gulp.orig, {

                    // manually create a task for
                    // testing

                    tasks: {

                        test: function (gulp, cb) {

                            var config = this.config,
                                file   = this.file;

                            expect(file.src).to.eql(fixture.test.foo);
                            return done();

                        }

                    }

                });

            helper(fixture);
            gulp.orig.start(['test']);

        });

    });

});
