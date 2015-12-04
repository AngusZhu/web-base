

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
