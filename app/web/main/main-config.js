angular.module('app.main', ['ngRoute'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app.main', {
            url: '/main',
            views: {
                'mainContainer': {
                    templateUrl: 'web/main/main.html',
                    controller: 'app.menu.MainCtrl'
                }
            }
        });
    })
    .factory("MAIN_URL",function(urlHelper){
        return urlHelper({
            'GET_MENUS' : 'menu/list'
        });
    });

