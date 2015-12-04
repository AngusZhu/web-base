
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