
app.controller('LoginCtrl', ['$scope', '$rootScope', 'loginService', '$location', '$uibModal', '$http', 'infoService',
    function ($scope, $rootScope, loginService, $location, $uibModal, $http, infoService) {
        $scope.sendStatus = 0;
        $scope.verified = 0;
        $scope.smsCode = "";

        $scope.getCustomerAuthorizationData = function () {

            $scope.loading = true;
            var Data = loginService.getCustomerAuthorizationData();
            Data.then(function (ref) {
                if (ref.data == "null") {
                    $scope.loading = false;
                    $.ajax({ type: "POST", data: {}, dataType: "json", url: "/Login/RedirectBackToCustomersList" })
                        .then(function (data) {
                            window.location = data.redirectUrl + "?authorizedUserSessionToken=" + data.authorizedUserSessionToken;
                        }, function (error) {
                            console.log(error);
                        });


                }
                else {
                    if (ref.data == "authorised") {
                        var url = location.origin.toString();
                        window.location.href = url + '#!/allProducts';
                    }
                    else {
                        $scope.questions = ref.data;
                    }
                    if ($scope.questions.length == 0) {
                        $scope.buttonName = 'OK';
                    }
                    else {
                        $scope.buttonName = 'Հրաժարվել';
                    }
                    $scope.loading = false;
                }

            }, function () {
                $scope.loading = false;

                //alert('Error getCustomerAuthorizationData');
                $scope.$uibModalInstance = $uibModal.open({
                    scope: $scope,
                    template:
                        '<div> <div class="col-sm-12 popup_wrapper_top" style="height:40px;background-color:#d2322d;">' +
                        '<div style="margin-top:-5px"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Վավերացման ձախողում</div> </div><br />' +
                        '<br /> <br /><div class="my_text1" style="text-align:center;font-size:17px">Տեղի ունեցավ սխալ</div>  <br /> <br /><div class="col-sm-5"></div> <button class=" btn btn-sm btn-success" ng-click="closeErrorModal()"><span class="glyphicon glyphicon-ok"></span>&nbsp;OK</button></div>',
                    keyboard: false,
                    controller: 'LoginCtrl',
                    backdrop: 'static',
                    windowClass: 'app-modal-window3',
                    size: ''
                });
            });
        }
        $scope.openloginmodal = function () {
            $scope.$uibModalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/Login/LoginQuestion',
                keyboard: false,
                controller: 'LoginCtrl',
                backdrop: 'static',
                //windowClass: 'app-modal-window2',
                size: ''
            });
        };

        $scope.openSessionExpiredDialog = function () {
            $scope.$uibModalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/Login/SessionExpiredDialog',
                keyboard: false,
                controller: 'LoginCtrl',
                backdrop: 'static',
                size: ''
            });
        };



        $scope.openSMSDialog = function () {

            $scope.$uibModalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/Login/OpenSmsAuthorization',
                keyboard: false,
                controller: 'LoginCtrl',
                backdrop: 'static',
                size: ''
            });
        };

        $scope.openPermissionDeniedDialog = function () {
            $scope.$uibModalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/Login/PermissionDeniedDialog',
                keyboard: false,
                controller: 'LoginCtrl',
                backdrop: 'static',
                size: ''
            });
        };

        $scope.closePermissionDeniedDialog = function () {

            var loadElements = ["load", "accountCloseLoad", "armload", "periodicLoad",
                "utilityLoad", "budgetLoad", "paymentLoad", "interLoad", "accountFreezeeLoad", "accountUnfreezeeLoad", "accountLoad", "acountReLoad", "cardClosingLoad",
                "cardUnpaidPercentPaymentOrderLoad", "cashLoad", "cashPosLoad", "chequeLoad", "chequeReceiveLoad",
                "credentialLoad", "currencyLoad", "depositLoad", "serviceProvidedOrderLoad", "HBActivationOrderLoad",
                "loanProductActivLoad", "loanProductLoad", "matureLoad", "referenceLoad", "removalOrderLoad", "statementLoad", "transitLoad", "swiftLoad", "pensionAppliactionLoad", "pensionAppliactionTerminationLoad",
                "cardDataChangeOrderLoad", "cardServiceFeeGrafikDataChangeOrderLoad", "depositDataChangeOrderLoad", "DepositCaseStoppingPenaltyCalculationOrderLoad", "credentialActivationOrderLoad",
                "bondOrderSaveLoad", "bondAmountChargeOrderLoad", "bondQualityUpdateOrderLoad", "arcaCardsTransactionOrderLoad", "cardLimitChangeOrderLoad", "plasticCardLoad"];

            for (var i = 0; i < loadElements.length; i++) {
                if (document.getElementById(loadElements[i]) != null) {
                    document.getElementById(loadElements[i]).classList.add("hidden");
                }
            }
            $scope.$parent.$close();

            //$('#' + dialogId).remove();
        };

        $scope.closeModal = function () {
            $scope.$uibModalInstance.close();
        };
        $scope.closeSMSModal = function () {
            if (document.getElementById("load") != null) {
                document.getElementById("load").classList.add("hidden");
            }
            else {
                document.getElementById("Loader").classList.add("hidden");
            }
            $scope.$$childHead.$parent.$close();
        };

        $scope.closeErrorModal = function () {
            $scope.$uibModalInstance.close();
            $.ajax({ type: "POST", data: {}, dataType: "json", url: "/Login/RedirectBackToCustomersList" })
                .then(function (data) {
                    window.location = data.redirectUrl + "?authorizedUserSessionToken=" + data.authorizedUserSessionToken + "&customerNumber=" + data.customerNumber;
                }, function (error) {
                    console.log(error);
                });
        };

        $scope.closeSessionExpire = function () {
            $.ajax({ type: "POST", data: {}, dataType: "json", url: "/Login/ExitToCustomersLoginPage" })
                .then(function (data) {
                    window.location = data.redirectUrl;
                }, function (error) {
                    console.log(error);
                });

        };


        $scope.logIn = function (path) {

            var sessionData = loginService.setSessionGuid();
            sessionData.then(function (ch) {

                sessionStorage.setItem('sessionId', ch.data);

                /// $scope.$root.sessionGuid = ch.data;

                var Data = loginService.logIn();
                Data.then(function (ch) {
                    $scope.session = ch.data;

                    if ($scope.session == true) {

                        var url = location.origin.toString();
                        if (path)
                            window.location.href = url + path;
                        else
                            window.location.href = url + '#!/allProducts';
                    }
                    else if ($scope.session == false) {
                        $.ajax({ type: "POST", data: {}, dataType: "json", url: "/Login/RedirectBackToCustomersList" })
                            .then(function (data) {
                                window.location = data.redirectUrl + "?authorizedUserSessionToken=" + data.authorizedUserSessionToken + "&customerNumber=" + data.customerNumber;
                            }, function (error) {
                                console.log(error);
                            });

                    }
                    else {
                        $scope.$uibModalInstance = $uibModal.open({
                            scope: $scope,
                            template:
                                '<style> .glyphicon {  top: -6px; }</style> <div> <div class="col-sm-12 popup_wrapper_top" style="height:40px;background-color:#d2322d;">' +
                                '<div style="margin-top:-5px"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Վավերացման ձախողում</div> </div><br />' +
                                '<br /> <br /><br /><div class="my_text1" style="text-align:center;font-size:17px">Տվյալները հասանելի չեն</div>  <br /> <br />  <br />  <br /> <button style="width:90px;margin-top:-35px;margin-left:100px" class="col-sm-5 my_save_button" ng-click="closeErrorModal()">OK</button> </div>',
                            keyboard: false,
                            controller: 'LoginCtrl',
                            backdrop: 'static',
                            windowClass: 'app-modal-window3',
                            size: ''
                        });
                    }
                }, function () {
                    $scope.loading = false;
                    $scope.$uibModalInstance = $uibModal.open({
                        scope: $scope,
                        template:
                            '<style> .glyphicon {  top: -6px; }</style> <div> <div class="col-sm-12 popup_wrapper_top" style="height:40px;background-color:#d2322d;">' +
                            '<div style="margin-top:-5px"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Վավերացման ձախողում</div> </div><br />' +
                            '<br /> <br /><br /><div class="my_text1" style="text-align:center;font-size:17px">Տեղի ունեցավ սխալ</div>  <br /> <br />  <br />  <br /> <button style="width:90px;margin-top:-35px;margin-left:100px" class="col-sm-5 my_save_button" ng-click="closeErrorModal()">OK</button> </div>',
                        keyboard: false,
                        controller: 'LoginCtrl',
                        backdrop: 'static',
                        windowClass: 'app-modal-window3',
                        size: ''
                    });
                });

            });

        }




        $scope.logInUser = function (path) {

            var sessionData = loginService.setSessionGuid();
            sessionData.then(function (ch) {
                sessionStorage.setItem('sessionId', ch.data);
                var url = location.origin.toString();
                window.location.href = url + path;

            });

        }




        $scope.sendAutorizationSMS = function () {
            $scope.loading = true;
            var Data = loginService.sendAutorizationSMS();
            Data.then(function (res) {
                $scope.loading = false;
                if (validate($scope, res.data)) {
                    $scope.sendStatus = 1;
                }
            }, function () {
                $scope.loading = false;
                alert('Error LogIn');
            });
        };

        $scope.verifyAutorizationSMS = function (smsCode) {
            $scope.loading = true;
            var Data = loginService.verifyAutorizationSMS(smsCode);
            Data.then(function (res) {
                if (document.getElementById("load") != null) {
                    document.getElementById("load").classList.add("hidden");
                }
                else {
                    document.getElementById("Loader").classList.add("hidden");
                }
                if (validate($scope, res.data)) {
                    $scope.verified = 1;
                    $scope.$$childHead.$parent.$close();
                }
            }, function () {
                if (document.getElementById("load") != null) {
                    document.getElementById("load").classList.add("hidden");
                }
                else {
                    document.getElementById("Loader").classList.add("hidden");
                }
                alert('Error LogIn');
            });
        };

        $scope.openServeTypeDialog = function () {
            $scope.$uibModalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/Login/OpenServeTypeDialog',
                keyboard: false,
                controller: 'CustomerCtrl',
                backdrop: 'static',
                size: ''
            });
        };

        $scope.serveCustomer = function (customerNumber) {
            var Data = loginService.testServingCustomer(customerNumber);
            Data.then(function (result) {

                $scope.session = result.data;
                if ($scope.session == true) {
                    var url = location.origin.toString();
                    window.location.href = url + '#!/allProducts';
                }
            }, function () {

            });


        }

        $scope.serveNonCustomer = function () {
            var Data = loginService.testServingNonCustomer();
            Data.then(function (result) {
                $scope.session = result.data;
                if ($scope.session == false) {
                    var url = location.origin.toString();
                    window.location.href = url + '/NonCustomerService/NonCustomerService/';
                }
            }, function () {

            });
        }
        ////////////////////////////////////////

        $scope.exitToCustomer = function () {

            var Data = infoService.isTestingMode();
            Data.then(function (res) {
                if ($rootScope.SessionProperties.AdvancedOptions.CanCompleteTheServiceAlways == "0") {
                    if ($scope.$root.SessionProperties != undefined && $scope.$root.SessionProperties.SourceType == 2 && $scope.$root.notificationCount > 0 && res.data == false) {
                        ShowMessage('Առկա են չկատարված հայտեր: Խնդրում ենք ապահովել հայտերի կատարումը:', 'error');
                        return;
                    }
                }
                $http({
                    method: "post",
                    url: "/Login/RedirectBackToCustomersList",
                    data: {},
                    dataType: "json"
                }).then(function (acc) {
                    if (acc.data.redirectUrl == "/Login/Testversion") {
                        window.location = acc.data.redirectUrl;
                    } else {
                        sessionStorage.clear();
                        window.location = acc.data.redirectUrl +
                            "?authorizedUserSessionToken=" +
                            acc.data.authorizedUserSessionToken +
                            "&customerNumber=" +
                            acc.data.customerNumber;
                    }
                });

            }, function () {

                alert('Error exitToCustomer');
            });
        }

        $scope.exitToCustomerData = function () {

            var Data = infoService.isTestingMode();
            Data.then(function (res) {

                if ($scope.$root.SessionProperties != undefined && $scope.$root.SessionProperties.SourceType == 2 && $scope.$root.notificationCount > 0 && res.data == false) {
                    ShowMessage('Առկա են չկատարված հայտեր: Խնդրում ենք ապահովել հայտերի կատարումը:', 'error');
                    return;
                }
                $http({
                    method: "post",
                    url: "/Login/RedirectToCustomerData",
                    data: {},
                    dataType: "json"
                }).then(function (acc) {
                    if (acc.data.redirectUrl == "/Login/Testversion") {
                        window.location = acc.data.redirectUrl;
                    } else {
                        sessionStorage.clear();
                        window.location = acc.data.redirectUrl;
                    }
                });

            }, function () {

                alert('Error exitToCustomerData');
            });
        }

        $scope.cancelPhoneBankingLogin = function () {
            var sessionData = loginService.setSessionGuid();
            sessionData.then(function (ch) {

                sessionStorage.setItem('sessionId', ch.data);
                $http({
                    method: "post",
                    url: "/Login/RedirectBackToCustomersList",
                    data: {},
                    dataType: "json"
                }).then(function (acc) {
                    sessionStorage.clear();
                    window.location = acc.data.redirectUrl +
                        "?authorizedUserSessionToken=" +
                        acc.data.authorizedUserSessionToken +
                        "&customerNumber=" +
                        acc.data.customerNumber;
                });


            }, function () {
            });

        }



        $scope.redirectToLoanManagementSystem = function () {
            $.ajax({
                type: "POST", data: {}, dataType: "json", url: "/LoanApplication/RedirectLoanManagementSystem",
                success: function (data) {
                    window.location = data.redirectUrl + "?customerNumber=" + data.customerNumber + "&authorizedUserSessionToken=" + data.authorizedUserSessionToken + "&authorisedCustomerSessionId=" + data.authorisedCustomerSessionId;
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 500) {
                        ShowMessage("Նշված գործողությունը հասանելի չէ:", "error");
                    }
                    else if (xhr.status == 411) {
                        ShowMessage("Աշխատանքային սեսիան ավարտված է: Անհրաժեշտ է վերագրանցվել(մուտք գործել) ծրագիր:", "error");
                    }
                    else {
                        ShowMessage("Տեղի ունեցավ սխալ։", "error");
                    }
                }
            });
        }

        $scope.redirectToLoanManagementSystemCollateral = function () {
            $.ajax({
                type: "POST", data: {}, dataType: "json", url: "/Provision/RedirectLoanManagementSystemCollateral",
                success: function (data) {
                    window.location = data.redirectUrl + "?customerNumber=" + data.customerNumber + "&authorizedUserSessionToken=" + data.authorizedUserSessionToken + "&authorisedCustomerSessionId=" + data.authorisedCustomerSessionId;
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 500) {
                        ShowMessage("Նշված գործողությունը հասանելի չէ:", "error");
                    }
                    else if (xhr.status == 411) {
                        ShowMessage("Աշխատանքային սեսիան ավարտված է: Անհրաժեշտ է վերագրանցվել(մուտք գործել) ծրագիր:", "error");
                    }
                    else {
                        ShowMessage("Տեղի ունեցավ սխալ։", "error");
                    }
                }
            });
        };



        //  Դրամարկղի մատյանի համար սսիլկա

        $scope.backToCustomersPage = function () {
            var Data = infoService.isTestingMode();
            Data.then(function (res) {

                if ($scope.$root.SessionProperties != undefined && $scope.$root.SessionProperties.SourceType == 2 && $scope.$root.notificationCount > 0 && res.data == false) {
                    ShowMessage('Առկա են չկատարված հայտեր: Խնդրում ենք ապահովել հայտերի կատարումը:', 'error');
                    return;
                }
                $http({
                    method: "post",
                    url: "/Login/Redirect",
                    data: {},
                    dataType: "json"
                }).then(function (acc) {
                    if (acc.data.redirectUrl == "/Login/Testversion") {
                        window.location = acc.data.redirectUrl;
                    } else {
                        //sessionStorage.clear();
                        window.location = acc.data.redirectUrl +
                            "?authorizedUserSessionToken=" +
                            acc.data.authorizedUserSessionToken
                    }
                });

            }, function () {
                alert('Error exitToCustomer');
            });
        }




        $scope.redirectToLoanManagementSystemAcra = function () {
            $scope.acraMonitoringMember = $scope.$root.SessionProperties.AdvancedOptions["acraMonitoringMember"];
            if ($scope.acraMonitoringMember == "1"){
                $.ajax({
                    type: "POST", data: {}, dataType: "json", url: "/LoanApplication/RedirectLoanManagementSystemAcraMonitoring",
                    success: function (data) {
                        window.location = data.redirectUrl + "?customerNumber=" + data.customerNumber + "&authorizedUserSessionToken=" + data.authorizedUserSessionToken + "&authorisedCustomerSessionId=" + data.authorisedCustomerSessionId;
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status == 500) {
                            ShowMessage("Նշված գործողությունը հասանելի չէ:", "error");
                        }
                        else if (xhr.status == 411) {
                            ShowMessage("Աշխատանքային սեսիան ավարտված է: Անհրաժեշտ է վերագրանցվել(մուտք գործել) ծրագիր:", "error");
                        }
                        else {
                            ShowMessage("Տեղի ունեցավ սխալ։", "error");
                        }
                    }
                });
            }
            else
                ShowMessage('Հասանելի չէ։', 'information');
        }

        $scope.leasingLogIn = function (path) {

            var sessionData = loginService.setSessionGuid();
            sessionData.then(function (ch) {

                sessionStorage.setItem('sessionId', ch.data);

                /// $scope.$root.sessionGuid = ch.data;

                var Data = loginService.logIn();
                Data.then(function (ch) {
                    $scope.session = ch.data;

                    if ($scope.session == true) {

                        var url = location.origin.toString();
                        if (path)
                            window.location.href = url + path;
                        else
                            window.location.href = url + '#!/leasingAllProducts';
                    }
                    else if ($scope.session == false) {
                        $.ajax({ type: "POST", data: {}, dataType: "json", url: "/Login/RedirectBackToLeasingCustomersList" })
                            .then(function (data) {
                                window.location = data.redirectUrl + "?authorizedUserSessionToken=" + data.authorizedUserSessionToken + "&customerNumber=" + data.customerNumber;
                            }, function (error) {
                                console.log(error);
                            });

                    }
                    else {
                        $scope.$uibModalInstance = $uibModal.open({
                            scope: $scope,
                            template:
                                '<style> .glyphicon {  top: -6px; }</style> <div> <div class="col-sm-12 popup_wrapper_top" style="height:40px;background-color:#d2322d;">' +
                                '<div style="margin-top:-5px"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Վավերացման ձախողում</div> </div><br />' +
                                '<br /> <br /><br /><div class="my_text1" style="text-align:center;font-size:17px">Տվյալները հասանելի չեն</div>  <br /> <br />  <br />  <br /> <button style="width:90px;margin-top:-35px;margin-left:100px" class="col-sm-5 my_save_button" ng-click="closeErrorModal()">OK</button> </div>',
                            keyboard: false,
                            controller: 'LoginCtrl',
                            backdrop: 'static',
                            windowClass: 'app-modal-window3',
                            size: ''
                        });
                    }
                }, function () {
                    $scope.loading = false;
                    $scope.$uibModalInstance = $uibModal.open({
                        scope: $scope,
                        template:
                            '<style> .glyphicon {  top: -6px; }</style> <div> <div class="col-sm-12 popup_wrapper_top" style="height:40px;background-color:#d2322d;">' +
                            '<div style="margin-top:-5px"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Վավերացման ձախողում</div> </div><br />' +
                            '<br /> <br /><br /><div class="my_text1" style="text-align:center;font-size:17px">Տեղի ունեցավ սխալ</div>  <br /> <br />  <br />  <br /> <button style="width:90px;margin-top:-35px;margin-left:100px" class="col-sm-5 my_save_button" ng-click="closeErrorModal()">OK</button> </div>',
                        keyboard: false,
                        controller: 'LoginCtrl',
                        backdrop: 'static',
                        windowClass: 'app-modal-window3',
                        size: ''
                    });
                });

            });

        }

        $scope.exitToLeasingCustomer = function () {

            var Data = infoService.isTestingMode();
            Data.then(function (res) {
                if ($rootScope.SessionProperties.AdvancedOptions.CanCompleteTheServiceAlways == "0") {
                    if ($scope.$root.SessionProperties != undefined && $scope.$root.SessionProperties.SourceType == 2 && $scope.$root.notificationCount > 0 && res.data == false) {
                        ShowMessage('Առկա են չկատարված հայտեր: Խնդրում ենք ապահովել հայտերի կատարումը:', 'error');
                        return;
                    }
                }
                $http({
                    method: "post",
                    url: "/Login/RedirectBackToLeasingCustomersList",
                    data: {},
                    dataType: "json"
                }).then(function (acc) {
                    if (acc.data.redirectUrl == "/Login/Testversion") {
                        window.location = acc.data.redirectUrl;
                    } else {
                        sessionStorage.clear();
                        window.location = acc.data.redirectUrl +
                            "?authorizedUserSessionToken=" +
                            acc.data.authorizedUserSessionToken +
                            "&customerNumber=" +
                            acc.data.customerNumber;
                    }
                });

            }, function () {

                alert('Error exitToLeasingCustomer');
            });
        }
               

        $scope.redirectToLoanManagementSystemLeasingCollateral = function () {
            $.ajax({
                type: "POST", data: {}, dataType: "json", url: "/Provision/RedirectLoanManagementSystemLeasingCollateral",
                success: function (data) {
                    window.location = data.redirectUrl + "?customerNumber=" + data.customerNumber + "&authorizedUserSessionToken=" + data.authorizedUserSessionToken + "&authorisedCustomerSessionId=" + data.authorisedCustomerSessionId;
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 500) {
                        ShowMessage("Նշված գործողությունը հասանելի չէ:", "error");
                    }
                    else if (xhr.status == 411) {
                        ShowMessage("Աշխատանքային սեսիան ավարտված է: Անհրաժեշտ է վերագրանցվել(մուտք գործել) ծրագիր:", "error");
                    }
                    else {
                        ShowMessage("Տեղի ունեցավ սխալ։", "error");
                    }
                }
            });
        };

    }]);

