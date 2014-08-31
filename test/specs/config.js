/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var fs       = require('mock-fs'),
    config   = require('../../lib'),
    sequence = require('run-sequence'),
    sinon    = require('sinon'),
    expect   = require('chai').expect,

    // mock for testing

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
            fixture = {};

        before(function (done) {

            // create file system mocks

            fs({
                '/a/b': {},
                '/e/f': {},
                '/c/d': {
                    'test.js': '// test.js'
                },
                '/f/h': {
                    'test.js': '// test.js'
                },
                'some/path': {
                    'test.js': '// test.js'
                }
            });

            // create spys

            tasks.one = sinon.spy();
            tasks.two = sinon.spy();

            // setup config fixtures

            fixture.one = { options: { level: 'one' }, foo: ['some/path/**/.js'] };
            fixture.two = {
                foo: {
                    files: {
                        '/a/b': '/c/d/*.js',
                        '/e/f': '/f/h/*.js'
                    }
                }
            };

            // intialize

            config(gulp.orig, { tasks: tasks })(fixture);

            // tasks

            gulp.orig.task('three', function () {
                done();
            });

            gulp.orig.task('default', function (cb) {
                sequence('one:foo', 'two:foo', 'three', cb);
            });

            gulp.orig.start(['default']);

        });

        it('registers a task', function () {
            expect(tasks.one.called).to.be.true;
            expect(tasks.two.called).to.be.true;
        });

        it('this.file exists', function () {

            ['one', 'two'].forEach(function (item) {
                var scope = tasks[item].thisValues[0];
                expect(scope.file).to.be.a('object');
            });

        });

        it('this.files exists', function () {

            ['one', 'two'].forEach(function (item) {

                var scope = tasks[item].thisValues[0];
                expect(scope.files).to.be.a('array');

                switch(item) {

                    case 'one':
                        expect(scope.files.length).to.eql(1);
                        break;
                    case 'two':
                        expect(scope.files.length).to.eql(2);
                        expect(scope.files[0].src[0]).to.eql('/c/d/test.js');
                        expect(scope.files[0].dest).to.eql('/a/b');
                        break;

                }

            });

        });

        it('this.options() exists', function () {

            ['one', 'two'].forEach(function (item) {
                var scope = tasks[item].thisValues[0];
                expect(scope.options).to.be.a('function');
            });

        });

        it('this.config() exists', function () {

            ['one', 'two'].forEach(function (item) {
                var scope = tasks[item].thisValues[0];
                expect(scope.config).to.be.a('function');
            });

        });

        it('this.options() overrides or sets a value', function () {

            ['one', 'two'].forEach(function (item) {
                var scope = tasks[item].thisValues[0];
                expect(scope.options({
                    level: 'two'
                }).level).to.eql('two');
            });

        });

        it('this.name is set correctly', function () {

            ['one', 'two'].forEach(function (item) {
                var scope = tasks[item].thisValues[0];
                expect(scope.name).to.eql(item);
            });

        });

        it('this.nameArgs is set correctly', function () {

            ['one', 'two'].forEach(function (item) {
                var scope = tasks[item].thisValues[0];
                expect(scope.nameArgs).to.eql(item + ':foo');
            });

        });

        it('this.target is set correctly', function () {

            ['one', 'two'].forEach(function (item) {
                var scope = tasks[item].thisValues[0];
                expect(scope.target).to.eql('foo');
            });

        });

    });

});
