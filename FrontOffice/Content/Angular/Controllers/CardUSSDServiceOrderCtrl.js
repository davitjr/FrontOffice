app.controller("CardUSSDServiceOrderCtrl", ['$scope', '$http', 'cardUSSDServiceOrderService', 'infoService', 'dateFilter', '$confirm', 'cardService', 'ReportingApiService', function ($scope, $http, cardUSSDServiceOrderService, infoService, dateFilter, $confirm, cardService, ReportingApiService) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Type = 181;
    $scope.order.SubType = 1;



    $scope.saveAndApproveCardUSSDServiceOrder = function (productID) {
        if ($http.pendingRequests.length == 0) {
            showloading();
            $scope.error = null;
            $scope.order.ProductID = productID;


            var Data = cardUSSDServiceOrderService.saveAndApproveCardUSSDServiceOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                    hideloading();
                    document.getElementById("cardUSSDServiceOrderLoad").classList.add("hidden");
                    CloseBPDialog('card_USSD_service_order');
                }
                else {
                    hideloading();
                    document.getElementById("cardUSSDServiceOrderLoad").classList.add("hidden");
                    $scope.showError = true;
                    //showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                hideloading();
                document.getElementById("cardUSSDServiceOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveAndApproveCardUSSDServiceOrder');
            });
            // });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.getArcaCardSMSServiceActionTypes = function (cardUSSDService) {
        var Data = infoService.getArcaCardSMSServiceActionTypes();
        Data.then(function (result) {
            $scope.ActionTypes = result.data;
            if (cardUSSDService == 2) //եթե արդեն կա գրանցված
            {
                delete $scope.ActionTypes[1];
            }
            else if (cardUSSDService == 0 || cardUSSDService == 4)//եթե չկա գրանցված կամ հանված է
            {
                delete $scope.ActionTypes[2];
            }
            else if ( cardUSSDService == 6)//եթե փոփոխված է
            {
                delete $scope.ActionTypes[1];
            }
            
            delete $scope.ActionTypes[3];
            
            }, function () {
                alert('Error getArcaCardSMSServiceActionTypes');
        });
    };

    $scope.getCardMobilePhone = function (productID) {
        var Data = cardUSSDServiceOrderService.getCardMobilePhone(productID);
        Data.then(function (result) {
            $scope.order.MobilePhone = result.data;
        }, function () {
            alert('Error getCardMobilePhone');
        });
    };

    $scope.getCardUSSDServiceOrder = function (orderId) {
        var Data = cardUSSDServiceOrderService.getCardUSSDServiceOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getCardUSSDServiceOrder');
        });
    };

    $scope.getCardUSSDServiceHistory = function () {
        cardUSSDServiceOrderService.getCardUSSDServiceHistory($scope.productID)
            .then(function (history) {
                $scope.cardUSSDServiceHistory = history.data;
            });
    }

    $scope.getCardApplicationDetails = function (applicationID, cardNumber) {
        showloading();
        var Data = cardService.getCardApplicationDetails(applicationID, cardNumber);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: $scope.applicationID, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
                alert('Error getCardApplicationDetails');
        });
    };
}]);