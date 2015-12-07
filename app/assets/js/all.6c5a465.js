'use strict';

// Declare app level module which depends on views, and components
window.webapp = angular.module('webapp', [
    'ui.router',
    'ngRoute',
    'ngResource',
    'AddAuthTokenService',
    'webapp.main',
    'webapp.version'
]);

webapp.config( function ($routeProvider,$stateProvider, $urlRouterProvider,$locationProvider) {
    $locationProvider.html5Mode(true);//delete url # symbol
    $routeProvider.otherwise({redirectTo: '/'});
    //$urlRouterProvider.otherwise("/");
 /*   $stateProvider.state('webapp.main', {
        url: '/',
        templateUrl: 'web/main/main.html',
        controller: 'MainCtrl'
    });*/
    $routeProvider.otherwise({redirectTo: '/main'});

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
/**
    example :
    
    in parent controller:
    
    $scope.page = {
            "pageNumber" : 1,
            "pageSize" : 10        
    };

    Ajax response
    $scope.conditionSearch = function(){
    resource.get(params,function(data){
            if(data.returnCode === '0'){                    
                $scope.transactions = data.data.list;
                $scope.totalPage = data.data.totalPage;         //This is need
                $scope.currentPage = data.data.currentPage;     //This is need
                $scope.pageSize = data.data.pageSize;           //This is need
            }
    });

    } 

    In HTML template
    paging-action is the function of fetch data in your Controller
    <div class="pagination right" 
        wp-pagination current-page="currentPage" page-size="pageSize" 
        total-page="totalPage" paging-action="conditionSearch()" 
        page="page"></div>
*/

webapp.directive('wpPagination', function () {
    function _init(scope, attrs) {
        scope.List = [];
        scope.Hide = false;
        scope.dots = scope.dots || '...';
        scope.currentPage = +scope.currentPage || 1;
        scope.totalPage = +scope.totalPage || 0;
        scope.ulClass = scope.ulClass || 'pagination';
        scope.adjacent = +scope.adjacent || 2;
        scope.activeClass = scope.activeClass || 'active';
        scope.disabledClass = scope.disabledClass || 'disabled';
        scope.hideIfEmpty = false;
        scope.showPrevNext = scope.$eval(attrs.showPrevNext) || true;
    }
    function _validate(scope, pageCount) {
        if (scope.currentPage > pageCount) {
            scope.currentPage = pageCount;
        }
        if (scope.currentPage <= 0) {
            scope.currentPage = 1;
        }
        if (scope.adjacent <= 0) {
            scope.adjacent = 2;
        }
        if (pageCount <= 1) {
            scope.Hide = scope.hideIfEmpty;
        }
    }

    function addPrevNext(scope, pageCount, mode){
        if (!scope.showPrevNext || pageCount < 1) { return; }
        var disabled,linkItem;
        if(mode === 'prev') {
            disabled = scope.currentPage - 1 <= 0;
            var prevPage = scope.currentPage - 1 <= 0 ? 1 : scope.currentPage - 1;
            linkItem = {
             value: "<", 
             title: 'Previous',
             page: prevPage,
             liClass: disabled ? scope.disabledClass + ' prev' : 'prev'
            };
        } else {
            disabled = scope.currentPage + 1 > pageCount;
            var nextPage = scope.currentPage + 1 >= pageCount ? pageCount : scope.currentPage + 1;
            linkItem = { 
                value : ">", 
                title: 'Next',
                page: nextPage,
                liClass: disabled ? scope.disabledClass + ' next' : 'next'
            };
        }
        scope.List.push(linkItem);
    }

    function addRange(start, finish, scope) {
        var i = 0;
        for (i = start; i <= finish; i++) {
            var item = {
                value: i,
                title: i,
                liClass: scope.currentPage === i ? scope.activeClass : ''
            };
            scope.List.push(item);
        }
    }

    function addDots(scope) {
        scope.List.push({
            title: scope.dots
        });
    }

    function addFirst(scope, next) {
        addRange(1, 2, scope);
        if(next !== 3){
            addDots(scope);
        }
    }

    function addLast(pageCount, scope, prev) {
        if(prev !== pageCount - 2){
            addDots(scope);
        }
        addRange(pageCount - 1, pageCount, scope);
    }


    function build(scope, attrs) {
        if (!scope.pageSize || scope.pageSize <= 0) { scope.pageSize = 1; }
        var totalPage = scope.totalPage;
        _init(scope, attrs);
        _validate(scope, totalPage);
        var start, finish;
        var fullAdjacentSize = (scope.adjacent * 2) + 2;
        addPrevNext(scope, totalPage, 'prev');
        if (totalPage <= (fullAdjacentSize + 2)) {
            start = 1;
            addRange(start, totalPage, scope);
        } else {
            if (scope.currentPage - scope.adjacent <= 2) {
                start = 1;
                finish = 1 + fullAdjacentSize;
                addRange(start, finish, scope);
                addLast(totalPage, scope, finish);
            }
            else if (scope.currentPage < totalPage - (scope.adjacent + 2)) {
                start = scope.currentPage - scope.adjacent;
                finish = scope.currentPage + scope.adjacent;
                addFirst(scope, start);
                addRange(start, finish, scope);
                addLast(totalPage, scope, finish);
            }
            else {
                start = totalPage - fullAdjacentSize;
                finish = totalPage;
                addFirst(scope, start);
                addRange(start, finish, scope);
            }
        }
        addPrevNext(scope, totalPage, 'next');
        scope.gotoPage = function(page){
            var currentPage = scope.page.pageNumber;
            if(page === '<'){
                if(currentPage === 1){
                    return;
                }
               scope.page.pageNumber = currentPage - 1;
            }else if(page === '>'){
                if(scope.totalPage === currentPage){
                    return;
                }
               scope.page.pageNumber = currentPage + 1;
            }else{
                scope.page.pageNumber = page;
            }
            scope.pagingAction();
        };
    }


    return {
        restrict: 'EA',
        scope: {
            currentPage: '=',
            pageSize: '=',
            totalPage: '=',
            page:'=',
            dots: '@',
            hideIfEmpty: '@',
            ulClass: '@',
            activeClass: '@',
            disabledClass: '@',
            adjacent: '@',
            showPrevNext: '@',
            pagingAction: '&'
        },
        template:
            '<a href="javascript:;" ng-class="Item.liClass" ng-click="gotoPage(Item.value)" ng-repeat="Item in List">{{Item.title}}</a>',
        link: function (scope, element, attrs) {
            scope.$watchCollection('[currentPage,pageSize,totalPage,page]', function () {
                build(scope, attrs);
            });
        }
    };
});

(function () {
	var _WPUtils = window.WPUtils || {};

	_WPUtils.isEmail = function(value) {
		var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		return EMAIL_REGEXP.test(value);
	};
	window.WPUtils = _WPUtils;

})();
/*
 * @author: Chan
 * @date: July 8, 2015
 * @description: All the modules
 *
 */


(function(m) {
    var jq = angular.element;

    (function(MOD_PAY_WITH_CREDIT_CARD) {

        m.service(MOD_PAY_WITH_CREDIT_CARD, function($rootScope, $resource, $state, $interval, urlHelper) {
            var callback = null,
                checkCcTxStatusIntervalId = null,
                self = this,
                networkErrorCount = 0,
                config = {},
                timeStart = null,
                posAuthResource = $resource(APPCONFIG.CREDIT_CARD_POS_URL + 'auth', {}, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    save: {
                        method: "POST",
                        isArray: false,
                        transformResponse: function(data, headersGetter) {
                            return {
                                returnCode: '0',
                                errorMessageEN: ''
                            };
                        }
                    }
                }),
                DEFAULT_OPTIONS = {
                    referenceNo: 0,
                    amount: 0,
                    callbackUrl:'',
                    tips:0,
                    statusUrl:'',
                    timeout:0
                };
            var getCreditCardPaymentStatus = function() {
                if((new Date() - timeStart)/1000 > self.config.timeout){
                    self.clear();
                    $rootScope.$broadcast("Credit-Payment",{data:{status:'Timeout'}});
                    return;
                }
                var creditCardStatusResource = $resource(self.config.statusUrl, {});
                creditCardStatusResource.get({
                    orderNo: self.config.referenceNo
                }, function(response, status, headers, config) {
                    if (response !== null && response.returnCode === 0 && response.data && response.data.status) {
                        if (response.data.status.toLocaleUpperCase() === 'SUC' || response.data.status.toLocaleUpperCase() === 'FAIL') {
                            self.clear();
                            $rootScope.$broadcast("Credit-Payment",response);
                        }
                    } else if (response !== null && response.returnCode !== 0 && response.errorMessageEN) {
                        self.clear();
                        alertify.error(response.errorMessageEN);
                    }
                }, function(error, status, headers, config) {
                    // alertify.error('Saving reservation failed, please contact us.');
                });
            };
            var checkCreditCardPaymentStatus = function() {
                checkCcTxStatusIntervalId = $interval(function() {
                     getCreditCardPaymentStatus();
                }, 5000);
            };

            self.pay = function(config) {
                networkErrorCount = 0;
                timeStart = new Date();
                self.config = jq.extend({}, DEFAULT_OPTIONS, config);
                posAuthResource.save({
                    "referenceNo": config.referenceNo,
                    "amount": config.amount,
                    "tips": config.tips,
                    "callbackUrl": config.callbackUrl
                }, function(response, status, headers, config) {
                    checkCreditCardPaymentStatus();
                }, function(error, status, headers, config) {
                    checkCreditCardPaymentStatus();
                });
            };


            this.clear = function() {
                if (checkCcTxStatusIntervalId != null) {
                    $interval.cancel(checkCcTxStatusIntervalId);
                    checkCcTxStatusIntervalId = null;
                }
            };
        });
    })('gtaCreditCardPayment');

})(webapp);


angular.module('widget.numberField', [])
    .directive('numberField', function() {
        return {
            restrict: 'A',
            transclude: true,
//            require: '^onlyDigits',
            scope: {
                config: '=numValue'
            },
            templateUrl: "_source/common/template/number-field.tpl.html",
            link: function(scope, element) {


            }
        };
    })
    .service('numberField', function() {

    })
.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits='';
                    try{
                        digits = parseInt(val, 10);
                    }catch(e){

                    }
                    if (digits * 1 === 0)
                        digits = '';

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits,10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});


angular.module('widget.overlay',[])

.provider("ElasticOverlay", function(){

    var defaults = {
        overlayMask: true,
        overlayMaskClass: 'overlay-mask',
        overlayClass: 'overlay',
        closeClass: 'overlay-close',
        closeLink: true,
        closeLinkClass: 'overlay-close-link',
        confirmLinkClass: 'overlay-confirm-link',
        keyboard: true,
        appendTo: 'body',
        autoCalculateSize: false
    };

    var globalOptions = {};

    this.options = function(value) {
        globalOptions = value;
    };

    this.$get = ['$http', '$document', '$compile', '$rootScope', '$controller', '$templateCache', '$q',  '$timeout',
    function($http, $document, $compile, $rootScope, $controller, $templateCache, $q, $timeout) {

        var body = $document.find('body');

        function createElement (clazz) {
            var el = angular.element("<div>");
            el.addClass(clazz);
            return el;
        }

        function ElasticOverlay (opts) {
            
            var self = this, options = this.options = angular.extend({}, defaults, globalOptions, opts);

            if (options.overlayMask) {
                this.overlayMaskEL = createElement(options.overlayMaskClass);
            }

            this.overlayEL = createElement(options.overlayClass);

            this.handledEscKey = function(e) {
                if (e.which === 27) {
                    self.close();
                    e.preventDefault();
                    self.$scope.$apply();
                }
            };

            this.overlayMaskClick = function(e) {
                self.close();
                e.preventDefault();
                self.$scope.$apply();
            };

            this.overlayCloseClick = function(e) {
                self.close();
                e.preventDefault();
                self.$scope.$apply();
            };

            this.overlayOkClick = function(e) {
                self.close({
                    event: 'ok'
                });
                e.preventDefault();
                self.$scope.$apply();
            };

            $rootScope.$on("$routeChangeSuccess", function(){
                self.close();
            });
        }

        ElasticOverlay.prototype.isOpen = function() {
            return this._open;
        };

        ElasticOverlay.prototype.open = function(templateUrl, controller) {
            var self = this,
                options = this.options;

            if (templateUrl) {
                options.templateUrl = templateUrl;
            }

            if (controller) {
                options.controller = controller;
            }

            if (!(options.template || options.templateUrl)) {
                throw new Error('ElasticOverlay.open expected template or templateUrl, neither found. Use options or open method to specify them.');
            }

            this._loadResolves().then(function(locals) {
                var $scope = locals.$scope = self.$scope = $rootScope.$new();

                if (options.contents) {
                    if(angular.isArray(options.contents)) {
                        $scope.popupMessage = options.contents;
                    }else if(angular.isString(options.contents)) {
                        $scope.popupMessage = [options.contents];
                    }
                }

                $scope.firstBtn = options.firstBtnVal || 'Cancel';
                $scope.secondBtn = options.secondBtnVal || 'Ok';

                if (options.closeLink) {
                    $scope.close = options.closeLink;
                }
                if (options.titleContents) {
                    $scope.titleMsg  =  options.titleContents;
                }

                self.overlayEL.html(locals.$template);

                if (self.options.controller) {
                    var ctrl = $controller(self.options.controller, locals);
                    self.overlayEL.contents().data('ngControllerController', ctrl);
                }

                $compile(self.overlayEL.contents())($scope);
                self._addElementsToDom();
                self._show();

                self._bindEvents();

                $timeout(function() {
                    self.overlayEL.addClass('moving');
                    if (self.options.autoCalculateSize) {
                        self.overlayEL.css('left',self._getPos()+'px');
                    }
                });

                window.onresize = function() {
                    self.overlayEL.addClass('moving');
                    $timeout(function() {
                        if (self.options.autoCalculateSize) {
                            self.overlayEL.css('left',self._getPos()+'px');
                        }
                    });
                };
            });

            this.deferred = $q.defer();
            return this.deferred.promise;
        };

        ElasticOverlay.prototype.close = function(result) {
            this._onCloseComplete(result);
        };

        ElasticOverlay.prototype._bindEvents = function() {
            if (this.options.keyboard) {
                body.bind('keydown', this.handledEscKey);
            }
            if (this.options.overlayMask && this.options.overlayMaskClick) {
                this.overlayMaskEL.bind('click', this.overlayMaskClick);
            }

            this._getElement(this.options.closeLinkClass, 'click', this.overlayCloseClick);
            this._getElement(this.options.closeClass, 'click', this.overlayCloseClick);
            this._getElement(this.options.confirmLinkClass, 'click',this.overlayOkClick);
        };

        ElasticOverlay.prototype._getElement = function(element, event, fn) {
            var ele = this.overlayEL[0].querySelector('.' + element);
            if (ele !== null) {
                this.item = angular.element(ele);
                if (this.item) {
                    this.item.unbind(event,fn).bind(event, fn);
                }
            }
        };

        ElasticOverlay.prototype._unbindEvents = function() {
            if (this.options.keyboard) {
                body.unbind('keydown', this.handledEscKey);
            }
            if (this.options.overlayMask && this.options.overlayMaskClick) {
                this.overlayMaskEL.unbind('click', this.overlayMaskClick);
            }
        };

        ElasticOverlay.prototype._onCloseComplete = function(result) {
            this._removeElementsFromDom();
            this._unbindEvents();
            if (result) {
                this.deferred.resolve(result);
            }
        };

        ElasticOverlay.prototype._addElementsToDom = function() {
            body.append(this.overlayEL);
            if (this.options.overlayMask) {
                body.append(this.overlayMaskEL);
            }
            this._open = true;
        };

        ElasticOverlay.prototype._show = function() {
            this.overlayEL.css('display','block');
            if (this.options.overlayMask) {
                this.overlayMaskEL.css('display','block');
            }
        };

        ElasticOverlay.prototype._getPos = function() {
            var popupWidth = this.overlayEL[0].offsetWidth;
            var screenWidth = document.body.clientWidth;
            return (parseInt(screenWidth-popupWidth,10))/2;
        };

        ElasticOverlay.prototype._removeElementsFromDom = function() {
            var ele = this.overlayEL;
            ele.removeClass('moving');
            $timeout(function(){
                ele.remove();
            },500);
            if (this.options.overlayMask) {
                this.overlayMaskEL.remove();
            }
            this._open = false;
        };

        ElasticOverlay.prototype._loadResolves = function() {
            var values = [], keys = [], templatePromise, self = this;

            if (this.options.template) {
                templatePromise = $q.when(this.options.template);
            } else if (this.options.templateUrl) {
                templatePromise = $http.get(this.options.templateUrl, {cache:$templateCache})
                .then(function(response) { return response.data; });
            }

            keys.push('$template');
            values.push(templatePromise);

            return $q.all(values).then(function(values) {
                var locals = {};
                angular.forEach(values, function(value, index){
                    locals[keys[index]] = value;
                });
                locals.ElasticOverlay = self;

                return locals;
            });
        };

        var openingOverlay = null;

        return {
            overlay: function(opts) {
                if (openingOverlay && openingOverlay.isOpen()) {return;}
                var overlay = new ElasticOverlay(opts);
                openingOverlay = overlay;
                return overlay;
            },
            msgOverlay: function(opts) {
                if (openingOverlay && openingOverlay.isOpen()) {return;}
                var overlay = new ElasticOverlay(opts);
                openingOverlay = overlay;
                return overlay.open('web/template/popup.tpl.html');
            },
            promptOverlay: function(opts) {
                if (openingOverlay && openingOverlay.isOpen()) {return;}
                var overlay = new ElasticOverlay(opts);
                openingOverlay = overlay;
                return overlay.open('web/template/popupmsg.tpl.html');
            }
        };

    }];

})

.factory("PopupMessage", ['ElasticOverlay', function(ElasticOverlay) {

    return {
        confirm: function(templateText, firstBtnText, secondBtnText, titleText) {
            return ElasticOverlay.msgOverlay({
                overlayMaskClass: 'overlay-transparent-mask overlay-mask',
                overlayClass: 'overlay overlay-message',
                //autoCalculateSize: true,
                contents: templateText,
                firstBtnVal: firstBtnText,
                secondBtnVal: secondBtnText,
                titleContents: titleText
            });
        },
        alert: function(templateText, titleText) {
            return ElasticOverlay.msgOverlay({
                overlayMaskClass: 'overlay-transparent-mask overlay-mask',
                overlayClass: 'overlay overlay-message',
                //autoCalculateSize: true,
                contents: templateText,
                titleContents: titleText,
                closeLink: false
            });
        },
        msg: function(templateText, titleText, firstBtnText, secondBtnText) {
            return ElasticOverlay.promptOverlay({
                overlayClass: 'overlay',
                autoCalculateSize: true,
                contents: templateText,
                titleContents: titleText,
                firstBtnVal: firstBtnText,
                secondBtnVal: secondBtnText
            });
        }
    };
}])

.factory('alertify', function (PopupMessage) {
    return {
        success: function (msg) {
            PopupMessage.alert(msg, 'Success');
        },
        error: function (msg) {
            PopupMessage.alert(msg, 'Error');
        },
        info: function (msg) {
            PopupMessage.alert(msg, 'Info');
        },
        confirm: function(msg, yesBtn, noBtn){
            return PopupMessage.confirm(msg, yesBtn, noBtn, 'Confirm');
        }
    };
});


(function(m) {

   function getUrl(v, debug) {
      return (debug ? APPCONFIG.MOCK_URL : APPCONFIG.BASE_URL) + v + APPCONFIG.SUFFIX;
   }

   m.factory('urlHelper', function() {
      return function(urlData) {
         var k, v, rst = {},
            debug = window.location.href.indexOf('debug=true') > -1;

         if (typeof(urlData) === 'string') {
            return getUrl(urlData, debug);
         }
         for (k in urlData) {
            if (typeof(urlData[k]) === 'string')
               v = urlData[k];
            else if (urlData[k].length === 1)
               v = urlData[k][0];
            else
               v = debug ? urlData[k][1] : urlData[k][0];

            rst[k] = getUrl(v, debug);
         }
         return rst;
      };
   });
})(webapp);


(function (m) {
	// only number input
	(function (ONLY_NUMBER_DIRECTIVE) {
		m.directive('onlyNumber', function () {
			return {
				require: 'ngModel',
				restrict: 'A',
				link: function (scope, elem, attr, ctrl) {
					elem[0].onkeyup = function() {
						this.value = this.value.replace(/[^\d.]/g, '')  // Remove all the non-number character
								.replace('/^\./g', '') // If the first char is '.', then remove it
								.replace(/\.{2,}/g, '') // Ensure there are only one '.'
								.replace('.', '$#$').replace(/\./g,"").replace("$#$",".");
						return true;
		            };
				}
			};
		});
	})();

	// #broken image
	(function (BROKEN_IMAGE_DIRECTIVE) {

		var DEFAULT_BROKEN_IMG = 'app/assets/img/brokenimage.png';
	    m.directive('gtaBrokenImage', function ($parse) {
	        return {
	            restrict: 'A',
	            link: function(scope, element, attrs) {
	            	var img = attrs.gtaBrokenImage || DEFAULT_BROKEN_IMG;
		        	element.bind('error', function(e) {
						if (DEFAULT_BROKEN_IMG !== element.attr('src'))
		          			element.attr({'src': img, 'broken': 'broken'});
		        	});
		      	}
	        };
	    });
	})();
	(function (ONLY_NUMBER_DIRECTIVE) {
		m.directive('onlyPositiveInteger', function () {
			return {
				require: 'ngModel',
				restrict: 'A',
				link: function (scope, elem, attr, ctrl) {
					elem[0].onkeyup = function() {
						this.value = parseInt(this.value.replace(/[^\d.]/g, '').replace('/^\./g', '').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g,"").replace("$#$","."),10);
						return true;
		            };
				}
			};
		});
	})();
	//equals password 2015-7-13 chenli
	(function(EQUALS) {
	    m.directive('equals', function() {
	        return {
	            restrict: 'A', // only activate on element attribute
	            require: '?ngModel', // get a hold of NgModelController
	            link: function(scope, elem, attrs, ngModel) {
	                if (!ngModel) return; // do nothing if no ng-model

	                // watch own value and re-validate on change
	                scope.$watch(attrs.ngModel, function() {
	                    validate();
	                });

	                // observe the other value and re-validate on change
	                attrs.$observe('equals', function(val) {
	                    validate();
	                });

	                var validate = function() {
	                    // values
	                    var val1 = ngModel.$viewValue;
	                    var val2 = attrs.equals;
	                    // set validity
	                    ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
	                };
	            }
	        };
	    });
	})();

	(function(NG_FOCUS) {
	    m.directive('gtaFocus', function() {
	        var FOCUS_CLASS = "ng-focused";
	        return {
	            restrict: 'A',
	            require: 'ngModel',
	            link: function(scope, element, attrs, ctrl) {
	                ctrl.$focused = false;
	                element.bind('focus', function(evt) {
	                    element.addClass(FOCUS_CLASS);
	                    scope.$apply(function() {
	                        ctrl.$focused = true;
	                    });
	                }).bind('blur', function(evt) {
	                    element.removeClass(FOCUS_CLASS);
	                    scope.$apply(function() {
	                        ctrl.$focused = false;
	                    });
	                });
	            }
	        };
	    });
	})();


	//password strength process
	(function(GTA_PSW_PROCESS){
		m.directive('gtaPswProcess',function(){
			return{
				restrict: 'AE',
				scope:{
					gtaClass: "@",
					gtaId: "@"
				},
				template: '<div id="pwd-container" ng-class="gtaClass"><div class="pwstrength_viewport_progress"></div></div>',
                link: function(scope, element, attrs, ctrl){
                 	var options = {};
				    options.ui = {
				        container: "#pwd-container",
				        showVerdictsInsideProgressBar: true,
				        viewports: {
				            progress: ".pwstrength_viewport_progress"
				        }
				    };
				    options.common = {
				        debug: true,
				        onLoad: function () {
				            $('#messages').text('Start typing password');
				        }
				    };
				    $('#'+ scope.gtaId).pwstrength(options);
                 }
			};
		});
	})(); 


	// tip about password rule
	(function(PSW_RULE_TIP){
		m.directive('gtaPswRuleTip', function(){
			return {
				restrict: 'AE',
				template: '<i class="icon icon-help" id="icon-help" original-title="Password length: 8-20 alphanumeric characters." ></i>',
				link: function(scope, element, attrs, ctrl){
					$('#icon-help').tipsy({gravity: 'w'}).mouseenter(function(){
						$(".tipsy").css({'font-size': '16px'});
					});
				}
			};
		});
	})();

})(webapp);


(function (m) {

	// #datepicker
	(function (DATEPICKER_DIRECTIVE) {
		var _DP = {
			// CONSTANT
			'OPTION_PREFIX': 'gta-dp-option-',
			'EVENT_PREFIX': 'gta-dp-event-',

			// Attributes
			'defaults': {
				format: 'M d, yyyy',
				autoclose: true
			},
			'parseAttr': function (str) {
				var arr = str.split('-'), i, len = arr.length, rst = arr[0];

				for(i = 1; i < len; i++) {
					rst += arr[i].substr(0, 1).toUpperCase() + arr[i].substr(1);
				}
				return rst;
			}
		};

		if (!$.fn.datepicker)
			throw 'datepicker required';

		Date.prototype.format = function (format, lang) { //author: Chan
			return $.fn.datepicker.DPGlobal.formatDate(new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())), format || _DP.defaults.format, lang || 'en');
		};


		$.fn.datepicker.DPGlobal.template = $.fn.datepicker.DPGlobal.template.replace('<div class="datepicker">', '<div class="datepicker gtadatepicker">')
			.replace('&#171;', '<').replace('&#187;', '>')
			.replace('&#171;', '<').replace('&#187;', '>')
			.replace('&#171;', '<').replace('&#187;', '>');

		m.directive('gtaDatepicker', function($parse, $compile) {
			return {
				restrict: "AE",
				replace: true,
				scope: {
					gtaDpModel: '=',	//the modal in parent scope
					gtaStartDate: '=',
					gtaEndDate: '='
				},
				template: function (elem, attrs) {
					if (attrs.gtaDpInline)
						return '<div class="gtadatepicker datepicker"></div>';

					return '<div class="gtadatepicker-input">' +
								  '<input type="text" ng-model="gtaDpModel" readonly="readonly">' +
								  //'<span class="add-on"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></span>' +
							'</div>';
				},
				link: function(scope, element, attrs) {
					var jqAttr = {}, jqEvent = {}, obj = null, dom = null, config = null, ignoreSet = false, fireEvent = true,
						inline = !!attrs.gtaDpInline,
                        rangeMode = !!attrs.gtaDpRangeMode,
                        range = [],
						weekly = attrs.gtaDpView === 'week',
						onload = null,
						defaultValue = attrs.gtaDpDefault,
						rangeTarget = attrs.gtaDpRangeTarget ? attrs.gtaDpRangeTarget : null,
                        tmp = null,
						ngAttrs = attrs.$attr, k, v;

					if (ngAttrs['gtaDpEventLoad'] && attrs['gtaDpEventLoad']) {
						onload = attrs['gtaDpEventLoad'];
						delete ngAttrs['gtaDpEventLoad'];
						delete attrs['gtaDpEventLoad'];
					}

					for (k in ngAttrs) {
						if (ngAttrs[k].indexOf(_DP.OPTION_PREFIX) === 0)
							jqAttr[_DP.parseAttr(ngAttrs[k].substr(_DP.OPTION_PREFIX.length))] = attrs[k];

						if (ngAttrs[k].indexOf(_DP.EVENT_PREFIX) === 0)
							jqEvent[_DP.parseAttr(ngAttrs[k].substr(_DP.EVENT_PREFIX.length))] = attrs[k];
					}
					if (attrs.id)
						element.attr('id', attrs.id);

					if (jqAttr.startDate && jqAttr.startDate === 'today') {
						jqAttr.startDate = new Date();
					} else if(jqAttr.startDate){
						jqAttr.startDate = new Date(jqAttr.startDate);
					}
					
					if (jqAttr.endDate && jqAttr.endDate === 'today') {
						jqAttr.endDate = new Date();
					} else if(jqAttr.endDate){
						jqAttr.endDate = new Date(jqAttr.endDate);
					}

					dom = (inline) ? element : element.find('input');
                    config = $.extend({}, _DP.defaults, jqAttr);

					for (tmp in config) {
                         if (config[tmp] === 'false')
                             config[tmp] = false;
                         if (config[tmp] === 'true')
                             config[tmp]  = true;
                    }
                    if (rangeMode)
                        config.forceParse = false;

                    obj = dom.datepicker(config);
                    if (element.attr('required')){
						element.removeAttr('required');
						dom.attr('required', true);
						$compile(element)(scope);
					}

					if (attrs.gtaDpElement)
						scope.$parent[attrs.gtaDpElement] = obj;

					if (onload && typeof(scope.$parent[onload]) === 'function') {
						scope.$parent[onload].call(obj);
					}
					obj.callMethod = function () {
						fireEvent = false;
						obj.datepicker.apply(obj, arguments);
					};

					scope.gtaDpElem = obj;
					if (weekly) {
						obj.on('changeDate', function (e) {
							if (!fireEvent) {
								fireEvent = true;
								return;
							}
							var dates = [], date = e.date, day = date.getDay(),
								onedaytime = 3600 * 1000 * 24,
								i = 0,
								firstDate = new Date(date.getTime() - day * onedaytime);
							dates.push(firstDate);
							while (++i < 7) {
								dates.push(new Date(firstDate.getTime() + i * onedaytime));
							}
							ignoreSet = true;
							fireEvent = false;
							obj.datepicker('setDates', dates);
						});
					}
					if (!inline) {
						element.find('.add-on').click(function () {
							obj.datepicker('show');
						});
					} else {
						obj.on('changeDate', function (e) {
							ignoreSet = true;
							scope.gtaDpModel = obj.datepicker('getFormattedDate');
							if (!scope.$root.$$phase)
								scope.$apply();
						});
					}
					if (rangeTarget) {
						obj.on('changeDate', function (e) {
							scope.$parent[rangeTarget].datepicker('setStartDate', e.date);
						});
					}
                    if (rangeMode) {
                        obj.on('changeDate', function (e) {
                            var choose = null;
                            if (!fireEvent) {
                                fireEvent = true;
                                return false;
                            }

                            if (range.length === 2)
                                range = [];
                            if (e.date) {
                            	range.push($.fn.datepicker.Constructor.prototype._local_to_utc(e.date).valueOf());
                        	} else {
                        		range = [];
                        	}

                            choose = (range.length === 2 && range[1] > range[0]) ? range : null;
                            fireEvent = false;
                            obj.datepicker('setRange', choose);
                            obj.datepicker('setDate', e.date);

                            if (choose) {
                                scope.gtaDpModel = new Date(choose[0]).format() + ' - ' + new Date(choose[1]).format();
                                scope.$apply();
                                setTimeout(function () {
                                    obj.datepicker('hide');
                                    // Because input datepicker only have a focus event, so we have to manual blur it.
                                    dom.blur();
                                }, 300);
                            } else if (range.length === 2) {
                                range = [range[1]];
                            }
                        });
                    }
					for (k in jqEvent) {
						obj.on(k, (function (evt) {
							return function (e) {
								if (fireEvent) {
									// If it's weekly view, it will trigger change date twice.
									if (!weekly || (weekly && e.dates.length > 1))
										scope.$parent[evt].call(element, e);
								}
								else
									fireEvent = true;
							};
						})(jqEvent[k]));
						/*obj.on(k, function (e) {
							if (fireEvent) {
								// If it's weekly view, it will trigger change date twice.
								if (!weekly || (weekly && e.dates.length > 1))
									scope.$parent[jqEvent[k]].call(element, e);
							}
							else
								fireEvent = true;
						});*/
					}
					if (defaultValue) {
						if (defaultValue === 'today') {
							scope.gtaDpModel = new Date().format('M d, yyyy');
						} else {
							scope.gtaDpModel = defaultValue;
						}
					}
					scope.$watch('gtaStartDate', function(newVal) {
						if (newVal) {
							obj.datepicker('setStartDate', new Date(newVal));
						}
					});
					
					scope.$watch('gtaEndDate', function(newVal) {
						if (newVal) {
							obj.datepicker('setEndDate', new Date(newVal));
						}
					});
					scope.$watch('gtaDpModel', function(newVal) {
						if (newVal) {
							if (!ignoreSet) {
                                if (!rangeMode) {
                                    fireEvent = false;
                                    var specialDate = new Date(newVal);
                                    if ( Object.prototype.toString.call(specialDate) === "[object Date]" ) {
									  if (!isNaN(specialDate.getTime())) {
									     obj.datepicker('setDate', new Date(newVal));
									  }
									}
                                }
                            }
							ignoreSet = false;
						}
					});
				}
			};
		});
	})();

	(function (DATETAG_DIRECTIVE) {
		var en = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
		m.directive('gtaDateTag', function($parse, $compile) {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					date: '='	//the modal in parent scope
				},
				template: '<a class="gta-date-tag" href="javascript:;">' +
								'<div class="month uppercase" ng-bind="month"></div>' +
                    			'<span class="yellow font30" ng-bind="day"></span>' +
                    			'<h4 class="yellow txt-center" ng-bind="year"></h4>' +
							'</a>',
				link: function(scope, element, attrs) {
					var date = new Date(scope.date);
					scope.month = en[date.getMonth()];
					scope.year = date.getFullYear();
					scope.day = date.getDate();
				}
			};
		});
	})();
    (function (GRAPH_DIRECTIVE) {
        m.directive('gtaGraph', function($parse, $compile) {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
                    nothing: '=',
                    isGray : '='
                },
				template: '<a href="javascript:;" title="{{description}}" class="photo-area2 left">' +
                            '<h4>{{description}}</h4>' +
                            '<img ng-src="{{src}}" ng-class="{true:\'gray\'}[isGray]"/>' +
                        '</a>',
				link: function(scope, element, attrs) {
                    scope.src = attrs.src;
                    scope.description = attrs.description;
                    var evt = attrs.click;
                    scope.clickEvent = function ($event) {
                        var pevt = scope.$parent[evt];
                        if (evt && pevt && typeof(pevt) === 'function') {
                            pevt.call(scope.$parent);
                        }
                    };
				}
			};
		});
	})();

})(webapp);


webapp.filter('accountRightsFilter', function() {
	return function(input) {
		var result = input;
		if (input === 'true') {
			result = 'yes';
		} else if (input === 'false') {
			result = 'no';
		}
		return result;
	};
});

webapp.filter('facilityPermissionFilter', function() {
	return function(input) {
		var result = '';
		if (input === 'AO') {
			result = 'Access Only';
		} else if (input === 'BA') {
			result = 'Booking & Access';
		}
		return result;
	};
});

webapp.filter('memberTypePartialFilter', function() {
	return function(input) {
		var result = '';
		if (input === 'IPM') {
			result = 'Primary Patron';
		} else if (input === 'IDM') {
			result = 'Dependent Patron';
		} else if (input === 'CPM') {
			result = 'Primary Patron'; 
		} else if (input === 'CDM') {
			result = 'Dependent Patron';
		} else if (input === 'MG') {
			result = 'Patron Guest';
		} else if (input === 'HG') {
			result = 'House Guest';
		}
		return result;
	};
});

webapp.filter('serviceAccountFilter', function() {
	return function(input) {
		var result = '';
		if (input === 'IDV') {
			result = 'Individual';
		} else if (input === 'COP') {
			result = 'Corporate';
		}
		return result;
	};
});

webapp.filter('courseTypeFilter', function() {
	return function(input) {
		var result = '';
		if (input === 'GSS') {
			result = 'GOLF';
		} else if (input === 'TSS') {
			result = 'TENNIS';
		}
		return result;
	};
});

webapp.filter('payMethodFilter', function() {
	return function(input) {
		var result = input;
		if (input === 'VISA') {
			result = 'Credit Card';
		} else if (input === 'CV') {
			result = 'Cash Value';
		}
		return result;
	};
});

webapp.filter('courseTypeFullNameFilter', function() {
	return function(input) {
		var result = '';
		if (input === 'GSS') {
			result = 'Golf Course';
		} else if (input === 'TSS') {
			result = 'Tennis Course';
		}
		return result;
	};
});

webapp.filter('courseDateFilter', function($filter) {
	return function(input,fmt) {
		return $filter('date')(new Date(input),fmt);
	};
});

webapp.filter('courseStatusFilter', function() {
	return function(input) {
		var result = '';
		if (input === 'OPN') {
			result = 'Opening';
		} else if (input === 'CLD') {
			result = 'Closed';
		} else if (input === 'FUL') {
			result = 'Full';
		} else if (input === 'ACT') {
			result = 'Active';
		} else if (input === 'CAN') {
			result = 'Cancelled';
		} else {
			result = input;
		}

		return result;
	};
});

webapp.filter('courseEnrollStatusFilter', function() {
	return function(input, type) {
		var result = '';
		if (input === 'REG') {
			result = 'Registered';
		} else if (input === 'ACT' && type === 'DETAIL') {
			result = 'Wait for Payment';
		} else if (input === 'ACT') {
			result = 'Wait to Pay';
		} else if (input === 'PND' && type === 'DETAIL') {
			result = 'Waiting for prior approval. Thank you very much for your interest in this course!';
		} else if (input === 'PND') {
			result = 'Pending';
		} else if (input === 'REJ' && type === 'DETAIL') {
			result = 'This enrollment is not accepted!';
		} else if (input === 'REJ') {
			result = 'Rejected';
		} else if (input === 'CAN' && type === 'DETAIL') {
			result = 'This enrollment has been cancelled';
		} else if (input === 'CAN') {
			result = 'Cancelled';
		} else {
			result = input;
		}

		return result;
	};
});

webapp.filter('courseDescriptionFilter', function() {
	return function(input) {
		var result = '';
		if (input && input.length > 50) {
			result = input.substring(0,50) + "...";
		} else {
			result = input;
		}

		return result;
	};
});

webapp.filter('acceptanceFilter', function() {
	return function(input) {
		var result = '';
		if (input === 'A') {
			result = 'Auto';
		} else if (input === 'M') {
			result = 'Require school approval';
		}else{
			result = input;
		}
		return result;
	};
});

webapp.filter('ageRangeFilter', function() {
	return function(input) {
		var result = '';
		if (input === 'KID') {
			result = '11-';
		} else if (input === 'CHILD') {
			result = '18-';
		} else if (input === 'ADULT') {
			result = '18+';
		} else if (input === 'SENIOR') {
			result = '60+';
		} else{
			result = input;
		}
		return result;
	};
});

webapp.filter('portalCurrencyFilter', function($filter) {
	return function(input) {
		var result = input;
		if(input){
			result = '' + $filter('currency')(input);		
			if(result.indexOf('(') > -1){
				result = '-' + result.substring(1,result.length-1);
			}
		} else if(input === 0){
			return $filter('currency')(input);
		} else{
			result = 'N/A';
		}
		
		if(result.indexOf('.') > -1){
			result = result.substring(0,result.indexOf('.'));
		}
		
		return result;
	};
});
webapp.filter('spritDateTypeFilter', function() {
	return function (input) {
		if (input) {
			return input.replace(/-/g, '/').substring(0,10);
		}
		return input;
	};
});
//2015-Aug-18 to 2015/08/18
webapp.filter('biasDateTypeFilter', function() {
	return function (input) {
		if (input) {
			return new Date(input).format('yyyy/mm/dd');
		}
		return input;
	};
});
//to format 2015-Dec-12
webapp.filter('mDateTypeFilter', function() {
	return function (input) {
		if (input) {
			return new Date(input).format('yyyy-M-dd');
		}
		return input;
	};
});
//daypass substring
webapp.filter('daypassSubstring', function() {
	return function (input) {
		if (input) {
			return input.substring(0, input.lastIndexOf('-'));
		}
		return input;
	};
});

webapp.filter('month', function() {
	return function (input) {
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];
		if (input) {
			var d = new Date(input);
			return monthNames[d.getMonth()];
		}
		return input;
	};
});

webapp.filter('year', function() {
	return function (input) {
		if (input) {
			var d = new Date(input);
			return d.getFullYear();
		}
		return input;
	};
});

webapp.filter('day', function() {
	return function (input) {
		if (input) {
			var d = new Date(input);
			return d.getDate();
		}
		return input;
	};
});

webapp.filter('nameFilter', function() {
	return function(input) {
		var result = '';
		if (input) {
			result = input.substring(0,1).toUpperCase() + input.substring(1);
		}
		return result;
	};
});

webapp.config(function($httpProvider) {
	$httpProvider.interceptors.push('addTokenInterceptor');
	$httpProvider.interceptors.push('noTokenInterceptor');
});

webapp.factory('addTokenInterceptor', function(AuthTokenService) {
	return {
		request: function(config, $rootScope) {
			//		      config.headers = {'Content-Type':"application/json;charset=UTF-8"};
			config.headers['token'] = AuthTokenService.getCurrentToken();
			config.headers['sessionId'] = AuthTokenService.getCurrentCookie();
			return config;
		}
	};
});
webapp.factory('noTokenInterceptor', function($window, AuthTokenService, $rootScope, $injector) {
	return {
		response: function(response) {
			if (response.data.returnCode === "9010103" || response.data.returnCode === "9010105" ||
				response.data.returnCode === "9010101" || response.data.returnCode === "9010102" ||
				response.data.returnCode === "9010104" || response.data.returnCode === "9010106" || response.data.returnCode === "9010113") {
				// $window.location.href = "#/login";
				var stateService = $injector.get('$state');
				stateService.go('user.login');
				return response;
			}
			if (response.data.returnCode) {
				var kaptchaCodes = response.data.returnCode.split(",");
				for (var i = 0; i < kaptchaCodes.length; i++) {
					if (kaptchaCodes[i] === "9010108" || kaptchaCodes[i] === "9010107") {
						$rootScope.isNeedKaptcha = true;
						AuthTokenService.setCurrentKaptcha(true);
					}
					if (kaptchaCodes[i] !== "9010108" && kaptchaCodes[i] !== "9010107" && kaptchaCodes[i].length === 7) {
						$rootScope.isNeedKaptcha = false;
						AuthTokenService.setCurrentKaptcha(false);
					}
				}
			}
			return response;
		}
	};
});

angular.module('AddAuthTokenService',['angular-storage'])
.factory('WPStore', function(store) {
  return store.getNamespacedStore('wp');
})
.service('AuthTokenService', function(WPStore) {
    var service = this,
        currentToken = null,
    	currentUserNo = null,
        currentUserName = null,
        currentCustomerId = null,
        id = null,
    	currentCookie = null,
    	currentKaptcha = null,
        fullName = null,
    	currentUserType = null,
    	currentCustomerAgeRange = null,
    	currentMemberStatus = null,
    	currentCustomerFacilityRights = [],
    	currentCustomerTrainingRights = [],
    	currentCustomerOtherRights = [],
    	rightsTypeArry = ['facility','training','other'];

    
    service.setCurrentCustomerRights = function(rights, rightsType){
    	
    	if(rights){
    		switch(rightsType) {
    		case rightsTypeArry[0]:
    			currentCustomerFacilityRights = rights;
    			WPStore.set('__facilityRights', rights);
    			break;
    			
    		case rightsTypeArry[1]:
    			currentCustomerTrainingRights = rights;
    			WPStore.set('__trainingRights', rights);
    			break;
    			
    		case rightsTypeArry[2]:
    			currentCustomerOtherRights = rights;
    			WPStore.set('__otherRights', rights);
    			break;
    		}
    	}  	
    };
    
    service.initCurrentCustomerRights = function(){
    	WPStore.set('__facilityRights', []);
    	WPStore.set('__trainingRights', []);
    	WPStore.set('__otherRights', []);
    };
    
    service.getCurrentCustomerRights = function(rightsType){
    	var currentCustomerRights = [];
    	
		switch(rightsType) {
		case rightsTypeArry[0]:
			currentCustomerRights = WPStore.get('__facilityRights');
			break;
			
		case rightsTypeArry[1]:
			currentCustomerRights = WPStore.get('__trainingRights');
			break;
			
		case rightsTypeArry[2]:
			currentCustomerRights = WPStore.get('__otherRights');
			break;
		}
    	   	
        return currentCustomerRights;
    };
    
    service.setCurrentToken = function(token) {
    	currentToken = token;
        WPStore.set('token', token);
        return currentToken;
    };

    service.getCurrentToken = function() {
        if (!currentToken) {
        	currentToken = WPStore.get('token');
        }
        return currentToken || "No-Token";
    };
    //USERID
    service.setId = function(id) {
        id = id;
        WPStore.set('__id', id);
        return id;
    };

    service.getId = function() {
        if (!id) {
            id = WPStore.get('__id');
        }
        return id ;
    };

    service.setCustomerId = function(id) {
        currentCustomerId = id;
        WPStore.set('__customer', currentCustomerId);
        return currentCustomerId;
    };

    service.getCustomerId = function() {
        if (!currentCustomerId) {
            currentCustomerId = WPStore.get('__customer');
        }
        return currentCustomerId ;
    };

    service.setCustomerAgeRange = function(v) {
    	currentCustomerAgeRange = v;
        WPStore.set('__customerAgeRange', currentCustomerAgeRange);
        return currentCustomerAgeRange;
    };

    service.getCustomerAgeRange = function() {
        if (!currentCustomerAgeRange) {
        	currentCustomerAgeRange = WPStore.get('__customerAgeRange');
        }
        return currentCustomerAgeRange ;
    };
       
    service.setCustomerMemberStatus = function(v) {
    	currentMemberStatus = v;
        WPStore.set('__memberStatus', currentMemberStatus);
        return currentMemberStatus;
    };

    service.getCustomerMemberStatus = function() {
        if (!currentMemberStatus) {
        	currentMemberStatus = WPStore.get('__memberStatus');
        }
        return currentMemberStatus ;
    };
    
    
    // FULL NAME
    service.setFullName = function(v) {
        fullName = v;
        WPStore.set('__fullname', v);
        return fullName;
    };

    service.getFullName = function() {
        if (!fullName) {
            fullName = WPStore.get('__fullname');
        }
        return fullName ;
    };

    //USERNO 
    service.setCurrentUserNo = function(userNo) {
        currentUserNo = userNo;
        WPStore.set('userNo', userNo);
        return currentUserNo;
    };

    service.getCurrentUserNo = function() {
        if (!currentUserNo) {
            currentUserNo = WPStore.get('userNo');
        }
        return currentUserNo ;
    };
    
    //USERNAME
    service.setCurrentUserName = function(userName) {
        currentUserName = userName;
        WPStore.set('userName', userName);
        return currentUserName;
    };

    service.getCurrentUserName = function() {
        if (!currentUserName) {
            currentUserName = WPStore.get('userName');
        }
        return currentUserName ;
    };
    
    //userType currentUserType
    service.setCurrentUserType = function(userType) {
    	currentUserType = userType;
        WPStore.set('userType', userType);
        return currentUserType;
    };

    service.getCurrentUserType = function() {
        if (!currentUserType) {
        	currentUserType = WPStore.get('userType');
        }
        return currentUserType ;
    };
    //kaptcha currentKaptcha
    service.setCurrentKaptcha = function(kaptcha) {
    	currentKaptcha = kaptcha;
        WPStore.set('kaptcha', kaptcha);
        return currentKaptcha;
    };

    service.getCurrentKaptcha = function() {
        if (!currentKaptcha) {
        	currentKaptcha = WPStore.get('kaptcha');
        }
        return currentKaptcha ;
    };
    
    //Cookie currentCookie
    service.setCurrentCookie = function(cookie) {
    	currentCookie = cookie;
        WPStore.set('cookie', cookie);
        return currentCookie;
    };

    service.getCurrentCookie = function() {
        if (!currentCookie) {
        	currentCookie = WPStore.get('cookie');
        }
        return currentCookie ;
    };
});



angular.module('dateUtils',[])
.factory('dateService',function($filter){
	
	var calBeginDate = function(num,unit){
			
		if(unit === "WEEK"){
			return calWeekDate(num);
		}else if(unit === "MONTH"){
			return calMonthDate(num);
		}
		
		return "";
	};
	
	var calCurrentDate = function(){
		return $filter('date')(new Date(),'yyyy/MM/dd');
	};
	var calCurrentMonth = function(){
		return $filter('date')(new Date(),'yyyy-MM');
	};
	
	var transFormat = function(val){
		return $filter('date')(val,'yyyy/MM/dd');
	};
	
	var calWeekDate = function(num){
		var date = new Date();
		var day = num * 7;
		var beginDate = date.getTime() - day * 24 * 60 *60 * 1000;
		
		return transFormat(new Date(beginDate));	
	};
	
	var calMonthDate = function(num){	
		var date = new Date();		
		var day = 0;
		
		for(var i = 0; i < num; i++){		
			var month = date.getMonth() - i;
			day += calMonthDay(null,month);
		}
			
		var beginDate = date.getTime() - day * 24 * 60 *60 * 1000;
		
		return transFormat(new Date(beginDate));		
	};
	
	var calMonthDay = function(date,month){
		date = arguments[0] || new Date();
        date.setDate(1);
        date.setMonth(month);
        var time = date.getTime() - 24 * 60 * 60 * 1000;
        var newDate = new Date(time);
        return newDate.getDate();
	};

	return{
		getBeginDate:function(num,unit){return calBeginDate(num,unit);},
		getCurrentDate:function(){return calCurrentDate();},
		getCurrentMonth:function(){return calCurrentMonth();},
		format:function(val){return transFormat(val);}
	};
});
'use strict';

angular.module('SYSCODE',['angular-storage'])
.service('SysCodeService', function(store,urlHelper,$resource) {
	var service = this,
	currentMapping = null,
	SYSCode = urlHelper({
		'BUSINESS_NATURE': 'dropdownlists/businessNature',
		'NATIONALITY':'dropdownlists/nationality',
		'DROPDOWN_EDUCATION': 'dropdownlists/education',
		'DROPDOWN_HKDISTRICT': 'dropdownlists/HKDistrict'
	});

	service.getCodeMapping = function(code) {
		currentMapping = store.get(code);
        if (!currentMapping) {
        	var currentResource = $resource(SYSCode[code], null);
				currentResource.get(null, function(data) {
					if(data && data.data && data.data.list){
						store.set(code, data.data.list);
						return data.data.list;
					}
				});
        	
        }
        return currentMapping;
    };

    service.getCodeDisplay = function (dropdownlist,codeValue) {
    	var codeDisplay = '';
    	if (!dropdownlist) {
    		return "";
    	}
    	 dropdownlist.forEach( function(element, index, array){
    		if (codeValue === element.codeValue) {
    			codeDisplay = element.codeDisplay;
    		}
    	});
    	 return codeDisplay;
    };
});
'use strict';

(function () {
	var MSG = {} || window.MSG;

	// Common part
	MSG.COMMON = {
		ERR_BUSY: 'System busy, please retry later.'
	};

	// Module User 
	MSG.MOD_USER = {
		LOGIN: {
			ERR_USERNAME_EMPTY: 'User name cannot be empty',
			ERR_USERNAME_FORMAT: 'User name format is wrong',
			ERR_PASSWORD_EMPTY: 'User password cannot be empty',
			ERR_RES_NO_USERNAME: 'Login Failed, there is not user name value',
			ERR_RES_NO_USERTYPE: 'Login Failed, there is not user type value',
			ERR_RES_NO_USERNO: 'Login Failed, there is not userNo value'
		}
	};

	// export
	window.MSG = MSG;
})();
'use strict';

var window;
exports.APPCONFIG = {
	ENV: 'dev',
	LANG: 'en_us',
	BASE_URL: '//localhost:8080/rest/',
	MOCK_URL: 'mock/', 
	SUFFIX: '',
	SHOW_VERSION: true,
	CREDIT_CARD_POS_URL : 'http://127.0.0.1:8091/pos/credit/'
};

if (window) {
	var tmp  = exports.APPCONFIG, w = window.APPCONFIG || {}, k = null;
	for (k in tmp) {
		w[k] = tmp[k];
	}
	window.APPCONFIG = w;
}


'use strict';

var window;
exports.APPCONFIG = {
	ENV: 'dev',
	LANG: 'en_us',
	BASE_URL: 'http://localhost:8080/rest/',
	MOCK_URL: 'mock/', 
	SUFFIX: '',
	SHOW_VERSION: true,
	CREDIT_CARD_POS_URL : 'http://127.0.0.1:8091/pos/credit/'
};

if (window) {
	var tmp  = exports.APPCONFIG, w = window.APPCONFIG || {}, k = null;
	for (k in tmp) {
		w[k] = tmp[k];
	}
	window.APPCONFIG = w;
}

