angular.module('webapp.setting')

.controller('MainCtrl', function($scope,$rootScope, $resource, $state,$window, $stateParams, AuthTokenService,MAIN_URLS,alertify) {
		var resource=$resource(MAIN_URLS.GET_SYSTEM_INFO,"",{query:{method:'GET'}});
		resource.query( function (data) {
			if (data.returnCode === '000000' && data.data) {
				console.log("error");
				//$state.go('app.training.coaching.view',{coachComment:JSON.stringify(param)});
			}else{
				console.log("error2");
			}
		},function(data){
			console.log(data);
		});
});

