app.service("hbTokenService", ['$http', function ($http) {

    this.getHBToken = function (tokenID) {
        var response = $http({
            method: "post",
            url: "/HBToken/GetHBToken",
              params: {
                  tokenID: tokenID
            }

        });
        return response;
    };
       this.getHBTokens = function (hbUserId, filter) {
           var response = $http({
               method: "post",
               url: "/HBToken/GetHBTokens",
               params: {
                   hbUserId: hbUserId,
                   filter: filter
               }
           });
           return response;
       };

       this.saveHBTokenOrder = function (order) {
           var response = $http({
               method: "post",
               url: "HBToken/SaveHBTokenOrder",
               data: JSON.stringify(order),
               dataType: "json"
           });
           return response;
       };


       this.getHBTokenNumbers = function (tokenType) {
           var response = $http({
               method: "post",
               url: "/HBToken/GetHBTokenNumbers",
               params: {
                   tokenType: tokenType
               }

           });
           return response;
       };


       this.getHBTokenOrder = function (orderId) {
           var response = $http({
               method: "post",
               url: "/HBToken/GetHBTokenOrder",
               params: {
                   orderId: orderId
               }
           });
           return response;
       };

       this.getTokenServiceFee = function (opDate, tokenType, tokenSubType) {
           var response = $http({
               method: "post",
               url: "/HBToken/GetTokenServiceFee",
               params: {
                   opDate: opDate,
                   tokenType: tokenType,
                   tokenSubType:tokenSubType
               }
           });
           return response;
       };
      
       this.getEntryDataPermissionServiceFee = function () {
           var response = $http({
               method: "post",
               url: "/HBToken/GetEntryDataPermissionServiceFee"
           });
           return response;
       };

       this.saveHBRegistrationCodeResendOrder = function (order) {
           var response = $http({
               method: "post",
               url: "/HBToken/SaveHBRegistrationCodeResendOrder",
               data: JSON.stringify(order),
               dataType: "json"
           });
           return response;
       };
       

       
}]);