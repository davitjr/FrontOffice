app.service("CustomerArrestsInfoService", ['$http', function ($http) {

    this.getCustomerArrestsInfo = function (customerNumber) {
        var response = $http({
            method: "POST",
            url: "/CustomerArrestsInfo/GetCustomerArrestsInfo",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.getCustomerInfos = function (customerNumber) {
        var response = $http({
            method: "POST",
            url: "/CustomerArrestsInfo/GetCustomerInfos",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.getArrestTypes = function () {
        var response = $http({
            method: "post",
            url: "/CustomerArrestsInfo/GetArrestTypesList",
            dataType: "json"
        });
        return response;
    };
    
    this.getArrestsReasonTypes = function () {
        var response = $http({
            method: "post",
            url: "/CustomerArrestsInfo/GetArrestsReasonTypes",
            dataType: "json"
        });
        return response;
    };

    this.postAddedCustomerArrestInfo = function (obj) {
        var response = $http({
            method: "post",
            url: "/CustomerArrestsInfo/PostAddedCustomerArrestInfo",
            data: obj,
            dataType: "json"
        });
        return response;
    };
    this.postRemovedCustomerArrestInfo = function (obj) {
        var response = $http({
            method: "post",
            url: "/CustomerArrestsInfo/PostRemovedLoanArrest",
            data: obj,
            dataType: "json"
        });
        return response;
    };

    this.getOperday = function () {
        var response = $http({
            method: "post",
            url: "/CustomerArrestsInfo/GetOperday",
            dataType: "json"
        });
        return response;
    };

    this.getSetNumberInfo = function () {
        var response = $http({
            method: "post",
            url: "/CustomerArrestsInfo/GetSetNumberInfo",
            dataType: "json"
        });
        return response;
    }


    this.checkCustomerFilial = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/CustomerArrestsInfo/CheckCustomerFilial",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };
}]);

