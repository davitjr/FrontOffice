app.controller("PrintDocumentsCtrl", ['$scope', 'printDocumentsService', '$location', 'infoService', function ($scope, printDocumentsService, $location, infoService) {

    $scope.getCustomerSignature = function () {
        showloading();
        var Data = printDocumentsService.getCustomerSignature();
        ShowPDF(Data);
    };

    $scope.getCustomerKYC = function () {
        showloading();
        var Data = printDocumentsService.getCustomerKYC();
        ShowPDF(Data);
    };

    $scope.getCustomerAllProducts = function (productStatus) {
        showloading();
        var Data = printDocumentsService.getCustomerAllProducts(productStatus);
        ShowPDF(Data);
    };

    $scope.getCustomerDocuments = function () {
        showloading();
        var Data = printDocumentsService.getCustomerDocuments();
        ShowPDF(Data);
    };

    $scope.getUnderageCustomerAgreement = function () {
        showloading();
        var Data = printDocumentsService.getUnderageCustomerAgreement();
        ShowPDF(Data);
    };

    $scope.getListOfCustomerDeposits = function () {
        showloading();
        var Data = printDocumentsService.getListOfCustomerDeposits();
        ShowExcel(Data, 'ListOfCustomerDeposits');
    };
    $scope.mergeApplicationDetails = {};
    $scope.getFilialList = function () {

        var Data = infoService.GetFilialList();
        Data.then(function (acc) {
            $scope.filialList = acc.data;
        }, function () {
            alert('Error getFilialList');
        });

    }
    $scope.getCustomerMergeApplicationAgreement = function () {
        showloading();
        var Data = printDocumentsService.getCustomerMergeApplicationAgreement($scope.mergeApplicationDetails.filialChangeCode);
        ShowPDF(Data);
    };

    $scope.getSentSMSMessages = function () {
        showloading();
        var Data = printDocumentsService.getSentSMSMessages();
        ShowPDF(Data);
    };


}]);
