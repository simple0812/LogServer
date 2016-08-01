define([
    'moment',
    'angular'
], function () {
    var commonFilter = angular.module('commonFilter', []);
    commonFilter.filter('dateFilter', function () {
        return function (input) {
            return moment(parseInt(input) * 1000).format('YYYY-MM-DD HH:mm');
        }
    });

    commonFilter.filter('searchFilter', function () {
        return function (items, keyword) {
            if (!keyword) return items;
            return _.filter(items, function (item) {
                return item.name.indexOf(keyword) > -1;
            });
        }
    });
});