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

        var tasks   = {},
            fixture = {},
            spies   = {},
            tests   = [];

        tests = [
            {
                label : 'registers a task',
                assert: function (spy) {
                    expect(spy.called).to.be.true;
                }
            },
            {
                label : 'this.config exists',
                assert: function (spy) {
                    var scope = spy.thisValues[0];
                    expect(scope.config).to.be.object;
                }
            },
            {
                label : 'this.options() exists',
                assert: function (spy) {
                    var scope = spy.thisValues[0];
                    expect(scope.options).to.be.a('function');
                    expect(scope.options().level).to.eql('one');
                }
            },
            {
                label : 'this.options() overides a value',
                assert: function (spy) {
                    var scope = spy.thisValues[0];
                    expect(scope.options({
                        level: 'two'
                    }).level).to.eql('two');
                }
            }
        ];

        before(function () {

            tests.forEach(function (test, index) {

                tasks[index] = sinon.spy();

                fixture[index] = {
                    options: {
                        level: 'one'
                    },
                    foo    : ['some/path/**/.js']
                };

            });

            config(gulp.orig, { tasks: tasks })(fixture);

        });

        tests.forEach(function (test, index) {

            it(test.label, function (done) {

                gulp.orig.start([index + ':foo']);

                (function check() {

                    if (!tasks[index].called) {
                        setTimeout(check, 100);
                    } else {
                        return test.assert(tasks[index]), done();
                    }

                }());

            });

        });

    });

});
