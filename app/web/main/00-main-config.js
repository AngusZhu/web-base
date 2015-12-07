angular.module('webapp.main', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: 'web/main/main.html',
            controller: 'MainCtrl'
        });
    }])
   /* .config(function($stateProvider, $urlRouterProvider,$locationProvider) {
        $stateProvider.state('home', {
            url: '/main',
            views: {
                'mainContainer': {
                    templateUrl: 'web/main/main.html',
                    controller: 'MainCtrl'
                }
            }
        });
        $locationProvider.html5Mode(true);
    })*/
    .factory("MENU_URL",function(urlHelper){
        return urlHelper({
            'GET_MENUS' : 'menu/list'
        });
    });

