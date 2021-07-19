app.service("rateService",['$http', function ($http) {

    this.getExchangeRates = function () {
        var response = $http({
            method: "post",
            url: "/ExchangeRate/GetExchangeRates"
        });
        return response;
    };

    this.GetExchangeRatesHistory = function (filialCode, currency, startDate) {
        var response = $http({
            method: "post",
            url: "/ExchangeRate/GetExchangeRatesHistory",
            params: {
                filialCode: filialCode,
                currency: currency,
                startDate: startDate
            }
        });
        return response;
    };

    this.GetCBExchangeRatesHistory = function (currency, startDate) {
        var response = $http({
            method: "post",
            url: "/ExchangeRate/GetCBExchangeRatesHistory",
            params: {
                currency: currency,
                startDate: startDate
            }
        });
        return response;
    };

    this.GetCrossExchangeRatesHistory = function (startDate) {
        var response = $http({
            method: "post",
            url: "/ExchangeRate/GetCrossExchangeRatesHistory",
            params: {
                startDate: startDate
            }
        });
        return response;
    };
}]);