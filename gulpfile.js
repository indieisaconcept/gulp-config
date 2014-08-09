'use strict';

var gulp   = require('gulp'),
    config = require('./lib')(gulp);

// ===================
// CONFIG
// ===================

config({

    paths: {
        source: ['./lib/**/*.js'],
        tests : ['./test/**/*.js', '!test/{temp,coverage}/**}'],
        cov   : './test/coverage'
    },

    // tasks
    // ------------------------

    jshint  : { lint : '<%=paths.source%>' },
    mocha   : { specs: '<%=paths.tests%>'  },
    istanbul: { options: { paths: '<%=paths%>' }, coverage: '<%=paths.source%>' }

});