app.service("cardTariffContractService",['$http', function ($http) {

    this.getCardTariffContract = function (tariffID) {
        var response = $http({
            method: "get",
            url: "/CardTariffContract/GetCardTariffContract",
            params: {
                tariffID: tariffID
            }
        });
        return response;
    };
   
   this.getCustomerCardTariffContracts = function (filter) {
        var response = $http({
            method: "post",
            url: "/CardTariffContract/GetCustomerCardTariffContracts",
            params:{
            filter:filter
            }
        });
        return response;
   };

   this.getActiveCardsCount = function (tariffID) {
       var response = $http({
           method: "post",
           url: "/CardTariffContract/GetCardTariffContractActiveCardsCount",
           params: {
               tariffID: tariffID
           }
       });
       return response;
   };



   this.geCardTariffContracts = function (filter,customerNumber) {
       var response = $http({
           method: "post",
           url: "/CardTariffContract/GetCardTariffContracts",
           params: {
               filter: filter,
               customerNumber: customerNumber
           }
       });
       return response;
   };


   this.getCardTariffContractAttachment = function (customerNumber, docQuality) {
       var response = $http({
           method: "post",
           url: "/Customer/GetCardTariffContractAttachment",
           params: {
               customerNumber: customerNumber,
               docQuality: docQuality
           }
       });
       return response;
   }


   this.printCardTarifContract = function (tarifID) {
       var response = $http({
           method: "post",
           url: "/CardTariffContract/PrintCardTarifContract",
           params: {
               tarifID: tarifID,
           }
       });
       return response;
   };

}]);