app.controller("DepositCasePenaltyMatureOrderCtrl", ['$scope', 'depositCasePenaltyMatureOrderService', '$http', 'paymentOrderService', 'orderService', 'customerService', function ($scope, depositCasePenaltyMatureOrderService, $http, paymentOrderService, orderService, customerService) {
    $scope.order = {};
    $scope.order.Description = 'Անհատական պահատուփերի գծով մարում';
    $scope.order.Type = 104;
    $scope.order.SubType = 1;
    $scope.order.Currency = "AMD";
    $scope.order.ProductId = $scope.ProductId;
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Amount = $scope.penaltyAmount;
  

    var Data = customerService.getAuthorizedCustomerNumber();
    Data.then(function(descr) {
        $scope.order.CustomerNumber = descr.data;
        var Data = orderService.generateNextOrderNumber($scope.order.CustomerNumber);
        Data.then(function(nmb) {
            $scope.order.OrderNumber = nmb.data;
        });

    });

   

    $scope.saveDepositCasePenaltyMatureOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.error = null;
            document.getElementById("depositCasePenaltyMatureOrderLoad").classList.remove("hidden");
            var Data = depositCasePenaltyMatureOrderService.saveDepositCasePenaltyMatureOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    document.getElementById("depositCasePenaltyMatureOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('newDepositCasePenaltyMatureOrder');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("depositCasePenaltyMatureOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("depositCasePenaltyMatureOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveDepositCaseOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.getDebitAccounts = function () {
        var Data = paymentOrderService.getAccountsForOrder(1, 2, 3);
        Data.then(function (acc) {
            $scope.debitAccounts = acc.data;
        }, function () {
            alert('Error getDebitAccounts');
        });
    };


    $scope.$watch('checkForDebitAccount', function (newValue, oldValue) {
        if (newValue != undefined)
        {
            if ($scope.checkForDebitAccount == 0)
            {
                $scope.order.Type = 104;
            }
            else if ($scope.checkForDebitAccount == 1)
            {
                $scope.order.Type = 105;
                $scope.order.DebitAccount = null;
            }
        }
    });


    $scope.getDepositCasePenaltyMatureOrder = function (orderID) {
        var Data = depositCasePenaltyMatureOrderService.getDepositCasePenaltyMatureOrder(orderID);
        Data.then(function (rep) {
            $scope.order = rep.data;
        }, function () {
            alert('Error getDepositCasePenaltyMatureOrder');
        });
    };


    $scope.getCashInPaymentOrder = function (isCopy) {
        isCopy = false;
        showloading();
        //var Data = depositCasePenaltyMatureOrderService.getCashInPaymentOrder($scope.order, isCopy);
        //ShowPDF(Data);


        var Data = depositCasePenaltyMatureOrderService.getCashInPaymentOrder($scope.order, isCopy);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
            alert('Error getCashInPaymentOrder');
        });


    }

}]);