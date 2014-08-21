'use strict';

var mocha = require('gulp-mocha');

module.exports = function (gulp, done) {

    var options = this.options(),
        file    = this.file;

    gulp.src(file.src)
        .pipe(mocha(options))
        .on('error', gulp.util.log)
        .on('finish', done);

};
