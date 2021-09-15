app.controller("CardClosingOrderCtrl", ['$scope', 'cardClosingOrderService', 'infoService', 'cardService', '$location', 'dialogService', '$uibModal', 'orderService', '$http', 'ReportingApiService', function ($scope, cardClosingOrderService, infoService, cardService, $location, dialogService, $uibModal, orderService, $http, ReportingApiService) {

    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    $scope.saveCardClosingOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.order.Type = 30;
            document.getElementById("cardClosingLoad").classList.remove("hidden");
            $scope.order.ProductId = $scope.card.ProductId;
            var Data = cardClosingOrderService.saveCardClosingOrder($scope.order, $scope.card.CardNumber);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("cardClosingLoad").classList.add("hidden");
                    CloseBPDialog('cardClosing');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.ReceiverAccount);
                }
                else {
                    document.getElementById("cardClosingLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("cardClosingLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveAccount');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getCardClosingOrder = function (orderId) {
        var Data = cardClosingOrderService.GetCardClosingOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;

            var CardData = cardService.getCard($scope.order.ProductId);
            CardData.then(function (cr) {
                $scope.card = cr.data;

            }, function () { alert('error') });
        }, function () {
            alert('Error GetCardClosingOrder');
        });
    };

    $scope.getCardClosingReasons = function () {
        var Data = infoService.GetCardClosingReasons();
        Data.then(function (acc) {
            $scope.reasons = acc.data;
        }, function () {
            alert('Reasons Error');
        });
    };

    $scope.getCardClosingWarnings = function () {
        var Data = cardClosingOrderService.GetCardClosingWarnings($scope.card.ProductId);
        Data.then(function (acc) {
            $scope.warnings = acc.data;
        }, function () {
            alert('Warnings Error');
        });
    };

    $scope.getCardClosingApplication = function () {
        showloading();
        var Data = cardClosingOrderService.getCardClosingApplication($scope.card.CardNumber);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 7, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
            alert('Error getCardClosingApplication');
        });
    };

    $scope.callbackgetCardClosingOrder = function () {
        $scope.getCardClosingOrder($scope.selectedOrderId);
    };


}]);