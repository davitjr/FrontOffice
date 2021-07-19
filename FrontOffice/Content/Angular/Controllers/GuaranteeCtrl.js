app.controller("GuaranteeCtrl", ['$scope', 'guaranteeService', '$state','$http','$confirm', function ($scope, guaranteeService, $state,$http,$confirm) {

    $scope.filter = 1;

    try {
        $scope.isOnlineAcc = $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"];
    }
    catch (ex) {
        $scope.isOnlineAcc = "0";
    }
    $scope.percentCummulation = [];
    $scope.percentCummulation[0] = "Նախնական գանձում";
    $scope.percentCummulation[1] = "Կուտակում";
    //To Get All Records  
    $scope.getGuarantees = function () {
        $scope.loading = true;
        var Data = guaranteeService.getGuarantees($scope.filter);
        Data.then(function (guar) {
            if ($scope.filter == 1) {
                $scope.guarantees = guar.data;
                $scope.closingGuarantees = [];
            }
            else if ($scope.filter == 2) {
                $scope.closingGuarantees = guar.data;
            }

            for (var i = 0; i < $scope.guarantees.length; i++) {
                $scope.guarantees[i].InterestRate = ($scope.guarantees[i].InterestRate * 100).toFixed(1);
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getGuarantees');
        });
    }

    $scope.getGuarantee = function (productId) {
        if ($scope.guarantee==null || $scope.openedGuarantee==true) {
            $scope.loading = true;
                    var Data = guaranteeService.getGuarantee(productId);
                    Data.then(function (guar) {
                            $scope.guarantee = guar.data;

                        $scope.guarantee.InterestRate = ($scope.guarantee.InterestRate * 100).toFixed(1)
                        $scope.loading = false;
            
                    }, function () {
                        $scope.loading = false;
                        alert('Error getGuarantee');
                    });
        }
        
    }

    $scope.setClickedRow = function (index,guarantee) {
        $scope.selectedRow = index;
        $scope.selectedProductId = $scope.guarantees[index].ProductId;
        $scope.params = { selectedGuarantee: $scope.guarantees[index] };
        $scope.selectedGuarantee = guarantee;
        $scope.selectedRowClose = null;
        $scope.selectedGuaranteeIsAccessible = $scope.guarantees[index].isAccessible;
    }

    $scope.setClickedRowClose = function (index) {
        $scope.selectedRowClose = index;
        $scope.selectedRow = null;
        $scope.selectedClosedGuarantee = $scope.closingGuarantees[index];
        $scope.selectedGuaranteeIsAccessible = $scope.closingGuarantees[index].isAccessible;
    }

    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.selectedAccountNumber = null;
        $scope.getGuarantees();
    }

    $scope.openGuaranteeDetails = function () {
        $state.go('guaranteeDetails', { productId: $scope.selectedProductId, closedGuarantee: $scope.selectedClosedGuarantee });
    }



    $scope.getGivenGuaranteeReductions = function (productId) {
        var Data = guaranteeService.getGivenGuaranteeReductions(productId);
        Data.then(function (guar) {
            $scope.givenGuaranteeReductions = guar.data;
        }, function () {
            alert('Error getGivenGuaranteeReductions');
        });
    };

    $scope.saveGuaranteeTerminationOrder = function (productId) {
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Դադարեցնե՞լ տվյալ երաշխիքը:' })
             .then(function () {
                 showloading();
                 var Data = guaranteeService.saveGuaranteeTerminationOrder(productId);
                 Data.then(function (res) {
                     hideloading();
                     if (validate($scope, res.data)) {
                         $scope.path = '#Orders';
                         showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                         refresh(143);
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


    $scope.callbackgetGuaranteeTerminationOrder = function () {
        $scope.getGuaranteeTerminationOrder($scope.selectedOrderId);
    };


    $scope.getGuaranteeTerminationOrder = function (orderID) {
        var Data = guaranteeService.getGuaranteeTerminationOrder(orderID);
        Data.then(function (rep) {
            $scope.order = rep.data;
            if ($scope.order.Type == 143) {
                $scope.getGuarantee($scope.order.ProductId);
            }

        }, function () {
            alert('Error getFactoringTerminationOrder');
        });
    };

    $scope.callbackgetGuarantee = function () {
        $scope.openedGuarantee = true;
        $scope.getGuarantee($scope.productId);
    }
}])