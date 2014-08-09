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

    var config = this.config,
        file   = this.file;

    return this.src(file.src)
        .pipe(jshint(config.options))
        .pipe(jshint.reporter(stylish))
        .on('error', gulp.util.log);

};
