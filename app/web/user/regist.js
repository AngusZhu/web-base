angular.module('myApp.user', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        console.log("comes view1");
        $routeProvider.when('/regist', {
            templateUrl: 'web/user/regist.html',
            controller: 'UserCtrl'
        });
    }])

    .controller('UserCtrl', [function () {

    }]);