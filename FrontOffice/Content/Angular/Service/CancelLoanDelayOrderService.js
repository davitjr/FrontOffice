app.service("cancelLoanDelayOrderService", ['$http', function ($http) {


    this.saveCancelLoanDelayOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/CancelLoanDelayOrder/SaveCancelLoanDelayOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };
    this.getCancelLoanDelayOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CancelLoanDelayOrder/GetCancelLoanDelayOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

}]);