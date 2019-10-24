const fs = require('fs');
const path = require('path');
const babelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc')));

const wallabify = require('wallabify');
const wallabyPostprocessor = wallabify({
        // browserify options, such as
        // insertGlobals: false
    }
    // you may also pass an initializer function to chain other
    // browserify options, such as transformers
    // , b => b.exclude('mkdirp').transform(require('babelify'))
);


module.exports = function (wallaby) {
    return {
        files: [
            {pattern: './index.js', load: false},
            {pattern: './node_modules/chai/chai.js', instrument: false},
            {pattern: './node_modules/sinon/pkg/sinon.js', instrument: false},
        ],
        tests: [
            {pattern: 'test/test_*.js', load: false},
        ],
        debug: true,
        trace: true,
        testFramework: 'mocha',
        compilers: {
            '**/*.js': wallaby.compilers.babel(babelConfig),
        },
        postprocessor: wallabyPostprocessor,
        setup: function () {
            window.__moduleBundler.loadTests();
        },
    };
};
