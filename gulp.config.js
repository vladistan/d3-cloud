module.exports = function () {
    var client = './examples/';
    var server = './examples/';
    var report = './report/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true}).js;
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
        index: 'index.html',

        client: client,

        js: [
            './**/*.js',
            './examples/*.js',
            './examples/d3/*.js',
            '!' + '**/*.spec.js'
        ],
        jsOrder: [
            '**/*'
        ],
        report: report,
        root: root,
        server: server,
        source: 'examples/',
        stubsjs: [
            'stubs/**/*.js'
        ],

        /**
         /**
         * plato
         */
        plato: {js: 'examples/**/*.js'},

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
        /**
         * The sequence of the injections into specs.html:
         *  1 testlibraries
         *      mocha setup
         *  2 bower
         *  3 js
         *  4 spechelpers
         *  5 specs
         *  6 templates
         */
        testlibraries: [
            nodeModules + '/mocha/mocha.js',
            nodeModules + '/chai/chai.js',
            nodeModules + '/mocha-clean/index.js',
            nodeModules + '/sinon-chai/lib/sinon-chai.js'
        ],
        specHelpers: ['test-helpers/*.js'],
        specs: ['examples/specs.html'],

        /**
         * Node settings
         */
        defaultPort: '8001'
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    /**
     * karma settings
     */
    config.karma = getKarmaOptions();

    return config;
    ////////////////
    function getKarmaOptions() {
        var options = {
            files: [].concat(
                // bowerFiles,
                // 'examples/**/*.js'
                //'spec.html'
                //'node_modules/**/*'
                'examples/d3/phantom.helpers.js',
                'examples/d3/d3.js',
                'examples/d3/cloud.layout.js',
                'examples/d3/extracted.js',
                'examples/**/*.spec.js'
                //'r_specs.html'
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
                ]
            },
            preprocessors: {}

        };
        options.preprocessors['examples/d3/*.js'] = ['coverage'];
        return options;
    }
};
