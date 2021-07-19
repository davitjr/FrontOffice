app.service("loanProductDataChangeOrderService", ['$http', function ($http) {



	this.saveLoanProductDataChangeOrder = function (order) {
		var response = $http({
			method: "post",
			url: "/LoanProductDataChangeOrder/SaveLoanProductDataChangeOrder",
			data: JSON.stringify(order)
		});
		return response;
	};


	this.getLoanProductDataChangeOrder= function (orderID) {
		var response = $http({
			method: "post",
			url: "/LoanProductDataChangeOrder/GetLoanProductDataChangeOrder",
			params: {
				orderID: orderID
			}
		});

		return response;
	};


	this.existsLoanProductDataChange = function (appId) {
		var response = $http({
			method: "post",
			url: "/LoanProductDataChangeOrder/ExistsLoanProductDataChange",
			params: {
				appId: appId
			}
		});

		return response;
	};


}]);