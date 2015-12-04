
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
