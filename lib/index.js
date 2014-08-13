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
    keyExc = ['options', 'description', 'aliases', 'deps', 'help'],
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

            opts    = cfg.options || {}, // common task options
            deps    = cfg.deps    || {}, // common task dependencies

            task    = self.tasks[key],
            aliases = util._.isArray(cfg.aliases) ? cfg.aliases : cfg.aliases && [cfg.aliases],

            args,
            targets;

        keyExc.unshift(Object.keys(cfg));
        targets = util._.without.apply(null, keyExc);

        if(task) {

            // all targets
            // -----------------------------------

            cfg.help = util._.isBoolean(cfg.help) ? cfg.help : false; // should taks be displayed in help

            args = [name, !!cfg.help && util.format('Run all targets for "%s"', name), targets.map(function (target) {
                return name + ':' + target;
            }), null];

            // ensure task aliases are added, if
            // defined ( see gulp-help )

            if (aliases) {
                args.push({
                    aliases: aliases
                });
            }

            self.gulp.task.apply(self.gulp, args);

            // sub targets
            // -----------------------------------

            targets.forEach(function (target) {

                var tname   = util.format('%s:%s', name, target),
                    tgt     = cfg[target],
                    aliases = util._.isArray(tgt.aliases) ? tgt.aliases : tgt.aliases && [tgt.aliases],
                    args;

                tgt = {

                    description : cfg.description ||
                                  tgt.description ||
                                  util.format('Run the "%s" task using target "%s"', name, target),

                    help        : util._.isBoolean(tgt.help) ? tgt.help : true, // should taks be displayed in help

                    options     : util._.merge({}, opts, tgt.options),          // merge task default options with targets
                    deps        : util._.merge([], deps, tgt.deps),             // merge task default deps with targets

                    files: {
                        src : util._.isArray(tgt) || util._.isString(tgt) ? tgt : tgt.src,
                        dest: tgt.dest
                    }
                };

                // create task

                args = [tname, tgt.help && tgt.description, tgt.deps, function () {

                    var args  = [].slice.call(arguments),
                        scope = this;

                    scope.config = {
                        options: util._.clone(tgt.options)
                    };

                    util.deprecate.property(scope, 'config', 'this.config is deprecated, use this.options() instead');

                    scope.tasks[tname].options = util._.clone(tgt.options);
                    scope.options = util.options.bind(scope.tasks[tname].options);

                    // fix file to task

                    scope.file  = scope.tasks[tname].file  = tgt.files; // remove this soon
                    scope.files = scope.tasks[tname].files = tgt.files;

                    return task.apply(scope, [self.gulp].concat(args));

                }];

                // ensure task aliases are added, if
                // defined ( see gulp-help )

                if (aliases) {
                    args.push({
                        aliases: aliases
                    });
                }

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

    require('gulp-help')(gulp); // setup help menu for gulp

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
