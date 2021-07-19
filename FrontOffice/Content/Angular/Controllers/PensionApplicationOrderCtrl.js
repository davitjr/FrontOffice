app.controller("PensionApplicationOrderCtrl", ['$scope', 'pensionApplicationOrderService', 'infoService', 'dateFilter', 'paymentOrderService', '$http', '$filter', function ($scope, pensionApplicationOrderService, infoService, dateFilter, paymentOrderService, $http, $filter) {


    if ($scope.orderType == 89 || $scope.orderType == 91 || $scope.orderType == 94) {

        $scope.order = {};
        $scope.order.SubType = 1;
        $scope.order.Type = $scope.orderType;
        $scope.order.PensionApplication = {};
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        if ($scope.order.Type == 91 || $scope.orderType == 94) {

            $scope.order.PensionApplication = angular.copy($scope.pensionapplication);
            $scope.order.PensionApplication.ServiceType = $scope.order.PensionApplication.ServiceType.toString();
            $scope.order.PensionApplication.CardType = $scope.order.PensionApplication.CardType.toString();
            $scope.order.PensionApplication.DateOfNormalEnd = undefined;

        }
        else
            $scope.order.PensionApplication.ServiceType = undefined;
       
        if ($scope.orderType == 89 || $scope.orderType == 91 || $scope.orderType == 94) {
            $scope.order.PensionApplication.ContractDate = $scope.$root.SessionProperties.OperationDate;
            $scope.IsWorkingDay = function (weekday) {
                var Data = infoService.IsWorkingDay(weekday);
                Data.then(function (day) {
                    if (day.data == false) {
                        weekday = new Date(weekday);
                        weekday = new Date(weekday.getFullYear(), weekday.getMonth(), weekday.getDate() + 1);
                        $scope.IsWorkingDay(weekday);
                    }
                    else {
                        $scope.order.PensionApplication.DateOfNormalEnd = new Date(weekday);
                    }
                }, function () {
                    alert('IsWorkingDay');
                });

            }

            var weekday = new Date(($scope.$root.SessionProperties.OperationDate.getFullYear() + 1), $scope.$root.SessionProperties.OperationDate.getMonth(), $scope.$root.SessionProperties.OperationDate.getDate());
            weekday = dateFilter(weekday, 'yyyy/MM/dd');
            $scope.IsWorkingDay(weekday);

        }

    }
    else if ($scope.orderType == 93)
    {
        $scope.order = {};
        $scope.order.SubType = 1;
        $scope.order.Type = $scope.orderType;
        $scope.order.PensionApplication = {};
        $scope.order.PensionApplication = angular.copy($scope.pensionapplication);
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        $scope.order.ClosingDate = $scope.$root.SessionProperties.OperationDate;
    }

    $scope.getPensionAppliactionQualityTypes = function () {
        var Data = infoService.getPensionAppliactionQualityTypes();
        Data.then(function (type) {
            $scope.qualityTypes = type.data;
        }, function () {
            alert('Error getPensionAppliactionQualityTypes');
        });
    };


    $scope.getPensionAppliactionClosingTypes = function () {
        var Data = infoService.getPensionAppliactionClosingTypes();
        Data.then(function (type) {
            $scope.closingTypes = type.data;
        }, function () {
            alert('Error getPensionAppliactionClosingTypes');
        });
    };


    $scope.getPensionAppliactionServiceTypes = function () {
        var Data = infoService.getPensionAppliactionServiceTypes();
        Data.then(function (type) {
            $scope.serviceTypes = type.data;
        }, function () {
            alert('Error getPensionAppliactionServiceTypes');
        });
    };

    $scope.getAccountsForOrder = function (ServiceType) {
        var subType = 1;

        if (ServiceType == 3) {
            subType = 2;
        }
        if (ServiceType == 1) {
            subType = 3;
        }
        if (ServiceType == 6) {
            subType = 4;
        }
        var Data = paymentOrderService.getAccountsForOrder(89, subType, 1);
        Data.then(function (acc) {
            $scope.accounts = acc.data;
        }, function () {
            alert('Error getaccounts');
        });
    };


    $scope.getCardsType = function () {
        var Data = infoService.getCardsType();
        Data.then(function (type) {
            $scope.cardsType = type.data;
        }, function () {
            alert('Error getPensionAppliactionClosingTypes');
        });
    };



    $scope.savePensionApplicationOrder = function () {
        if ($http.pendingRequests.length == 0) {



            document.getElementById("pensionAppliactionLoad").classList.remove("hidden");
            var Data = pensionApplicationOrderService.savePensionApplicationOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("pensionAppliactionLoad").classList.add("hidden");
                    CloseBPDialog('newPensionAppliactionOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("pensionAppliactionLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("pensionAppliactionLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveAccount');
            });
        }

        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    $scope.savePensionApplicationTerminationOrder = function () {
        if ($http.pendingRequests.length == 0) {



            document.getElementById("pensionAppliactionTerminationLoad").classList.remove("hidden");
            var Data = pensionApplicationOrderService.savePensionApplicationTerminationOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("pensionAppliactionTerminationLoad").classList.add("hidden");
                    CloseBPDialog('newPensionAppliactionTerminationOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("pensionAppliactionTerminationLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("pensionAppliactionTerminationLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveAccount');
            });
        }

        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }


    $scope.getPensionApplicationOrder = function (orderID) {
        var Data = pensionApplicationOrderService.getPensionApplicationOrder(orderID);
        Data.then(function (acc) {
            $scope.order = acc.data;
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
        }, function () {
            alert('Error getRemovalOrder');
        });
    };

    $scope.getPensionApplicationTerminationOrder = function (orderID) {
        var Data = pensionApplicationOrderService.getPensionApplicationTerminationOrder(orderID);
        Data.then(function (acc) {
            $scope.order = acc.data;
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
        }, function () {
            alert('Error getRemovalOrder');
        });
    };

    $scope.pensionCloseApplication = function (accountNumber) {
        showloading();
        var Data = pensionApplicationOrderService.pensionCloseApplication(accountNumber);
        ShowPDF(Data);

    };

    $scope.pensionAgreement = function () {
        showloading();
        var Data = pensionApplicationOrderService.pensionAgreement();
        ShowPDF(Data);
    };

}]);