app.service("attachmentDocumentService",['$http', function ($http) {

    this.getProductDocuments = function (productID) {
        var response = $http({
            method: "post",
            url: "/AttachmentDocument/GetProductDocuments",
            params: {
                productID: productID
            }
        });
        return response;
    };

    this.getAttachmentsInfo = function (documentID) {

        var response = $http({
            method: "post",
            url: "/AttachmentDocument/GetAttachmentsInfo",
            params: {
                documentID: documentID
            }
        });
        return response;
    };
    this.getHBAttachmentsInfo = function (documentID) {

        var response = $http({
            method: "post",
            url: "/AttachmentDocument/GetHBAttachmentsInfo",
            params: {
                documentID: documentID
            }
        });
        return response;
    };

    this.getOneAttachment = function (id) {

        var response = $http({
            method: "post",
            url: "/AttachmentDocument/GetOneAttachment",
            responseType: 'arraybuffer',
            params: {
                id: id
            }
        });
        return response;
    };
    this.getOneHBAttachment = function (id) {

        var response = $http({
            method: "post",
            url: "/AttachmentDocument/GetOneHBAttachment",
            responseType: 'arraybuffer',
            params: {
                id: id
            }
        });
        return response;
    }
}]);