

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
