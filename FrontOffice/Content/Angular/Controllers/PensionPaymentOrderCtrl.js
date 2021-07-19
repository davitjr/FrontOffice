app.controller("PensionPaymentOrderCtrl", ['$scope', 'pensionPaymentOrderService', '$confirm', 'customerService', '$uibModal', '$http', 'printDocumentsService', '$state', '$rootScope',
    function ($scope, pensionPaymentOrderService, $confirm, customerService, $uibModal, $http, printDocumentsService, $state, $rootScope) {
        $scope.selectedid = null;
        $scope.pensionPaymentOrders = [];
        $scope.selectedaccount = null;

        $scope.getAllPensionPayment = function () {
            var Data = pensionPaymentOrderService.GetAllPensionPayment();
            Data.then(function (acc) {
                $scope.pensionPaymentOrders = acc.data;

            }, function () {

                alert('Error GetAllPensionPayment');
            });
        };

        $scope.getPensionPaymentOrderDetails = function (orderId) {
            var Data = pensionPaymentOrderService.GetPensionPaymentOrderDetails(orderId);
            Data.then(function (acc) {
                $scope.pensionPaymentOrder = acc.data;
            }, function () {
                    alert('Error getPensionPaymentOrderDetails');
            });
        };

        $scope.setClickedRow = function (index, pension) {
            $scope.selectedRow = index;
            $scope.selectedid = pension.PensionPaymentId;
        };

        $scope.noAccountSelected = function () {
            console.log("no account selected for processing");
        };

        $scope.getElementPosition = function (index) {
            var top = $('#pensionPaymentRow_' + index).position().top;
            if (document.getElementById('accountflowdetails') != undefined)
                document.getElementById('accountflowdetails').setAttribute("style", "margin-top:" + (top + 60).toString() + "px; width: 350px !important;");
        };

        $scope.savePensionPaymentOrder = function () {
            showloading();
            var Data = pensionPaymentOrderService.SavePensionPaymentOrder($scope.pensionPaymentOrders[$scope.selectedRow]);
            Data.then(function (res) {
                debugger;
                if (validate($scope, res.data)) {
                    hideloading();
                    showMesageBoxDialog('Պահպանումը կատարված է', $scope, 'information');
                    $scope.getAllPensionPayment();
                    refresh(237);
                }
                else {
                    hideloading();
                    var description = "";
                    for (var i = 0; i < res.data.Errors.length; i++) {
                        description += res.data.Errors[i].Description + ", "
                    }
                    showMesageBoxDialog(description, $scope, 'error');
                }
            },
                function (err) {
                    hideloading();
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                    alert('Error saveForgivableLoanCommitment');
                });
        };


    }]);