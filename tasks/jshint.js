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

    var options = this.options(),
        file    = this.file;

    return gulp.src(file.src)
        .pipe(jshint(options))
        .pipe(jshint.reporter(stylish))
        .on('error', gulp.util.log);

};
