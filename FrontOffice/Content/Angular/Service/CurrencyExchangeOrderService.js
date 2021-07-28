app.service("currencyExchangeOrderService", ['$http', function ($http) {

    this.SaveCurrencyExchangeOrder = function (order, confirm) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/SaveCurrencyExchangeOrder",
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                confirm: confirm
            }
        });
        return response;
    };

    this.getConvertationCashNonCashPaymentOrder = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetConvertationCashNonCashPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
        });
        return response;
    };

    this.getConvertationNonCashCashPaymentOrder = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetConvertationNonCashCashPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };

    this.getConvertationCashPaymentOrder = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetConvertationCashPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };

    this.getCrossConvertationCash = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetCrossConvertationCash",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };

    this.getCrossConvertationCashNonCash = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetCrossConvertationCashNonCash",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };

    this.getCrossConvertationNonCashCash = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetCrossConvertationNonCashCash",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };

    this.getCrossConvertationVariant = function (debitCurrency, creditCurrency) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetCrossConvertationVariant",
            params: {
                debitCurrency: debitCurrency,
                creditCurrency: creditCurrency
            }
        });
        return response;
    }

    this.getShortChangeAmount = function (order) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetShortChangeAmount",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


     this.getCrossConvertationDetails = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetCrossConvertationDetails",
            data: JSON.stringify(paymentOrder),
            dataType: "json",           
        });
        return response;
    };

     this.getConvertationDetails = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetConvertationDetails",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };

     this.getCardFeeForCurrencyExchangeOrder = function (paymentOrder) {
         var response = $http({
             method: "post",
             url: "/CurrencyExchangeOrder/GetCardFeeForCurrencyExchangeOrder",
             data: JSON.stringify(paymentOrder),
             dataType: "json"
         });
         return response;
     };



     this.isCashBigAmount = function (paymentOrder) {
         var response = $http({
             method: "post",
             url: "/CurrencyExchangeOrder/IsBigAmountForCurrencyExchangeOrder",
             data: JSON.stringify(paymentOrder),
             dataType: "json",

         });
         return response;
     };


     this.saveTransitCurrencyExchangeOrder = function (order, confirm) {
         var response = $http({
             method: "post",
             url: "/CurrencyExchangeOrder/SaveTransitCurrencyExchangeOrder",
             data: JSON.stringify(order),
             dataType: "json",
             params: {
                 confirm: confirm
             }
         });
         return response;
     };

     this.getTransitCurrencyExchangeOrderSystemAccount = function (order, operationCurrency) {
         var response = $http({
             method: "post",
             url: "/CurrencyExchangeOrder/GetTransitCurrencyExchangeOrderSystemAccount",
             data: JSON.stringify(order),
             dataType: "json",
             params: {
                 operationCurrency:operationCurrency
             }
         });
         return response;
     };

     this.GetConvertationCashNonCashForMatureOrder = function (order) {
         var response = $http({
             method: "post",
             url: "/CurrencyExchangeOrder/GetConvertationCashNonCashForMatureOrder",
             data: JSON.stringify(order),
             dataType: "json",
         });
         return response;
     };

     this.GetCrossConvertationCashNonCashForMatureOrder = function (order) {
         var response = $http({
             method: "post",
             url: "/CurrencyExchangeOrder/GetCrossConvertationCashNonCashForMatureOrder",
             data: JSON.stringify(order),
             dataType: "json",
         });
         return response;
     };

     this.getConvertationDetailsForMatureOrder = function (order) {
         var response = $http({
             method: "post",
             url: "/CurrencyExchangeOrder/GetConvertationDetailsForMatureOrder",
             data: JSON.stringify(order),
             dataType: "json",
         });
         return response;
     };

     this.getCrossConvertationDetailsForMatureOrder = function (order) {
         var response = $http({
             method: "post",
             url: "/CurrencyExchangeOrder/GetCrossConvertationDetailsForMatureOrder",
             data: JSON.stringify(order),
             dataType: "json",
         });
         return response;
    };

    this.getFee = function (paymentOrder, feeType) {
        var response = $http({
            method: "post",
            url: "/CurrencyExchangeOrder/GetFee",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                feeType: feeType,
            }
        });
        return response;
    };

}]);