angular.module('webapp.login', ['ngRoute'])
    .config(function($stateProvider, $urlRouterProvider,$locationProvider) {
        $locationProvider.html5Mode(true);//delete url # symbol
        console.log("login");
        $stateProvider.state('app.login', {
            url : '/login',
            views: {
                'mainContainer': {
                    templateUrl: 'web/login/login.html',
                    controller: 'MainCtrl'
                }
            }
        });

    });