app.controller("HBUserCtrl", ['$scope', 'HBUserService', 'loanService', 'periodicTransferService', 'creditLineService', 'guaranteeService', 'accreditiveService', 'depositService', 'cardService', 'accountService', 'factoringService', 'paidFactoringService', 'hbTokenService', 'dialogService', '$filter', "customerService", '$http', '$q', '$uibModal', 'infoService', 'ApprovementSchemaService', '$confirm', '$controller', function ($scope, HBUserService, loanService, periodicTransferService, creditLineService, guaranteeService, accreditiveService, depositService, cardService, accountService, factoringService, paidFactoringService, hbTokenService, dialogService, $filter, customerService, $http, $q, $uibModal, infoService, ApprovementSchemaService, $confirm, $controller) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.HBUser = {};

    $scope.order.HBUser.ProductsPermissions = [];
    $scope.allProducts = [];
    $scope.schema = JSON.parse(sessionStorage.getItem("hbApprovementSchema"));
    $scope.emailFormat = "^[A-Za-z0-9-_.]+$";
    $scope.usedHBTokenNumbers = []; 
    $scope.getCustomerMainData = function () {
        if ($scope.editUser!= undefined)
        {
            if ($scope.order.HBUser.CustomerNumber == undefined || $scope.order.HBUser.CustomerNumber.toString().length != 12) {
                $scope.customerMainData = undefined;
                return;
            }
        }
        if ($scope.$root.SessionProperties.CustomerType == 6 && $scope.order.HBUser.CustomerNumber==undefined) {
            var customerNumber = $scope.hbCustomerNumber;
        }
        else {
            customerNumber = $scope.order.HBUser.CustomerNumber;
        }
        if (customerNumber.toString().length != 12)
        {
            return;
        }
        var Data = customerService.getCustomerMainData(customerNumber);
        Data.then(function(customerData) {
                $scope.customerMainData = customerData.data;
                if ($scope.editUser != undefined) {
                    $scope.setEditUserEmail($scope.customerMainData.Emails);
                }


            },
            function() {
                console.log('error getCustomerMainData');
            });
    }
    if ($scope.editUser != undefined) {
        $scope.order.HBUser = angular.copy($scope.editUser);
        $scope.order.HBUser.ProductsPermissions = [];
        $scope.order.HBUser.IdentificationPerOrder = $scope.order.HBUser.IdentificationPerOrder.toString();
        $scope.order.HBUser.Email = $scope.editUser.Email;
        $scope.usernameAvailability = true;
        $scope.getCustomerMainData();
    }
    else {
        $scope.order.HBUser.newInserted = true;
        $scope.order.HBUser.IdentificationPerOrder = "false";
        $scope.usernameAvailability = false;

        $scope.order.HBUser.AllowDataEntry = true;
        $scope.order.HBUser.PassChangeReq = true;

    }
    $scope.getHBUsers = function () {
        // aktive users
        var filter = 1;
        if ($scope.hbApplication.ID == undefined)
            return;
        $scope.loading = true;
        var promises = [];
        var Data = HBUserService.getHBUsers($scope.hbApplication.ID, filter);
        Data.then(function (acc) {
            $scope.hbusers = acc.data;
            $scope.activeUsers = $scope.hbusers;
            angular.forEach($scope.hbusers, function (item) {
                var deferred = $q.defer();
                hbTokenService.getHBTokens(item.ID, 1).then(function (tokens) {
                    deferred.resolve(tokens);
                });
                promises.push(deferred.promise);
            });
            $q.all(promises).then(
                function (results) {
                    for (var i = 0; i < $scope.hbusers.length; i++) {
                        $scope.hbusers[i].tokens = results[i].data;
                        $scope.hbusers[i].newInserted = false;
                        if ($scope.hbusers[i].AllowDataEntry)
                        {
                            $scope.$parent.countOfAllowDataEntryUsers++;
                        }
                    }
                },
                // error
                function (response) {
                }
            );

            $scope.loading = false;
            var listOfUsersWithAllowDataEntryBefore = $scope.hbusers.filter(function (obj) {
                return obj.AllowDataEntry == true;
            });
            var rootScope = angular.element(document.getElementById('hbApplicationdetails')).scope();
            rootScope.listOfUsersWithAllowDataEntryBefore = listOfUsersWithAllowDataEntryBefore;


        }, function () {
            $scope.loading = false;
            alert('Error getHBUsers');
        });
    };
    $scope.getHBDeactivatedUsers = function () {
        // deactivated users
        var filter = 2;
        if ($scope.hbApplication.ID == undefined)
            return;
        $scope.loading = true;
        var promises = [];
        var Data = HBUserService.getHBUsers($scope.hbApplication.ID, filter);
        Data.then(function (acc) {
            $scope.deactivatedUsers = acc.data;
            angular.forEach($scope.deactivatedUsers, function (item) {
                var deferred = $q.defer();
                hbTokenService.getHBTokens(item.ID, 1).then(function (tokens) {
                    deferred.resolve(tokens);
                });
                promises.push(deferred.promise);
            });
            $q.all(promises).then(
                function (results) {
                    for (var i = 0; i < $scope.deactivatedUsers.length; i++) {
                        $scope.deactivatedUsers[i].tokens = results[i].data;
                        $scope.deactivatedUsers[i].newInserted = false;
                    }
                },
                // error
                function (response) {
                }
            );

            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getHBUsers');
        });
    };


    $scope.filter = '1';
    $scope.tokensFilter = '1';
    $scope.QualityFilter = function () {
        if ($scope.filter == 1) {
            $scope.hbusers = $scope.activeUsers;
        }
        else {
            $scope.hbusers = $scope.deactivatedUsers;
        }

    }
    $scope.QualityFilterTokens = function (user, tokensFilter) {
        for (var i = 0; i < $scope.hbusers.length; i++) {
            if ($scope.hbusers[i].ID == user.ID) {
                var Data = hbTokenService.getHBTokens(user.ID, tokensFilter);
                Data.then(function (tok) {
                    $scope.hbusers[i].tokens = tok.data;

                }, function () {
                    alert('Error getHBTokens');
                });
                break;
            }
        }
    }

    $scope.searchCustomers = function () {
        $scope.searchCustomersModalInstance = $uibModal.open({
            template: '<searchcustomer callback="getSearchedCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });
    };



    $scope.deleteCustomer = function () {
        $scope.CustomerNumber = undefined;
    }

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    }
    $scope.productTypes = [
        { 'key': 0, description: 'Վարկեր','Type':1 },
        { 'key': 1, description: 'Առևտրային վարկային գծեր', 'Type': 3 },
        { 'key': 2, description: 'Երաշխիք/Ակրեդիտիվ', 'Type': 4 },
        { 'key': 3, description: 'Ավանդներ', 'Type': 5 },
        { 'key': 4, description: 'Քարտեր','Type':6 },
        { 'key': 5, description: 'Ընթացիկ հաշիվներ', 'Type': 7 },
        { 'key': 6, description: 'Պարբերական փոխանցումներ', 'Type': 8 },
        { 'key': 7, description: 'Ֆակտորինգ', 'Type': 10 },
        { 'key': 8, description: 'Վճարված ֆակտորինգ', 'Type': 12 },
        { 'key': 9, description: 'Օվերդրաֆտ', 'Type': 9 },
        { 'key': 10, description: 'Պարտապանի սահմանաչափ', 'Type': 11 }
    ];
    for (var i = 0; i < $scope.productTypes.length; i++) {
        $scope.allProducts[i] = [];
    }
    $scope.currentProductKye = -1;
    $scope.setClickedRowProductType = function (index) {
        $scope.selectedRowProductType = index;
        $scope.currentProductKey = index;
    }
    $scope.setClickedRowProduct = function (index) {
        $scope.selectedRowProduct = index;

    }
    $scope.setProductPermissionsCheckBoxes = function (product,index) {
        if ($scope.editUser == undefined || product.lengt==0) {
            return;
        }
        var accountNumber;
        var appId;       
        for (var i = 0; i < product.length; i++) {
            appId = product[i].ProductId;
            if (appId == undefined)
                appId = 0;
            switch (index) {
                case 0: { accountNumber = 0; break; }
                case 1: { accountNumber = product[i].CreditLineAccountNumber; break; }
                case 2: { accountNumber = 0; break; }
                case 3: { accountNumber = product[i].DepositAccount.AccountNumber; break; }
                case 4: { accountNumber = product[i].CardAccount.AccountNumber; break; }
                case 5: {accountNumber = product[i].AccountNumber; break; }
                case 6: { accountNumber = 0; break; }
                case 7: { accountNumber = 0; break; }
                case 8: { accountNumber = 0; break; }
                case 9: { accountNumber = product[i].LoanAccount.AccountNumber; break; }
                case 10: { accountNumber = 0; break; }
            }

            for (var j = 0; j < $scope.editUser.ProductsPermissions.length; j++) {             
                if (appId == $scope.editUser.ProductsPermissions[j].ProductAppID 
                    && accountNumber == $scope.editUser.ProductsPermissions[j].ProductAccountNumber
                    && $scope.productTypes[index].Type == $scope.editUser.ProductsPermissions[j].ProductType) {

                    product[i].IsActive = $scope.editUser.ProductsPermissions[j].IsActive;
                }
            }

        }

    }

    $scope.getProducts = function () {
        loanService.getLoans(1).then(function (products) {
            $scope.allProducts[0] = products.data;
            $scope.setProductPermissionsCheckBoxes($scope.allProducts[0],0);
        }), function () { console.log('Error getProducts'); };

        creditLineService.getCreditLines(1).then(function (products) {
            $scope.allProducts[1] = products.data;
            var commercialCreditLines = [];
            for (var i = 0; i < $scope.allProducts[1].length; i++) {
                if ($scope.allProducts[1][i].Type == 18) {
                    commercialCreditLines.push($scope.allProducts[1][i]);
                }
            }
            $scope.allProducts[1] = commercialCreditLines;
            $scope.setProductPermissionsCheckBoxes($scope.allProducts[1],1);
        }), function () { console.log('Error getProducts'); };

        guaranteeService.getGuarantees(1).then(function (products) {
            $scope.allProducts[2] = products.data;
            accreditiveService.getAccreditives(1).then(function(accreditives) {
                $scope.allProducts[2] = $scope.allProducts[2].concat(accreditives.data);
                $scope.setProductPermissionsCheckBoxes($scope.allProducts[2], 2);
            });
        }), function () { console.log('Error getProducts'); };

        depositService.getDeposits(1).then(function (products) {
            $scope.allProducts[3] = products.data;
            $scope.setProductPermissionsCheckBoxes($scope.allProducts[3],3);
        }), function () { console.log('Error getProducts'); };

        cardService.getCards(1).then(function (products) {
            $scope.allProducts[4] = products.data;
            $scope.setProductPermissionsCheckBoxes($scope.allProducts[4],4);
        }), function () { console.log('Error getProducts'); };

        accountService.GetCurrentAccounts(1).then(function (products) {
            $scope.allProducts[5] = products.data;
            $scope.setProductPermissionsCheckBoxes($scope.allProducts[5],5);
        }), function () { console.log('Error getProducts'); };

        periodicTransferService.getPeriodicTransfers(1).then(function (products) {
            $scope.allProducts[6] = products.data;
            $scope.setProductPermissionsCheckBoxes($scope.allProducts[6],6);
        }), function () { console.log('Error getProducts'); };

        factoringService.getFactorings(1).then(function (products) {
            var factoring = [];
            for (var i = 0; i < products.data.length; i++) {
                if (products.data[i].Type == 31) {
                    factoring.push(products.data[i]);
                }
            }
            $scope.allProducts[7] = factoring;
            $scope.setProductPermissionsCheckBoxes($scope.allProducts[7], 7);
        }), function () { console.log('Error getProducts'); };

        paidFactoringService.getPaidFactorings(1).then(function (products) {
            $scope.allProducts[8] = products.data;
            $scope.setProductPermissionsCheckBoxes($scope.allProducts[8],8);
        }), function () { console.log('Error getProducts'); };

        creditLineService.getCreditLines(1).then(function (products) {
            $scope.allProducts[9] = products.data;
            var overdrafts = [];
            for (var i = 0; i < $scope.allProducts[9].length; i++) {
                if ($scope.allProducts[9][i].Type == 25) {
                    overdrafts.push($scope.allProducts[9][i]);
                }
            }
            $scope.allProducts[9] = overdrafts;
            $scope.setProductPermissionsCheckBoxes($scope.allProducts[9],9);
        }), function () { console.log('Error getProducts'); };

        factoringService.getFactorings(1).then(function (products) {            
            var cardHolderLimit = [];
            for (var i = 0; i < products.data.length; i++) {
                if (products.data[i].Type == 32) {
                    cardHolderLimit.push(products.data[i]);
                }
            }
            $scope.allProducts[10] = cardHolderLimit;
            $scope.setProductPermissionsCheckBoxes($scope.allProducts[10], 10);
        }), function () { console.log('Error getProducts'); };

    }
    $scope.setProductsPermissions = function (user) {
        user.ProductsPermissions = [];
        for (var i = 0; i < $scope.allProducts.length; i++) {
            for (var j = 0; j < $scope.allProducts[i].length; j++) {
                if ($scope.allProducts[i][j].IsActive == true) {
                    var product = $scope.allProducts[i][j];
                    var appId = product.ProductId;
                    if (appId == undefined)
                        appId = 0;
                    var productType;
                    var accountNumber;
                    switch (i) {
                        case 0: { productType = 1; accountNumber = 0; } break;
                        case 1: { productType = 3; accountNumber = product.LoanAccount.AccountNumber; } break;
                        case 2: { productType = 4; accountNumber = 0; } break;
                        case 3: { productType = 5; accountNumber = product.DepositAccount.AccountNumber; } break;
                        case 4: { productType = 6; accountNumber = product.CardAccount.AccountNumber; } break;
                        case 5: { productType = 7; accountNumber = product.AccountNumber; } break;
                        case 6: { productType = 8; accountNumber = 0; } break;
                        case 7: { productType = 10; accountNumber = 0; } break;
                        case 8: { productType = 12; accountNumber = product.LoanAccount.AccountNumber; } break;
                        case 9: { productType = 9; accountNumber = product.LoanAccount.AccountNumber; } break;
                        default: { productType = 0; accountNumber = 0 };
                    }
                    user.ProductsPermissions.push({
                        "IsActive": true,
                        "ProductAppID": appId,
                        "ProductType": productType,
                        "ProductAccountNumber": accountNumber
                    });
                }
            }
        }
        if ($scope.order.HBUser.ProductsPermissions.length == 0) {
            $scope.order.HBUser.LimitedAccess = false;
        }
    }


    $scope.checkAllProducts = function () {
            for (var i = 0; i < $scope.allProducts[$scope.currentProductKey].length; i++) {
                $scope.allProducts[$scope.currentProductKey][i].IsActive = $scope.allProducts[$scope.currentProductKey].isCheckedAllProducts;
                $scope.allProducts[$scope.currentProductKey][i].isCheckedAllProducts = $scope.allProducts[$scope.currentProductKey].isCheckedAllProducts;
            }     
    }

    $scope.checkHBUserNameAvailability = function () {
        var customerNumber = "";
        if ($scope.$root.SessionProperties.CustomerType == 6 && $scope.order.HBUser.CustomerNumber == undefined) {
            customerNumber = $scope.hbCustomerNumber;
        }
        else if ($scope.order.HBUser.CustomerNumber != undefined && $scope.$root.SessionProperties.CustomerType != 6) {
            customerNumber = $scope.order.HBUser.CustomerNumber;
        }
        $scope.order.HBUser.HBAppID = $scope.hbAppId;
        var Data = HBUserService.checkHBUserNameAvailability($scope.order.HBUser);
        Data.then(function (o) {
            if (!o.data)
                $scope.usernameAvailability = false;
            else
                $scope.usernameAvailability = true;
        }, function () {
            alert('Error checkHBUserNameAvailability');
        });

    }
    $scope.setClickedUser = function (index) {
        $scope.selectedUser = $scope.hbusers[index];
        $scope.selectedUserIndex = index;
    }
    $scope.setClickedToken = function (token, index) {
        $scope.selectedToken = token;
        $scope.selectedTokenIndex = index;
    }


    $scope.printOnlinePartialDeactivateRequestLegal = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlinePartialDeactivateRequestLegal(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.printOnlineAddTokenRequestLegal = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlineAddTokenRequestLegal(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.printOnlineLostTokenRequestLegal = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlineLostTokenRequestLegal(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.printOnlineDamagedTokenRequestLegal = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlineDamagedTokenRequestLegal(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.printOnlineChangeRightsRequestLegal = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlineChangeRightsRequestLegal(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.printOnlineChangeTokenRequestLegal = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlineChangeTokenRequestLegal(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.printOnlineLostTokenRequestPhysical = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlineLostTokenRequestPhysical(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.printOnlineDamagedTokenRequestPhysical = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlineDamagedTokenRequestPhysical(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.printOnlineChangeRightsRequestPhysical = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlineChangeRightsRequestPhysical(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.printOnlineChangeTokenRequestPhysical = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlineChangeTokenRequestPhysical(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.printOnlinePartialDeactivateRequestPhysical = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlinePartialDeactivateRequestPhysical(selectedTokenSerial);
        ShowPDF(Data);
    };
    $scope.printOnlineAddTokenRequestPhysical = function (selectedTokenSerial) {
        showloading();
        var Data = HBUserService.printOnlineAddTokenRequestPhysical(selectedTokenSerial);
        ShowPDF(Data);
    };

    $scope.validate = function () {
        if ($scope.editUser != undefined)
        {
            //Չի կարելի կցել իրավաբանական հաճախորդ
            if ($scope.customerMainData == undefined || $scope.customerMainData.CustomerType != 6) {
                return;
            }
        }
        $scope.error = [];
        if ($scope.editUser == undefined || ($scope.editUser != undefined && $scope.editUser.newInserted))
            if (!$scope.usernameAvailability) {
                $scope.error.push({
                    Code: 1009, Description: 'Օգտագործողի անունը  սխալ է'
                });
            }
        if ($scope.customerMainData.Emails.length == 0)
        {
            $scope.error.push({
                Code: 1010, Description: 'Տվյալ հաճախորդի համար չկա մուտքագրված էլեկտրոնային հասցե: Անհրաժեշտ է  հաճախորդի անձնական տվյալներում լրացնել առնվազն մեկ էլեկտրոնային հասցե:'
            });
        }

        if($scope.error.length == 0)
            return true;
        else
            return false;
    }
    $scope.saveHBUserOrder = function () {
        
        if (!$scope.validate())
            return;
        //user-ի մուտքագրում
        $scope.order.HBUser.HBAppID = $scope.hbAppId;
        $scope.setProductsPermissions($scope.order.HBUser);
        $scope.order.HBUser.Action = 1;
        $scope.order.HBUser.IsActive = true;
        if ($scope.customerMainData != undefined) {
            $scope.order.HBUser.UserFullName = $scope.customerMainData.CustomerDescription;
        }
        //user-i generacvac ID-in harkavor e miayn nor user avelacnelis
        if ($scope.order.HBUser.newInserted) {
            $scope.order.HBUser.ID = $scope.lastHBUserId;
        }
        var data = { user: $scope.order.HBUser, approvementSchema: $scope.order.schemaDetails };
        if ($http.pendingRequests.length == 0) {
            $scope.$parent.callback(data);
            CloseBPDialog('newhbuser');
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
        
    }
    $scope.callbackGetUser = function (data) {
        
        data.user.newInserted = true;
        data.user.tokens = [];
        $scope.hbusers.push(data.user);
        $scope.$parent.HBApplicationUpdate.Users.push(data.user);
        $scope.$parent.isHBApplicationUpdated = true;
        if ($scope.$root.SessionProperties.CustomerType != 6) {
            $scope.insertUserIntoApprovementSchema($scope.$parent, data.user, data.approvementSchema);
        }
        
    }

    $scope.editHBUser = function () {
        if (!$scope.validate())
            return;
        if ($scope.usernameAvailability == false)
        {
            return;
        }
        $scope.order.HBUser.Action = 2;
        $scope.setProductsPermissions($scope.order.HBUser);
        var data = { user: $scope.order.HBUser, schemaDetails: $scope.order.schemaDetails };

        $scope.$parent.callback(data);
        CloseBPDialog('edithbuser');
    }
    $scope.callbackGetEditUser = function (data) {
        //Erb katarvum e popoxutyun nor avelacrac useri vra, ayd user gcel avelacracneri mej
        if (data.user.newInserted) {
            data.user.Action = 1;
        }

        //heracnel user, ete ayn arka e HBApplicationUpdate-um
        //$scope.deleteIfExistUser(data.user);
        if ($scope.$root.SessionProperties.CustomerType != 6) {
            $scope.deleteUserFromSchemaIfExist(data.user);
            $scope.insertUserIntoApprovementSchema($scope.$parent, data.user, data.schemaDetails);
        }
        $scope.$parent.HBApplicationUpdate.Users.push(data.user);
        $scope.$parent.isHBApplicationUpdated = true;
        $scope.hbusers[$scope.selectedUserIndex] = data.user;
    }

    $scope.deleteUser = function () {
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ օգտագործողին:' })
                .then(function () {
                    for (var i = 0; i < $scope.hbusers.length; i++) {
                        if ($scope.hbusers[i].ID == $scope.selectedUser.ID) {
                            $scope.hbusers.splice(i, 1);
                            break;
                        }
                    }
                    for (var k = 0; k < $scope.$parent.HBApplicationUpdate.Users.length; k++) {
                        if ($scope.$parent.HBApplicationUpdate.Users[k].ID == $scope.selectedUser.ID) {
                            $scope.$parent.HBApplicationUpdate.Users.splice(k, 1);
                            break;
                        }
                    }
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }

    }


    $scope.deActivateUser = function ()
    {
        $scope.selectedUser.IsBlocked = true;
        $scope.selectedUser.Action = 3;
        for (var i = 0; i < $scope.selectedUser.tokens.length; i++) {
            // dadarecnel ete active 
            if ($scope.selectedUser.tokens[i].Quality != 2) {
                $scope.selectedUser.tokens[i].Quality = 2;
                $scope.selectedUser.tokens[i].Action = 3;
                $scope.$parent.HBApplicationUpdate.Tokens.push($scope.selectedUser.tokens[i]);
            }
        }
        $scope.$parent.HBApplicationUpdate.Users.push($scope.selectedUser);
        $scope.$parent.isHBApplicationUpdated = true;

        if ($scope.$root.SessionProperties.CustomerType != 6) {
            $scope.deleteUserFromSchemaIfExist($scope.selectedUser);        }

    }

    $scope.deActivateUserConfirmation = function (params) {
        if ($scope.selectedUser.IsBlocked == true) {
            return;
        }
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Ուշադրություն! Օգտագործողի դադարեցումը  հայտի հաստատման հետ կապված չէ: Օգտագործողին կցված բոլոր տոկենները անմիջապես անվերադարձ կապաակտիվանան:' })
                .then(function () {

                    $controller('PopUpCtrl', { $scope: $scope });
                    $scope.params = params;
                    $scope.openWindow('/HBServletRequestOrder/PersonalHBServletOrder', 'Օգտագործողի ապաակտիվացում', 'hbuserdeactivation', $scope.deActivateUser);

                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }

    }
    $scope.activateUser = function () {
        //User@ dadarecvac er
        if ($scope.selectedUser.IsBlocked == false) {
            return;
        }
        if ($http.pendingRequests.length == 0) {
            var message = 'Վերականգնել օգտագործողին';
            //////// Mer gorcoxutyan ardyunqum e haytnvel dadarecvacneri mej
            if ($scope.selectedUser.Action == 3 && $scope.isUserHasDeactivatedTokens($scope.selectedUser)) {
                message = 'Օգտագործողին կցված են դադարեցված տոկեններ,վերականգնվելու է միայն օգտագործողը, Շարունակե՞լ';
            }

            $confirm({ title: 'Շարունակե՞լ', text: message })
                .then(function () {
                    $scope.selectedUser.IsBlocked = false;
                    $scope.selectedUser.Action = 2;
                    //$scope.deleteIfExistUser($scope.selectedUser);
                    $scope.$parent.HBApplicationUpdate.Users.push($scope.selectedUser);
                    $scope.$parent.isHBApplicationUpdated = true;
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }

    }


    $scope.callbackGetToken = function (data) {
        data.token.newInserted = true;
        if ($scope.selectedUser.tokens == null) {
            $scope.selectedUser.tokens = [];
        }
        $scope.selectedUser.tokens.push(data.token);
        $scope.$parent.HBApplicationUpdate.Tokens.push(data.token);
        $scope.$parent.isHBApplicationUpdated = true;
        $scope.usedHBTokenNumbers.push(data.token.TokenNumber);
    }
    $scope.callbackGetEditToken = function (data) {
        //Erb katarvum e popoxutyun nor avelacrac tokeni vra, ayd tokenin gcel avelacracneri mej
        if (data.token.newInserted) {
            data.token.Action = 1;
        }
       
        $scope.$parent.HBApplicationUpdate.Tokens.push(data.token);
        $scope.$parent.isHBApplicationUpdated = true;
        $scope.hbusers[$scope.selectedUserIndex].tokens[$scope.selectedTokenIndex] = data.token;

        if (data.token.tokenNumberBeforeEdit != data.token.TokenNumber)
        {
            for (var i = 0; i < $scope.usedHBTokenNumbers.length; i++)
            {
                if($scope.usedHBTokenNumbers[i] == data.token.tokenNumberBeforeEdit)
                {
                    $scope.usedHBTokenNumbers.splice(i, 1);
                    $scope.usedHBTokenNumbers.push(data.token.TokenNumber);
                }
            }
        }



    }


    $scope.deleteToken = function () {
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ տոկենը:' })
                .then(function () {
                            for (var i = 0 ; i < $scope.hbusers.length; i++) {
                                for (var j = 0 ; j < $scope.hbusers[i].tokens.length; j++) {
                                    if ($scope.hbusers[i].tokens[j].ID == $scope.selectedToken.ID) {
                                        $scope.hbusers[i].tokens.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                            for (var k = 0; k < $scope.$parent.HBApplicationUpdate.Tokens.length; k++) {
                                if ($scope.$parent.HBApplicationUpdate.Tokens[k].ID == $scope.selectedToken.ID) {
                                    $scope.$parent.HBApplicationUpdate.Tokens.splice(k, 1);
                                    break;
                                }
                            }

                            $scope.removeTokenFromUnusedList();
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }



    }

    $scope.deActivateToken = function () {
        $scope.selectedToken.Quality = 2;
        $scope.selectedToken.Action = 3;
        //$scope.DeleteIfExistToken($scope.selectedToken);
        $scope.$parent.HBApplicationUpdate.Tokens.push($scope.selectedToken);
        $scope.$parent.isHBApplicationUpdated = true;
    }
    $scope.deActivateTokenConfirmation = function (params) {
        //Token@ dadarecvac er
        if ($scope.selectedToken.Quality == 2) {
            return;
        }
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Ուշադրություն! Տոկենի դադարեցումը  հայտի հաստատման հետ կապված չէ: Տոկենը անմիջապես անվերադարձ կապաակտիվանա:' })
                .then(function () {

                    $controller('PopUpCtrl', { $scope: $scope });
                    $scope.params = params;
                    $scope.openWindow('/HBServletRequestOrder/PersonalHBServletOrder', 'Տոկենի անվերադարձ ապաակտիվացում', 'hbtokendeactivation', $scope.deActivateToken);

                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    }

    $scope.activateTokenConfirmation = function (params) {

        if ($http.pendingRequests.length == 0) {

            $controller('PopUpCtrl', { $scope: $scope });
            $scope.params = params;
            $scope.openWindow('/HBServletRequestOrder/PersonalHBServletOrder', 'Տոկենի ակտիվացում', 'hbtokenactivation', $scope.activateToken);
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }

    }
    $scope.resetPasswordManuallyConfirmation = function (params) {

        if ($http.pendingRequests.length == 0) {

            $controller('PopUpCtrl', { $scope: $scope });
            $scope.params = params;
            $scope.openWindow('/HBServletRequestOrder/PersonalHBServletOrder', 'Գաղտնաբառի զրոյացում', 'hbuserpasswordresetmanually');

        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }

    }

    $scope.activateToken = function(){
        $scope.selectedToken.Quality = 1;
    }

    $scope.restoreToken = function () {
        //Token@ dadarecvac er
        if ($scope.selectedToken.Quality == 1) {
            return;
        }
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'վերականգնե՞լ տոկենը:' })
                .then(function () {
                    $scope.selectedToken.Quality = 1;
                    $scope.selectedToken.Action = 2;
                    $scope.$parent.HBApplicationUpdate.Tokens.push($scope.selectedToken);
                    $scope.$parent.isHBApplicationUpdated = true;
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }

    }
    $scope.unBlockUserConfirmation = function (params) {
        if ($scope.selectedUser.IsLocked == false) {
            return;
        }
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Ուշադրություն! Նախքան օգտագործողի ապաբլոկավորումը անհրաժեշտ է իրականացնել օգտագործողի նույնականացում։' })
                .then(function () {
                    $controller('PopUpCtrl', { $scope: $scope });
                    $scope.params = params;
                    $scope.openWindow('/HBServletRequestOrder/PersonalHBTokenUnBlockOrder', 'Օգտագործողի ապաակտիվացում', 'hbtokenunblock', $scope.unBlockUser);

                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }
    $scope.unBlockTokenConfirmation = function (params) {
        if ($http.pendingRequests.length == 0) {

            $controller('PopUpCtrl', { $scope: $scope });
            $scope.params = params;
            $scope.openWindow('/HBServletRequestOrder/PersonalHBTokenUnBlockOrder', 'Տոկենի ապաբլոկավորում', 'hbtokenunblock', $scope.unBlockToken);

        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }
    $scope.unBlockUser = function () {
        $scope.selectedUser.IsLocked = false;
    }
    $scope.unBlockToken = function () {
        $scope.selectedToken.Quality = 1;
    }
    $scope.tempraryDeActivate = function () {
        if ($scope.selectedToken.IsBlocked == true) {
            return;
        }
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Ժամանակավոր ապակտիվացնե՞լ տոկենը:' })
                .then(function () {
                    $scope.selectedToken.IsBlocked = true;
                    $scope.selectedToken.Action = 2;
                    $scope.$parent.HBApplicationUpdate.Tokens.push($scope.selectedToken);
                    $scope.$parent.isHBApplicationUpdated = true;
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }

    }
    $scope.backTempraryDeActivate = function () {
        if ($scope.selectedToken.IsBlocked == false) {
            return;
        }

        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Ժամանակավոր ապակտիվացումից հետ վերականգնե՞լ տոկենը:' })
                .then(function () {
                    $scope.selectedToken.IsBlocked = false;
                    $scope.selectedToken.Action = 2;
                    $scope.$parent.HBApplicationUpdate.Tokens.push($scope.selectedToken);
                    $scope.$parent.isHBApplicationUpdated = true;
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }

    }


    $scope.insertUserIntoApprovementSchema = function (parentScope, user, approvementSchema) {
        //Այն դեպքում երբ խումբը ընտրված չէ չշարունակել
        if (approvementSchema == undefined)
            return;
        var schema = JSON.parse(sessionStorage.getItem("hbApprovementSchema"));
        if (schema != null) {
            $scope.deleteUserFromSchemaIfExist(user);
            for (var i = 0; i < schema.SchemaDetails.length; i++) {
                if (schema.SchemaDetails[i].Group.HBUsers == undefined) {
                    schema.SchemaDetails[i].Group.HBUsers = [];
                }

                for (var j = 0; j < approvementSchema.length; j++) {
                    if (schema.SchemaDetails[i].Group.Id == approvementSchema[j].Group.Id) {
                        schema.SchemaDetails[i].Group.HBUsers.push(user);
                    }
                }
            }
        }

        //parentScope.order.ApprovementSchema = $scope.schema;
        sessionStorage.setItem("hbApprovementSchema", JSON.stringify(schema));
    }
    $scope.setLastHBUserId = function () {
        if ($scope.editUser != undefined && $scope.editUser.newInserted == false) {
            $scope.lastHBUserId = -1;
        }
        else {
            var Data = infoService.getGlobalLastKeyNumber(73);
            Data.then(function(key) {
                    $scope.lastHBUserId = key.data;
                },
                function() {
                    alert('error keynumber');
                });
        }
    }





    $scope.isUserHasDeactivatedTokens = function (user) {
        var isExist = false;
        for (var i = 0; i < user.tokens.length; i++) {
            if (user.tokens[i].Quality == 2) {
                isExist = true;
                break;
            }
        }
        return isExist;
    }

    $scope.getSchemaDetailsForUser = function (user) {
        if (user == undefined)
            return;
        schemaDetails = [];
        for (var i = 0; i < $scope.schema.SchemaDetails.length; i++) {
            if ($scope.schema.SchemaDetails[i].Group.HBUsers != undefined) {
                for (var j = 0; j < $scope.schema.SchemaDetails[i].Group.HBUsers.length; j++) {
                    if ($scope.schema.SchemaDetails[i].Group.HBUsers[j].ID == user.ID) {
                        schemaDetails.push($scope.schema.SchemaDetails[i]);
                    }
                }
            }

        }
        return schemaDetails;
    }
    $scope.initSchemaDetails = function (user) {
        $scope.order.schemaDetails = $scope.getSchemaDetailsForUser(user);
    }

    $scope.deleteUserFromSchemaIfExist = function (user) {
        var schema = JSON.parse(sessionStorage.getItem("hbApprovementSchema"));
        for (var i = 0; i < schema.SchemaDetails.length; i++) {
            if (schema.SchemaDetails[i].Group.HBUsers != undefined) {
                for (var j = 0; j < schema.SchemaDetails[i].Group.HBUsers.length; j++) {
                    if (schema.SchemaDetails[i].Group.HBUsers[j].ID == user.ID) {
                            schema.SchemaDetails[i].Group.HBUsers.splice(j, 1);
                    }
                }
            }
        }
        sessionStorage.setItem("hbApprovementSchema", JSON.stringify(schema));
    }

    $scope.setEditUserEmail = function (emails) {
        if (emails != undefined) {
            for (var i = 0; i < emails.length; i++) {
                if (emails[i].id == $scope.editUser.Email.id) {
                    $scope.order.HBUser.Email = emails[i];
                }

            }
        }
    }

    $scope.getHBAssigneeCustomers = function () {
        var Data = HBUserService.getHBAssigneeCustomers($scope.hbCustomerNumber);
        Data.then(function(customerData) {
                $scope.assigneeCustomers = customerData.data;
            },
            function() {
                console.log('error getHBAssigneeCustomers');
            });
    }

    $scope.changeAllowDataEntry = function (allowDataEntry) {
        if (allowDataEntry) {
            var rootScope = angular.element(document.getElementById('hbApplicationdetails')).scope();
            if (rootScope != undefined && !rootScope.allowDataEntry) {
                rootScope.allowDataEntry = true;
            }
        }
        else if (!allowDataEntry) {
            var rootScope = angular.element(document.getElementById('hbApplicationdetails')).scope()
            if (rootScope != undefined && rootScope.allowDataEntry) {
                rootScope.allowDataEntry = false;
            }
        }
    }

    angular.element(document).bind("keydown", function (e) {
        var products = $(".productType");
        if ($(".selected")[0] == undefined)
        {
            for (var i = 0; i < products.length; i++) {
                if ($(products[i]).is(":visible")) {
                    $scope.setClickedRowProductType(i);
                    break;

                }
            }

        }
        else {
            var currentProductKey = Number($($(".selected")[0]).attr("id"));
            var nextProductKey;
            if (e.keyCode == 40) {
                for (var i = currentProductKey + 1; i < products.length; i++) {
                    if ($(products[i]).is(":visible")) {
                        nextProductKey = Number($(products[i]).attr("id"));
                        $scope.setClickedRowProductType(nextProductKey);
                        break;

                    }
                }
            }
            else if (e.keyCode == 38) {
                for (var i = currentProductKey - 1; i >= 0; i--) {
                    if ($(products[i]).is(":visible")) {
                        nextProductKey = Number($(products[i]).attr("id"));
                        $scope.setClickedRowProductType(nextProductKey);
                        break;

                    }
                }
            }
        }
       
        $scope.$apply();
    });

    $scope.removeTokenFromUnusedList = function () {
        var refreshScope = angular.element(document.getElementById('hbUserDetails')).scope();
        if (refreshScope != undefined) {
            for (var i = 0; i < refreshScope.usedHBTokenNumbers.length; i++)
            {
                if (refreshScope.usedHBTokenNumbers[i]== $scope.selectedToken.TokenNumber)
                {
                    refreshScope.usedHBTokenNumbers.splice(i, 1);
                    break;
                }
            }

        }
    }


    $scope.getHBUserLog = function () {
        var Data = HBUserService.getHBUserLog($scope.order.HBUser.UserName);
        Data.then(function(cdata) {
                $scope.hbUserLog = cdata.data;
            },
            function() {
                console.log('error getHBUserLog');
            });
    }
}]);