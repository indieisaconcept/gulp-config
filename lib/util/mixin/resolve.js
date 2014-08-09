/*
 * gulp-config
 * http://github.com/indieisaconcept/gulp-config
 *
 * Copyright (c) 2014 Jonathan Barnett
 * Licensed under the ISC license.
 */

'use strict';

/**
 * @function resolve
 * Use a dot notionation string to get an nested object value
 *
 * @param {string} key     dot notation string
 * @param {object} source  source object to traverse
 *
 * @returns
 */

var _ = require('lodash');

module.exports = function (/* String */ key, /* Object */ source) {

    if(!_.isString(key)) {
        throw new Error('Resolve needs a string a it\'s first argument');
    }

    if(!_.isObject(source)) {
        throw new Error('Resolve needs a source object');
    }

    if (!key) {
        return;
    }

    return key.split('.').reduce(function (previous, current) {
        return previous[current];
    }, source);

};