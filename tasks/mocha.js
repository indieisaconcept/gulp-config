'use strict';

var mocha = require('gulp-mocha');

module.exports = function (gulp) {

    var config = this.config,
        file   = this.file;

    gulp.src(file.src)
        .pipe(mocha(config.options))
        .on('error', gulp.util.log);

};
