app.controller("CardAccountRemovalOrderCtrl", ['$scope', '$rootScope', '$confirm','cardAccountRemovalOrderService', 'cardService', '$http', '$filter', function ($scope, $rootScope, $confirm, cardAccountRemovalOrderService, cardService, $http, $filter) {

    $scope.filter = 1;

    $scope.order = {
        OperationDate: new Date(),
        RemovalReason: "-1",
        Type: 220
    };

    $scope.GetCards = function () {
        $scope.loading = true;
        var Data = cardService.getCards($scope.filter);
        Data.then(function (card) {
            $scope.cards = card.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCards');
        });
    };

    $scope.SaveCardAccountRemovalOrder = function () {        

        if ($http.pendingRequests.length == 0) {

            document.getElementById("cardAccountOrderRemovalLoad").classList.remove("hidden");
            var Data = cardAccountRemovalOrderService.saveCardAccountRemovalOrder($scope.order);
        Data.then(function (res) {
            $scope.confirm = false;
            if (validate($scope, res.data)) {
                document.getElementById("cardAccountOrderRemovalLoad").classList.add("hidden");
                if ($scope.ResultCode === 5) {
                    ShowMessage('Հայտը պահպանված է, սակայն սխալի պատճառով կատարված չէ', 'error');
                } else if ($scope.ResultCode === 1) {
                    ShowMessage('Հաշվի հեռացման հայտը հաստատվել է։', 'bp-information');
                }
                CloseBPDialog('cardaccountremoval');
                refresh($scope.order.Type);
            }
            else {
                document.getElementById("cardAccountOrderRemovalLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function (err) {
            $scope.confirm = false;
            document.getElementById("cardAccountOrderRemovalLoad").classList.add("hidden");
            if (err.status != 420) {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error in saveCardRemovalOrder');
        });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    $scope.getCardAccountRemovalOrder = function (orderID) {
        var Data = cardAccountRemovalOrderService.getCardAccountRemovalOrder(orderID);
        Data.then(function (cardDetails) {
            $scope.order = cardDetails.data;
        });
    }
}]);