angular.module('app.main')
    .controller('app.menu.MainCtrl', function ($scope, $rootScope, $resource, MENU_URL, AuthTokenService) {
        console.log("come to mainCtrl");
        var resource = $resource(MENU_URL.GET_MENUS);
        resource.get(function (response) {
            if (response.returnCode === '0') {
                var menuList = response.data;
                $scope.menuList = menuList;
            }
        });


    });