app.controller('ChequeBookReceiveOrderCtrl', ['$scope', 'referenceOrderService', 'paymentOrderService', 'chequeBookReceiveOrderService', '$location', 'dialogService', 'orderService', 'customerService', '$http', '$confirm', function ($scope, referenceOrderService, paymentOrderService, chequeBookReceiveOrderService, $location, dialogService, orderService, customerService, $http, $confirm) {

    $scope.order = {};
    $scope.order.Type = 75;
    $scope.order.SubType = 1;
    $scope.order.RegistrationDate = new Date();
    $scope.order.ChequeBookAccount = {};
    $scope.order.ChequeBookAccount.AccountNumber = null;
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    

    $scope.getChequeBookReceiveOrder = function (OrderId) {
        var Data = chequeBookReceiveOrderService.GetChequeBookReceiveOrder(OrderId);
        Data.then(function (ch) {
            $scope.order = ch.data;
        }, function () {
            alert('Error GetChequeBook');
        });
    };


    $scope.getChequeBookReceiveServiceFee = function () {
        var Data = orderService.getOrderServiceFee($scope.order.Type);
        Data.then(function (acc) {
            $scope.order.FeeAmount = numeral(acc.data).format('0,0.00');
        }, function () {
            alert('Error getfeeaccounts');
        });
    };


    $scope.saveChequeBookReceiveOrder = function () {
        if ($http.pendingRequests.length == 0) {

            $scope.order.FeeAccount = $scope.order.ChequeBookAccount;
            $scope.order.FeeAmount = parseFloat($scope.order.FeeAmount.toString().replace(",", ""));
            $scope.order.CostPrice = parseFloat($scope.order.CostPrice.toString().replace(",", ""));

            if ($scope.order.CostPrice > $scope.order.FeeAmount ) {
                $confirm({ title: 'Ինքնարժեքը մեծ է սակագնից, Շարունակե՞լ', text: 'Ինքնարժեքը մեծ է սակագնից' })
            .then(function () {
                document.getElementById("chequeReceiveLoad").classList.remove("hidden");
                var Data = chequeBookReceiveOrderService.SaveChequeBookReceiveOrder($scope.order);
                Data.then(function (ch) {

                    if (validate($scope, ch.data)) {
                        document.getElementById("chequeReceiveLoad").classList.add("hidden");
                        CloseBPDialog('receivecheque');
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    }
                    else {
                        document.getElementById("chequeReceiveLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function () {
                    document.getElementById("chequeReceiveLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error SaveCheque');
                });
                    });
                $scope.order.PersonFullName = $scope.person.PersonName + ' ' + $scope.person.PersonLastName;
            }
        else
            {
                document.getElementById("chequeReceiveLoad").classList.remove("hidden");
                var Data = chequeBookReceiveOrderService.SaveChequeBookReceiveOrder($scope.order);
                Data.then(function (ch) {

                    if (validate($scope, ch.data)) {
                        document.getElementById("chequeReceiveLoad").classList.add("hidden");
                        CloseBPDialog('receivecheque');
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        }
                        else {
                            document.getElementById("chequeReceiveLoad").classList.add("hidden");
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                          }
                     }, function () {
                        document.getElementById("chequeReceiveLoad").classList.add("hidden");
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        alert('Error SaveCheque');
                });
                };
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };


    $scope.getCurrentAccounts = function () {
        $scope.currentAccounts = [];
        var Data = referenceOrderService.GetCurrentAccounts();
        Data.then(function (ch) {
            for (var i = 0; i < ch.data.length; i++) {
                if (ch.data[i].AccountType != 58) {
                    $scope.currentAccounts.push(ch.data[i]);
                }

            }
        }, function () {
            alert('Error CurrentAccounts');
        });
    };
 
    $scope.callbackgetChequeBookReceiveOrder = function () {
        $scope.getChequeBookReceiveOrder($scope.selectedOrderId);
    };


    $scope.getChequeBookReceiveOrderWarnings = function () {
        var Data = chequeBookReceiveOrderService.getChequeBookReceiveOrderWarnings($scope.opperson.CustomerNumber, $scope.order.ChequeBookAccount.AccountNumber);
        Data.then(function (acc) {
            $scope.warnings = acc.data;
        }, function () {
            alert('Warnings Error');
        });
    };

    $scope.setOrderPerson = function () {
        var Data = orderService.setOrderPerson();
                Data.then(function (ord) {
            $scope.opperson = ord.data;
            $scope.getChequeBookReceiveOrderWarnings($scope.opperson.CustomerNumber, $scope.order.ChequeBookAccount.AccountNumber);
                }, function () {
                    alert('Error CashTypes');
                });
    };
    $scope.setPerson = function () {

        var Data = customerService.getCustomerType();
        Data.then(function (cust) {
            $scope.customertype = cust.data;
        }, function () {
            alert('Error');
        });

        var Data = orderService.setOrderPerson();
        Data.then(function (ord) {
            $scope.person = ord.data;
        }, function () {
            alert('Error CashTypes');
        });


    };

    $scope.setPerson();


    $scope.getChequeBookApplication = function () {
        $scope.order.PersonFullName = $scope.person.PersonName + ' ' + $scope.person.PersonLastName;
        showloading();
        var Data = chequeBookReceiveOrderService.getChequeBookApplication($scope.order.ChequeBookAccount.AccountNumber, $scope.order.PersonFullName, $scope.order.pageNumberStart, $scope.order.pageNumberEnd);
        ShowPDF(Data);
    };

}]);