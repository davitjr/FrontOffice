app.controller("CustomerDataOrderCtrl", ['$scope', 'customerDataOrderService', 'customerService', '$location', '$uibModal', function ($scope, customerDataOrderService, customerService, $location, $uibModal) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    $scope.getCustomerDataOrder = function (OrderId) {

        var Data = customerDataOrderService.GetCustomerDataOrder(OrderId);
        Data.then(function (ch) {
            $scope.order = ch.data;
        }, function () {
            alert('Error GetCustomerDataOrder');
        });
    };

    $scope.closeModal = function () {
        $scope.$uibModalInstance.close();
        $location.path("Orders");
    };
    $scope.closeErrorModal = function () {
        $scope.$uibModalInstance.close();
    };

    $scope.showOKmodal = function () {
        $scope.$uibModalInstance = $uibModal.open({
            scope: $scope,
            templateUrl: '/Error/MsgBoxOK',
            keyboard: false,
            controller: 'CustomerDataOrderCtrl',
            backdrop: 'static',
            size: '',
        });
    };
    $scope.showErrormodal = function () {
        $scope.$uibModalInstance = $uibModal.open({
            scope: $scope,
            templateUrl: '/Error/MsgBoxError',
            keyboard: false,
            controller: 'CustomerDataOrderCtrl',
            backdrop: 'static',
            windowClass: 'app-modal-window2',
            size: '',
        });
    };
    $scope.openProgramExpireModal = function () {
        $scope.$uibModalInstance = $uibModal.open({
            scope: $scope,
            templateUrl: '../Error/ProgramExpire',
            keyboard: false,
            controller: 'CustomerDataOrderCtrl',
            backdrop: 'static',
            size: ''
        });
    };
    $scope.saveCustomerDataOrder = function () {
        showloading();
        $scope.order.EmailAddress = [];
        $scope.order.EmailAddress.push($scope.FirstAddress);
        $scope.order.EmailAddress.push($scope.SecondAddress);
        var Data = customerDataOrderService.SaveCustomerDataOrder($scope.order);
        Data.then(function (ch) {

            if (validate($scope, ch.data)) {
                hideloading();
                $scope.showOKmodal();
            }
            else {
                hideloading();
                $scope.showErrormodal();
            }
        }, function () {
            hideloading();
            $scope.openProgramExpireModal();
            alert('Error SaveCustomerData');
        });
    };
    $scope.getCustomer = function () {
        var Data = customerService.getCustomer();
        Data.then(function (cust) {
            $scope.customer = cust.data;
            for (var i = 0; i < cust.data.PhoneList.length; i++) {
                if (cust.data.PhoneList[i].phoneType.key == 1) {
                    $scope.order.MobilePhoneNumber = cust.data.PhoneList[i].phone.countryCode + cust.data.PhoneList[i].phone.areaCode + cust.data.PhoneList[i].phone.phoneNumber;
                }
                else {
                    $scope.order.HomePhoneNumber = cust.data.PhoneList[i].phone.countryCode + cust.data.PhoneList[i].phone.areaCode + cust.data.PhoneList[i].phone.phoneNumber;
                }
            }
            if (cust.data.EmailList.length > 1) {
                $scope.FirstAddress = cust.data.EmailList[0];
                $scope.SecondAddress = cust.data.EmailList[1];
            }
            else {
                $scope.FirstAddress = cust.data.EmailList[0];
            }
            $scope.order.Password = cust.data.SecurityCode;


        }, function () {
            alert('Error');
        });
    };

}]);