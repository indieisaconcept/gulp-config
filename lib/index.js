/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var npath   = require('path'),
    util    = require('./util'),
    resolve = require('configfiles'),

    _       = util._,
    gutil   = require('gulp-util'),

    keyExc  = ['options', 'deps', 'help', 'description', 'aliases'],
    plugin  = 'gulp-config',
    initConfig;

initConfig = function (config) {

    if (!_.isPlainObject(config)) {
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
        keys = Object.keys(config());

    keys.forEach(function (key) {

        var cfg     = config(key),
            name    = key,

            copts   = cfg.options || {}, // common task options
            cdeps   = cfg.deps    || [], // common task dependencies

            task    = self.tasks[key],

            args,
            targets;

        keyExc.unshift(Object.keys(cfg));
        targets = _.without.apply(null, keyExc);

        if(task) {

            // all targets
            // -----------------------------------

            args = [name, targets.map(function (target) {
                return name + ':' + target;
            })];

            if (self.help) {

                // a) allow description to be hidden
                // b) allow description to be overriden
                // c) fallback to default

                cfg.help = _.isBoolean(cfg.description) && !cfg.description ||
                           _.isString(cfg.description) ? cfg.description : util.format('Run all targets for "%s"', name);

                args.splice(1, 0, cfg.help);

                // ensure task aliases are added, if
                // defined ( see gulp-help )

                if (cfg.aliases) {
                    args.push(null, {
                        aliases: cfg.aliases
                    });
                }

            }

            self.gulp.task.apply(self.gulp, args);

            // sub targets
            // -----------------------------------

            targets.forEach(function (target) {

                var tname  = util.format('%s:%s', name, target),
                    tgt    = cfg[target],
                    files, file, args, delegatedTask, wrappedTask;

                // normalize target

                tgt         = _.isString(tgt) || _.isArray(tgt) ? { src: tgt } : tgt;
                tgt.options = _.merge({}, copts, tgt.options); // merge task default options with targets
                tgt.deps    = _.merge([], cdeps, tgt.deps);    // merge task default deps with targets

                // file & files
                // src : ['some/path/**/*.js']
                // dest: 'buld/path/'

                files = resolve(tgt);
                file  = files[0];

                delegatedTask = function () {

                    var args = [].slice.call(arguments),
                        scope;

                    scope  = {

                        // misc

                        name     : name,
                        nameArgs : tname,
                        target   : target,

                        // target & file options

                        file     : file,
                        files    : files,
                        options  : util.options.bind(tgt.options),
                        config   : config

                    };

                    return task.call.apply(task, [scope, self.gulp].concat(args));

                };

                // async support
                // Wrap delegate to ensure callback can be passed
                // correctly to tasks

                wrappedTask = task.length > 1 ? function(cb) { /*jshint unused:false */
                    return delegatedTask.apply(null, arguments);
                } : function() {
                    return delegatedTask.apply(null, arguments);
                };

                // create task

                args = [tname, tgt.deps, wrappedTask];

                if (self.help) {

                    // a) allow description to be hidden
                    // b) allow description to be overriden
                    // c) fallback to default

                    tgt.help = _.isBoolean(tgt.description) && !tgt.description ||
                               _.isString(tgt.description) ? tgt.description : util.format('Run the "%s" target for "%s"', target, name);

                    args.splice(1, 0, tgt.help);

                    // ensure task aliases are added, if
                    // defined ( see gulp-help )

                    if (tgt.aliases) {
                        args.push({
                            aliases: tgt.aliases
                        });
                    }

                }

                self.gulp.task.apply(self.gulp, args);
                self.gulp.tasks[tname].options = tgt.options;

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

    var dir  = process.cwd();

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
    options.tasks = _.isArray(options.tasks) ? options.tasks : options.tasks;
    options.tasks = _.isString(options.tasks) ? [options.tasks] : options.tasks;

    // prefech tasks, for use later

    if (_.isArray(options.tasks)) {

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
