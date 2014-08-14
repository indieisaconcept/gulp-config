'use strict';

var gulp   = require('gulp'),
    help   = require('gulp-help')(gulp),
    config = require('./lib')(gulp, { help: true });

// ===================
// CONFIG
// ===================

config({

    paths: {
        source: ['./lib/**/*.js', './tasks/**/*.js'],
        tests : ['./test/**/*.js']
    },

    // tasks
    // ------------------------

    jshint  : { lint : '<%=paths.source%>' },
    mocha   : { specs: '<%=paths.tests%>'  }

});

gulp.task('test', ['jshint', 'mocha']);
