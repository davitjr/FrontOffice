app.controller("CreditLineProlongationOrderCtrl", ['$scope', 'creditLineProlongationOrderService', '$http', '$confirm', function ($scope, creditLineProlongationOrderService, $http, $confirm) {
    $scope.order = {};


    $scope.saveCreditLineProlongationOrder = function (productId) {
       if ($http.pendingRequests.length == 0) {
        $confirm({ title: 'Շարունակե՞լ', text: 'Երկարաձգե՞լ վարկային գիծը'  })
                .then(function () {
                    showloading();
                    var Data = creditLineProlongationOrderService.saveCreditLineProlongationOrder(productId);
                    Data.then(function (res) {
                        hideloading();
                        if (validate($scope, res.data)) {
                            $scope.path = '#Orders';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            //refresh(199);
                            //CloseBPDialog('saveCreditLineTerminationOrder');
                        }
                        else {
                            $scope.showError = true;
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                            //refresh(142);
                        }

                    }, function () {
                        hideloading();
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        alert('Error saveCreditLineTerminationOrder');
                        });

                    function  GetCreditLineProlongationOrder() {
                        GetCreditLineProlongationOrder(productId)
                    };

                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.getCreditLineProlongationOrder = function (id) {
        var Data = creditLineProlongationOrderService.getCreditLineProlongationOrder(id);
        Data.then(function (acc) {
            $scope.creditLineProlongationOrderDetails = acc.data;
        }, function () {
            alert('Error getCreditLineProlongationOrder');
        });

    };


    $scope.IsCreditLineActivateOnApiGate = function (orderId) {
        var Data = creditLineProlongationOrderService.IsCreditLineActivateOnApiGate(orderId);
        Data.then(function (acc) {
            if (acc.data == "True")
                $scope.isApiGate = 0
            else if (acc.data == "False")
                $scope.isApiGate = 1
        }, function () {
            alert('Error IsCreditLineActivateOnApiGate');
        });
    };

}]);