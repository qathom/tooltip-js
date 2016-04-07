'use strict';
module.exports = {
    dist: 'dist',
    build: {
        files: {
            'dist/tooltip.js': ['src/tooltip.js']
        },
        browserifyOptions: {
            standalone: 'tooltip'
        },
        minifyFiles: {
            'dist/tooltip-min.js': ['dist/tooltip.js']
        },
        bannerFiles: ['dist/*']
    },
    tests: {
        mocha: {
            src: ['tests/*.js']
        }
    }
};
