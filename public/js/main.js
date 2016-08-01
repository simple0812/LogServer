var main = {
    init: function(name) {
        require.config({
            baseUrl: '/js',
            paths: {
                'angular': 'lib/angular',
                'bootstrap': 'lib/bootstrap',
                'underscore': 'lib/underscore',
                'common': 'lib/common',
                'moment': 'lib/moment',
                'validator': 'lib/validator',
                'pager': 'lib/pager',
                'jquery': 'lib/jquery',
                'hashChange': 'lib/hashChange',
                'md5': 'md5',
                'commonDirect': 'common/directive',
                'commonFilter': 'common/filter',
                'service': name + '/service',
                'controller': name + '/controller'
            },
            shim: {
                'angular': {
                    exports: 'angular'
                },
                'underscore': {
                    exports: '_'
                },
                'common': {
                    exports: 'common',
                    deps: ['jquery', 'bootstrap']
                },
                'hashChange': {
                    exports: 'hashChange',
                    deps: ['jquery']
                },
                'pager': {
                    exports: 'pager',
                    deps: ['hashChange']
                },
                'moment': {
                    exports: 'moment'
                },
                'validator': {
                    exports: 'validator',
                    deps: ['jquery', 'common']
                },
                'bootstrap': ['jquery'],
                'commonDirect': {
                    exports: 'commonDirect',
                    deps: [
                        'angular',
                        'common'
                    ]
                },
                'commonFilter': {
                    exports: 'commonFilter',
                    deps: [
                        'angular',
                        'moment'
                    ]
                }
            }
        });
    }
}