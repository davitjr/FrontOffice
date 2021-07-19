app.controller("card3DSecureServiceOrderOrderCtrl", ['$scope', 'card3DSecureOrderService', 'infoService', '$http', 'customerService', 'dialogService', 'infoService', function ($scope, card3DSecureOrderService, infoService, $http, customerService, dialogService, infoService) {

    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Type = 188;
    $scope.order.SubType = 1;
    $scope.order.Card3DSecureService = {};
    $scope.order.Card3DSecureService.CardNumber = $scope.cardNumber;
    $scope.order.Card3DSecureService.ProductId = $scope.productID;
    $scope.getCustomerMainData = function () {
        customerService.getAuthorizedCustomerNumber().then(function (authCustomer) {
            $scope.authorizedCustomerNumber = authCustomer.data;
            $scope.order.Card3DSecureService.CustomerNumber = $scope.authorizedCustomerNumber;
            customerService.getCustomerMainData($scope.authorizedCustomerNumber).then(function (customerData) {
                $scope.customerMainData = customerData.data;
            })
        })
    };

    $scope.saveCard3DSecureServiceOrder = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("card3DSecureOrderLoad").classList.remove("hidden");
            var Data = card3DSecureOrderService.saveCard3DSecureServiceOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("card3DSecureOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('card3DSecureOrder');
                    refresh($scope.order.Type, $scope.order.Card3DSecureService.ProductId );
                }
                else {
                    document.getElementById("card3DSecureOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("card3DSecureOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getCard3DSecureServiceHistory = function () {
        card3DSecureOrderService.getCard3DSecureServiceHistory($scope.productID)
            .then(function (history) {
                $scope.card3dSecureServiceHistory = history.data;
            });
    }

    $scope.getActionTypes = function () {
        var Data = infoService.getArcaCardSMSServiceActionTypes();
        Data.then(function (result) {
            $scope.actionTypes = result.data;
            if ($scope.card3DSecureService.Quality == 2) //եթե արդեն կա գրանցված                    
            {
                delete $scope.actionTypes[1];
            }
            else if ($scope.card3DSecureService.Quality == 0 || $scope.card3DSecureService.Quality == 4)//եթե չկա գրանցված կամ հանված է       
            {
                delete $scope.actionTypes[2];
                delete $scope.actionTypes[3];
            }
            else if ($scope.card3DSecureService.Quality == 6)//եթե փոփոխված է
            {
                delete $scope.ActionTypes[1];
            }
           
        }, function () {
            alert('Error getActionTypes');
        });
    };
    $scope.changeActionType = function () {
        if ($scope.order.Card3DSecureService.ActionType == 2 || $scope.order.Card3DSecureService.ActionType == 3)
        {
            $scope.order.Card3DSecureService.Email = $scope.card3DSecureService.Email;

        }
    }
}]);