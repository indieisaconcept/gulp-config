/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var jshint  = require('gulp-jshint'),
    stylish = require('jshint-stylish');

module.exports = function (gulp) {

    return gulp.src(this.src)
        .pipe(jshint(this.options))
        .pipe(jshint.reporter(stylish))
        .on('error', gulp.util.log);

};