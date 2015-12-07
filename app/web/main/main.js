angular.module('webapp.main')
    .controller('MainCtrl', function ($scope, $rootScope, $resource,MENU_URL) {
        console.log("come to mainCtrl");
        var resource = $resource(MENU_URL.GET_MENUS);
        resource.get(function (response) {
            if (response.returnCode === '0') {
                var menuList = response.data;
                $scope.menuList = menuList;
            }
        });


    });