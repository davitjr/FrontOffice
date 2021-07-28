app.controller("HBApplicationOrderCtrl", ['$scope', '$rootScope', 'hbApplicationService', '$http', '$filter', 'infoService', 'ApprovementSchemaService', '$confirm', 'hbTokenService', 'casherService', 'customerService', function ($scope, $rootScope, hbApplicationService, $http, $filter, infoService, ApprovementSchemaService, $confirm, hbTokenService, casherService, customerService) {
    $scope.order = {};
    $scope.filter = '1';
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.HBApplicationUpdate = {}; 
    $scope.HBApplicationUpdate.Users = [];
    $scope.HBApplicationUpdate.Tokens = [];
    $scope.order.ApprovementSchema = {};   
    $scope.confirmationPerson = '1';

    $scope.allowDataEntry=false;

    $scope.isHBApplicationUpdated = false;

    $scope.countOfAllowDataEntryUsers = 0;

    if ($rootScope.SessionProperties.UserId == 1653 || $rootScope.SessionProperties.UserId == 2582 || $rootScope.SessionProperties.UserId == 2603 || $rootScope.SessionProperties.UserId == 2802) {
        $scope.canAccessToOtherBranchesHB = "1";
    } else {
        $scope.canAccessToOtherBranchesHB = $scope.$root.SessionProperties.AdvancedOptions["canAccessToOtherBranchesHB"];
    }

    $scope.setApprovementSchema = function () {
        $scope.loading = true;
        //if ($scope.$root.SessionProperties.CustomerType != 6) {
            if ($scope.hbApplication.isNewInsertedHBApplication == true) {
                $scope.createSchema();
            }
            else {
                var Data = ApprovementSchemaService.getApprovementSchema();
                Data.then(function(rep) {
                        $scope.schema = rep.data;
                        sessionStorage.setItem("hbApprovementSchema", JSON.stringify($scope.schema));
                    },
                    function() {
                        alert('Error getApprovementSchema');
                    });
            //}
            $scope.loading = false;
        }
    }
    $scope.saveHBApplicationOrder = function () {
        if ($scope.canAccessToOtherBranchesHB != "1" && $scope.userFilialCode != $scope.hbApplication.FilialCode && !$scope.hbApplication.isNewInsertedHBApplication)
        {
            return ShowMessage('Ուշադրություն! Տվյալ փոփոխությունը հնարավոր է իրականացնել միայն հեռահար բանկինգ ծառայությունը տրամադրող մասնաճյուղում։', 'information');
        }
        var hbApplicationUpdate = $scope.HBApplicationUpdate;
        if ($http.pendingRequests.length == 0 && hbApplicationUpdate != null) {
            var messageText = 'Պահպանել փոփոխությունները։';
            if ($scope.allowDataEntry && $scope.listOfUsersWithAllowDataEntryBefore.length == 0 && $scope.$root.SessionProperties.CustomerType == 6 && !$scope.hbApplication.isNewInsertedHBApplication )
            {
                messageText = 'Գործարքների իրականացման հասանելիությունը կտրամադրվի ծառայությունների ակտիվացում կատարելուց հետո: Ծառայության արժեքն է '+ $scope.entryDataPermissionServiceFee+ ' ՀՀ դրամ:';
            }
            $confirm({ title: 'Շարունակե՞լ', text: messageText})
            .then(function () {
                if ($scope.$root.SessionProperties.CustomerType != 6) {
                    $scope.order.ApprovementSchema = JSON.parse(sessionStorage.getItem("hbApprovementSchema"));
                    $scope.order.ApprovementSchema = $scope.removeDuplicatesFromSchema($scope.order.ApprovementSchema);
                }
                $scope.HBApplicationUpdate.Users = $scope.removeDuplicates($scope.HBApplicationUpdate.Users);
                $scope.validate();

                    var usersScope = angular.element(document.getElementById('hbUserDetails')).scope();
                if (usersScope != undefined) {
                    if ($scope.isExistEmptyUser(usersScope.hbusers)) {
                        return;
                    }
                }

                $scope.HBApplicationUpdate.Tokens = $scope.removeDuplicates($scope.HBApplicationUpdate.Tokens);

                var hbApplicationUpdate = $scope.HBApplicationUpdate;
                $scope.order.RegistrationDate = new Date();
                $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
                $scope.order.SubType = 1;
                if ($scope.hbApplication.isNewInsertedHBApplication == true) {
                    $scope.order.Type = 116;
                }
                else {
                    $scope.order.Type = 132;
                }

                $scope.order.HBApplication = {};
                $scope.order.HBApplication.ID = $scope.hbApplication.ID;
                $scope.order.HBApplication.QualityDescription = $scope.hbApplication.QualityDescription;
                $scope.order.HBApplication.Quality  = $scope.hbApplication.Quality ;
                $scope.order.HBApplication.ContractNumber = $scope.hbApplication.ContractNumber;
                $scope.order.HBApplication.InvolvingSetNumber = $scope.hbApplication.InvolvingSetNumber;
                $scope.order.HBApplication.FilialCode = $scope.customerFilialCode;

                    document.getElementById("hpApplicationLoad").classList.remove("display-none");
                    document.getElementById("hpApplicationLoad").classList.remove("hidden");
                    var Data = hbApplicationService.saveHBApplicationOrder($scope.order, hbApplicationUpdate);
                    Data.then(function (res) {

                        if (validate($scope, res.data)) {
                            switch ($scope.ResultCode) {
                                case 8:
                                    showMesageBoxDialog('Հայտը ուղարկվել է հաստատման', $scope, 'information');
                                    break;
                                case 0:
                                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                                    break;
                                case 1:
                                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                                    window.location.href = location.origin.toString() + '/#!/hbapplication';
                                    break;
                            }
                            document.getElementById("hpApplicationLoad").classList.add("hidden");

                        }
                        else {
                            document.getElementById("hpApplicationLoad").classList.add("hidden");
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                        }

                    }, function () {
                        document.getElementById("hpApplicationLoad").classList.add("hidden");
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        alert('Error saveHBApplicationOrder');
                    });
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }

    }
    $scope.createSchema = function () {
        $scope.order.ApprovementSchema = {};
        $scope.order.ApprovementSchema.SchemaDetails = [];
        for (var i = 1; i <= $scope.hbGroupIds.length; i++) {
            var schemaDetails = {};
            schemaDetails.Group = {};
            schemaDetails.Group.Id = $scope.hbGroupIds[i-1];
            schemaDetails.Order = i;
            schemaDetails.Group.GroupName = "Խումբ " + i;
            $scope.order.ApprovementSchema.SchemaDetails.push(schemaDetails);
        }
        $scope.schema = $scope.order.ApprovementSchema; 
        sessionStorage.setItem("hbApprovementSchema", JSON.stringify($scope.schema));
    }

    $scope.removeDuplicates = function (arr) {
        arr = arr.reverse();
        return arr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj["ID"]).indexOf(obj["ID"]) === pos;
        });
    }
    

    $scope.removeDuplicatesFromSchema = function (schema) {
        for (var i = 0; i < schema.SchemaDetails.length; i++) {
            if (schema.SchemaDetails[i].Group.HBUsers != undefined)
            {
                schema.SchemaDetails[i].Group.HBUsers = $scope.removeDuplicates(schema.SchemaDetails[i].Group.HBUsers);
            }
        }
        return schema;
    }
   

    $scope.getHBApplicationOrder = function (orderId) {
        var Data = hbApplicationService.getHBApplicationOrder(orderId);
        Data.then(function (result) {
            $scope.order = result.data;
        }, function () {
            alert('Error getHBApplicationOrder');
        });
    };

   
    $scope.validate = function () {
        $scope.error = [];
    }
    $scope.isExistEmptyUser = function (users) {
            for (var i = 0; i < users.length; i++)
            {
                if (users[i].newInserted == true && users[i].tokens.length == 0)
                {
                    $scope.error.push({ Code: 1045, Description: 'Գոյություն ունի մուտքագրված օգտագործող առանց տոկենի : Կցեք տոկեն կամ հեռացրեք տվյալ օգտագործողին:' });
                    return true;
                }
            }
            return false;
        }

    $scope.printOnlineRequestLegal = function () {
            showloading();
            var Data = hbApplicationService.printOnlineRequestLegal();
            ShowPDF(Data);
        };
    $scope.printOnlineDeactivateTokenRequestPhysical = function () {
            showloading();
            var Data = hbApplicationService.printOnlineDeactivateTokenRequestPhysical();
            ShowPDF(Data);
        };

    $scope.printOnlineDeactivateRequestLegal = function () {
            showloading();
            var Data = hbApplicationService.printOnlineDeactivateRequestLegal();
            ShowPDF(Data);
    };
    $scope.printOnlineContractPhysical = function (contractNumber, contractDate) {
        contractDate = $filter('mydate')(contractDate, "dd/MM/yyyy");
        showloading();
        var Data = hbApplicationService.printOnlineContractPhysical($scope.userFilialCode, contractNumber, contractDate, $scope.confirmationPerson);
        ShowPDF(Data);
    };
     
    $scope.printOnlineContractLegal = function () {
        showloading();
        var Data = hbApplicationService.printOnlineContractLegal($scope.userFilialCode, $scope.confirmationPerson);
        ShowPDF(Data);
    };
    $scope.printOnlineAgreementPhysical = function () {
        showloading();
        var Data = hbApplicationService.printOnlineAgreementPhysical($scope.userFilialCode, $scope.confirmationPerson);
        ShowPDF(Data);
    };
    $scope.printOnlineAgreementLegal = function () {
        showloading();
        var Data = hbApplicationService.printOnlineAgreementLegal($scope.userFilialCode, $scope.confirmationPerson);
        ShowPDF(Data);
    };
    $scope.getEntryDataPermissionServiceFee = function () {
        var Data = hbTokenService.getEntryDataPermissionServiceFee();
        Data.then(function (result) {
            $scope.entryDataPermissionServiceFee = result.data;
        }, function () {
            alert('Error getEntryDataPermissionServiceFee');
        });
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

    $scope.confirmationPersons = function (confirmationPerson) {
        $scope.confirmationPerson = confirmationPerson;
    };
}]);