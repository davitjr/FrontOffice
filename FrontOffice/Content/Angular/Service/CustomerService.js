app.service("customerService", ['$http', function ($http) {

    this.getCustomer = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Customer/GetCustomer",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };
    this.hasACBAOnline = function () {
        var response = $http({
            method: "post",
            url: "/Customer/HasACBAOnline"
        });
        return response;
    };

    this.changeCustomer = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Customer/ChangeCustomerNumber",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };
    this.GetCustomerDebts = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Customer/GetCustomerDebts",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.savePersonNote = function (personNote) {

        var response = $http({
            method: "post",
            url: "/Customer/SavePersonNote",
            data: JSON.stringify(personNote),
            dataType: "json"
        });
        return response;
       

    };
    this.getPersonNoteHistory = function () {

        var response = $http({
            method: "post",
            url: "/Customer/GetPersonNoteHistory"
        });
        return response;
    };
    this.getCasherDescription = function (setNumber) {
        var response = $http({
            method: "post",
            url: "/Home/GetCasherDescription",
            params: {
                setNumber: setNumber,
            }
        });
        return response;
    };

    this.getCustomerDocumentWarnings = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Customer/GetCustomerDocumentWarnings",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.GetIdentityId = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Customer/GetIdentityId",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.getCustomerType = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Customer/GetCustomerType",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.getCustomerSyntheticStatus = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Customer/GetCustomerSyntheticStatus",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };
    
    this.getAttachmentDocumentList = function (customerNumber, docQuality) {
        var response = $http({
            method: "post",
            url: "/Customer/GetAttachmentDocumentList",
            params: {
                customerNumber: customerNumber,
                docQuality: docQuality
            }
        });
        return response;
    };

    this.getOneAttachmentDocument = function (attachmentId,fileExtension) {
        var response = $http({
            method: "post",
            url: "/Customer/GetOneAttachmentDocument",
            responseType: 'arraybuffer',
            params: {
                attachmentId: attachmentId,
                fileExtension: fileExtension
            }
        });
        return response;
    };

    this.getAuthorizedCustomerNumber = function () {

        var response = $http({
            method: "post",
            url: "/Customer/GetAuthorizedCustomerNumber"
        });
        return response;
    };

    this.hasPhoneBanking = function () {
        var response = $http({
            method: "post",
            url: "/Customer/HasPhoneBanking",
        });
        return response;
    };


    this.isDAHKAvailability = function () {

        var response = $http({
            method: "post",
            url: "/Customer/IsDAHKAvailability"
        });
        return response;
    };

    this.getCustomerLinkedPersons = function (customerNumber, quality) {
        var response = $http({
            method: "post",
            url: "/Customer/GetCustomerLinkedPersonsList",
            params: {
                customerNumber: customerNumber,
                quality: quality
            }
        });
        return response;
    };
    this.saveCustomerPhoto = function (oneAttachment, extension, photoId) {
        var response = $http({
            method: "post",
            url: "/Customer/SaveCustomerPhoto",
            data: JSON.stringify(oneAttachment),
            params: {
                photoId: photoId
            }
        });
        return response;
    };


    this.getCustomerPhoto = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Customer/GetCustomerPhoto",
            params: {
                customerNumber: customerNumber
            }

        });
        return response;

    };

    this.deleteCustomerPhoto = function (photoId) {
        var response = $http({
            method: "post",
            url: "/Customer/DeleteCustomerPhoto",
            params: {
                photoId: photoId
            }
        });
        return response;
    };

    this.getCustomerOnePhoto = function (photoId) {
        var response = $http({
            method: "post",
            url: "/Customer/GetCustomerOnePhoto",
            params: {
                photoId: photoId
            }
        });
        return response;
    };
    this.hasCardTariffContract = function () {
        var response = $http({
            method: "post",
            url: "/Customer/HasCardTariffContract",
        });
        return response;
    };
 
   this.hasPosTerminal = function () {
        var response = $http({
            method: "post",
            url: "/Customer/HasPosTerminal",
        });
        return response;
   };


   this.getCustomerMainData = function (customerNumber) {
       var response = $http({
           method: "post",
           url: "/Customer/GetCustomerMainData",
           params: {
               customerNumber: customerNumber
           }
       
       });
       return response;
   };

   this.getCustomerFilialCode = function () {
       var response = $http({
           method: "post",
           url: "/Customer/GetCustomerFilialCode"
       });
       return response;
    };

    this.isCustomerConnectedToOurBank = function () {
        var response = $http({
            method: "post",
            url: "/Customer/IsCustomerConnectedToOurBank"
        });
        return response;
    };

   this.redirectProducts = function (customerNumber) {

       var response = $http({
           method: "post",
           url: "/Home/RedirectProducts",
           params: {
               customerNumber: customerNumber
           }
       });
       return response;
   };

       this.hasCustomerBankruptBlockage = function () {
        var response = $http({
            method: "post",
            url: "/Customer/HasCustomerBankruptBlockage"
        });
        return response;
    };

    this.getLeasingCustomerNumber = function (leasingCustomerNumber) {
        var response = $http({
            method: "post",
            url: "/Customer/GetLeasingCustomerNumber",
            params: {
                leasingCustomerNumber: leasingCustomerNumber
            }
        });
        return response;
    };

    this.getLeasingNumber = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Customer/GetLeasingNumber",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };


}]);
