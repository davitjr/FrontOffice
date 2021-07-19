app.service("ChangeBranchOrderService", ['$http', function ($http) {
    this.saveChangeBranchOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/ChangeBranchOrder/SaveChangeBranchOrder",
            data: JSON.stringify(order),
            datType: "json"
        });

        return response;
    };

    this.getChangeBranchOrder = function (ID) {
        var response = $http({
            method: "post",
            url: "/ChangeBranchOrder/GetChangeBranchOrder",
            params: {
                orderID: ID
            }
        });

        return response;
    };

    this.getCurrentBranch = function (ID) {
        var response = $http({
            method: "post",
            url: "/ChangeBranchOrder/getCurrentBranch",
            params: {
                cardNumber: ID
            }
        });

        return response;
    };


}]);