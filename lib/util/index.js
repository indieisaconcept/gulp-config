/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

var _           = require('lodash'),
    expander    = require('expander'),
    format      = require('util').format,
    options,
    config;

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
 * property interpolation and resolving files
 *
 * @param {object} source object detailing whole config
 *
 * @returns {object}
 */

config = function (/* Object */ source) {
    if (!_.isPlainObject(source)) {
        throw new Error('An valid config { Object } is required.');
    }
    return expander.interface(source);
};

module.exports = {
    _        : _,
    format   : format,
    glob     : require('glob'),
    config   : config,
    options  : options
};
