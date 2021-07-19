app.service("utilityService",['$http', function ($http) {
    this.getLastRates = function (currency, rateType, direction) {

        var jData = {};
        jData.currency = currency;
        jData.rateType = rateType;
        jData.direction = direction;

        var response = $http({
            method: "post",
            url: "/Utility/GetLastRates",
            data: JSON.stringify(jData),
            dataType: "json"
        });

        return response;
    };
    this.formatNumber = function (num, decimal) {
        var value = parseFloat(num);
        return value.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    this.formatRound = function (value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    };

    this.getOperationSystemAccount = function (order,orderAccountType,currency) {
        var response = $http({
            method: "post",
            url: "/Utility/GetOperationSystemAccount",
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                currency: currency,
                orderAccountType: orderAccountType
            }
        });
        return response;
    };

    this.getCBKursForDate = function (date, currency) {
        var response = $http({
            method: "post",
            url: "/Utility/GetCBKursForDate",
            params: {
                date: date,
                currency: currency
            }
        });
        return response;
    };

    this.convertAnsiToUnicode = function (text) {
        var response = $http({
            method: "post",
            url: "/Utility/ConvertAnsiToUnicode",
            params: {
                text:text
            }
        });
        return response;
    };

    this.getCurrentOperDay = function () {
        var response = $http({
            method: "post",
            url: "/Utility/GetCurrentOperDay",
        });
        return response;
    };


    //number1-առաջին թիվ
    //decimalsCount կլորացվող նիշերի քանակ
    //operation-գործողություն(օր.՝1-բազմապատկում)
    //number2-երկրորդ թիվ
    this.formatRountByDecimals = function (number1, decimalsCount, operation, number2) {
        var response = $http({
            method: "post",
            url: "/Utility/FormatRountByDecimals",
            params: {
                number1: number1,
                decimalsCount: decimalsCount,
                operation: operation,
                number2: number2
            }
        });
        return response;
    };



}]);