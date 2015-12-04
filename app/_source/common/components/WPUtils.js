
(function () {
	var _WPUtils = window.WPUtils || {};

	_WPUtils.isEmail = function(value) {
		var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
		return EMAIL_REGEXP.test(value);
	};
	window.WPUtils = _WPUtils;

})();