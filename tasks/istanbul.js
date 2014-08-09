/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var plugins = require('gulp-load-plugins')();

module.exports = function (gulp, done) {

    var opts  = this.options,
        paths = opts.paths;

    console.log(paths);

    gulp.src(this.src)
        .pipe(plugins.istanbul()) // Covering files
        .on('finish', function() {
            gulp.src(paths.tests)
                .pipe(plugins.plumber())
                .pipe(plugins.mocha({
                    reporter: 'list'
                }))
                .pipe(plugins.istanbul.writeReports({
                    dir: paths.cov,
                    reporters: [ 'lcov', 'json', 'text', 'text-summary' ],
                    reportOpts: { dir: paths.cov },
                }))
                .on('finish', function() {
                    process.chdir(__dirname);
                    //done();
                });
        })
        .on('error', gulp.util.log);

};