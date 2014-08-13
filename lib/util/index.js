/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var _      = require('lodash'),
    format = require('util').format,
    erbReg = /^<%=\s*([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*%>$/i,
    options,
    config;

_.mixin({
    'resolve': require('./mixin/resolve')
});

/**
 * @function options
 * Returns an object with defaults applied
 *
 * @param {object} override object to merge
 *
 * @returns {object}
 */

options = function (/* Object */ override) {
    var current = this || {};
    return _.merge(current, override || {});
};

/**
 * @function config
 * Normalise a config object. Setting correct values via
 * property interpolation
 *
 * @param {object} source object detailing whole config
 *
 * @returns {object}
 */

config = function (/* Object */ target, /* Object */ source) {

    if(source && _.isArray(source)) {
        return source;
    }

    target = target || {};
    source = source || target || {};

    Object.keys(target).forEach(function (key) {

        var match,
            result;

        if (_.isString(target[key])) {
            match  = target[key].match(erbReg);
            result = match && match[1] ? _.resolve(match[1], source) : target[key];
        } else if (_.isObject(target[key]) && !_.isArray(target[key])) {
            result = config(target[key], source);
        } else {
            result = target[key];
        }

        target[key] = result;

    });

    return target;

};

module.exports = {
    deprecate: require('depd')('gulp-config'),
    _        : _,
    format   : format,
    glob     : require('glob'),
    config   : config,
    options  : options
};
