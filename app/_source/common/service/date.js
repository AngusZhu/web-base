

angular.module('dateUtils',[])
.factory('dateService',function($filter){
	
	var calBeginDate = function(num,unit){
			
		if(unit === "WEEK"){
			return calWeekDate(num);
		}else if(unit === "MONTH"){
			return calMonthDate(num);
		}
		
		return "";
	};
	
	var calCurrentDate = function(){
		return $filter('date')(new Date(),'yyyy/MM/dd');
	};
	var calCurrentMonth = function(){
		return $filter('date')(new Date(),'yyyy-MM');
	};
	
	var transFormat = function(val){
		return $filter('date')(val,'yyyy/MM/dd');
	};
	
	var calWeekDate = function(num){
		var date = new Date();
		var day = num * 7;
		var beginDate = date.getTime() - day * 24 * 60 *60 * 1000;
		
		return transFormat(new Date(beginDate));	
	};
	
	var calMonthDate = function(num){	
		var date = new Date();		
		var day = 0;
		
		for(var i = 0; i < num; i++){		
			var month = date.getMonth() - i;
			day += calMonthDay(null,month);
		}
			
		var beginDate = date.getTime() - day * 24 * 60 *60 * 1000;
		
		return transFormat(new Date(beginDate));		
	};
	
	var calMonthDay = function(date,month){
		date = arguments[0] || new Date();
        date.setDate(1);
        date.setMonth(month);
        var time = date.getTime() - 24 * 60 * 60 * 1000;
        var newDate = new Date(time);
        return newDate.getDate();
	};

	return{
		getBeginDate:function(num,unit){return calBeginDate(num,unit);},
		getCurrentDate:function(){return calCurrentDate();},
		getCurrentMonth:function(){return calCurrentMonth();},
		format:function(val){return transFormat(val);}
	};
});