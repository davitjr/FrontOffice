app.service("operDayOptionsService", ['$http', function ($http) {


	this.getOperDayOptionsList = function (searchParams) {
		var response = $http({
			method: "post",
			url: "/OperDayOptions/GetOperDayOptionsList",
			data: JSON.stringify(searchParams),
			dataType: "json",
			
		});
		return response;
	};


	this.saveOperDayOptions = function (operDayOptionsObject) {
		
		var response = $http({
			method: "post",
			url: "/OperDayOptions/SaveOperDayOptions",
			data: JSON.stringify(operDayOptionsObject),
			dataType: "json",

		});
		return response;
	};

}]);
