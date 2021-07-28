app.service("depositService",['$http', function ($http) {

    this.getDeposits = function (filter) {
        var response = $http({
            method: "post",
            url: "/Deposit/GetDeposits",
            params: {
                filter:filter
            }
        });
        return response;
    };


    this.terminateDeposit = function (deposit) {

        var response = $http({
            method: "post",
            url: "/Deposit/SaveTerminateDepositOrder",
            data: JSON.stringify(deposit),
            dataType: "json"

        });
        return response;

    };




    this.getDeposit = function (productID) {
        var response = $http({
            method: "post",
            url: "/Deposit/GetDeposit",
            params: {
                productID: productID
            }
        });
        return response;

    };

    this.getJointCustomers = function (productID) {

        var response = $http({
            method: "post",
            url: "/Deposit/GetJointCustomers",
            params: {
                productID: productID
            }
        });
        return response;

    };

    this.getDepositRepayments = function (productID) {

        var response = $http({
            method: "post",
            url: "/Deposit/GetDepositRepayments",
            params: {
                productID: productID
            }
        });
        return response;

    };


    this.depositRepaymentsGrafik = function (productId) {
        var response = $http({
            method: "post",
            url: "/Deposit/DepositRepaymentsGrafik",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.depositCloseApplication = function (depositNumber) {
        var response = $http({
            method: "post",
            url: "/Deposit/DepositCloseApplication",
            responseType: 'arraybuffer',
            params: {
                depositNumber: depositNumber
            }
        });
        return response;
    };

    this.getDepositContract = function (depositNumber, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/Deposit/GetDepositContract",
            responseType: 'arraybuffer',
            params: {
                depositNumber: depositNumber,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };

    this.getDepositSource = function (productID) {

        var response = $http({
            method: "post",
            url: "/Deposit/GetDepositSource",
            params: {
                productID: productID
            }
        });
        return response;

    };

    this.getDepositTerminationOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/DepositOrder/GetDepositTerminationOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

        this.printDepositStatement = function (appid,accountNumber, lang, dateFrom, dateTo, averageRest, currencyRegulation, payerData, additionalInformationByCB, exportFormat,includingExchangeRate) {
        var response = $http({
            method: "post",
            url: "/Deposit/PrintDepositStatement",
            params: {
                productId: appid,
                accountNumber: accountNumber,
                lang: lang,
                dateFrom: dateFrom,
                dateTo: dateTo,
                averageRest: averageRest,
                currencyRegulation: currencyRegulation,
                payerData: payerData,
                additionalInformationByCB: additionalInformationByCB,
                includingExchangeRate: includingExchangeRate,
                exportFormat: exportFormat
            }
        });
        return response;
        };


        this.depositRepaymentsDetailedGrafik = function (productId, exportFormat) {
            var response = $http({
                method: "post",
                url: "/Deposit/DepositRepaymentsDetailedGrafik",
                params: {
                    productId: productId,
                    exportFormat: exportFormat
                }
            });
            return response;
        };


}]);