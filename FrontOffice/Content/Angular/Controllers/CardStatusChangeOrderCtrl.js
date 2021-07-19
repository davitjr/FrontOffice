app.controller("CardStatusChangeOrderCtrl", ['$scope', '$http', 'cardStatusChangeOrderService',  function ($scope, $http, cardStatusChangeOrderService) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Type = 136;
    $scope.order.SubType = 1;



    $scope.getCardStatusChangeOrder = function (orderId) {
        var Data = cardStatusChangeOrderService.getCardStatusChangeOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getCardStatusChangeOrder');
        });
    };


    $scope.saveCardStatusChangeOrder = function (productid) {
        if ($http.pendingRequests.length == 0) {


            //$confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ քարտի սպասարկման գրաֆիկը' })
            //.then(function () {
                showloading();
                $scope.error = null;
                $scope.order.ProductId = productid;
                

                var Data = cardStatusChangeOrderService.saveCardStatusChangeOrder($scope.order);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        refresh($scope.order.Type);
                        hideloading();
                        CloseBPDialog('card_status_change_order');
                    }
                    else {
                        hideloading();
                        document.getElementById("cardStatusChangeOrderLoad").classList.add("hidden");
                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                    }
                }, function () {
                    hideloading();
                    document.getElementById("cardStatusChangeOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in saveCardStatusChangeOrder');
                });
           // });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };


}]);