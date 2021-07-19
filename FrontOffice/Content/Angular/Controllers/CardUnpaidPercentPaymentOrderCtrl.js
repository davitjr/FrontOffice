app.controller('CardUnpaidPercentPaymentOrderCtrl', ['$scope', 'CardUnpaidPercentPaymentOrderService', 'infoService', 'cardService', '$location', 'dialogService', '$uibModal', 'orderService', 'accountService','$http', function ($scope, cardUnpaidPercentPaymentOrderService, infoService, cardService, $location, dialogService, $uibModal, orderService, accountService,$http) {

    $scope.order = {};
    $scope.order.Card = $scope.card;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    if ($scope.card != undefined)
    {
        $scope.PositiveRate = $scope.card.PositiveRate;
        if ($scope.card.Currency == 'AMD')
        $scope.PositiveRate = parseFloat($scope.PositiveRate.toFixed(1));
    };

    $scope.saveCardUnpaidPercentPaymentOrder = function () {
        if ($http.pendingRequests.length == 0) {


            if ($scope.card.PositiveRate > 0 && $scope.order.Account != undefined) {
                document.getElementById("cardUnpaidPercentPaymentOrderLoad").classList.remove("hidden");
                $scope.order.ProductId = $scope.card.ProductId;
                var Data = cardUnpaidPercentPaymentOrderService.saveCardUnpaidPercentPaymentOrder($scope.order);


                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        document.getElementById("cardUnpaidPercentPaymentOrderLoad").classList.add("hidden");
                        CloseBPDialog('cardUnpaidPercentPayment');
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope,'information');
                    }
                    else {
                        document.getElementById("cardUnpaidPercentPaymentOrderLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    document.getElementById("cardUnpaidPercentPaymentOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error saveAccount');
                });
            }
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };
           
    $scope.getCardUnpaidPercentPaymentOrder = function (ID) {
        var Data = cardUnpaidPercentPaymentOrderService.getCardUnpaidPercentPaymentOrder(ID);
        Data.then(function (result) {
            $scope.order = result.data;

            var CardData = cardService.getCard($scope.order.ProductId);
            CardData.then(function (res) {
                $scope.card = res.data;

            }, function () { alert('error') });
        }, function () {
            alert('Error GetCardUnpaidPercentPaymentOrder');
        });
    };

    $scope.getAccountsForCurrency = function () {
        if ($scope.card.Currency == 'AMD') {
            $scope.order.Account = $scope.card.CardAccount;
        }
        else {
            var Data = accountService.getAccountsForCurrency('AMD');
            Data.then(function (acc) {
                $scope.Accounts = acc.data;
            }, function () {
                alert('Error');
            });
        };
    };


    $scope.callbackgetCardUnpaidPercentPaymentOrder = function () {
        $scope.getCardUnpaidPercentPaymentOrder($scope.selectedOrderId);
    };


}]);