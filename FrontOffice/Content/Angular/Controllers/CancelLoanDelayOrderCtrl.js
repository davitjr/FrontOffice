app.controller("CancelLoanDelayOrderCtrl", ['$scope', '$http', 'cancelLoanDelayOrderService', 'loanService', 'dateFilter', 'limitToFilter', function ($scope, $http, cancelLoanDelayOrderService, loanService, dateFilter, limitToFilter) {

    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Type = 230;
    $scope.order.SubType = 1;


    $scope.saveCancelLoanDelayOrder = function () {

        $scope.order.ProductAppId = $scope.productid;
        if ($http.pendingRequests.length == 0) {
            document.getElementById("cancelLoanDelayOrderLoad").classList.remove("hidden");
            var Data = cancelLoanDelayOrderService.saveCancelLoanDelayOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("cancelLoanDelayOrderLoad").classList.add("hidden");
                    CloseBPDialog('cancelLoanDelayOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("cancelLoanDelayOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("cancelLoanDelayOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveCancelLoanDelayOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }
    $scope.getCancelLoanDelayOrder = function (orderId) {
        var Data = cancelLoanDelayOrderService.getCancelLoanDelayOrder(orderId);
        Data.then(function (dep) {
            $scope.order = dep.data;
        }, function () {
            alert('Error getCancelLoanDelayOrder');
        });
    };


    $scope.getLoanGrafik = function () {

        var Data = loanService.getLoanGrafik($scope.currentLoan);
        Data.then(function (rep) {
            $scope.loanGrafik = rep.data;
        }, function () {
            alert('Error getLoanGrafik');
        });
    };

}]);