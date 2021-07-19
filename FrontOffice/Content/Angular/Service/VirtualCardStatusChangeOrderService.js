app.service("virtualCardStatusChangeOrderService", ['$http', function ($http) {
	this.saveVirtualCardStatusChangeOrder = function (order) {
		var response = $http({
			method: "post",
			url: "/VirtualCardStatusChangeOrder/SaveVirtualCardStatusChangeOrder",
			data: JSON.stringify(order),
			datType: "json"
		});

		return response;
	};

	this.getVirtualCardStatusChangeOrder = function (orderID) {
		var response = $http({
			method: "post",
			url: "/VirtualCardStatusChangeOrder/GetVirtualCardStatusChangeOrder",
			params: {
				orderID: orderID
			}
		});

		return response;
	};

}]);