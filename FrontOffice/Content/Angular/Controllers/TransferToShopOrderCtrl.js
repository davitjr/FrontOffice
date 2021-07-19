app.controller('TransferToShopOrderCtrl', ['$scope', 'transferToShopOrderService', '$http', 'customerService', '$filter', function ($scope, transferToShopOrderService, $http, customerService, $filter) {
    $scope.order = {};
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    $scope.order.Currency = $scope.currency;
    $scope.order.ProductId = $scope.productId;
    $scope.order.Type = 106;
    $scope.order.SubType = 1;
    if ($scope.productId != undefined)
    {
        var Data = customerService.getCustomer();
        Data.then(function (cust) {
            $scope.customer = cust.data;
            if ($scope.loanSale == 8 || $scope.loanSale == 9 || $scope.loanSale == 10 || $scope.loanProgram==25) {
                $scope.productDescription = " գյուղ վարկով";
            }
            else {
                $scope.productDescription = " ապառիկի";
            }
            $scope.order.Description = $scope.customer.FirstName + " " + $scope.customer.LastName + " "
                + ($scope.customer.PassportNumber != null ? $scope.customer.PassportNumber + ", " : $scope.customer.DocumentNumber != null ? $scope.customer.DocumentNumber + ", " : "") + ($scope.customer.PassportGivenBy != null ? $scope.customer.PassportGivenBy + ", " : $scope.customer.DocumentGivenBy != null ? $scope.customer.DocumentGivenBy + ", " : "") + ($scope.customer.PassportGivenDate != null ? $scope.customer.PassportGivenDate + " " : $scope.customer.DocumentGivenDate != null ? $scope.customer.DocumentGivenDate + " " : "")
                +$scope.productDescription+" փոխանց. համ. գույքի հանձ/ը";
        }, function () {
            alert('Error');
        });
    }


    $scope.getTransferToShopOrder = function (orderId) {
        var Data = transferToShopOrderService.getTransferToShopOrder(orderId);

        Data.then(function (ut) {
            $scope.order = ut.data;
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
            $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");
        }, function () {
            alert('Error getaccounts');
        });
    };



    $scope.saveTransferToShopOrder = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("transferToShopOrderLoad").classList.remove("hidden");

            var Data = transferToShopOrderService.saveTransferToShopOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("transferToShopOrderLoad").classList.add("hidden");
                    CloseBPDialog('newTransferToShopOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                }
                else {
                    document.getElementById("transferToShopOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function (err) {
                document.getElementById("transferToShopOrderLoad").classList.add("hidden");
                alert('Error SWIFT');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }


    $scope.getShopAccount = function (productId) {

        var Data = transferToShopOrderService.getShopAccount(productId);
        Data.then(function (acc) {
            $scope.order.ReceiverAccount = acc.data;
        }, function () {
            alert('getShopAccount');
        });
    };

    $scope.getShopTransferAmount = function (productId) {

        var Data = transferToShopOrderService.getShopTransferAmount(productId);
        Data.then(function (acc) {
            $scope.order.Amout = acc.data;
        }, function () {
            alert('getShopAccount');
        });
    };


}]);