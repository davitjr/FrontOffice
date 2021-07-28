app.controller("SwiftCopyOrderCtrl", ['$scope', 'paymentOrderService', 'swiftCopyOrderService', '$location', 'dialogService', 'orderService', 'feeForServiceProvidedOrderService', '$http', 'ReportingApiService', function ($scope, paymentOrderService, swiftCopyOrderService, $location, dialogService, orderService, feeForServiceProvidedOrderService, $http, ReportingApiService) {

    $scope.order = {};
    //$scope.order.FeeAmount = numeral(1000).format('0,0.00');
    $scope.cashType = 19;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Type = 26;
    
    $scope.generateNewOrderNumber = function () {
        var Data = orderService.generateNewOrderNumber(1);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };

    $scope.getSwiftCopyOrderServiceFee = function () {
        var Data = orderService.getOrderServiceFee($scope.order.Type);
        Data.then(function (acc) {
            $scope.order.FeeAmount = numeral(acc.data).format('0,0.00');
        }, function () {
            alert('Error getfeeaccounts');
        });
    };

    $scope.getSwiftCopyOrder = function (OrderId) {

        var Data = swiftCopyOrderService.GetSwiftCopyOrder(OrderId);
        Data.then(function (ch) {
            $scope.order = ch.data;
        }, function () {
            alert('Error GetSwiftCopyOrder');
        });
    };

    $scope.saveSwiftCopyOrder = function () {
        if ($http.pendingRequests.length == 0) {


        if ($scope.cashType == 18) {
            $scope.order.FeeAccount = {};
            $scope.order.FeeAccount.AccountNumber = "0";
            $scope.order.FeeAccount.Currency = "AMD";
        }
        document.getElementById("swiftLoad").classList.remove("hidden");
        $scope.order.FeeAmount = parseFloat($scope.order.FeeAmount.toString().replace(",", ""));
        $scope.order.Fees = [];
            $scope.order.Fees = [
                {
                    Amount: $scope.order.FeeAmount,
                    Type: $scope.cashType,
                    Account: $scope.order.FeeAccount,
                    Currency: 'AMD'
                }
            ];
        var Data = swiftCopyOrderService.saveSwiftCopyOrder($scope.order);
        Data.then(function (res) {

            if (validate($scope, res.data)) {
                document.getElementById("swiftLoad").classList.add("hidden");
                CloseBPDialog('swiftcopyorder');
                $scope.path = '#Orders';
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
            }
            else {
                document.getElementById("swiftLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function (err) {
            document.getElementById("swiftLoad").classList.add("hidden");
            if (err.status != 420)
            {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error SWIFT');
        });
    }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }
    $scope.getFeeAccounts = function () {
        var Data = paymentOrderService.getAccountsForOrder(26, 1, 3);
        Data.then(function (acc) {
            $scope.feeAccounts = acc.data;
        }, function () {
            alert('Error getfeeaccounts');
        });
    };


    $scope.callbackgetSwiftCopyOrder = function () {
        $scope.getSwiftCopyOrder($scope.selectedOrderId);
    };

    //Վճարման հանձնարարականի տպում
    $scope.getSwiftCopyOrderDetails = function (isCopy) {
        showloading();
        if (isCopy == undefined)
            isCopy = false;

        var swiftOrder = $scope.order;
        swiftOrder.ServiceType = 213;
        swiftOrder.Amount = parseFloat($scope.order.FeeAmount.toString().replace(",", ""));
        swiftOrder.Currency = "AMD";
        swiftOrder.Type = 26;
        swiftOrder.DebitAccount = { AccountNumber: "0", Currency: "AMD" };
        swiftOrder.Description = "SWIFT հաստատման փաստաթղթի համար";
        var Data = feeForServiceProvidedOrderService.getFeeForServiceProvidedOrderDetails(swiftOrder, isCopy);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
            alert('Error getFeeForServiceProvidedOrderDetails');
        });

    };

}]);