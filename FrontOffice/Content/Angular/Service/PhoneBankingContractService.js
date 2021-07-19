app.service("phoneBankingContractService", ['$http', function ($http) {

    this.getPhoneBankingContract = function () {
        var response = $http({
            method: "post",
            url: "/PhoneBankingContract/GetPhoneBankingContract"

        });
        return response;
    };

    this.savePhoneBankingContractOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/PhoneBankingContractOrder/SavePhoneBankingContractOrder",
            data: JSON.stringify(order),
            dataType: "json",          
        });
        return response;
    };

    this.savePhoneBankingContractClosingOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/PhoneBankingContractClosingOrder/SavePhoneBankingContractClosingOrder",
            data: JSON.stringify(order),
            dataType: "json",
        });
        return response;
    };

    this.getPhoneBankingContractPDF = function () {
        var response = $http({
            method: "post",
            url: "/PhoneBankingContract/GetPhoneBankingContractPDF",
            responseType: 'arraybuffer'
           
        });
        return response;
    };

    this.getPhoneBankingContractClosingPDF = function () {
        var response = $http({
            method: "post",
            url: "/PhoneBankingContract/GetPhoneBankingContractClosingPDF",
            responseType: 'arraybuffer'

        });
        return response;
    };

    this.getPhoneBankingContractClosingOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/PhoneBankingContractClosingOrder/GetPhoneBankingContractClosingOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


    this.getPhoneBankingContractOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/PhoneBankingContractOrder/GetPhoneBankingContractOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.savePBActivationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "PhoneBankingContract/SavePBActivationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

}]);