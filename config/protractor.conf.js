/**
 * @author: @AngularClass
 */
var helpers = require('./helpers');

exports.config = {
    baseUrl: 'http://localhost:8104/',

    // use `npm run e2e`
    specs: [
        helpers.root('e2e/**.e2e.js'),
        helpers.root('e2e/*.e2e.js')
    ],
    exclude: [],

    framework: 'jasmine2',

    allScriptsTimeout: 110000,
    jasmineNodeOpts: {
        showTiming: true,
        showColors: true,
        isVerbose: false,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000
    },
    directConnect: true,

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['show-fps-counter=true']
        }
    },
    onPrepare: function() {
        browser.ignoreSynchronization = false;
    },

    /**
     * Angular 2 configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
     * `rootEl`
     */
    useAllAngular2AppRoots: true
};