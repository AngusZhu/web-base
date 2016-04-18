
angular.module('AddAuthTokenService',['angular-storage'])
.factory('PointStore', function(store) {
  return store.getNamespacedStore('wp');
})
.service('AuthTokenService', function(PointStore) {
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
    			PointStore.set('__facilityRights', rights);
    			break;
    			
    		case rightsTypeArry[1]:
    			currentCustomerTrainingRights = rights;
    			PointStore.set('__trainingRights', rights);
    			break;
    			
    		case rightsTypeArry[2]:
    			currentCustomerOtherRights = rights;
    			PointStore.set('__otherRights', rights);
    			break;
    		}
    	}  	
    };
    
    service.initCurrentCustomerRights = function(){
    	PointStore.set('__facilityRights', []);
    	PointStore.set('__trainingRights', []);
    	PointStore.set('__otherRights', []);
    };
    
    service.getCurrentCustomerRights = function(rightsType){
    	var currentCustomerRights = [];
    	
		switch(rightsType) {
		case rightsTypeArry[0]:
			currentCustomerRights = PointStore.get('__facilityRights');
			break;
			
		case rightsTypeArry[1]:
			currentCustomerRights = PointStore.get('__trainingRights');
			break;
			
		case rightsTypeArry[2]:
			currentCustomerRights = PointStore.get('__otherRights');
			break;
		}
    	   	
        return currentCustomerRights;
    };
    
    service.setCurrentToken = function(token) {
    	currentToken = token;
        PointStore.set('token', token);
        return currentToken;
    };

    service.getCurrentToken = function() {
        if (!currentToken) {
        	currentToken = PointStore.get('token');
        }
        return currentToken || "No-Token";
    };
    //USERID
    service.setId = function(id) {
        id = id;
        PointStore.set('__id', id);
        return id;
    };

    service.getId = function() {
        if (!id) {
            id = PointStore.get('__id');
        }
        return id ;
    };

    service.setCustomerId = function(id) {
        currentCustomerId = id;
        PointStore.set('__customer', currentCustomerId);
        return currentCustomerId;
    };

    service.getCustomerId = function() {
        if (!currentCustomerId) {
            currentCustomerId = PointStore.get('__customer');
        }
        return currentCustomerId ;
    };

    service.setCustomerAgeRange = function(v) {
    	currentCustomerAgeRange = v;
        PointStore.set('__customerAgeRange', currentCustomerAgeRange);
        return currentCustomerAgeRange;
    };

    service.getCustomerAgeRange = function() {
        if (!currentCustomerAgeRange) {
        	currentCustomerAgeRange = PointStore.get('__customerAgeRange');
        }
        return currentCustomerAgeRange ;
    };
       
    service.setCustomerMemberStatus = function(v) {
    	currentMemberStatus = v;
        PointStore.set('__memberStatus', currentMemberStatus);
        return currentMemberStatus;
    };

    service.getCustomerMemberStatus = function() {
        if (!currentMemberStatus) {
        	currentMemberStatus = PointStore.get('__memberStatus');
        }
        return currentMemberStatus ;
    };
    
    
    // FULL NAME
    service.setFullName = function(v) {
        fullName = v;
        PointStore.set('__fullname', v);
        return fullName;
    };

    service.getFullName = function() {
        if (!fullName) {
            fullName = PointStore.get('__fullname');
        }
        return fullName ;
    };

    //USERNO 
    service.setCurrentUserNo = function(userNo) {
        currentUserNo = userNo;
        PointStore.set('userNo', userNo);
        return currentUserNo;
    };

    service.getCurrentUserNo = function() {
        if (!currentUserNo) {
            currentUserNo = PointStore.get('userNo');
        }
        return currentUserNo ;
    };
    
    //USERNAME
    service.setCurrentUserName = function(userName) {
        currentUserName = userName;
        PointStore.set('userName', userName);
        return currentUserName;
    };

    service.getCurrentUserName = function() {
        if (!currentUserName) {
            currentUserName = PointStore.get('userName');
        }
        return currentUserName ;
    };
    
    //userType currentUserType
    service.setCurrentUserType = function(userType) {
    	currentUserType = userType;
        PointStore.set('userType', userType);
        return currentUserType;
    };

    service.getCurrentUserType = function() {
        if (!currentUserType) {
        	currentUserType = PointStore.get('userType');
        }
        return currentUserType ;
    };
    //kaptcha currentKaptcha
    service.setCurrentKaptcha = function(kaptcha) {
    	currentKaptcha = kaptcha;
        PointStore.set('kaptcha', kaptcha);
        return currentKaptcha;
    };

    service.getCurrentKaptcha = function() {
        if (!currentKaptcha) {
        	currentKaptcha = PointStore.get('kaptcha');
        }
        return currentKaptcha ;
    };
    
    //Cookie currentCookie
    service.setCurrentCookie = function(cookie) {
    	currentCookie = cookie;
        PointStore.set('cookie', cookie);
        return currentCookie;
    };

    service.getCurrentCookie = function() {
        if (!currentCookie) {
        	currentCookie = PointStore.get('cookie');
        }
        return currentCookie ;
    };
});
