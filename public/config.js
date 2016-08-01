{
    baseUrl: './js',
    paths: {
        'angular': 'lib/angular',
        'bootstrap': 'lib/bootstrap',
        'underscore': 'lib/underscore',
        'extension': 'lib/extension',
        'common': 'lib/common',
        'moment': 'lib/moment',
        'validator': 'lib/validator',
        'backbone': 'lib/backbone',
        'pager': 'lib/pager',
        'hashChange': 'lib/hashChange',
        'jquery': 'lib/jquery',
        'jquery.ui.widget': 'lib/jquery.ui.widget',
        'jquery.fileupload': 'lib/jquery.fileupload',
        'datetimepicker': 'lib/bootstrap-datetimepicker',
        'md5': 'md5',
        'commonDirect': 'common/directive',
        'commonFilter': 'common/filter',
        // 'user': 'user/app',
        // 'userService': 'user/service',
        // 'userController': 'user/controller',
        // 'article': 'article/app',
        // 'articleService': 'article/service',
        // 'articleController': 'article/controller',

    },
    dir: '../static',
    modules: [{
        name: 'user/app',
        include : [
            'user/service',
            'user/controller',
        ]
        // exclude:[
        //     'angular',
        //     'bootstrap',
        //     'underscore',
        //     'jquery',
        //     'moment'
        // ]
    }, {
        name: 'article/app'
    }],
    shim: {
        'angular': {
            exports: 'angular'
        },
        'datetimepicker': {
            exports: 'datetimepicker',
            deps: ['jquery']
        },
        'angular-route': {
            exports: 'angular-route'
        },
        'common': {
            exports: 'angular-route',
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
        'extension': {
            exports: 'extension',
            deps: ['jquery']
        },
        'commonDirect': {
            exports: 'commonDirect',
            deps: [
                'angular',
                'common',
                'datetimepicker',
                'jquery.fileupload'
            ]
        },
        'commonFilter': {
            exports: 'commonFilter',
            deps: [
                'angular',
                'moment'
            ]
        },
        'jquery.fileupload': {
            exports: 'jquery.fileupload',
            deps: ['jquery', 'jquery.ui.widget']
        }
    }
}