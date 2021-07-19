app.service("loanDelayOrderService", ['$http', function ($http) {


    this.saveLoanDelayOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/LoanDelayOrder/SaveLoanDelayOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.getLoanDelayOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/LoanDelayOrder/GetLoanDelayOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

}]);