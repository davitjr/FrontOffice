app.controller("PlasticCardRemovalOrderCtrl", ['$scope', '$rootScope', '$confirm', 'plasticCardService', 'plasticCardRemovalService', 'cardRegistrationOrderService', 'cardService', '$http', '$filter', function ($scope, $rootScope, $confirm, plasticCardService, plasticCardRemovalService, cardRegistrationOrderService, cardService, $http, $filter) {

    $scope.filter = 1;

    $scope.order = {
        OperationDate: new Date(),
        RemovalReason: "-1",
        Type: 214
    };

    $scope.GetCards = function () {
        $scope.loading = true;
        var Data = plasticCardRemovalService.getCustomerPlasticCards();
        Data.then(function (card) {
            $scope.cards = card.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCards');
        });
    };

    $scope.SavePlasticCardRemovalOrder = function () {
        $scope.order.Card = $scope.card;
        $scope.order.Card.CreditLine = null;
        $scope.order.Card.Overdraft = null;
        $scope.order.Card.CardAccount = {
            isAccessible: false
        }
        $scope.order.RemovalReason = $scope.RemovalReason;
        if ($http.pendingRequests.length == 0) {
            $scope.CheckPlasticCardRemovalOrder();
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.save = function () {
        document.getElementById("cardOrderRemovalLoad").classList.remove("hidden");
        var Data = plasticCardRemovalService.savePlasticCardRemovalOrder($scope.order);
        Data.then(function (res) {
            $scope.confirm = false;
            if (validate($scope, res.data)) {
                document.getElementById("cardOrderRemovalLoad").classList.add("hidden");
                if ($scope.ResultCode === 5) {
                    ShowMessage('Հայտը պահպանված է, սակայն սխալի պատճառով կատարված չէ', 'error');
                } else if ($scope.ResultCode === 1) {
                    ShowMessage('Քարտի հեռացման հայտը հաստատվել է։', 'bp-information');
                }
                CloseBPDialog('plasticcardremoval');
                refresh($scope.order.Type);
            }
            else {
                document.getElementById("cardOrderRemovalLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function (err) {
            $scope.confirm = false;
            document.getElementById("cardOrderRemovalLoad").classList.add("hidden");
            if (err.status != 420) {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error in saveCardRemovalOrder');
        });
    };

    $scope.getCardRegistrationWarnings = function () {
        var Data = cardRegistrationOrderService.GetCardRegistrationWarnings($scope.card);
        Data.then(function (acc) {
            $scope.warnings = acc.data;
        }, function () {
            alert('Warnings Error');
        });
    };

    $scope.getPlasticCardRemovalOrder = function (orderID) {
        var Data = plasticCardRemovalService.getPlasticCardRemovalOrder(orderID);
        Data.then(function (cardDetails) {
            $scope.order = cardDetails.data;
        });
    };

    $scope.getCardRemovalReasons = function () {
        $scope.loading = true;
        var Data = plasticCardRemovalService.getCardRemovalReasons();
        Data.then(function (reasons) {
            $scope.reasons = reasons.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCardRemovalReasons');
        });
    };

    $scope.checkHeight = function (event) {
        var el = event.target;
        setTimeout(function () {
            el.style.cssText = 'height:auto;';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }, 0);
    };

    $scope.CheckPlasticCardRemovalOrder = function () {
        $scope.loading = true;
        var Data = plasticCardRemovalService.checkPlasticCardRemovalOrder($scope.order);
        Data.then(function (confData) {
            if (confData.data.length) {
                let showMessage = '';
                for (let i = 0; i < confData.data.length; i++) {
                    showMessage = showMessage + `${i + 1}.` + confData.data[i] + '\n';
                }
                $confirm({ title: '', text: showMessage + '\n' + '\n' })
                    .then(function () { $scope.save() });
            } else {
                $scope.save();
            }
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error CheckPlasticCardRemovalOrder');
        });
    };
}]);