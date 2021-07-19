app.controller("OperDayOptionsCtrl", ['$scope', 'operDayOptionsService', 'infoService', 'utilityService', '$filter', '$http', '$rootScope', '$state', function ($scope, operDayOptionsService, infoService, utilityService,$filter, $http, $rootScope, $state) {
	$rootScope.OpenMode = 15;

	$scope.filter = {
		StartDate: new Date(Date.now() - 1*24*60*60*1000),
		EndDate: new Date(),
		UserID: null,
		
	};
	
	
	//*************************************************************************************************************************

	$scope.getTypeofOperDayClosingOptions = function () {
		var Data = infoService.getTypeofOperDayClosingOptions();
		Data.then(function (options) {
			$scope.operDayClosingOptions = options.data;
		}, function () {
			alert('Error getTypeofOperDayClosingOptions');
		});
	};


	$scope.getOperDayOptionsList = function () {
		$scope.loading = true;
		var Data = operDayOptionsService.getOperDayOptionsList($scope.filter);
		Data.then(function (operDayOptionsList) {
			$scope.operDayOptionsList = operDayOptionsList.data;
		},
			function () {
				$scope.loading = false;
				alert('Error getOperDayOptionsList');
			});
	};
	$scope.getCurrentOperDay = function () {
		var Data = utilityService.getCurrentOperDay();
		Data.then(function (opDate) {
			$scope.filter.OperDay = $filter('mydate')(opDate.data, "dd/MM/yyyy");
			$scope.getOperDayOptionsList();
		}, function () {
			alert('Error getCurrentOperDay');
		});
	};



	$scope.initOperDayChecing = function () {
		$scope.operDayOptionsObject = [];

		for (var i = 1; i < 5; i++) {
			$scope.operDayOptionsObject.push({
				IsEnabled: false,
				Code: i,
			});
		}
	};
	$scope.refreshOperDayOptionss = function () {
		var refreshScope = angular.element(document.getElementById('OperDayOptions')).scope()
		if (refreshScope != undefined) {
			refreshScope.getOperDayOptionsList();
		}
	};



	$scope.saveOperDayOptions = function () {
		var Data = operDayOptionsService.saveOperDayOptions($scope.operDayOptionsObject);
		Data.then(function (acc) {

			$scope.opDayOptions = acc.data;
			ShowToaster('Պահպանումը կատարված է', 'success');
			$scope.refreshOperDayOptionss();
			$scope.getOperDayOptionsList();
			CloseBPDialog('newOperDayOptions');
		}, function () {
			alert('Error saveOperDayOptions');
		});
		
		};



}]); 