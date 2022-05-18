app.service("virtualCardService", ['$http', function ($http) {

	
	this.getVirtualCards = function (productID) {
		var response = $http({
			method: "post",
			headers: {
				'Content-Type': "application/json"
			},
			url: "/Card/GetVirtualCards",
			responseType: 'application/json',
			params: {
				productID: productID
			}
		});
		return response;
	};

	this.getVirtualCardHistory = function (virtualCardId) {
		var response = $http({
			method: "post",
			headers: {
				'Content-Type': "application/json"
			},
			url: "/Card/GetVirtualCardHistory",
			responseType: 'application/json',
			params: {
				virtualCardId: virtualCardId
			}
		});
		return response;
	};

	this.reSendUpdateVirtualCard = function (updateRequestId) {
		var response = $http({
			method: "post",
			url: "/VirtualCardStatusChangeOrder/ReSendVirtualCardRequest",
			params: {
				requestId: updateRequestId
			}
		});

		return response;
	};

	this.getVirtualCardCTFInfo = function (virtualCardId) {
		var response = $http({
			method: "post",
			headers: {
				'Content-Type': "application/json"
			},
			url: "/Card/GetVirtualCardCTFInfo",
			responseType: 'application/json',
			params: {
				virtualCardId: virtualCardId
			}
		});
		return response;
	};


	this.getVirtualCardInfoFromThales = function (productID) {
		var response = $http({
			method: "post",
			headers: {
				'Content-Type': "application/json"
			},
			url: "/Card/GetVirtualCardInfoFromThales",
			responseType: 'application/json',
			params: {
				productID: productID
			}
		});
		return response;
	};



}]);