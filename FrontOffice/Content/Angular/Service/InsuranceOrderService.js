app.service("insuranceOrderService", ['$http', function ($http) {
   

    this.saveInsuranceOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/InsuranceOrder/SaveInsuranceOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };
   


    this.getInsuranceOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/InsuranceOrder/GetInsuranceOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };




    this.getPaymentOrderDetails = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/InsuranceOrder/GetPaymentOrderDetails",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };



    this.getCashInPaymentOrderDetails = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/InsuranceOrder/GetCashInPaymentOrderDetails",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };


    this.getInsuranceCompanySystemAccountNumber = function (companyID, insuranceType) {
        var response = $http({
            method: "post",
            url: "/InsuranceOrder/GetInsuranceCompanySystemAccountNumber",
            params: {
                companyID: companyID,
                insuranceType: insuranceType
            }
        });
        return response;
    };

}]);