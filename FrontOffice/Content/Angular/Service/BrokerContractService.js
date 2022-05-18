app.service("brokerContractService",['$http', function ($http) {

    this.getBrokerContractProduct = function () {
        var response = $http({
            method: "post",
            url: "/BrokerContract/GetBrokerContractProduct",
        });
        return response;
    };

    this.getBrokerContractSurvey = function () {
        var response = $http({
            method: "post",
            url: "/BrokerContract/GetBrokerContractSurvey",
        });
        return response;
    };

    this.saveBrokerContractOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/BrokerContract/SaveAndApproveBrokerContractOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };
    

    this.getBrokerContractQuestionnaireDetails = function (contractId) {
        var response = $http({
            method: "post",
            url: "/BrokerContract/GetBrokerContractQuestionnaireDetails",
            params: {
                contractId: contractId
            }
        });
        return response;
    };

    this.getStocksInvestmentRisksDescription = function () {
        var response = $http({
            method: "post",
            url: "/BrokerContract/StocksInvestmentRisksDescription",
            responseType: 'arraybuffer'
        });
        return response;
    };


    this.getInterestPolicyContract = function () {
        var response = $http({
            method: "post",
            url: "/BrokerContract/InterestPolicyContract",
            responseType: 'arraybuffer'
        });
        return response;
    };

    this.getStockBrokerContract = function (contractNumber, contractDate) {
        var response = $http({
            method: "post",
            url: "/BrokerContract/StockBrokerContract",
            responseType: 'arraybuffer',
            params: {
                contractNumber: contractNumber,
                contractDate: contractDate
            }
        });
        return response;
    }


    this.generateBrokerContractNumber = function () {
        var response = $http({
            method: "post",
            url: "/BrokerContract/GenerateBrokerContractNumber"
        });
        return response;
    };
}]);
