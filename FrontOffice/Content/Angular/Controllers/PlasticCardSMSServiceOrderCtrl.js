app.controller("PlasticCardSMSServiceOrderCtrl", ['$scope', '$http', 'PlasticCardSMSServiceOrderService', 'infoService', 'customerService', 'dateFilter', '$confirm', 'cardService', function ($scope, $http, PlasticCardSMSServiceOrderService, infoService, customerService, dateFilter, $confirm, cardService) {
    $scope.accesstoSMSserviceceasefield = $scope.$root.SessionProperties.AdvancedOptions[" accesstoSMSserviceceasefield"];
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Type = 223;
    $scope.order.SubType = 1;
    $scope.IsDisableSum = false;
    $scope.IsDisableSmsType = false;
    $scope.IsDisableMobilePhone = false;
    $scope.order.SetNumber = $scope.$root.SessionProperties.UserId;
    lastAction = 0;
    if ($scope.card != undefined) {
        $scope.cardNumber = $scope.card.CardNumber;
        $scope.productID = $scope.card.ProductId;
        $scope.order.CardNumber = $scope.cardNumber;

    }
    $scope.order.Card = $scope.card;



    $scope.saveAndApprovePlasticCardSMSServiceOrder = function (productID) {
        if (($scope.order.SMSType == undefined || $scope.order.SMSFilter === "") || ($scope.order.OperationType == '2' && $scope.CurrentPhone === "") || ($scope.isMainPhone == true && $scope.order.OperationType == '3' && $scope.accesstoSMSserviceceasefield == '0'))
            return;
        if ($http.pendingRequests.length == 0) {
            showloading();
            $scope.error = null;
            $scope.order.ProductID = productID;
            $scope.order.isArmenia = $scope.Tuple.m_Item2;
            $scope.order.MobilePhone = $scope.Tuple.m_Item1;
            var Data = PlasticCardSMSServiceOrderService.saveAndApprovePlasticCardSMSServiceOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                    hideloading();
                    document.getElementById("PlasticCardSMSServiceOrderLoad").classList.add("hidden");
                    CloseBPDialog('PlasticCardSMSService');
                }
                else {
                    hideloading();
                    document.getElementById("PlasticCardSMSServiceOrderLoad").classList.add("hidden");
                    $scope.showError = 0;
                    //showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                hideloading();
                document.getElementById("PlasticCardSMSServiceOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveAndApprovePlasticCardSMSServiceOrder');
            });
            // });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };


    $scope.GetAllTypesOfPlasticCardsSMS = function () {

        var Data = PlasticCardSMSServiceOrderService.GetAllTypesOfPlasticCardsSMS();
        Data.then(function (result) {
            $scope.TypeOfPlasticCardsSMS = result.data;
        }, function () {
            alert('Error GetAllTypesOfPlasticCardsSMS');
        });
    };

    $scope.getArcaCardSMSServiceActionTypes = function () {
        var Data = infoService.getArcaCardSMSServiceActionTypes();
        Data.then(function (result) {
            $scope.ActionTypes = result.data;
            if ($scope.accesstoSMSserviceceasefield == '0') {
                delete $scope.ActionTypes[2];
            }
        }, function () {
            alert('Error getArcaCardSMSServiceActionTypes');
        });
    };



    $scope.getAuthorizedCustomerNumber = function () {
        const data = customerService.getAuthorizedCustomerNumber()
            .then(function (result) {
                $scope.customerNumber = result.data;
                $scope.getCardMobilePhone($scope.customerNumber, $scope.cardNumber);
            }, function () {
                alert('Error getAuthorizedCustomerNumber PlasticCardSMSServiceCtrl');
            });
    };





    $scope.getCardMobilePhone = function (customerNumber, cardNumber) {
        var Data = PlasticCardSMSServiceOrderService.getCardMobilePhone(customerNumber, cardNumber);
        Data.then(function (res) {
            $scope.MobilePhones = res.data;
            MobilePhonesReserve = [...$scope.MobilePhones];
            $scope.GetCurrentPhone($scope.cardNumber);
        }, function () {
            alert('Error GetPlasticCardSMSServiceHistory');
        });
    };

    $scope.GetCurrentPhone = function (cardNumber) {
        var Data = PlasticCardSMSServiceOrderService.GetCurrentPhone(cardNumber);
        Data.then(function (res) {
            $scope.CurrentPhone = res.data;
            $scope.isMainPhone = (!($scope.MobilePhones.some(phone => phone.m_Item1 == ($scope.CurrentPhone.toString()) && ($scope.CurrentPhone))));
            if ($scope.MobilePhones.length == 1) {
                $scope.Tuple = $scope.MobilePhones[0];
                $scope.IsDisableMobilePhone = true;
            }
        }, function () {
            alert('Error GetCurrentPhone');
        });
    };


    $scope.getPlasticCardSMSServiceOrder = function (orderId) {
        var Data = PlasticCardSMSServiceOrderService.getPlasticCardSMSServiceOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getPlasticCardSMSServiceOrder');
        });
    };

    //$scope.$watch('order.MobilePhone', function (newValue, oldValue) {
    //    console.log(newValue);
    //    console.log(oldValue);
    //});

    $scope.Actions = function () {
        if (lastAction == 2) {
            $scope.MobilePhones = MobilePhonesReserve;
            if ($scope.MobilePhones.length == 1) {
                $scope.Tuple = $scope.MobilePhones[0];
            }

        }
        if ($scope.MobilePhones.length > 1) {
            $scope.IsDisableMobilePhone = false;
        }
        if ($scope.order.OperationType == 3) {
            $scope.SMSTypeAndValue($scope.cardNumber);
        }
        else
            if (($scope.order.OperationType == 1) &&
                ($scope.order.SMSType == 5 || $scope.order.SMSType == 6 || $scope.order.SMSType == 9)) {
                $scope.order.SMSFilter = 0;
                $scope.IsDisableSum = true;
            }
            else
                if ($scope.order.OperationType == 2) {

                    $scope.order.SMSType = '4';
                    $scope.order.SMSFilter = 'N';
                    $scope.IsDisableSmsType = true;
                    $scope.IsDisableSum = true;
                    $scope.IsDisableMobilePhone = true;
                    if (($scope.order.Card.MainCardNumber != "" && ($scope.order.Card.MainCardNumber != $scope.order.Card.CardNumber)) || ($scope.order.Card.CardType).includes('BUSINESS')) {
                        $scope.Tuple = { m_Item1: "", m_Item2: "" };
                    }
                }
                else {
                    $scope.order.SMSFilter = '';
                    $scope.IsDisableSmsType = false;
                    $scope.IsDisableSum = false;
                    if ($scope.MobilePhones.length > 1) {
                        $scope.IsDisableMobilePhone = false;
                    }
                }
        lastAction = $scope.order.OperationType;

    }, function () {
        alert('Error Actions');
    };

    $scope.SMSActions = function () {
        if (($scope.order.OperationType == 1 || $scope.order.OperationType == 3) &&
            ($scope.order.SMSType == 5 || $scope.order.SMSType == 6 || $scope.order.SMSType == 9)) {
            $scope.order.SMSFilter = 0;
            $scope.IsDisableSum = true;
        }
        else {
            $scope.order.SMSFilter = ""; $scope.IsDisableSum = false;
        }
    }, function () {
        alert('Error SMSActions');
    };

    $scope.IsNumber = function (value) {
        if (!($scope.order.SMSFilter == undefined)) {

            if (!(value === '' + parseInt(value))) {
                var slicevilue = value.slice(0, -1);
                $scope.order.SMSFilter = slicevilue;
            }
        }
    }, function () {
        alert('Error IsNumber');
    };


    $scope.getPlasticCardSMSServiceHistory = function (cardNumber) {
        var Data = PlasticCardSMSServiceOrderService.getPlasticCardSMSServiceHistory(cardNumber);
        Data.then(function (result) {
            $scope.PlasticCardSMSServiceHistory = result.data;
        }, function () {
            alert('Error GetPlasticCardSMSServiceHistory');
        });
    };


    $scope.SMSTypeAndValue = function (cardNumber) {
        var Data = PlasticCardSMSServiceOrderService.SMSTypeAndValue(cardNumber);
        Data.then(function (res) {
            let smsTypeAndValue = res.data;

            if (smsTypeAndValue != '') {
                var type = smsTypeAndValue.substring(0, 1);
                switch (type) {
                    case "M":
                        $scope.order.SMSType = '1';
                        break;
                    case "B":
                        $scope.order.SMSType = '2';
                        break;
                    case "A":
                        $scope.order.SMSType = '3';
                        break;
                    case "E":
                        $scope.order.SMSType = '4';
                        break;
                    case "W":
                        $scope.order.SMSType = '5';
                        break;
                    case "H":
                        $scope.order.SMSType = '6';
                        break;
                    case "C":
                        $scope.order.SMSType = '7';
                        break;
                    case "D":
                        $scope.order.SMSType = '8';
                        break;
                    case "F":
                        $scope.order.SMSType = '9';
                        break;

                }
                $scope.order.SMSFilter = smsTypeAndValue.substring(1, smsTypeAndValue.length);
                $scope.order.OperationType = '3'
                $scope.IsDisableSmsType = false;
                if (($scope.order.SMSType == 5 || $scope.order.SMSType == 6 || $scope.order.SMSType == 9)) {
                    $scope.order.SMSFilter = 0;
                    $scope.IsDisableSum = true;

                }
                else
                    $scope.IsDisableSum = false;
            }

        }
            , function () {
                alert('Error GetCurrentPhone');
            });
    };

}]);