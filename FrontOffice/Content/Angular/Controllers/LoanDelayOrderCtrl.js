app.controller("LoanDelayOrderCtrl", ['$scope', '$http', 'loanDelayOrderService', 'loanService', 'creditLineService', 'limitToFilter', function ($scope, $http, loanDelayOrderService, loanService, creditLineService, limitToFilter) {

    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Type = 229;

    if ($scope.isCreditLine == true) {
        $scope.order.SubType = 1;
    }
    else {
        $scope.order.SubType = 1;
    }


    $scope.saveLoanDelayOrder = function () {

        $scope.order.ProductAppId = $scope.productid;
        if (!($scope.order.DelayDate instanceof Date)) {
            var dateParts = $scope.order.DelayDate.split("/");
            $scope.order.DelayDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        }


        if ($http.pendingRequests.length == 0) {
            document.getElementById("loanDelayOrderLoad").classList.remove("hidden");
            var Data = loanDelayOrderService.saveLoanDelayOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("loanDelayOrderLoad").classList.add("hidden");
                    CloseBPDialog('loanDelayOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("loanDelayOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("loanDelayOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveLoanDelayOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }


    $scope.getLoanDelayOrder = function (orderId) {
        var Data = loanDelayOrderService.getLoanDelayOrder(orderId);
        Data.then(function (dep) {
            $scope.order = dep.data;
        }, function () {
            alert('Error getLoanDelayOrder');
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


    $scope.getCreditLineGrafik = function () {
        var Data = creditLineService.getCreditLineGrafik($scope.currentCreditline);
        Data.then(function (crd) {
            $scope.creditlinegrafik = crd.data;
            $scope.creditlinegrafik.push({ EndDate: $scope.currentCreditline.EndDate, EndDateToString: $scope.currentCreditline.EndDateToString });
        }, function () {
            alert('Error');
        });
    };






}]);