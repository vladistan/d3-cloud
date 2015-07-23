module.exports = function () {
    var report = './report/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };
    var nodeModules = 'node_modules';

    var config = {
        /**
         * File paths
         */
        // all javascript that we want to vet
        alljs: [
            './examples/*.js',
            './examples/d3/*.js',
            './*.js',
            '!examples/d3/d3.js'
        ],
        js: [
            '**/*.js',
            './examples/*.js',
            './examples/d3/*.js',
            '!' + '**/*.spec.js'
        ],
        stubsjs: [
            'stubs/**/*.js'
        ],

        /**
         /**
         * plato
         */
        plato: {js: '**/*.js'},
        /**
         * Bower and NPM files
         */
        bower: bower,
        packages: [
            './package.json',
            './bower.json'
        ],
        /**
         * specs.html, our HTML spec runner
         */
        specRunner: specRunnerFile,
        specRunnerFile: specRunnerFile,
        specs: ['**/*.spec.js'],

        /**
         * Node settings
         */
        defaultPort: '8001'
    };

    return config;
};
