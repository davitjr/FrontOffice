app.controller("hbServletOrderCtrl", ['$scope', '$location', 'dialogService', '$http', 'hbServletOrderService', 'ApprovementSchemaService', function ($scope, $location, dialogService, $http, hbServletOrderService, ApprovementSchemaService) {
    $scope.order = {};
    $scope.order.HBtoken = {};
    $scope.order.Type = $scope.orderType;
    $scope.order.SubType = 1;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.ServletRequest = {};

    if ($scope.orderType == 151) {
        $scope.order.HBtoken = {};
        $scope.order.CustomerNumber = $scope.selectedUser.CustomerNumber;
        $scope.order.HBtoken.HBUser = $scope.selectedUser;
    }
    else if ($scope.orderType == 137 || $scope.orderType == 138) {
        $scope.order.CustomerNumber = $scope.selectedToken.HBUser.CustomerNumber;
        $scope.order.HBtoken.ID = $scope.selectedToken.ID;
        $scope.order.HBtoken.HBUser = $scope.selectedToken.HBUser;
        $scope.order.HBtoken.TokenNumber = $scope.selectedToken.TokenNumber;
        $scope.order.HBtoken.TokenType = $scope.selectedToken.TokenType;
        $scope.order.HBtoken.GID = $scope.selectedToken.GID;
    }
    else if ($scope.orderType == 158) {
        $scope.order.CustomerNumber = $scope.selectedToken.HBUser.CustomerNumber;
        $scope.order.HBtoken.ID = $scope.selectedToken.ID;
        $scope.order.HBtoken.TokenType = $scope.selectedToken.TokenType;
        $scope.order.HBtoken.TokenNumber = $scope.selectedToken.TokenNumber;
        $scope.order.HBtoken.HBUser = $scope.selectedToken.HBUser;
    }
    else if ($scope.orderType == 182) {
        $scope.order.HBtoken.HBUser = $scope.selectedUser
        $scope.order.HBtoken.ID = $scope.selectedUser.ID;
        $scope.order.HBtoken.HBUser.ID = $scope.selectedUser.ID;
    }
    //Gemalto Production Part
    else if ($scope.orderType == 135) {
        if ($scope.selectedToken != undefined)
        {
            $scope.order.CustomerNumber = $scope.selectedToken.HBUser.CustomerNumber;
            $scope.order.HBtoken.ID = $scope.selectedToken.ID;
            $scope.order.HBtoken.HBUser = $scope.selectedToken.HBUser;
            $scope.order.HBtoken.TokenNumber = $scope.selectedToken.TokenNumber;
            $scope.order.HBtoken.TokenType = $scope.selectedToken.TokenType;
            $scope.order.HBtoken.GID = $scope.selectedToken.GID;
        }
        if ($scope.selectedUser != undefined) {
            $scope.order.CustomerNumber = $scope.selectedUser.CustomerNumber;
            $scope.order.HBtoken.HBUser = $scope.selectedUser;
        }
    }

    $scope.closeDialog = function () {
        var closeDiv;
        if ($scope.orderType == 135) {

            closeDiv = 'hbtokenunblock';
        }
        if ($scope.orderType == 137) {

            closeDiv = 'hbtokenactivation';
        }
        if ($scope.orderType == 138) {

            closeDiv = 'hbtokendeactivation';
        }
        if ($scope.orderType == 151) {

            closeDiv = 'hbuserdeactivation';
        }
        if ($scope.orderType == 158) {

            closeDiv = 'hbShowPinCode';
        }
        if ($scope.orderType == 182) {

            closeDiv = 'hbuserpasswordresetmanually';
        }


        CloseBPDialog(closeDiv);
    }

    $scope.saveHBServletOrder = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("hbServletLoad").classList.remove("hidden");
            if ($scope.orderType == 135 && $scope.selectedToken != undefined) {
                var Data = hbServletOrderService.saveHBServletTokenUnBlockOrder($scope.order);
            }
            else if ($scope.orderType == 135 && $scope.selectedUser != undefined) {
                var Data = hbServletOrderService.saveHBServletUserUnlockOrder($scope.order);
            }
            if ($scope.orderType == 137) {
                var Data = hbServletOrderService.saveHBServletTokenActivationOrder($scope.order);
            }
            if ($scope.orderType == 138) {
                var Data = hbServletOrderService.saveHBServletTokenDeactivationOrder($scope.order);

            }
            if ($scope.orderType == 151) {
                var Data = hbServletOrderService.saveHBServletUserDeactivationOrder($scope.order);

            }
            if ($scope.orderType == 158) {
                var Data = hbServletOrderService.saveHBServletShowPINCode($scope.order);

            }
            if ($scope.orderType == 182) {
                var Data = hbServletOrderService.saveHBUserPasswordResetManually($scope.order);

            }
            Data.then(function (result) {
                if (validate($scope, result.data)) {
                    if ($scope.values) {
                        $scope.valuedescription = "PIN կոդ:";
                    }

                    if ($scope.callback != undefined) {
                        $scope.callback();
                        if ($scope.orderType == 151) {
                            $scope.updateApprovementSchema();
                        }
                    }
                    debugger;
                    if ($scope.orderType == 137) {
                        var Data = hbServletOrderService.migrateOldUserToCas($scope.order.HBtoken.HBUser.ID);
                        Data.then(function (schema) {
                            document.getElementById("hbServletLoad").classList.add("hidden");
                            $scope.closeDialog();
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            refresh(120);
                        },
                            function () {
                                alert('Error migrateOldUserToCas');
                            });
                    } else {
                        document.getElementById("hbServletLoad").classList.add("hidden");
                        $scope.closeDialog();
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        refresh(120);
                    }
                }
                else {
                    document.getElementById("hbServletLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function (err) {
                document.getElementById("hbServletLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveHBServletOrder');
            });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };


    $scope.updateApprovementSchema = function () {
        var Data = ApprovementSchemaService.getApprovementSchema();
        Data.then(function (schema) {
            localStorage.setItem("hbApprovementSchema", JSON.stringify(schema.data));
        },
            function () {
                alert('Error updateApprovementSchema');
            });
    }
}]);