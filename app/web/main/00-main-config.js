angular.module('webapp.main', ['ngRoute'])
    .config(function($stateProvider, $urlRouterProvider,$locationProvider) {
        $locationProvider.html5Mode(true);//delete url # symbol

        $stateProvider.state('app.index', {
            url : '/index',
            views: {
                'mainContainer': {
                    templateUrl: 'web/main/index.html',
                    controller: 'MainCtrl'
                }
            }
        });

        $stateProvider.state('app.main', {
            url : '/main',
            views: {
                'mainContainer': {
                    templateUrl: 'web/main/index.html',
                    controller: 'MainCtrl'
                }
            }
        });

    }).factory("MAIN_URLS", function(urlHelper) {
        return urlHelper({
            GET_SYSTEM_INFO: ['/system']
        });
    });