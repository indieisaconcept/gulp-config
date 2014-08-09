'use strict';

var gulp   = require('gulp'),
    config = require('./lib')(gulp);

// ===================
// CONFIG
// ===================

config({

    paths: {
        source: ['./lib/**/*.js'],
        tests : ['./test/**/*.js']
    },

    // tasks
    // ------------------------

    jshint  : { lint : '<%=paths.source%>' },
    mocha   : { specs: '<%=paths.tests%>'  }

});

gulp.task('test', ['jshint', 'mocha']);
