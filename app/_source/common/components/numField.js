

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