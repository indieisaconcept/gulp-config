# gulp-config

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

**`gulp-config`** provides grunt like config management for gulp tasks. 

Note the following gulp plugins are used within this plugin by default.

### Caveates

- only a partial implementation of grunt config management
- more test coverage needed
- [gulp-util](https://github.com/gulpjs/gulp-util) included by default
- [gulp-help](https://github.com/chmontgomery/gulp-help) included by default

## Install

```bash
$ npm install --save-dev gulp-config
```

## Usage

```javascript
'use strict';

var gulp   = require('gulp'),
    config = require('./lib')(gulp);

config({

    paths: {
        source: ['./lib/**/*.js'],
        tests : ['./test/**/*.js']
    },

    jshint  : { lint : '<%=paths.source%>' },
    mocha   : { specs: '<%=paths.tests%>'  }

});
```
> Example gulpfile.js

**`gulp-config`** will auto discover by default any tasks located in the nearest `tasks` directory. This directory can be changed by passing in options when first intializing `gulp-config` ( see options )

**Take a look at this projects gruntfile and tasks directory for a working example.**

## config

When tasks are registered via `gulp-config`, all sub targets will be made available via the parent task name. So for example running `> gulp jshint` will run all `jshint` targets whilst `> gulp jshint:foo` will only run the foo target.

Config files can also reference other config values in the same manner as grunt, using the `<%=key.name %>` pattern.

```
{
	'plugin': {
	
		options 		: {}, 			// global options
		aliases 		: ['foo'],  	// alias names for task
		description 	: '', 			// task description for help
		help 			: true | false	// visible in help ( default false )
		
		target: {

			aliases 	: ['foo'],  	// alias names for task
			description : '', 			// task description for help
			help 		: true | false	// visible in help ( default true )
			options		: {}, 			// target options ( merged with global )
			
			src 		: ['some/path'],
			dest		: 'some/des'
		},
		
		target: ['some/path']
	}
	
{
```
> Example config

## Options

When first initilizing `gulp-config`, an options object can be passed which can be used to customize where tasks are located.

### tasks 

This is used to set where tasks can be found. Passing a single path is supported, in addition an array of paths can also be specified. All paths support glob style matching.

Should you wish to not used auto lookup, tasks can be passed directly via an object literal.

For convenience, gulp-util is available automatically via gulp.util within a task.

#### Basic

```javascript
var gulp   = require('gulp'),
    config = require('./lib')(gulp, {
    	tasks: ['some/path/*/*.js', 'some/other/path/**/*.js']
    });
```

#### Advanced

```javascript
var gulp   = require('gulp'),
    config = require('./lib')(gulp, {
    	tasks: {
    		jshint: function (gulp) {
    			// my custom task
    		}
    	}
    });
```
### tasks

Tasks registered via gulp-config should follow the pattern below;

```javascript
module.exports = function (gulp) {

	var config = this.config,
		 file   = this.file;
		 
	// task code ......

};
```
Tasks registered in this manner will have access to access to a config object and a file object.

- The config object, is the current targets options based upon a processed config.
- The file object contains the current targets src and dest properties.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [gulp](http://gulpjs.com/).

## Release History

- **0.1.0** Initial release

## License

Copyright (c) 2014 Jonathan Barnett. Licensed under the ISC license.

[npm-url]: https://npmjs.org/package/gulp-config
[npm-image]: https://badge.fury.io/js/gulp-config.svg
[travis-url]: https://travis-ci.org/indieisaconcept/gulp-config
[travis-image]: https://travis-ci.org/indieisaconcept/gulp-config.svg?branch=master
[daviddm-url]: https://david-dm.org/indieisaconcept/gulp-config.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/indieisaconcept/gulp-config
