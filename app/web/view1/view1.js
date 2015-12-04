angular.module('myApp.view1', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        console.log("comes view1");
        $routeProvider.when('/view1', {
            templateUrl: 'web/view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])
    .controller('View1Ctrl', [function () {

    }]);