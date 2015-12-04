'use strict';

var window;
exports.APPCONFIG = {
	ENV: 'dev',
	LANG: 'en_us',
	BASE_URL: 'rest/',
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

