angular.module('app.user', ['ngRoute'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app.user.regist', {
            url: 'regist',
            views: {
                'mainContainer': {
                    templateUrl: 'web/user/regist.html',
                    controller: 'app.user.UserCtrl'
                }
            }
        });
});