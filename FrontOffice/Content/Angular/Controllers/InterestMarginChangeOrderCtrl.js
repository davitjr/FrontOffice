app.controller("InterestMarginChangeOrderCtrl", ['$scope', 'InterestMarginService', 'fondChangeOrderService', 'infoService', '$http', function ($scope, InterestMarginService, fondChangeOrderService, infoService, $http) {

    $scope.initInterestMarginChangeOrder = function () {
        $scope.InterestMarginOrder = {};
        $scope.InterestMarginOrder.RegistrationDate = new Date();
        $scope.InterestMarginOrder.Type = 221;
        $scope.InterestMargin = null;
    };

    //Արժույթները
    $scope.getCurrentAccountCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });

    };

    $scope.getInterestMarginDetails = function () {
        var Data = InterestMarginService.getInterestMarginDetails($scope.marginType);
        Data.then(function (InterestMargin) {
            $scope.InterestMargin = InterestMargin.data;
            $scope.InterestMargin.marginDate = new Date(parseInt($scope.InterestMargin.marginDate.substr(6)));
            for (var i = 0; i < $scope.InterestMargin.marginDetails.length; i++) {
                $scope.InterestMargin.marginDetails[i].isDisable = true;
                $scope.InterestMargin.marginDetails[i].InterestRate = $scope.InterestMargin.marginDetails[i].InterestRate * 100;
            }
            for (currency in $scope.currencies) {
                let cur = $scope.InterestMargin.marginDetails.filter(item => {
                    return item.Currency == currency;
                });
                if (!cur.length) {
                    $scope.InterestMargin.marginDetails.push({
                        InterestRate: 0,
                        Currency: currency,
                        isDisable: true
                    });
                }
            }
        }, function () {
            alert('Error getInterestMarginDetails');
        });
    };

    $scope.getInterestMarginDetailsByDate = function () {
        var Data = InterestMarginService.getInterestMarginDetailsByDate($scope.marginType, $scope.InterestMargin.marginDate);
        Data.then(function (InterestMargin) {
            $scope.InterestMargin = InterestMargin.data;
            $scope.InterestMargin.marginDate = new Date(parseInt($scope.InterestMargin.marginDate.substr(6)));
            for (var i = 0; i < $scope.InterestMargin.marginDetails.length; i++) {
                $scope.InterestMargin.marginDetails[i].isDisable = true;
                $scope.InterestMargin.marginDetails[i].InterestRate = $scope.InterestMargin.marginDetails[i].InterestRate * 100;
            }
            for (currency in $scope.currencies) {
                let cur = $scope.InterestMargin.marginDetails.filter(item => {
                    return item.Currency == currency;
                });
                if (!cur.length) {
                    $scope.InterestMargin.marginDetails.push({
                        InterestRate: 0,
                        Currency: currency,
                        isDisable: true
                    });
                }
            }
        }, function () {
            alert('Error getInterestMarginDetails');
        });
    };


    //$scope.setFondProvidingTerminationDate = function (index) {
    //    var today = new Date();
    //    $scope.fond.ProvidingDetails[index].TerminationDate = today;
    //};

    //$scope.removeFondProvidingTerminationDate = function (index) {
    //    $scope.fond.ProvidingDetails[index].TerminationDate = undefined;
    //};



    $scope.saveInterestMarginChangeOrder = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("InterestMarginChangeOrderSaveLoad").classList.remove("hidden");

            $scope.InterestMarginOrder.InterestMargin = $scope.InterestMargin;
            var Data = InterestMarginService.saveInterestMarginChangeOrder($scope.InterestMarginOrder);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    document.getElementById("InterestMarginChangeOrderSaveLoad").classList.add("hidden");
                    CloseBPDialog('InterestMarginorder');
                    showMesageBoxDialog('Տվյալների խմբագրումը կատարված է', $scope, 'information');
                    refresh(186);
                }
                else {
                    document.getElementById("InterestMarginChangeOrderSaveLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            },
                function (err) {
                    document.getElementById("InterestMarginChangeOrderSaveLoad").classList.add("hidden");
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                    alert('Error saveInterestMarginChangeOrder');
                });
        }

        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    //$scope.addFondProvidingDetail = function () {
    //    debugger;
    //    $scope.fond.ProvidingDetails.push({});
    //};

    //$scope.delete = function (index) {
    //    $scope.fond.ProvidingDetails.splice(index, 1);
    //}

    $scope.getInterestMarginOrder = function (orderId) {
        var Data = InterestMarginService.getInterestMarginOrder(orderId);
        Data.then(function (acc) {
            $scope.orderDetails = acc.data;
            $scope.orderDetails.InterestMargin.marginDate = new Date(parseInt($scope.orderDetails.InterestMargin.marginDate.substr(6)));
        }, function () {
            alert('Error getInterestMarginOrder');
        });

    };



}]);