app.controller("AccountClosingOrderCtrl", ['$scope', 'accountClosingOrderService', 'infoService', '$http',function ($scope, accountClosingOrderService, infoService,  $http) {

    $scope.getDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    $scope.order.closingAccounts = [];
            
    //Հաշվի փակման պահպանում և հաստատում
    $scope.saveAccountClosingOrder = function () {

        if ($http.pendingRequests.length == 0) {
            $scope.order.Type = 29;

            document.getElementById("accountCloseLoad").classList.remove("hidden");         
            if ($scope.account == undefined) {
                $scope.order.closingAccounts = $scope.closingAccounts;
            }
            else {
                $scope.order.closingAccounts[0] = $scope.account;
            }
            var Data = accountClosingOrderService.saveAccountClosingOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("accountCloseLoad").classList.add("hidden");
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('closeaccount');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("accountCloseLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("accountCloseLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveClosingAccount');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getAccountClosingApplication = function (isReprint) {

        var accountNumbers = "";

        if (isReprint != true) {
            if ($scope.account != undefined) {
                accountNumbers = $scope.account.AccountNumber;
            }
            else {

                for (var i = 0; i < $scope.closingAccounts.length; i++) {
                    accountNumbers += $scope.closingAccounts[i].AccountNumber + ',';
                }
                accountNumbers = accountNumbers.slice(0, -1);
            }
        }
        else {
            for (var i = 0; i < $scope.order.ClosingAccounts.length; i++) {
                accountNumbers += $scope.order.ClosingAccounts[i].AccountNumber + ',';
            }
            accountNumbers = accountNumbers.slice(0, -1);
        }
        if (isReprint || $scope.AccountClosingOrderForm.$valid ) {
            showloading();
            var Data = accountClosingOrderService.getAccountClosingApplication(accountNumbers, $scope.order.ClosingReasonDescription, isReprint, $scope.order.RegistrationDateString);
            ShowPDF(Data);
        }
    };

    $scope.getAccountClosingOrder = function (orderId) {
        var Data = accountClosingOrderService.GetAccountClosingOrder(orderId);
        Data.then(function (acc) {

            $scope.order = acc.data;
        }, function () {
            alert('Error GetAccountClosingOrder');
        });
    };

    $scope.callbackgetAccountClosingOrder = function () {
        $scope.getAccountClosingOrder($scope.selectedOrderId);
    };
    
    $scope.getAccountClosingReasonsTypes = function () {
        var Data = infoService.GetAccountClosingReasonsTypes();
        Data.then(function (closingTypes) {
            $scope.closingReasonsTypes = closingTypes.data;
        }, function () {
            alert('Error ClosingReasonsTypes');
        });
    };
}]);