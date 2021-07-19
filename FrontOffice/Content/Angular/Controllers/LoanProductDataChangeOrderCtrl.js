app.controller("LoanProductDataChangeOrderCtrl", ['$scope', '$http', 'loanProductDataChangeOrderService', '$confirm', 'infoService', 'dateFilter', 'limitToFilter', function ($scope, $http, loanProductDataChangeOrderService, $confirm, infoService, dateFilter, limitToFilter) {

	$scope.order = {};

	$scope.getLoanProductDataChangeOrder = function (OrderId) {
		var Data = loanProductDataChangeOrderService.getLoanProductDataChangeOrder(OrderId);
		Data.then(function (acc) {
			$scope.loanProductDataChangeOrder = acc.data;
		}, function () {
			alert('Error getLoanProductDataChangeOrder');
		});
	};

    $scope.saveLoanProductDataChangeOrder = function (productId, fieldType, fieldValue) {
        $scope.isExistLoanEarlyMature = false;
		if ($http.pendingRequests.length == 0) {
			$confirm({title: 'Շարունակե՞լ', text: 'Առկա է կետի փոփոխության համաձայնագիր'})
				.then(function () {
					showloading();
					$scope.order.FieldType = fieldType;
					$scope.order.FieldValue = fieldValue;
					$scope.order.ProductAppId = productId;
					var Data = loanProductDataChangeOrderService.saveLoanProductDataChangeOrder($scope.order);
					Data.then(function (res) {
						hideloading();
						if (validate($scope, res.data)) {
							$scope.path = '#Orders';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            refresh(203);
						}
						else {
							$scope.showError = true;
							showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
							
						}

					}, function () {
						hideloading();
						showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
						alert('Error saveCreditLineTerminationOrder');
					});
				});

		}
		else {
			return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

		}
	};

	$scope.existsLoanProductDataChange = function (appId) {
		var Data = loanProductDataChangeOrderService.existsLoanProductDataChange(appId);
		Data.then(function (acc) {
			$scope.isExistLoanEarlyMature = acc.data;
		}, function () {
			alert('Error existsLoanProductDataChange');
		});
	};


}]);