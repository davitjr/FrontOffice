app.controller("VirtualCardCtrl", ['$scope', 'virtualCardService', 'casherService', function ($scope, virtualCardService, casherService) {

	$scope.filter = 1;

	$scope.getVirtualCards = function (productID) {
		var Data = virtualCardService.getVirtualCards(productID);
		Data.then(function (result) {
			var obj = JSON.parse(result.data);
			if (obj.ResultCode == 1) {
				$scope.virtualCards = obj.Result;
			}
			else {
				showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
			}
			
		}, function (result) {
			var error = result.data.Description;
			alert('Error getCard3DSecureService');
		});
	};

	$scope.getVirtualCardHistory = function (virtualCardId) {
		var Data = virtualCardService.getVirtualCardHistory(virtualCardId);
		Data.then(function (result) {
			var obj = JSON.parse(result.data);
			if (obj.ResultCode == 1) {
				$scope.history = obj.Result;
			}
			else {
				showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
			}
			
		}, function (result) {
			var error = result.data.Description;
			alert('Error getCard3DSecureService');
		});
	};

	$scope.setClickedRowVirtualCard = function (virtual) {
		$scope.selectedVirtualcard = virtual;
	};

	$scope.getCasherDescription = function (setNumber) {

		if (setNumber == undefined) {
			$scope.CasherDescription = undefined;
			return;
		}
		var Data = casherService.getCasherDescription(setNumber);
		Data.then(function (dep) {
			$scope.CasherDescription = dep.data;

		}, function () {
			alert('Error');
		});
		return $scope.CasherDescription;
	};

	$scope.reSendUpdateVirtualCard = function (updateRequestId) {
		showloading();
		var Data = virtualCardService.reSendUpdateVirtualCard(updateRequestId);
		Data.then(function (b) {
			hideloading();
			if (b.data.ResultCode == 1) {
				showMesageBoxDialog('Հարցումն ուղարկված է', $scope, 'information');
			}
			else {
				showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
			}
			

		}, function () {
			hideloading();
			showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
		});
	};

}]); 