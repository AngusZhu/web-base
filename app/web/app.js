'use strict';

// Declare app level module which depends on views, and components
window.webapp = angular.module('webapp', [
    'ui.router',
    'ngRoute',
    'ngResource',
    'widget.overlay',
    'AddAuthTokenService',
    'webapp.main',
    'webapp.login',
    'webapp.version'
]);
webapp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/");

    $stateProvider.state('app', {
        url : '/',
        templateUrl : 'web/setting/index.html',
        controller: 'MainCtrl',
        ncyBreadcrumb : {
            label : 'Common'
        }
    });
});

window.exports = {};

//add interceptor
webapp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('htmlCacheClear');
});

webapp.factory('htmlCacheClear', function ($q, $window) {
    return {
        request: function (config) {
            if (config.method === 'GET' && config.url.substr(-5) === '.html') {
                config.url += '?t=' + window.BUILD_HTML_HASH;
            }
            return config;
        }
    };
});

webapp.service("LoginService", function (store) {
    var LoginInfo = {};

    var setProperty = function (newObj) {
        store.set('__LoginInfo', newObj);
    };
    var getProperty = function () {
        LoginInfo = store.get('__LoginInfo');
        return LoginInfo;
    };

    return {
        setProperty: setProperty,
        getProperty: getProperty
    };
});

