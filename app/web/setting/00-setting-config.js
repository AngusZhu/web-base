angular.module('webapp.setting', ['ngRoute'])
    .config(function($stateProvider, $urlRouterProvider,$locationProvider) {
        $locationProvider.html5Mode(true);//delete url # symbol

        $stateProvider.state('app.setting', {
            url : '/setting/rule',
            views: {
                'mainContainer': {
                    templateUrl: 'web/setting/index.html',
                    controller: 'SettingCtrl'
                }
            }
        });

    }).factory("SETTING_URLS", function(urlHelper) {
        return urlHelper({
            GET_ALL_MECHANISM: ['/mechanism']
        });
    });