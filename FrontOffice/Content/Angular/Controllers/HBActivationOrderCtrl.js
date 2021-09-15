app.controller("HBActivationOrderCtrl", ['$scope', '$rootScope', 'HBActivationOrderService', 'paymentOrderService', 'dialogService', '$filter', 'orderService', "customerService", '$http', 'ReportingApiService', function ($scope, $rootScope, HBActivationOrderService, paymentOrderService, dialogService, $filter, orderService, customerService, $http, ReportingApiService) {


    $scope.order = {};
    $scope.order.Type = 69;
    $scope.order.SubType = 1;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.serviceFee = 0;
    $scope.requests = angular.copy($scope.requests);
    if ($scope.requests != undefined)
    {

       
        for (var i = 0; i < $scope.requests.length; i++)
        {
            if ($scope.requests[i].RequestType == 1 || $scope.requests[i].RequestType == 2)
            {
                $scope.showTokensView = true;
                if ($scope.requests[i].HBToken.TokenType == 1)
                {
                    $scope.forPrint = true;
                }

                //if ($scope.requests[i].RequestType == 1 && $scope.$root.SessionProperties.CustomerType != 6)
                //{
                //    $scope.requests[i].ServiceFee = 0;
                //}
            }
            $scope.serviceFee = $scope.serviceFee + $scope.requests[i].ServiceFee;
        }
        
        

    }
    $scope.order.Amount = $scope.serviceFee;
    $scope.order.HBActivationRequests = angular.copy($scope.requests);


    $scope.getDebitAccounts = function (orderType, orderSubType) {
        var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 3);
        Data.then(function (acc) {
            $scope.debitAccounts = acc.data;
        }, function () {
            alert('Error getdebitaccounts');
        });
    };

    $scope.setOrderAmount = function (requests)
    {
        var serviceFee = 0;
        for (var i = 0; i < requests.length; i++) {
            //if (requests[i].RequestType == 1 || requests[i].RequestType == 2)
            //{
            //    if (requests[i].RequestType == 1 && $scope.$root.SessionProperties.CustomerType != 6) {
            //        requests[i].ServiceFee = 0;
            //    }
            //}
            serviceFee = serviceFee + requests[i].ServiceFee;
            if (requests[i].IsFree) {
                serviceFee = serviceFee - requests[i].ServiceFee;
            }
        }
        $scope.serviceFee = serviceFee;
        $scope.order.Amount = $scope.serviceFee;
    }

    $scope.saveHBActivationOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("HBActivationOrderLoad").classList.remove("hidden");

            $scope.order.Currency = "AMD";

            for (var i = 0; i < $scope.order.HBActivationRequests.length; i++)
            {
                if ( !($scope.order.HBActivationRequests[i].RequestDate instanceof Date) )
                {
                    $scope.order.HBActivationRequests[i].RequestDate = $filter('mydate')($scope.order.HBActivationRequests[i].RequestDate, "dd/MM/yyyy");
                }
            }

            //$scope.order.HBActivationRequest.RequestDate = $filter('mydate')($scope.order.HBActivationRequest.RequestDate, "dd/MM/yyyy");
            var Data = HBActivationOrderService.saveHBActivationOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {

                    document.getElementById("HBActivationOrderLoad").classList.add("hidden");
                    
                    $scope.path = '#Orders';
                    CloseBPDialog('newHBActivationOrder');
                    CloseBPDialog('pendingRequests');
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh(69, $scope.order.DebitAccount);
                    window.location.href = location.origin.toString() + '/#!/Orders'; 

                }
                else {

                    document.getElementById("HBActivationOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("HBActivationOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveHBActivationOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }


    $scope.getHBActivationOrder = function (orderID) {
        var Data = HBActivationOrderService.GetHBActivationOrder(orderID);
        Data.then(function (rep) {
            $scope.order = rep.data;
        }, function () {
            alert('Error getHBActivationOrder');
        });
    };


    $scope.callbackgetHBActivationOrder = function () {
        $scope.getHBActivationOrder($scope.selectedOrderId);
    }

    $scope.getFeeForNewTokenOrderDetails = function (isCopy) {
        if ($http.pendingRequests.length == 0) {
        $scope.order.Currency = "AMD";
        showloading();
        //$scope.orderForPrixRasx.OPPerson = $scope.order.OPPerson;
        $scope.order.Name = $scope.person.PersonName;
        $scope.order.LastName = $scope.person.PersonLastName;
        $scope.order.CreditAccount = {};
        $scope.order.CreditAccount.AccountNumber = 0;

            if ($scope.$root.SessionProperties.CustomerType == 6) {

                var orderNumber = $scope.order.OrderNumber;
                for (var i = 0; i < $scope.order.HBActivationRequests.length; i++) {
                    if ($scope.order.HBActivationRequests[i].RequestType == 1 || $scope.order.HBActivationRequests[i].RequestType == 2) {

                        if ($scope.order.HBActivationRequests[i].HBToken.TokenType == 1) {

                            $scope.order.OrderNumber = (parseInt($scope.order.OrderNumber) + 1).toString();
                            $scope.order.Description = "Տոկենի տրամադրում, " + $scope.person.FirstName + " " + $scope.person.LastName + ", " + $scope.person.CustomerNumber + ", տոկենի համարը` " + $scope.order.HBActivationRequests[i].HBToken.TokenNumber;
                            var Data = HBActivationOrderService.getFeeForNewTokenOrderDetails($scope.order);
                            Data.then(function (response) {
                                var requestObj = { Parameters: response.data, ReportName: 81, ReportExportFormat: 1 }
                                ReportingApiService.getReport(requestObj, function (result) {
                                    ShowPDFReport(result);
                                });
                            }, function () {
                                alert('Error getFeeForNewTokenOrderDetails');
                            });

                        }
                    }
                }
                $scope.order.OrderNumber = orderNumber;

            }
            else {
                var orderNumber = $scope.order.OrderNumber;
                for (var i = 0; i < $scope.order.HBActivationRequests.length; i++) {
                    if ($scope.order.HBActivationRequests[i].RequestType == 1 || $scope.order.HBActivationRequests[i].RequestType == 2) {

                        if ($scope.order.HBActivationRequests[i].HBToken.TokenType == 1) {

                            $scope.order.OrderNumber = (parseInt($scope.order.OrderNumber) + 1).toString();
                            $scope.order.Description = "Տոկենի տրամադրում, " + $scope.person.OrganisationName + ", " + $scope.person.CustomerNumber + ", " + $scope.order.HBActivationRequests[i].HBToken.HBUser.UserFullName + ", տոկենի համարը` " + $scope.order.HBActivationRequests[i].HBToken.TokenNumber;
                            var Data = HBActivationOrderService.getFeeForNewTokenOrderDetails($scope.order);
                            Data.then(function (response) {
                                var requestObj = { Parameters: response.data, ReportName: 81, ReportExportFormat: 1 }
                                ReportingApiService.getReport(requestObj, function (result) {
                                    ShowPDFReport(result);
                                });
                            }, function () {
                                alert('Error getFeeForNewTokenOrderDetails');
                            });
                        }
                    }
                }
                $scope.order.OrderNumber = orderNumber;
            }
        }
        else
        {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Ելքի օրդեր>> կոճակը:', 'error');
        }




    }

    $scope.setPerson = function () {

        var Data = customerService.getCustomerType();
        Data.then(function (cust) {
            $scope.customertype = cust.data;
        }, function () {
            alert('Error');
        });

        var Data2 = customerService.getCustomer();
        Data2.then(function (cust) {
            $scope.person = cust.data;
            $scope.generateNextOrderNumber();
        }, function () {
            alert('Error CashTypes');
        });


    };

    $scope.generateNextOrderNumber = function () {
        if ($scope.person != undefined) {
            var Data = orderService.generateNextOrderNumber($scope.person.CustomerNumber);
            Data.then(function(nmb) {
                $scope.order.OrderNumber = nmb.data;
            });
        }
    };

    $scope.saveHBActivationRejectionOrder = function () {
        if ($http.pendingRequests.length == 0) {

            document.getElementById("HBActivationRejectionOrderLoad").classList.remove("hidden");

            $scope.order.Type = 164;

            var Data = HBActivationOrderService.saveHBActivationRejectionOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                                        
                    document.getElementById("HBActivationRejectionOrderLoad").classList.add("hidden");
                     
                    CloseBPDialog('newHBActivationRejectionOrder');
                    CloseBPDialog('pendingRequestsForRejection');
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information'); 
                    refresh($scope.order.Type);
                    window.location.href = location.origin.toString() + '/#!/Orders'; 
                     

                }
                else {

                    document.getElementById("HBActivationRejectionOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("HBActivationRejectionOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }
}]);