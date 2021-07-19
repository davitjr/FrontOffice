app.controller("CriminalsCtrl", ['$scope', 'criminalsService','transfersService', function ($scope, criminalsService,transfersService) {

    $scope.getCriminalCheckResults = function () {

        var Data = criminalsService.getCriminalCheckResults($scope.criminalLogId);
        Data.then(function (res) {
            $scope.criminalsList = res.data;
        },
        function () {
            alert('Error getCriminalCheckResults');
        });

    };

    $scope.updateTransferVerifiedStatus = function (transferId,verified) {
     $scope.error = null;

     var Data = transfersService.updateTransferVerifiedStatus(transferId,verified);
        Data.then(function (res) {
            $scope.confirm = false;
            if (validate($scope, res.data)) {
                if (verified = 2)
                    showMesageBoxDialog('Գործարքը նշվեց թույլատրելի', $scope, 'information');
                else
                     showMesageBoxDialog('Գործարքը նշվեց կասկածելի', $scope, 'information');

                CloseBPDialog('CriminalsList');

                var refreshScope = angular.element(document.getElementById('Transfers')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getTransfers();
                }
            }
            else {
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.savePayment);
                }
        }, function (err) {
            if (err.status != 420) {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error in updateTransferVerifiedStatus');
        });

    };

    

}]);
