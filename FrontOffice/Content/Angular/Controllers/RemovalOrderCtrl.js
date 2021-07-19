app.controller("RemovalOrderCtrl", ['$scope', 'removalOrderService', 'infoService', 'dialogService', '$uibModal', '$http', '$confirm', '$filter',  function ($scope, removalOrderService, infoService, dialogService, $uibModal, $http, $confirm, $filter) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    //$scope.order.Amount = 0;
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
            
    if ($scope.removableorder != undefined)
    {
        $scope.order.OrderNumber = "";

        if ($scope.removableorder.Quality == 30)
        {
            $scope.order.Type = 19;
        }
        else
        {
            $scope.order.Type = 18;
        }
        
        $scope.order.RemovingOrderId = $scope.removableorder.Id;
        var orderType = 0;

        if ($scope.removableorder.Type)
        {
            orderType = $scope.removableorder.Type;
        }
        

        if ($scope.removableorder.Amount)
        {
            $scope.order.Amount = $scope.removableorder.Amount;
        }
        else
        {
            $scope.order.Amount = 0;
        }       

        if (orderType == 51 || orderType ==54)
        {
            if ($scope.removableorder.ReceiverAccount) {
                $scope.order.Account = $scope.removableorder.ReceiverAccount.AccountNumber;
            }
            else
            {
                $scope.order.Account = "0";
            }
        }
        else
        {
            if ($scope.removableorder.DebitAccount) {
                $scope.order.Account = $scope.removableorder.DebitAccount.AccountNumber;
            }
            else
            {
                $scope.order.Account = "0";
            }
        }
       

        if ($scope.removableorder.Currency)
        {
            $scope.order.Currency = $scope.removableorder.Currency;
        }
        else
        {
            $scope.order.Currency = "";
        }
            
        if ($scope.removableorder.OPPerson)
        {
            $scope.order.Customer = $scope.removableorder.OPPerson.PersonName + ' ' + $scope.removableorder.OPPerson.PersonLastName;
        }
        else
        {
            $scope.order.Customer = '';
        }
    }
    
    $scope.getOrderRemovingReasons = function () {
        var Data = infoService.getOrderRemovingReasons();
        Data.then(function (ref) {
            $scope.removingReasons = ref.data;
        }, function () {
            alert('Error Removing Reasons');
        });
    };

    $scope.getRemovableOrderApplication = function () {
        showloading();
        var Data = removalOrderService.getRemovableOrderApplication($scope.order.RemovingOrderId, $scope.order.Amount, $scope.order.Currency, $scope.order.Account, $scope.order.Customer);
        ShowPDF(Data);
    };

    //Հայտի պահպանում
    $scope.saveRemovalOrder = function () {
        if ($http.pendingRequests.length == 0) {


            $scope.error = null;
            document.getElementById("removalOrderLoad").classList.remove("hidden");
            var Data = removalOrderService.saveRemovalOrder($scope.order);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    document.getElementById("removalOrderLoad").classList.add("hidden");
                    
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('removalOrder');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("removalOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.savePayment);

                }
            }, function () {
                $scope.confirm = false;
                document.getElementById("removalOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in savePayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };
    
    $scope.getRemovalOrder = function (orderID) {
        var Data = removalOrderService.getRemovalOrder(orderID);
        Data.then(function (acc) {
            $scope.order = acc.data;
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
        }, function () {
            alert('Error getRemovalOrder');
        });
    };

}]);