app.controller("VirtualCardStatusChangeOrderCtrl", ['$scope', '$http', 'virtualCardStatusChangeOrderService', 'infoService', function ($scope, $http, virtualCardStatusChangeOrderService, infoService) {
	$scope.order = {};
	$scope.order.RegistrationDate = new Date();
	$scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
	$scope.order.Type = 224;
	$scope.order.SubType = 1;



	$scope.getVirtualCardStatusChangeOrder = function (orderId) {
		var Data = virtualCardStatusChangeOrderService.getVirtualCardStatusChangeOrder(orderId);
		Data.then(function (acc) {
			$scope.order = acc.data;
		}, function () {
			alert('Error getCardStatusChangeOrder');
		});
	};


	$scope.saveVirtualCardStatusChangeOrder = function (virtualcardid,productid) {
		if ($http.pendingRequests.length == 0) {


			//$confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ քարտի սպասարկման գրաֆիկը' })
			//.then(function () {
			showloading();
			$scope.error = null;
			$scope.order.ProductId = productid;
			$scope.order.VirtualCardId = virtualcardid;


			var Data = virtualCardStatusChangeOrderService.saveVirtualCardStatusChangeOrder($scope.order);
			Data.then(function (res) {
				if (validate($scope, res.data)) {
					$scope.path = '#Orders';
					showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
					refresh($scope.order.Type);
					hideloading();
					CloseBPDialog('virtual_card_status_change_order');
				}
				else {
					hideloading();
					document.getElementById("virtualCardStatusChangeOrderLoad").classList.add("hidden");
					$scope.showError = true;
					showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

				}
			}, function () {
				hideloading();
				document.getElementById("virtualCardStatusChangeOrderLoad").classList.add("hidden");
				showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
				alert('Error in saveCardStatusChangeOrder');
			});
			// });
		}
		else {
			return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

		}
	};

	$scope.getVirtualCardStatusChangeReasons = function () {
		var Data = infoService.GetVirtualCardStatusChangeReasons();
		Data.then(function (b) {
			$scope.reasons = b.data;

		}, function () {
			alert('Error');
		});
	};

	$scope.getVirtualCardChangeActions = function () {
		var Data = infoService.GetVirtualCardChangeActions($scope.status);
		Data.then(function (b) {
			$scope.statuses = b.data;

		}, function () {
			alert('Error');
		});
	};




}]);