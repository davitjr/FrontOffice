app.controller("CardlessCashoutCancellationOrderCtrl", ['$scope', 'cardlessCashoutCancellationOrderCtrlService', '$filter', '$uibModal', '$http', 'ReportingApiService', function ($scope, cardlessCashoutCancellationOrderCtrlService, $filter, $uibModal, $http, ReportingApiService) {
    $scope.cancellationOrder = {};
    $scope.cancellationOrder.DebitAccount = [];

    $scope.saveAndApproveCardlessCashoutCancellationOrder = function () {
        if ($http.pendingRequests.length == 0) {
            showloading();
            $scope.cancellationOrder.CancellationDocId = $scope.order.Id;
            $scope.cancellationOrder.CreditAccount = $scope.order.DebitAccount;
            $scope.cancellationOrder.Amount = $scope.order.Amount;
            $scope.cancellationOrder.OldAmount = $scope.order.Amount;
            $scope.cancellationOrder.TransferFee = $scope.order.TransferFee;
            $scope.cancellationOrder.OldTransferFee = $scope.order.TransferFee;
            $scope.cancellationOrder.Currency = $scope.order.Currency;
            $scope.cancellationOrder.Description = $scope.order.Description;

            var Data = cardlessCashoutCancellationOrderCtrlService.SaveAndApproveCardlessCashoutCancellationOrder($scope.cancellationOrder);
            Data.then(function (res) {
                $scope.orderResult = res.data;
                if ($scope.orderResult.ResultCode == 1) {
                    hideloading();
                    CloseBPDialog('cardlesscashoutcancellationorder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Բանկոմատին փոխանցման հայտի չեղարկման հայտի մուտքագրումը կատարված է', $scope, 'information');
                }
                else {
                    hideloading();
                    showMesageBoxDialog('Խնդրում ենք ողղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function () {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveFastTransferPayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    }

    $scope.getCardlessCashoutOrder = function (orderId) {
        var Data = cardlessCashoutCancellationOrderCtrlService.GetCardlessCashoutOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error GetCardlessCashoutOrder');
        });
    };


}]);