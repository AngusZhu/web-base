
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
