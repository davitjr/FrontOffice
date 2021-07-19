app.service("plasticCardService",['$http',function ($http) {

    this.savePlasticCardOrder = function (cardOrder) {

        var response = $http({
            method: "post",
            url: "/PlasticCardOrder/SavePlasticCardOrder",
            data: JSON.stringify(cardOrder),
            dataType: "json"
        });
        return response;
    };

    this.getPlasticCardOrder = function (orderID) {

        var response = $http({
            method: "post",
            url: "/PlasticCardOrder/GetPlasticCardOrder",
            dataType: "json",
            params: {
                orderID: orderID
            }
        });
        return response;
    }

    this.GetCustomerLastMotherName = function (customerNumber) {
  
        var response = $http({
            method: "post",
            url: "/PlasticCardOrder/GetCustomerLastMotherName",
            dataType:"string",
            params: {
                customerNumber: customerNumber,
            }
        });
        return response;
    }

    this.GetCustomerMainCards = function () {
        var response = $http({
            method: "post",
            url: "/PlasticCardOrder/GetMainCards"            
        });
        return response;
    }

    this.GetCustomerMainCardsForAttachedCardOrder = function () {
        var response = $http({
            method: "post",
            url: "/PlasticCardOrder/GetCustomerMainCardsForAttachedCardOrder"           
        });
        return response;
    }

    this.CheckIfPlasticCardCanBeCanceled = function (orderID) {

        var response = $http({
            method: "post",
            url: "/PlasticCardOrder/CheckIfPlasticCardCanBeCanceled",
            dataType: "bool",
            params: {
                orderID: orderID,
            }
        });
        return response;
    }

    this.GetCustomerAddressEng = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/PlasticCardOrder/GetCustomerAddressEng",
            dataType: "string",
            params: {
                customerNumber: customerNumber,
            }
        });
        return response;
    }

    this.GetPlasticCardOrdersReport = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/PlasticCardOrder/GetPlasticCardOrdersReport",
            responseType: 'arraybuffer',
            data: JSON.stringify(searchParams)
        });
        return response;
    }
}]);