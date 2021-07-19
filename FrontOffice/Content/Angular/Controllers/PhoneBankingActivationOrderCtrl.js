app.controller("PhoneBankingActivationOrderCtrl", ['$scope', '$rootScope', 'paymentOrderService', 'phoneBankingContractService', 'dialogService', '$filter', 'orderService', "customerService", '$http', '$controller', 'HBActivationOrderService', function ($scope, $rootScope, paymentOrderService, phoneBankingContractService, dialogService, $filter, orderService, customerService, $http, $controller, HBActivationOrderService) {


    $scope.order = {};
    $scope.order.Type = 166;
    $scope.order.SubType = 1;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate; 
    $scope.order.PBActivationRequest = angular.copy($scope.request);
    $scope.order.GlobalID = angular.copy($scope.GlobalID);

    if ($scope.order.PBActivationRequest != undefined)
    {
        $scope.order.Amount = $scope.order.PBActivationRequest.ServiceFee;
    }
        

    $scope.getDebitAccounts = function (orderType, orderSubType) {
        var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 3);
        Data.then(function (acc) {
            $scope.debitAccounts = acc.data;
        }, function () {
            alert('Error getdebitaccounts');
        });
    };
     
    $scope.savePhoneBankingContractActivationOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("PBActivationOrderLoad").classList.remove("hidden");

           
            $scope.order.Currency = "AMD";

            
            if (!($scope.order.PBActivationRequest.RequestDate instanceof Date) )
            {
                $scope.order.PBActivationRequest.RequestDate = $filter('mydate')($scope.order.PBActivationRequest.RequestDate, "dd/MM/yyyy");
            }

 
            var Data = phoneBankingContractService.savePBActivationOrder($scope.order);


            Data.then(function (res) {
                if (validate($scope, res.data)) {

                    document.getElementById("PBActivationOrderLoad").classList.add("hidden");
                    
                    $scope.path = '#Orders';
                    CloseBPDialog('newPBActivationOrder');
                    CloseBPDialog('phoneBankingPendingRequests');
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh(166, $scope.order.DebitAccount);

                }
                else {

                    document.getElementById("PBActivationOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("PBActivationOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error savePBActivationOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    $scope.generateNextOrderNumber = function () {
        if ($scope.person != undefined) {
            var Data = orderService.generateNextOrderNumber($scope.person.CustomerNumber);
            Data.then(function(nmb) {
                $scope.order.OrderNumber = nmb.data;
            });
        }
    };

    $scope.getPBRequest = function () {
        var Data = HBActivationOrderService.getPhoneBankingRequests();
        Data.then(function (acc) {
            $scope.order.PBActivationRequest = acc.data;
            $scope.hasPBRequests = true;
        }, function () {
            alert('Error getHBRequest');
        });

    }

    $scope.setCurrentRequests = function () {
     
        $scope.params = { request: $scope.order.PBActivationRequest , GlobalID: $scope.GlobalID}

    };

    $scope.setOrderAmount = function () {  
        if ($scope.order.PBActivationRequest.IsFree) {
            $scope.order.Amount = 0;
            $scope.order.PBActivationRequest.IsFree = true;
        }
        else
        {
            $scope.order.Amount = $scope.order.PBActivationRequest.ServiceFee;
            $scope.order.PBActivationRequest.IsFree = false;
        }
    }
   
}]);