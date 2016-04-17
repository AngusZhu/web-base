angular.module('webapp.login', ['ngRoute'])
    .config(function($stateProvider, $urlRouterProvider,$locationProvider) {
        $locationProvider.html5Mode(true);//delete url # symbol
        console.log("login");


    });