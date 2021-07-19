app.controller("AttachmentDocumentCtrl",['$scope', 'attachmentDocumentService', function ($scope, attachmentDocumentService) {

    $scope.allattachments = [];



    $scope.getProductDocuments = function (productID) {
        var Data = attachmentDocumentService.getProductDocuments(productID);

        Data.then(function (att) {
            $scope.productDocuments = att.data;

            for (var i = 0; i < $scope.productDocuments.length; i++) {
                $scope.getAttachmentsInfo($scope.productDocuments[i]);
            }

        }, function () {
            alert('Error');
        });
    };

    $scope.getAttachmentsInfo = function (productDocument) {

        if (productDocument.Source == 1) {
            var Data = attachmentDocumentService.getAttachmentsInfo(productDocument.Id);
        }
        else if (productDocument.Source == 2) {
            var Data = attachmentDocumentService.getHBAttachmentsInfo(productDocument.Id);
        }
        Data.then(function (att) {

            $scope.oneAttachment = {
                source: 0,
                productDescription: "",
                attachment: {}
            };
            $scope.oneAttachment.source = productDocument.Source;
            $scope.oneAttachment.productDescription = productDocument.DocumentTypeDescription;
            $scope.oneAttachment.attachment = att.data;
            $scope.allattachments.push($scope.oneAttachment);

        }, function () {
            alert('Error');
        });
    };

    $scope.getOneAttachment = function (id, source, extension) {
        if (source == 1) {
            var Data = attachmentDocumentService.getOneAttachment(id);
        }
        else if (source == 2) {
            var Data = attachmentDocumentService.getOneHBAttachment(id);
        }

        Data.then(function (dep) {
            if (extension == 1) {
                var file = new Blob([dep.data], { type: 'image/jpeg' });
            }
            else if (extension == 2) {
                var file = new Blob([dep.data], { type: 'application/pdf' });
            }
            else if (extension == 3) {
                var file = new Blob([dep.data], { type: 'image/png' });
            }

            var fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        }, function () {

            alert('Error ');
        });
    };

}]);