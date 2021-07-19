app.controller("StatmentByEmailOrderCtrl", ['$scope', 'infoService', 'referenceOrderService', 'statmentByEmailOrderService', '$location', 'dialogService', 'orderService','$http', function ($scope, infoService, referenceOrderService, statmentByEmailOrderService, $location, dialogService, orderService,$http) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.accounts = "";
    $scope.description = '';
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
       
    $scope.getStatmentByEmailOrder = function (OrderId) {
        var Data = statmentByEmailOrderService.GetStatmentByEmailOrder(OrderId);
        Data.then(function (ch) {
            for (var i = 0; i < ch.data.Accounts.length; i++) {
                $scope.accounts += ch.data.Accounts[i].AccountNumber + ' ' + ch.data.Accounts[i].Currency + ' ' + ch.data.Accounts[i].AccountTypeDescription;
                if (i < ch.data.Accounts.length-1) {
                    $scope.accounts += ",\n";
                }
            }
            $scope.order = ch.data;
        }, function () {
            alert('Error GetStatmentByEmailOrder');
        });
    };

    $scope.saveStatmentByEmailOrder = function () {
        if ($http.pendingRequests.length == 0) {


        document.getElementById("statementLoad").classList.remove("hidden");
        var Data = statmentByEmailOrderService.SaveStatmentByEmailOrder($scope.order);
        Data.then(function (ch) {
            if (validate($scope, ch.data)) {
                document.getElementById("statementLoad").classList.add("hidden");
                CloseBPDialog('statmentbyemailorder');
                $scope.path = '#Orders';
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
            }
            else {
                document.getElementById("statementLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function (err) {
            document.getElementById("statementLoad").classList.add("hidden");
            if (err.status != 420)
            {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error SaveCheque');
        });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };
    $scope.getAccounts = function () {
        var Data = referenceOrderService.GetAccounts();
        Data.then(function (em) {
            $scope.accounts = em.data;

        }, function () {
            alert('Error Accounts');
        });
    };
    $scope.getStatementFrequency = function () {
        var Data = infoService.GetStatementFrequency();
        Data.then(function (ref) {
            $scope.frequency = ref.data;
        }, function () {
            alert('Error frequency');
        });
    };

    $scope.callbackgetStatmentByEmailOrder = function () {
        $scope.getStatmentByEmailOrder($scope.selectedOrderId);
        $scope.getStatementFrequency();
    }


}]);