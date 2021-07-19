app.controller("FactoringCtrl", ['$scope', 'factoringService', '$state','$http','$confirm', function ($scope, factoringService, $state,$http,$confirm) {

    $scope.filter = 1;

    //To Get All Records  
    $scope.getFactorings = function () {
        $scope.loading = true;
        var Data = factoringService.getFactorings($scope.filter);
        Data.then(function (fact) {
            if ($scope.filter == 1) {
                $scope.factorings = fact.data;
                $scope.closingFactorings = [];
            }
            else if ($scope.filter == 2) {
                $scope.closingFactorings = fact.data;
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getFactorings');
        });
    }

    $scope.getFactoring = function (productId) {
        if ($scope.factoring == null || $scope.openedFactoring==true) {
            $scope.loading = true;
            var Data = factoringService.getFactoring(productId);
            Data.then(function (fact) {
                $scope.factoring = fact.data;


                $scope.loading = false;

            }, function () {
                $scope.loading = false;
                alert('Error getFactoring');
            });
        }

    }

    $scope.setClickedRow = function (index,factoring) {
        $scope.selectedRow = index;
        $scope.selectedProductId = $scope.factorings[index].ProductId;
        $scope.selectedRowClose = null;
        $scope.selectedFactoring = factoring;
    }

    $scope.setClickedRowClose = function (index) {
        $scope.selectedRowClose = index;
        $scope.selectedRow = null;
        $scope.selectedClosedFactoring = $scope.closingFactorings[index];
    }

    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;

        $scope.getFactorings();
    };

    $scope.openFactoringDetails = function () {
        $state.go('factoringDetails', { productId: $scope.selectedProductId, closedFactoring: $scope.selectedClosedFactoring });
    };

    $scope.saveFactoringTerminationOrder = function (productId) {
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Դադարեցնե՞լ տվյալ ֆակտորինգի սահմանաչափը' })
             .then(function () {
                 showloading();
                 var Data = factoringService.saveFactoringTerminationOrder(productId);
                 Data.then(function (res) {
                     hideloading();
                     if (validate($scope, res.data)) {
                         $scope.path = '#Orders';
                         showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                         refresh(142);
                     }
                     else {
                         $scope.showError = true;
                         showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                     }

                 }, function () {
                     hideloading();
                     showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                     alert('Error saveFactoringTerminationOrder');
                 });
             });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };


    $scope.callbackgetFactoringTerminationOrder = function () {
        $scope.getFactoringTerminationOrder($scope.selectedOrderId);
    };


    $scope.getFactoringTerminationOrder = function (orderID) {
        var Data = factoringService.getFactoringTerminationOrder(orderID);
        Data.then(function (rep) {
            $scope.order = rep.data;
            $scope.getFactoring($scope.order.ProductId);

        }, function () {
            alert('Error getFactoringTerminationOrder');
        });
    };

    $scope.callbackgetFactoring = function () {
        $scope.openedFactoring = true;
        $scope.getFactoring($scope.productId);
    }


}])