'use strict';
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bt: {
            dist: 'dist',
            build: {
                files: {
                    'dist/tooltip.js': ['src/tooltip.js']
                },
                browserifyOptions: {
                    standalone: 'tooltip'
                }
            },
            min: {
                files: {
                    'dist/tooltip-min.js': ['dist/tooltip.js']
                }
            },
            banner: {
                files: ['dist/*']
            },
            tests: {
                mocha: {
                    src: ['tests/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('build-tools');
};