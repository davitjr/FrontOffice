app.service("MatureOrderService", ['$http', function ($http) {

    this.SaveMatureOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/MatureOrder/SaveMatureOrder",

            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };
    this.GetMatureOrder = function (orderID) {

        var response = $http({
            method: "post",
            url: "/MatureOrder/GetMatureOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.getMatureApplication = function ( account, matureType, currentRateValue, contractNumber, amount) {
        var response = $http({
            method: "post",
            url: "/MatureOrder/GetMatureApplication",
            responseType: 'arraybuffer',
            params: {
                matureType: matureType,
                currentRateValue: currentRateValue,
                contractNumber: contractNumber,
                amount: amount
            },
            data: JSON.stringify(account),
            dataType:"json"
        });
        return response;
    };

    this.getThreeMonthLoanRate = function (productId) {
        var response = $http({
            method: "post",
            url: "/MatureOrder/GetThreeMonthLoanRate",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getLoanMatureCapitalPenalty = function (order) {
        var response = $http({
            method: "post",
            url: "/MatureOrder/GetLoanMatureCapitalPenalty",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getLoanCalculatedRest = function (loan,order) {
        var response = $http({
            method: "post",
            url: "/MatureOrder/GetLoanCalculatedRest",
            data: JSON.stringify({ "loan": loan, "order": order }),
            dataType: "json"
        });
        return response;
    }

    this.getProductAccount = function (order) {
        var response = $http({
            method: "post",
            url: "/MatureOrder/GetProductAccount",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

}]);
