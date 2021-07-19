app.controller("LoanInterestRateConcessionCtrl", ['$scope', '$http', 'loanInterestRateConcessionService', '$state', function ($scope, $http, loanInterestRateConcessionService, $state) {

    $scope.order = {};
    $scope.order.ConcessionDate = new Date();
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.NumberOfMonths = 12;
    $scope.order.Type = 236;
    $scope.order.SubType = 1;

    $scope.saveLoanInterestRateConcession = function () {

        $scope.order.ProductAppId = $scope.productId;

        if ($http.pendingRequests.length == 0) {
            document.getElementById("loanInterestRateConcessionLoad").classList.remove("hidden");
            var Data = loanInterestRateConcessionService.saveLoanInterestRateConcession($scope.order);
            Data.then(function (res) {
                document.getElementById("loanInterestRateConcessionLoad").classList.add("hidden");
                if (validate($scope, res.data)) {
                    ShowMessage('Հայտի մուտքագրումը կատարված է', 'success', $scope.path);
                    CloseBPDialog('LoanInterestRateConcession');
                    setTimeout(
                        function () {
                            location.reload();
                        }, 2000);
                }
                else {
                    //document.getElementById("loanInterestRateConcessionLoad").classList.add("hidden");
                    if (res.data.Errors.length == 1 && res.data.Errors[0].Code == 0)
                        showMesageBoxDialog(res.data.Errors[0].Description, $scope, 'error');
                    else
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    CloseBPDialog('LoanInterestRateConcession');
                }
            }, function () {
                //document.getElementById("loanInterestRateConcessionLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveLoanInterestRateConcession');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    $scope.getLoanInterestRateConcessionOrder = function (orderId) {
        var Data = loanInterestRateConcessionService.getLoanInterestRateConcessionOrder(orderId);
        Data.then(function (dep) {
            $scope.order = dep.data;
        }, function () {
                alert('Error getLoanInterestRateConcessionOrder');
        });
    };
}]);