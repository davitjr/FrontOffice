app.service("servicePaymentNoteOrderService", ['$http',function ($http) {

    this.getServicePaymentNoteList = function () {
        return $http.get("/ServicePaymentNoteOrder/GetServicePaymentNoteList");
    };


    this.deleteServicePaymentNote = function () {
        var response = $http({
            method: "post",
            url: "/ServicePaymentNoteOrder/DeleteServicePaymentNote"
        });
        return response;
    };

       this.getServicePaymentNoteReasons = function () {
        var response = $http({
            method: "post",
            url: "/ServicePaymentNoteOrder/GetServicePaymentNoteReasons",
            
        });
        return response;
    };

     this.saveServicePaymentNoteOrder = function (serviceNoteOrder) {
        var response = $http({
            method: "post",
            url: "/ServicePaymentNoteOrder/SaveServicePaymentNoteOrder",
            data: JSON.stringify(serviceNoteOrder),
            dataType: "json"
        });
        return response;
     };

     this.getServicePaymentNoteOrder = function (orderId) {
         var response = $http({
             method: "post",
             url: "/ServicePaymentNoteOrder/GetServicePaymentNoteOrder",
             params: {
                 orderId: orderId
             }
         });
         return response;
     };

    this.getDelatedServicePaymentNoteOrder = function (orderId) {
         var response = $http({
             method: "post",
             url: "/ServicePaymentNoteOrder/GetDelatedServicePaymentNoteOrder",
             params: {
                 orderId: orderId
             }
         });
         return response;
     };

}]);