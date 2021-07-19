app.controller("HBApplicationCtrl", ['$scope', '$rootScope', 'hbApplicationService', '$http', '$filter', 'infoService', 'customerService', '$state', 'casherService', 'HBActivationOrderService', function ($scope, $rootScope, hbApplicationService, $http, $filter, infoService, customerService, $state, casherService, HBActivationOrderService) {

    if ($rootScope.SessionProperties.UserId == 1653 || $rootScope.SessionProperties.UserId == 2582 || $rootScope.SessionProperties.UserId == 2603 || $rootScope.SessionProperties.UserId == 2802) {
        $scope.canAccessToOtherBranchesHB = 1;
    } else {
        $scope.canAccessToOtherBranchesHB = $scope.$root.SessionProperties.AdvancedOptions["canAccessToOtherBranchesHB"];
    }


    $scope.addHBApplication = function () {
        
        if ($scope.hbApplication.InvolvingSetNumber == 0)
            return false;
        $scope.hbApplication.QualityDescription = "Դիմում";
        $scope.hbApplication.Quality = 1;
        $scope.hbApplication.FilialCode =  $scope.userFilialCode;
        $scope.hbApplication.RegistrationDate = new Date();
        var data = { hbApplication: $scope.hbApplication };
        $scope.setContractNumber(72);
        $scope.$parent.callback(data);
        CloseBPDialog('newhbapplication');
    }

    $scope.getHBApplication = function () {
        $scope.loading = true;
        var Data = hbApplicationService.getHBApplication();
        Data.then(function (app) {
            $scope.hbApplication = app.data;             
            $scope.hbApplication.isNewInsertedHBApplication = false; 
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getHBApplication');
        });
    }

    $scope.initHBApplication = function () {      

        if ($scope.$root.SessionProperties.CustomerType == 6) {
            $scope.hbApplication = {};
            $scope.hbApplication.RegistrationDate = new Date();
            return;
        }
       

        var Data = hbApplicationService.getHBApplicationShablon();
        Data.then(function (shablon) { 
            $scope.hbApplication = shablon.data;
            $scope.hbApplication.RegistrationDate = new Date();
            $scope.hbApplication.countOfSchemaGroups = 1;
            $scope.hbApplication.InvolvingSetNumber = "";
        }, function () {
            $scope.loading = false;
            alert('Error getHBApplicationShablon');
        });
    }
    $scope.callbackgetHBApplication = function (data) {
        $scope.hbApplication = data.hbApplication;
        $scope.hbApplication.isNewInsertedHBApplication = true;
        if ($scope.$root.SessionProperties.CustomerType == 6)
        {
            var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function(res) {
                $scope.hbApplication.CustomerNumber = res.data;
            });
        }
        //petq e lini hamapatasxan verji id-in
        if ($scope.hbApplication.ID == 0 || $scope.hbApplication.ID == undefined) {
            $scope.setLastHBId(77);
        }
        if ($scope.hbApplication.countOfSchemaGroups != undefined) {
            for (var i = 1; i <= $scope.hbApplication.countOfSchemaGroups; i++) {
                $scope.pushGroupId(75);
            }
        }
    }

    $scope.setLastHBId = function (id) {
        var Data = infoService.getGlobalLastKeyNumber(id);
        Data.then(function(key) {
                $scope.hbApplication.ID = key.data;
            },
            function() {
                alert('error keynumber');
            });
    }

    $scope.hbGroupIds = [];
    $scope.pushGroupId = function (id) {
        var Data = infoService.getGlobalLastKeyNumber(id);
        Data.then(function(key) {
                $scope.hbGroupIds.push(key.data);
            },
            function() {
                console.log('error keynumber');
            });
    }


    $scope.setContractNumber = function (id) {
        var Data = infoService.getGlobalLastKeyNumber(id);
        Data.then(function(key) {
                $scope.hbApplication.ContractNumber = key.data;
            },
            function() {
                console.log('error keynumber');
            });
    }



    $scope.openHBApplicationDetails = function () { 
        if ($scope.hbApplication.FilialCode == $scope.userFilialCode || ($scope.$root.SessionProperties.CustomerType == 6 && $scope.hbApplication.Quality == 1) || $scope.canAccessToOtherBranchesHB == "1")
            {
            $state.go('hbapplicationdetails', {
                hbApplication: $scope.hbApplication,
                hbGroupIds: $scope.hbGroupIds
            });
        }
        else
            return false;
    }

    $scope.getUserFilialCode = function () {
        var Data = casherService.getUserFilialCode();
        Data.then(function (ref) {
            $scope.userFilialCode = ref.data;
        }, function () {
            alert('Error FilialList');
        });
    };

    $scope.getCustomerFilialCode = function () {
        var Data = customerService.getCustomerFilialCode();
        Data.then(function (cust) {
            $scope.customerFilialCode = cust.data;
        }, function () {
            alert('Error getCustomerFilialCode');
        });
    };

    $scope.isCustomerConnectedToOurBank = function () {
        var Data = customerService.isCustomerConnectedToOurBank();
        Data.then(function (cust) {
            $scope.isCustomerConnectedToOurBank = cust.data;
        }, function () {
                alert('Error isCustomerConnectedToOurBank');
        });
    };

    $scope.getRequests = function () {
            var Data = HBActivationOrderService.getHBRequests();

            Data.then(function (cData) {
                if (cData) {
                    $scope.hasRequests = cData.data.length;
                }
            }, function () {
                alert('Error getRequests');
            });
    }
    $scope.getFilialList = function () {
        var Data = infoService.GetFilialList();
        Data.then(function (ref) {
            $scope.filialList = ref.data;
        }, function () {
            alert('Error getFilialList');
        });
    };

}]);