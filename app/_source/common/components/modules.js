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