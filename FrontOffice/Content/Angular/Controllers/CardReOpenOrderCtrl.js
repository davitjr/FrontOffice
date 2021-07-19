app.controller("CardReOpenOrderCtrl", ['$scope', 'CardReOpenOrderService', 'customerService', 'infoService', 'dialogService', '$uibModal', '$http', '$filter', '$confirm', function ($scope, CardReOpenOrderService, customerService, infoService, dialogService, $uibModal, $http, $filter, $confirm) {


    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Type = 244;
    $scope.order.SubType = 1;
    $scope.order.SetNumber = $scope.$root.SessionProperties.UserId;
    if ($scope.card != undefined) {
        $scope.order.CardNumber = $scope.card.CardNumber;
        $scope.order.ClosingDate = $scope.card.ClosingDate;
        $scope.order.Currency = $scope.card.Currency;
        $scope.order.Filial = $scope.card.FilialCode;
        $scope.order.MainCardNumber = $scope.card.MainCardNumber;
        $scope.order.ProductID = $scope.card.ProductId;
        $scope.order.CardType = $scope.card.Type;
    }

    $scope.isExistsSSN = true;

    //Քարտի մուտքագրման պահպանում և հաստատում
    $scope.Save = function () {

        if ($http.pendingRequests.length == 0) {

            if ($scope.order.ProductID != undefined) {
                document.getElementById("CardReOpenLoad").classList.remove("hidden");
                var Data = CardReOpenOrderService.saveCardReOpenOrder($scope.order);
                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        document.getElementById("CardReOpenLoad").classList.add("hidden");
                        CloseBPDialog('CardReOpen');
                        $scope.path = '#Orders';

                        if (res.data.ResultCode == 1) {
                            if ($scope.order.MainCardNumber != '' && !$scope.isCardopen) {
                                ShowMessage('Քարտը վերաբացված է, վերաբացվել է նաև ' + $scope.order.MainCardNumber + ' հիմնական քարտը', 'bp-information');
                            }
                            else {
                                ShowMessage('Քարտը վերաբացված է', 'bp-information');
                            }
                        }
                        else
                            ShowMessage('Հայտի մուտքագրումը կատարված է', 'information');
                        refresh($scope.order.Type);
                    }
                    else {
                        document.getElementById("CardReOpenLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    document.getElementById("CardReOpenLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error saveCardReOpen');
                });
            }
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getAuthorizedCustomerNumber = function () {
        const data = customerService.getAuthorizedCustomerNumber()
            .then(function (result) {
                let customerNumber = result.data;
                $scope.GetCustomer(customerNumber);
            }, function () {
                alert('Error getAuthorizedCustomerNumber CardReOpenCtrl');
            });
    };

    $scope.GetCustomer = function (customerNumber) {
        var Data = customerService.getCustomer(customerNumber);
        Data.then(function (result) {
            $scope.customer = result.data;
        }, function () {
            alert('Error GetCustomer');
        });
    };

    $scope.GetCardReOpenReason = function () {
        var Data = CardReOpenOrderService.GetCardReOpenReason();
        Data.then(function (result) {
            $scope.TypeOfReasons = result.data;
            if ($scope.order.MainCardNumber != '') {
                IsCardOpen($scope.order.MainCardNumber);
            } else $scope.isCardopen = false;
        }, function () {
            alert('Error GetCardReOpenReason');
        });
    };


    IsCardOpen = function (cardNumber) {
        var Data = CardReOpenOrderService.IsCardOpen(cardNumber);
        Data.then(function (res) {
            $scope.isCardopen = res.data;
        }, function () {
            alert('Error IsCardOpen');
        });
    };

    $scope.Actions = function () {
        var x = document.getElementById("divCheckbox");
        if ($scope.order.ReopenReason == '3')
            x.style.display = "block";
        else
            x.style.display = "none";

    }, function () {
        alert('Error Actions');
    };


    $scope.getCardReOpenOrder = function (orderId) {
        var Data = CardReOpenOrderService.getCardReOpenOrder(orderId);
        Data.then(function (acc) {

            $scope.order = acc.data;
        }, function () {
            alert('Error GetAccountOrder');
        });
    };


    $scope.callbackgetCardReOpenOrder = function () {
        $scope.getCardReOpenOrder($scope.selectedOrderId);
    };


    $scope.checkHeight = function (event) {
        console.log('test')
        var el = event.target;
        setTimeout(function () {
            el.style.cssText = 'height:auto;';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }, 0);
    };


    $scope.saveCardReOpenOrder = function () {
        if ($scope.order.ReopenReason == undefined || ($scope.order.ReopenReason == 3 && $scope.order.ReopenDescription == undefined)) return;

        if (($scope.customer.CustomerType == 6 && ($scope.customer.SocCardNumber == null || $scope.customer.SocCardNumber == '')) ? false : true) {
            $scope.Save();
        }
        else {
            $confirm({ title: 'Ուշադրություն', text: 'Հաճախորդի հանրային ծառայությունների համարանիշը մուտքագրված չէ։ \n Շարունակե՞լ' })
                .then(function () {
                    $scope.Save();
                }, function () {
                    return;
                });
        }

    }, function () {
        alert('Error saveCardReOpenOrder');
    };


}]);