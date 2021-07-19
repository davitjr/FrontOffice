app.controller("CardServiceFeeGrafikDataChangeOrderCtrl", ['$scope', '$http', 'cardServiceFeeGrafikDataChangeOrderService', 'dateFilter', '$confirm', function ($scope, $http, cardServiceFeeGrafikDataChangeOrderService, dateFilter, $confirm) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Type = 114;
    $scope.order.SubType = 1;

    $scope.saveCardServiceFeeGrafikDataChangeOrder = function (cardServiceFeeGrafik, cardNumber, productid) {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("cardServiceFeeGrafikDataChangeOrderLoad").classList.remove("hidden");
            $scope.error = null;
            $scope.order.ProductAppId = productid;
            $scope.order.CardNumber = cardNumber;

            var newcardServiceFeeGrafik = angular.copy(cardServiceFeeGrafik);


            for (var i = 0; i < newcardServiceFeeGrafik.length; i++)
            {
                newcardServiceFeeGrafik[i].PeriodStart = dateFilter(new Date(parseInt(cardServiceFeeGrafik[i].PeriodStart.substr(6))), 'yyyy/MM/dd');
                newcardServiceFeeGrafik[i].PeriodEnd = dateFilter(new Date(parseInt(cardServiceFeeGrafik[i].PeriodEnd.substr(6))), 'yyyy/MM/dd');
            }
            $scope.order.CardServiceFeeGrafik = newcardServiceFeeGrafik;
           
            var Data = cardServiceFeeGrafikDataChangeOrderService.saveCardServiceFeeGrafikDataChangeOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    document.getElementById("cardServiceFeeGrafikDataChangeOrderLoad").classList.add("hidden");

                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('cardServiceFeegrafik');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("cardServiceFeeGrafikDataChangeOrderLoad").classList.add("hidden");
                    $scope.showError = true;
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("cardServiceFeeGrafikDataChangeOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveCardServiceFeeGrafikDataChangeOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };


    $scope.getCardServiceFeeGrafikDataChangeOrder = function (orderId) {
        var Data = cardServiceFeeGrafikDataChangeOrderService.getCardServiceFeeGrafikDataChangeOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getCardServiceFeeGrafikDataChangeOrder');
        });
    };


    $scope.saveCardServiceFeeGrafikRemovableOrder = function (productid) {
        if ($http.pendingRequests.length == 0) {
            

            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ քարտի սպասարկման գրաֆիկը' })
            .then(function () {
                showloading();
            $scope.error = null;
            $scope.order.ProductAppId = productid;
            $scope.order.Type = 115;

            var Data = cardServiceFeeGrafikDataChangeOrderService.saveCardServiceFeeGrafikDataChangeOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                    hideloading();
                }
                else {
                    hideloading();
                    document.getElementById("cardServiceFeeGrafikDataChangeOrderLoad").classList.add("hidden");
                    $scope.showError = true;
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                hideloading();
                document.getElementById("cardServiceFeeGrafikDataChangeOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveCardServiceFeeGrafikDataChangeOrder');
            });
             });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };


}]);