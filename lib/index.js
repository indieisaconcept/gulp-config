/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var npath  = require('path'),
    util   = require('./util'),
    gutil  = require('gulp-util'),
    keyExc = ['options', 'deps'],
    plugin = 'gulp-config',
    initConfig;

initConfig = function (config) {

    if (!util._.isObject(config)) {
        throw new gutil.PluginError({
            plugin: plugin,
            message: 'An invalid config object has been passed.'
        });
    }

    config = config || {};

    try {
        config = util.config(config); // normalize config
    }
    catch(err) {
        throw new gutil.PluginError(plugin, err);
    }

    var self = this,
        keys = Object.keys(config);

    keys.forEach(function (key) {

        var cfg     = config[key],
            name    = key,

            copts   = cfg.options || {}, // common task options
            cdeps   = cfg.deps    || {}, // common task dependencies

            task    = self.tasks[key],

            args,
            targets;

        keyExc.unshift(Object.keys(cfg));
        targets = util._.without.apply(null, keyExc);

        if(task) {

            // all targets
            // -----------------------------------

            args = [name, targets.map(function (target) {
                return name + ':' + target;
            })];

            self.gulp.task.apply(self.gulp, args);

            // sub targets
            // -----------------------------------

            targets.forEach(function (target) {

                var tname = util.format('%s:%s', name, target),
                    tgt   = cfg[target],
                    args;

                tgt.options = util._.merge({}, copts, tgt.options); // merge task default options with targets
                tgt.deps    = util._.merge([], cdeps, tgt.deps);    // merge task default deps with targets

                // file
                // src : ['some/path/**/*.js']
                // dest: 'buld/path/'

                tgt.file = {
                    src : util._.isArray(tgt) && tgt || util._.isString(tgt) && [tgt] || tgt.src,
                    dest: tgt.dest
                };

                // create task

                args = [tname, tgt.deps, function () {

                    var args   = [].slice.call(arguments),
                        scope  = this,
                        tscope = scope.tasks[tname];

                    // misc

                    scope.name     = name;
                    scope.nameArgs = tname;
                    scope.target   = target;

                    // target & file options

                    scope.file     = tgt.file;
                    tscope.options = tgt.options;
                    scope.options  = util.options.bind(tscope.options);

                    return task.apply(scope, [self.gulp].concat(args));

                }];

                self.gulp.task.apply(self.gulp, args);

            });

        }

    });

};

/**
 * @function config
 * Creates a config helper to initializing gulp tasks,
 * in a similar vein to grunt
 *
 * @param {function} gulp    a gulp instance
 * @param {object}   options config specific options
 *
 * @returns {object}
 */

module.exports = function (gulp, options) {

    var dir = process.cwd();

    options           = options || {};
    options.gulp      = gulp;
    options.gulp.util = gutil; // make gulp utils available

    // provide support for a help menu

    // tasks:
    // -------------------------------------
    //
    // tasks can be passed as either an array of paths, or
    // as an object of tasks
    //
    // find all possible task files, in a specified directory
    // ensuring only files matching the pattern
    //
    // - dir/task.js
    // - dir/task/index,js

    options.tasks = options.tasks || ['./tasks/*/*.js', './tasks/*.js'];
    options.tasks = util._.isArray(options.tasks) ? options.tasks : options.tasks;
    options.tasks = util._.isString(options.tasks) ? [options.tasks] : options.tasks;

    // prefech tasks, for use later

    if (util._.isArray(options.tasks)) {

        options.tasks = options.tasks.reduce(function (previous, current) {

            var tasks = util.glob.sync(current);

            tasks.forEach(function (task) {

                // normalize task name accoring to, directory
                // structure

                var filename   = npath.basename(task).split('.')[0],
                    directory  = npath.dirname(task).split(npath.sep).pop(),
                    name       = filename !== 'index' ? filename : directory;

                previous[name] = require(npath.normalize(npath.join(dir, task)));

            });

            return previous;

        }, {});

    }

    return initConfig.bind(options);

};
