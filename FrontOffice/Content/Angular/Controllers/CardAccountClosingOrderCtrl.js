app.controller("CardAccountClosingOrderCtrl", ['$scope', '$rootScope', 'CardAccountClosingOrderService', 'customerService', 'infoService', 'dialogService', '$uibModal', '$http', '$filter', function ($scope, $rootScope, CardAccountClosingOrderService, customerService, infoService, dialogService, $uibModal, $http, $filter, ) {
    $scope.CardAccountClosingOrder = {}
    
    if ($scope.$parent.card !== undefined) {

        $scope.CardAccountClosingOrder.CardAccountNumber = $scope.$parent.card.CardAccount.AccountNumber;
        $scope.CardAccountClosingOrder.CardNumber = $scope.$parent.card.CardNumber;
        $scope.CardAccountClosingOrder.ProductId = $scope.$parent.card.ProductId;
        
    }

    $scope.saveCardAccountClosingOrder = function () {
        if ($http.pendingRequests.length == 0) {

            document.getElementById("cardAccountClosingLoad").classList.remove("hidden");

            var Data = CardAccountClosingOrderService.saveCardAccountClosingOrder($scope.CardAccountClosingOrder);

            Data.then(function (res) {
                
                if (validate($scope, res.data)) {
                    
                    CloseBPDialog('cardaccountclosingorder');
                    ShowMessage('Հայտի մուտքագրումը կատարված է', 'bp-information');          
                }
                else {
                    document.getElementById("cardAccountClosingLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("cardAccountClosingLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                    alert('Error in saveCardAccountClosingOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    $scope.getCardAccountClosingOrderDetails = function (selectedID) {
    
        var Data = CardAccountClosingOrderService.getCardAccountClosingOrderDetails(selectedID);

        Data.then(function (AccountClosingDetails) {
           
            $scope.order = AccountClosingDetails.data;
        });
    }

    $scope.getCardAccountClosingApplication = function () {
        showloading();
        var Data = CardAccountClosingOrderService.getCardAccountClosingApplication($scope.CardAccountClosingOrder.ProductId);
        ShowPDF(Data);
    };

}]);
