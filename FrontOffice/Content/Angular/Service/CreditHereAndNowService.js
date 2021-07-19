app.service("creditHereAndNowService", ['$http', function ($http) {

    this.getSearchedCreditsHereAndNow = function (searchParams) {

        var response = $http({
            method: "post",
            url: "/CreditHereAndNow/GetSearchedCreditsHereAndNow",
            data: JSON.stringify(searchParams),
            dataType: "json" 
        });
        return response;
    };

    this.saveCreditHereAndNowActivationPreOrder = function (order) {

        var response = $http({
            method: "post",
            url: "/CreditHereAndNow/SaveCreditHereAndNowActivationPreOrder",
            data: JSON.stringify(order),
            dataType: "json" 
        });
        return response;
    };

    this.approveCreditHereAndNowActivationPreOrder = function (preOrderID) {

        var response = $http({
            method: "post",
            url: "/CreditHereAndNow/ApproveCreditHereAndNowActivationPreOrder",
            params: {
                preOrderID: preOrderID
            }
        });
        return response;
    };
     

    this.AuthorizeCustomerByCustomerNumber = function (customerNumber) {

        var response = $http({
            method: "post",
            url: "/CreditHereAndNow/AuthorizeCustomerByCustomerNumber",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    }; 

    this.resetIncompletePreOrderDetailQuality = function () {

        var response = $http({
            method: "post",
            url: "/CreditHereAndNow/ResetIncompletePreOrderDetailQuality"
        });
        return response;
    };

    this.getIncompletePreOrdersCount = function () {

        var response = $http({
            method: "post",
            url: "/CreditHereAndNow/GetIncompletePreOrdersCount"
        });
        return response;
    }; 
}]);