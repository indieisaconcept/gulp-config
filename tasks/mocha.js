'use strict';

var mocha = require('gulp-mocha'),
    util  = require('gulp-util');

module.exports = function (gulp) {

    gulp.src(this.src)
        .pipe(mocha(this.options))
        .on('error', util.log);

};