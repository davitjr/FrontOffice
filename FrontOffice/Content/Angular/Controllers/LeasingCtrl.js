app.controller("LeasingCtrl", ['$scope', 'LeasingService', 'dialogService', '$uibModal', '$http', 'limitToFilter', '$confirm', '$filter', '$timeout', '$controller', '$rootScope','leasingFactory',
    function ($scope, LeasingService, dialogService, $uibModal, $http, limitToFilter, $confirm, $filter, $timeout, $controller, $rootScope, leasingFactory) {

        $scope.loanFullNumber;
        $scope.dateOfBeginning;
        $scope.leasingContractNumber;
        $scope.selectedDetailRow;

        $scope.initDetailedInformation = function () {
            $scope.dateOfBeginning = new Date(parseInt($scope.dateOfBeginning.substr(6)));
            var Data = LeasingService.getDetailedInformationObject($scope.loanFullNumber, $scope.dateOfBeginning);
            Data.then(function (acc) {
                $scope.detailedInfoObj = acc.data;

            }, function () {
                alert('Error initDetailedInformation');
            });
        };

        $scope.initInsuranceInformation = function () {
            $scope.loanFullNumber = params.loanFullNumber;
            $scope.dateOfBeginning = params.dateOfBeginning;
            var Data = LeasingService.getInsuranceInformationObject($scope.loanFullNumber, $scope.dateOfBeginning);
            Data.then(function (acc) {
                $scope.detailedInfoObj = acc.data;
                if (acc.data.length != 0) {
                    sessionStorage.setItem("hasLeasingInsurance", true);
                }
                else {
                    sessionStorage.setItem("hasLeasingInsurance", false);
                }
                leasingFactory.LeasingInsuranceId = 0;
                leasingFactory.LeasingInsuranceAmount = 0;
                leasingFactory.rootCtrlScope.selectedLeasingInsuranceAmount = 0;
                sessionStorage.setItem("leasingInsuranceId", null);
                sessionStorage.setItem("leasingInsuranceAmount", null);
            }, function () {
                alert('Error initInsuranceInformation');
            });
        };
        $scope.closeDetailedInformationModal = function () {

            CloseBPDialog("LeasingDetailedInfoForm");

        };


        $scope.setClickedInsurance = function (detailRow) {
            $scope.selectedDetailRow = detailRow;
            leasingFactory.LeasingInsuranceId = detailRow.Id;
            leasingFactory.LeasingInsuranceAmount = detailRow.SumAmd;
            leasingFactory.rootCtrlScope.selectedLeasingInsuranceAmount = detailRow.SumAmd;
        };

        $scope.selectLeasingInsurance = function (detailRow) {
            $scope.selectedDetailRow = detailRow;
            leasingFactory.LeasingInsuranceId = detailRow.Id;
            leasingFactory.LeasingInsuranceAmount = detailRow.SumAmd;
            leasingFactory.rootCtrlScope.selectedLeasingInsuranceAmount = detailRow.SumAmd;
            CloseBPDialog("leasingInsuranceInfo");
        };

        //getLeasingOperDay
        $scope.initLeasingOperDay = function () {
            var Data = LeasingService.getLeasingOperDay();
            Data.then(function (acc) {
                $scope.leasingOperDay = acc.data;
                
            }, function () {
                    alert('Error initLeasingOperDay');
            });
        };
    }]);
function CloseBPDialog(dialogID) {
    var dialog = document.querySelector('#' + dialogID);
    $('#' + dialogID).hide();
    dialog.parentNode.removeChild(dialog);
    if (document.querySelector('.bp-dialog-overlay')) {
        $('.bp-dialog-overlay').css("display", "none");
    }
    return false;
};