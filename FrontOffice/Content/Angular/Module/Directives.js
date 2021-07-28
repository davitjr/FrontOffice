app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});



//Փոփափ պատուհան
app.directive('modalDialog', function () {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function (scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function () {
                //scope.show = !scope.show;
            };
        },
        template: "<div class='ng-modal'><div class='ng-modal-overlay' ng-click='$parent.toggleModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='$parent.toggleModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
    };
});
app.directive('chosen', ['$timeout', function ($timeout) {

    var linker = function (scope, element, attr) {

        $timeout(function () {
            element.chosen();
        }, 0, false);
    };

    return {
        restrict: 'A',
        link: linker
    };
}]);

//Հաշվի քաղվածք
app.directive('accountstatement', function () {
    return {
        restrict: 'EA',
        scope: {
            accountnumber: '=',
            productappid: '=?',
            istransitaccount: '=?',
            withoutstatement: '=?'
        },
        templateUrl: '/Account/AccountStatement'
    };
});
//Կոմունալի որոնման արդյունքներ
app.directive('utilitypaymentsearchresults', function () {
    return {
        restrict: 'EA',
        templateUrl: '/UtilityPayment/UtilityPaymentSearch'
    };
});

app.directive('blacklist', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            var blacklist = attr.blacklist.split(',');
            ngModel.$parsers.unshift(function (value) {
                ngModel.$setValidity('blacklist', blacklist.indexOf(value) === -1);
                return value;
            });
        }
    };
});
app.directive('errors', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Error/Errors'
    };
});

app.directive('cardstatement', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Card/CardStatement'
    };
});

app.directive('transfershistory', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PeriodicTransfer/PeriodicTransfersHistory'
    };
});

app.directive('loading',
    function () {
        return {
            restrict: 'E',
            replace: true,
            template:
                '<div class="loading"><img src="../Content/Images/ajax-loader.gif" width="20" height="20" />Խնդրում ենք սպասել...</div>',
            link: function (scope, element, attr) {
                scope.$watch('loading',
                    function (val) {
                        if (val)
                            $(element).show();
                        else
                            $(element).hide();
                    });
            }
        }
    });
app.directive('loadingControl',
    function () {
        return {
            restrict: 'E',
            replace: true,
            template:
                '<span class="loading"><img src="../Content/Images/ajax-loader.gif" width="20" height="20" /></span>',
            link: function (scope, element, attr) {
                scope.$watch(attr.scopevariable,
                    function (val) {
                        if (!val)
                            $(element).show();
                        else
                            $(element).hide();
                    });
            }
        }
    });

app.directive('hasacbaonline', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Customer/HasACBAOnlineDirective'
    };
});
app.directive('customerdebts', function () {
    return {
        restrict: 'E',
        scope: {
            formname: '=',//ֆորմայի անունը որում գտնվում է դիրեկտիվան 
            showonlystrictdebts: '=?',//ցուցադրվի միայն այն պարտավորությունները, որոնք արգելում են գործարքը
        },
        link: function (scope, element, attrs) {

            if (scope.showonlystrictdebts == undefined) {
                scope.showonlystrictdebts = false;
            }
        },
        templateUrl: '/Customer/CustomerDebtsDirective'
    };
});
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


app.directive("sessionproperties", function () {

    return {
        restrict: 'E',
        controller: ['$rootScope', function ($rootScope) {

            $rootScope.SessionProperties = {};
            $rootScope.openedView = [];

            if (Intl.DateTimeFormat().resolvedOptions().timeZone != "Asia/Yerevan") {
                $rootScope.SessionProperties.IsTimeZoneValid = 0;
                showMesageBoxDialog('Ժամային գոտին սխալ է', '', 'error', '', $rootScope);
            }
            else
                $rootScope.SessionProperties.IsTimeZoneValid = 1;

            //Վերդդարձնում է տվյալների աղբյուրի տեսակը(Phonbanking,Bank,......)
            $.ajax({
                url: "/Customer/GetSessionProperties",
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    $rootScope.SessionProperties['OperationDate'] = new Date(parseInt(res.OperDay.substr(6)));
                    $rootScope.SessionProperties['SourceType'] = res.SourceType;
                    $rootScope.SessionProperties['IsNonCustomerService'] = res.IsNonCustomerService;
                    $rootScope.SessionProperties['UserId'] = res.UserId;
                    $rootScope.SessionProperties['IsChiefAcc'] = res.IsChiefAcc;
                    $rootScope.SessionProperties['IsManager'] = res.IsManager;
                    $rootScope.SessionProperties['AdvancedOptions'] = res.AdvancedOptions;
                    $rootScope.SessionProperties['LoanProductId'] = res.LoanProductId;
                    $rootScope.SessionProperties['IsCalledFromHB'] = res.IsCalledFromHB;
                    $rootScope.SessionProperties['IsCalledForHBConfirm'] = res.IsCalledForHBConfirm;
                    $rootScope.SessionProperties['IsTestVersion'] = res.IsTestVersion;
                    //Վերդարձնում է հաճախորդի տեսակը
                    if (!res.IsNonCustomerService) {
                        $.ajax({
                            url: "/Customer/GetCustomerType",
                            type: 'GET',
                            dataType: 'json',
                            success: function (response) {
                                $rootScope.SessionProperties['CustomerType'] = response;
                            }
                        });
                    }
                    //
                    if (res.NonCheckFilialATSAccount != true) {
                        $.ajax({
                            url: "/Home/HasATSSystemAccountInFilial",
                            type: 'GET',
                            dataType: 'json',
                            success: function (response) {
                                $rootScope.SessionProperties['HasFilialATSAccount'] = response;
                            }
                        });
                    }
                    else {
                        $rootScope.SessionProperties['HasFilialATSAccount'] = false;
                    }


                }
            });

        }
        ]

    }
});

app.directive('authorizeddirective', function () {
    return {
        restrict: 'EA',
        template: '<div class="container" ng-controller="LoginCtrl" ng-init="openloginmodal()"></div>'
    }
});
app.directive('allproductsdirective', function () {

    return {
        restrict: 'EA',
        template: '<div class="container" ng-controller="LoginCtrl" ng-init="logIn()"></div>'
    }
});
app.directive('noncustomerservicedirective', function () {
    return {
        restrict: 'EA',
        template: '<div class="container" ng-controller="LoginCtrl" ng-init="logIn(\'/NonCustomerService/NonCustomerService\')"></div>'
    }
});

app.directive('inputtransitaccountsfordebittransactions', function () {
    return {
        restrict: 'EA',
        template: '<div class="container" ng-controller="LoginCtrl" ng-init="logInUser(\'/TransitAccountsForDebitTransactions/Index\')"></div>'
    }
});

app.directive('redirectdirection', function () {
    return {
        restrict: 'EA',
        scope: {
            redirecturl: '=',
        },
        controller: ['$scope', '$element', '$controller', function ($scope, $element, $controller) {
            $controller('LoginCtrl', { $scope: $scope });
            $scope.logInUser($scope.redirecturl);
        }]

    }
});


app.directive('cashbooksharepoint', function () {
    return {
        restrict: 'EA',
        template: '<div class="container" ng-controller="LoginCtrl" ng-init="logInUser(\'/CashBook/Index\')"></div>'
    }
});

app.directive('financialplanningsharepoint', function () {
    return {
        restrict: 'EA',
        template: '<div class="container" ng-controller="LoginCtrl" ng-init="logInUser(\'/FinancialPlanning/Index\')"></div>'
    }
});



app.directive('sessionexpireddirective', function () {
    return {
        restrict: 'EA',
        template: '<div class="container" ng-controller="LoginCtrl" ng-init="openSessionExpiredDialog()"></div>'
    }
});

app.directive('smsauthorization', function () {
    return {
        restrict: 'EA',
        template: '<div class="container" ng-controller="LoginCtrl" ng-init="openSMSDialog()"></div>'
    }
});



app.directive('exchangerates', function () {
    return {
        restrict: 'EA',
        templateUrl: '../ExchangeRate/ExchangeRates'
    };
});
app.directive('permissiondenied', function () {
    return {
        restrict: 'EA',
        template: '<div class="container" ng-controller="LoginCtrl" ng-init="openPermissionDeniedDialog()"></div>'
    }
});

app.directive('attachmentdocument', function () {
    return {
        restrict: 'EA',

        scope: {
            productid: '='
        },
        templateUrl: '/AttachmentDocument/AttachmentDocuments'
    };
});
app.directive('clearallcache', function () {
    return {
        restrict: 'EA',
        template: '<button type="button" class="btn-xs btn-primary" ng-controller="CustomerCtrl" ng-click="clearAllCache()"><span class="glyphicon glyphicon-info-sign"></span>Թարմացնել տեղեկատուները</button>'
    }
});


app.directive('openDialog', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr, ctrl) {
            var dialogId = '#' + attr.openDialog;
            elem.bind('click', function (e) {
                $(dialogId).dialog('open');
            });
        }
    };
});

app.directive('customerinfo', ['$http', '$compile', function ($http, $compile) {

    return {
        restrict: 'E',
        scope: {
            customernumber: '=',
            showfulldata: '=?',
            viewmod: '=?'//Եթե բացակայում է սովորական,եթե 1 tabl-օվ
        },
        link: function (scope, element, attrs) {

            if (scope.showfulldata === undefined) {
                scope.showfulldata = true;
            }

            scope.$watch('customernumber', function () {

                var templateURL = '/Customer/CustomerInfoDirective';

                if (scope.viewmod != undefined) {
                    templateURL = '/Customer/CutomerVIewList';
                }

                $http.get(templateURL).then(function (result) {
                    element.html(result.data);
                    $compile(element.contents())(scope);
                });

            });
        }
    };
}]);

app.directive('customerinfoold', ['$http', '$compile', function ($http, $compile) {

    return {
        restrict: 'E',
        scope: {
            customernumber: '=',
            showfulldata: '=?',
            viewmod: '=?'//Եթե բացակայում է սովորական,եթե 1 tabl-օվ
        },
        link: function (scope, element, attrs) {

            if (scope.showfulldata === undefined) {
                scope.showfulldata = true;
            }

            scope.$watch('customernumber', function () {

                var templateURL = '/Customer/CustomerInfoDirectiveOld';

                if (scope.viewmod != undefined) {
                    templateURL = '/Customer/CutomerVIewList';
                }

                $http.get(templateURL).then(function (result) {
                    element.html(result.data);
                    $compile(element.contents())(scope);
                });

            });
        }
    };
}]);

app.directive('membershiprewards', function () {
    return {
        restrict: 'EA',

        scope: {
            cardnumber: '=',
            productid: '=',
            closingdate: '=',
            cardtype: '=?',
            accountnumber: '=?',
            currency: '=?'
        },
        templateUrl: '/CardMembershipRewards/CardMembershipRewards'
    };
});

app.directive('cardpositiverate', function () {
    return {
        restrict: 'EA',

        scope: {
            card: '='
        },
        templateUrl: '/Card/CardPositiveRate'
    };
});

app.directive('cardservicefee', function () {
    return {
        restrict: 'EA',

        scope: {
            cardnumber: '=',
            productid: '=',
            cardclosingdate: '=?',
            cardtype: '=?',
            relatedofficenumber: '=?'
        },
        templateUrl: '/Card/CardServiceFee'
    };
});

app.directive('visaalias', function () {
    return {
        restrict: 'EA',


        templateUrl: '/Card/VisaAlias',

    };
});


app.directive('closedcreditlines', function () {
    return {
        restrict: 'EA',

        scope: {
            cardnumber: '='
        },
        templateUrl: '/CreditLine/ClosedCreditLines'
    };
});

app.directive("updateModelOnEnterKeyPressed", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModelCtrl) {
            elem.bind("keyup", function (e) {
                if (e.keyCode === 13) {
                    scope.$apply(function () {
                        ngModelCtrl.$commitViewValue();
                    });
                }
            });
        }
    }
});

app.directive('testdir', function () {
    return {
        restrict: 'EA',
        scope: {
            callback: '&'
        },
        template: '<input type="text" ><br /><input type="button" ng-click="selectCustomer()"  />',
        link: function (scope, element, attr) {
            scope.selectCustomer = function () {
                scope.callback();
            }
        }
    }
});
app.directive('searchcommunal', function () {
    return {
        scope: {
            callback: '&',
            close: '&',
            periodic: '@periodic'
        },
        templateUrl: '/UtilityPayment/UtilityPaymentSearch',

        link: function (scope, element, attr) {

            $(".modal-dialog").draggable();

            scope.selectDetails = function () {
                scope.callback({ branch: scope.branch, description: scope.description, selectedId: scope.selectedId, utilityTypeDescription: scope.utilityTypeDescription, abonentType: scope.abonentType, utilityType: scope.utilityType, abonentDescription: scope.abonentDescription, PrepaidSign: scope.PrepaidSign });
            };

            scope.closesearchCommunalModal = function () {
                scope.close();
            };


        },
        controller: ['$scope', '$element', function ($scope, $element) {
            $scope.setDetails = function (branch, description, selectedId, abonentType, utilityType, abonentDescription, PrepaidSign) {
                $scope.branch = branch;
                $scope.description = description;
                $scope.selectedId = selectedId;
                $scope.abonentType = abonentType;
                $scope.utilityType = utilityType;
                $scope.abonentDescription = abonentDescription;
                $scope.PrepaidSign = PrepaidSign;
            };

        }]

    };
});
app.directive('budgetorder', function () {


    return {
        restrict: 'E',
        templateUrl: '/PaymentOrder/BudgetPaymentOrder',
        controller: 'BudgetPaymentOrderCtrl'
    };
});

app.directive('internationalorder', function () {


    return {
        restrict: 'E',
        templateUrl: '/InternationalPaymentOrder/InternationalPaymentOrder',
        controller: 'InternationalPaymentOrderCtrl'
    };
});

app.directive('fasttransferorder', function () {


    return {
        restrict: 'E',
        templateUrl: '/FastTransferPaymentOrder/FastTransferPaymentOrder',
        controller: 'FastTransferPaymentOrderCtrl'
    };
});

app.directive('receivedfasttransferorder', function () {


    return {
        restrict: 'E',
        templateUrl: '/ReceivedFastTransferPaymentOrder/ReceivedFastTransferPaymentOrder',
        controller: 'ReceivedFastTransferPaymentOrderCtrl'
    };
});


app.directive('paymentorder', function () {

    return {

        restrict: 'EA',
        templateUrl: '/PaymentOrder/PersonalPaymentOrder',
        controller: 'PaymentOrderCtrl'

    };
});


app.directive('transferarmpaymentorder', function () {


    return {

        restrict: 'E',
        templateUrl: '/PaymentOrder/TransferArmPaymentOrder',
        controller: 'PaymentOrderCtrl'
    };
});

app.directive('periodicutilitypayment', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PeriodicOrder/CommunalSearch',
        controller: 'PeriodicOrderCtrl'
    };
});



app.directive('periodicorder', function () {
    return {
        restrict: 'E',
        templateUrl: '/PeriodicOrder/PersonalPeriodicOrder',
    };
});


app.directive('creditlinedetails', function () {
    return {
        restrict: 'EA',

        scope: {
            productid: '=',
            cardnumber: '=',
            canmature: '=?',
            cardtype: '='
        },
        templateUrl: '/CreditLine/CreditLineDetails'
    };
});
app.directive('paymentaccount', function () {
    return {
        restrict: 'E',
        scope: {

            accounts: '=',//հաշիվները
            account: '=',//view ի վրա կցվող ng-model ը
            disable: '=',//եթե անհրաժեշտ ե disable անել հաշիվների դաշտը
            nameforaccount: '=',//հաշիվների label-ի անունը
            nameforcurrency: '=',//արժույթների label-ի անունը
            check: '=',//եթե 0 է ցույց է հաշիվները,1 ի դեպքում արժույթները
            ngblur: '&',//դաշտի ng-blur ի ժամանակ կատարվող ֆունկցիաները որոնք տրվում են դրսից
            onlyamd: '=',//եթե true է ցույց ե տալի միայն դրամ արժույթում
            isrequire: '=?',//եթե true  պարտադիր դաշտ է լրացման համար
            accountselectname: '@',//հաշվի select ի անունը
            forinputcheckbox: '=',//Եթե true է directive ի մեջ ցույց է տալիս checkbox-ով select-ը:
            showloading: '=?',// loading ցույց տալու կամ ցույց չտալու համար
            formname: '=',
            accountnumber: '=?',//համալրման ժամանակ դրսից փոխանցվող հաշվեհամար
            tooltipdescription: '@?',//եթե լրացված է, label-ից հետո Info նշան է դրվում, որի tooltip-ը արտացոլում է փոխանցված արժեքը
            showoptionsfirstitem: '=?',
            selectedcurrency: '=?',
            transfer: '=?',
            showforats: '=?',//ԱԳՍ-ով կանխիկ մուտք կամ կանխիկ ելք անելու նշում
            ordertype: '=?'//Հայտի տեսակ,

        },
        templateUrl: '/PaymentOrder/PaymentAccount',
        controller: ['$scope', '$element', 'infoService', function ($scope, $element, infoService) {

            $scope.tooltipClass = function () {
                $("[data-toggle=tooltip]").tooltip({ container: 'body' });
                $(".tip").tooltip({ placement: 'top', container: 'body' });
                $(".tipR").tooltip({ placement: 'right', container: 'body' });
                $(".tipB").tooltip({ placement: 'bottom', container: 'body' });
                $(".tipL").tooltip({ placement: 'left', container: 'body' });
            }

            $scope.$watchGroup(['accountnumber', 'accounts'], function (newValues, oldValues) {

                if ($scope.accountnumber != undefined && $scope.accounts != undefined) {
                    for (var i = 0; i < $scope.accounts.length; i++) {
                        if ($scope.accounts[i].AccountNumber == $scope.accountnumber) {
                            $scope.account = $scope.accounts[i];
                            $scope.orderAccount = $scope.accounts[i];
                            $scope.ngblur();
                        }
                    }
                }

            });







            $scope.guid = function () {
                return 'Account_' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            $scope.firstSelect = $scope.guid();
            $scope.secondSelect = $scope.guid();

            $scope.currenciesAccount = [];

            $scope.getCurrenciesKeyValueType = function () {
                var Data = infoService.getCurrenciesKeyValueType();
                Data.then(function (acc) {
                    $scope.cur = acc.data;
                    for (var i = 0; i < acc.data.length; i++) {
                        $scope.currenciesAccount.push({
                            AccountNumber: 0, Currency: acc.data[i].Key
                        });

                    }

                    if ($scope.selectedcurrency != undefined && $scope.transfer != undefined && $scope.accountnumber == undefined) {
                        for (var j = 0; j < $scope.currenciesAccount.length; j++) {
                            if ($scope.currenciesAccount[j].Currency == $scope.selectedcurrency) {
                                $scope.currencie = $scope.currenciesAccount[j];
                                $scope.setCurrency($scope.currencie);
                                $scope.ngblur();
                            }
                        }
                    }
                }, function () {
                    alert('Currencies Error');
                });


            }
            $scope.$watch('check', function (newValue, oldValue) {
                $scope.defaultText = "Ընտրեք...";
                if ($scope.check == 1 && $scope.onlyamd == true) {

                    $scope.currenciesAccount.push({
                        AccountNumber: 0, Currency: 'AMD'
                    });
                    $scope.currencie = $scope.currenciesAccount[0];
                    $scope.account = $scope.currencie;
                    $scope.orderAccount = null;
                }
                else {
                    $scope.orderAccount = undefined;
                }
            });

            if ($scope.onlyamd != true) {
                $scope.getCurrenciesKeyValueType();
            }

            $scope.getAccountDescription = function (account) {
                if (account.AccountType == 11) {
                    return account.AccountDescription + ' ' + account.Currency;
                }
                else {
                    return account.AccountNumber + ' ' + account.Currency;
                }
            };

            $scope.hasCardAccount = false;
            $scope.setAccountText = function ($event) {
                //$($event.target).get(0).selectedIndex = 0
            }
            $scope.defaultText = "Ընտրեք...";
            $scope.getAccountDesc = function (account) {
                if ($scope.maxBalance == undefined && $scope.maxAccountDesc == undefined) {
                    var balances = [];
                    var accountNumbers = [];
                    var productDescriptions = [];
                    for (var i = 0; i < $scope.accounts.length; i++) {
                        balances.push($scope.accounts[i].BalanceString);
                        if ($scope.accounts[i].AccountType == 11) {
                            accountNumbers.push($scope.accounts[i].ProductNumber);

                            var desc = $scope.accounts[i].AccountDescription.replace($scope.accounts[i].ProductNumber + ' ', '');
                            productDescriptions.push(desc);
                            $scope.hasCardAccount = true;
                        }
                        else {
                            accountNumbers.push($scope.accounts[i].AccountNumber);
                        }
                    }
                    $scope.maxBalance = Math.max.apply(Math, $.map(balances, function (el) { return el.length }));
                    $scope.maxAccountNumber = Math.max.apply(Math, $.map(accountNumbers, function (el) { return el.length }));
                    $scope.maxProductDesc = Math.max.apply(Math, $.map(productDescriptions, function (el) { return el.length }));
                }
                var desc = "";
                var dif = 0;


                if ($scope.ordertype == 133) {


                    var productDesc = account.AccountDescription.replace(account.ProductNumber + ' ', ' ');
                    desc = desc + productDesc;
                    dif = $scope.maxProductDesc - productDesc.length;
                    desc = desc + $scope.addSpaces(dif);

                    desc += $scope.addSpaces(4);

                    desc = desc + account.Currency;
                    dif = 3 - account.Currency.length;
                    desc = desc + $scope.addSpaces(dif);

                    desc += $scope.addSpaces(1);

                }
                else {

                    if (account.Status == 7) {

                        desc = desc + account.AccountNumber;
                        dif = $scope.maxAccountNumber - account.AccountNumber.length;
                        desc = desc + $scope.addSpaces(dif);

                        desc += $scope.addSpaces(1);

                        if ($scope.hasCardAccount) {
                            desc += $scope.addSpaces($scope.maxProductDesc);
                        }

                        desc += $scope.addSpaces(4);

                        var balance = account.AccountDescription;
                        dif = $scope.maxBalance - account.AccountDescription.length;
                        balance = $scope.addSpaces(dif) + balance;
                        desc = desc + balance;

                        desc += $scope.addSpaces(1);

                        desc = desc + account.Currency;
                        dif = 3 - account.Currency.length;
                        desc = desc + $scope.addSpaces(dif);

                        desc += $scope.addSpaces(1);
                        return desc;
                    }

                    if (account.AccountType == 11 || account.AccountType == 115) {

                        desc = desc + account.ProductNumber;
                        dif = $scope.maxAccountNumber - account.ProductNumber.length;
                        desc = desc + $scope.addSpaces(dif);

                        desc += $scope.addSpaces(1);
                      
                        if (account.AccountType == 115) {
                            productDesc = account.AccountNumber.replace(account.ProductNumber + ' ', '');
                        }
                        else {
                            productDesc = account.AccountDescription.replace(account.ProductNumber + ' ', '');
                        }
                        desc = desc + productDesc;
                        dif = $scope.maxProductDesc - productDesc.length;
                        desc = desc + $scope.addSpaces(dif);

                        desc += $scope.addSpaces(4);


                        var balance = account.BalanceString;
                        dif = $scope.maxBalance - account.BalanceString.length;
                        balance = $scope.addSpaces(dif) + balance;
                        desc = desc + balance;

                        desc += $scope.addSpaces(1);

                        desc = desc + account.Currency;
                        dif = 3 - account.Currency.length;
                        desc = desc + $scope.addSpaces(dif);

                        desc += $scope.addSpaces(1);

                    }
                    else {
                        desc = desc + account.AccountNumber;
                        dif = $scope.maxAccountNumber - account.AccountNumber.length;
                        desc = desc + $scope.addSpaces(dif);

                        desc += $scope.addSpaces(1);

                        if ($scope.hasCardAccount) {
                            desc += $scope.addSpaces($scope.maxProductDesc);
                        }

                        desc += $scope.addSpaces(4);

                        var balance = account.BalanceString;
                        dif = $scope.maxBalance - account.BalanceString.length;
                        balance = $scope.addSpaces(dif) + balance;
                        desc = desc + balance;

                        desc += $scope.addSpaces(1);

                        desc = desc + account.Currency;
                        dif = 3 - account.Currency.length;
                        desc = desc + $scope.addSpaces(dif);

                        desc += $scope.addSpaces(1);
                    }
                }
                return desc;
            }
            $scope.setAccount = function (account, id) {
                $scope.account = account;
                $scope.accountnumber = undefined;
                $scope.orderAccount = account;
                if (account != undefined) {
                    if (account.AccountType == 11) {
                        $scope.defaultText = account.AccountDescription + " " + account.Currency;
                    }
                    else {
                        $scope.defaultText = account.AccountNumber + " " + account.Currency;
                    }
                }
                if (id == $scope.firstSelect) {
                    $scope.selectElement = $scope.firstSelect;
                }
                if (id == $scope.secondSelect) {
                    $scope.selectElement = $scope.secondSelect;
                }
            }


            $scope.$watch('account', function (newValue, oldValue) {
                //if ($scope.selectedcurrency != undefined)
                //{
                //    $scope.setCurrency($scope.currencie);
                //    $scope.ngblur();
                //}
                //else
                if ($scope.account != undefined && $scope.account.AccountNumber != undefined && ($scope.account.AccountNumber != $scope.accountnumber || $scope.transfer != undefined)) {
                    $scope.ngblur();
                }
            });


            $scope.setCurrency = function (currencie) {
                $scope.account = currencie;
            }

            $scope.addSpaces = function (count) {
                var spaces = "";
                for (var i = 0; i < count; i++) {
                    spaces += String.fromCharCode(160);
                }
                return spaces;
            }
        }
        ]
        ,
        link: function (scope, elem, attr, ctrl) {
            angular.element(elem[0]).bind("mouseup", function (e) {
                if (scope.showoptionsfirstitem != true) {
                    var select = $("#" + scope.selectElement);
                    if ($(select).get(0) != undefined) {
                        $(select).get(0).selectedIndex = 0;
                        scope.$apply();
                    }
                }
            });

        }

    };
});


//Վարկի քաղվածք
app.directive('loanstatement', function () {
    return {
        restrict: 'EA',
        scope: {
            accountnumber: '=',
            productid: '=?'
        },
        templateUrl: '/Loan/LoanStatement'
    };
});




app.directive('currentaccounts', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Account/Accounts',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('cards', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Card/Cards',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideblank = hideBlank;
        }
    };
});

app.directive('deposits', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Deposit/Deposits',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('loans', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Loan/Loans',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('creditlines', function () {
    return {
        restrict: 'EA',
        templateUrl: '/CreditLine/CreditLines',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('periodictransfers', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PeriodicTransfer/PeriodicTransfers',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('depositcases', function () {
    return {
        restrict: 'EA',
        templateUrl: '/DepositCase/DepositCases',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('guarantees', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Guarantee/Guarantees',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('accreditives', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Accreditive/Accreditives',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('paidguarantees', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PaidGuarantee/PaidGuarantees',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('paidaccreditives', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PaidAccreditive/PaidAccreditives',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('factorings', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Factoring/Factorings',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('paidfactorings', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PaidFactoring/PaidFactorings',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('noncashopperson', function () {
    return {
        restrict: 'E',
        scope: {
            accountnumber: '=',
            opperson: '=',
            formname: '=',
            convertation: '=',
            armbudget: '=',
            ordertype: '=',
            accountType: '=?',
            iscustomertransitaccount: '=?'

        },
        templateUrl: '/Orders/NonCashOPPerson',
        controller: ['$scope', '$element', 'orderService', 'customerService', 'accountService', function ($scope, $element, orderService, customerService, accountService) {
            $scope.opperson = {};


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


                $scope.searchCustomersModalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {

                });
            };
            $scope.getSearchedCustomer = function (customer) {
                $scope.getCustomer(customer.customerNumber);
                $scope.closeSearchCustomersModal();
            }

            $scope.closeSearchCustomersModal = function () {
                $scope.searchCustomersModalInstance.close();
            }

            $scope.getCustomer = function (customerNumber) {
                var Data = customerService.getCustomer(customerNumber);
                Data.then(function (cust) {
                    $scope.opperson = {};
                    $scope.customer = cust.data;
                    if ($scope.customer.IdentityID != 0) {
                        if ($scope.customer.CustomerType == 6 && $scope.customer.Quality != 43) {
                            $scope.opperson.CustomerNumber = $scope.customer.CustomerNumber;
                            $scope.opperson.PersonName = $scope.customer.FirstName;
                            $scope.opperson.PersonLastName = $scope.customer.LastName;
                            $scope.opperson.PersonDocument = $scope.customer.DocumentNumber + ", " + $scope.customer.DocumentGivenBy + ", " + $scope.customer.DocumentGivenDate;
                            $scope.opperson.PersonSocialNumber = $scope.customer.SocCardNumber;
                            $scope.opperson.PersonNoSocialNumber = $scope.customer.NoSocCardNumber;
                            $scope.opperson.PersonAddress = $scope.customer.RegistrationAddress;
                            if ($scope.customer.PhoneList != undefined) {
                                for (var i = 0; i < $scope.customer.PhoneList.length; i++) {
                                    if ($scope.customer.PhoneList[i].phoneType.key == 1) {
                                        $scope.opperson.PersonPhone = $scope.customer.PhoneList[i].phone.countryCode + $scope.customer.PhoneList[i].phone.areaCode + $scope.customer.PhoneList[i].phone.phoneNumber;
                                    }
                                }
                            }
                            if ($scope.customer.EmailList != undefined) {
                                $scope.opperson.PersonEmail = '';
                                for (var i = 0; i < $scope.customer.EmailList.length; i++) {
                                    if (($scope.opperson.PersonEmail + $scope.customer.EmailList[i]).length < 50) {
                                        $scope.opperson.PersonEmail += $scope.customer.EmailList[i];
                                        if (i < $scope.customer.EmailList.length - 1) {
                                            $scope.opperson.PersonEmail += ",";
                                        }
                                    }
                                }
                            }
                            $scope.opperson.PersonBirth = new Date(parseInt($scope.customer.BirthDate.substr(6)));
                            $scope.opperson.PersonResidence = $scope.customer.Residence;

                            $scope.getCustomerDocumentWarnings($scope.customer.CustomerNumber);
                        }
                        else {
                            if ($scope.customer.Quality == 43)
                                ShowMessage('Չի կարող լինել կրկնակի հաճախորդ:', 'error');
                            else
                                ShowMessage('Պետք է լինի ֆիզիկական անձ:', 'error');
                            $scope.opperson = undefined;
                        }
                    }
                    else {
                        $scope.opperson = undefined;
                    }

                }, function () {
                    alert('Error getCustomer');
                });
            };


            $scope.getAuthorizedCustomerNumber = function () {
                var Data = customerService.getAuthorizedCustomerNumber();
                Data.then(function (cust) {
                    $scope.authorizedCustomerNumber = cust.data;
                    if ($scope.opperson != undefined && $scope.opperson.CustomerNumber != undefined) {
                        $scope.getCustomerDocumentWarnings($scope.opperson.CustomerNumber);
                    }
                }, function () {
                    alert('Error getAuthorizedCustomerNumber');
                });
            };
            $scope.getAuthorizedCustomerNumber();
            $scope.getOrderOPPersons = function (accountnumber) {
                if (accountnumber == undefined) {
                    accountnumber = 0;
                }

                if ($scope.ordertype == 139 && accountnumber == 0) {
                    return;
                }

                var Data = orderService.getOrderOPPersons(accountnumber, $scope.ordertype);
                Data.then(function (acc) {
                    $scope.persons = acc.data;

                    for (var i = 0; i < $scope.persons.length; i++) {
                        $scope.persons[i].BirthString = $scope.persons[i].PersonBirth;
                        $scope.persons[i].PersonBirth = new Date(parseInt($scope.persons[i].PersonBirth.substr(6)));
                    }

                    if ($scope.persons.length == 1) {
                        $scope.opperson = $scope.persons[0];
                        $scope.getCustomerDocumentWarnings($scope.opperson.CustomerNumber);
                    }
                    else
                        $scope.opperson = undefined;
                }, function () {
                    alert('Currencies Error');
                });
            }

            $scope.$watch('accountnumber', function (newValue, oldValue) {
                if ($scope.accountnumber != undefined)
                    if ($scope.accountType != 116) {
                        $scope.getOrderOPPersons(newValue);
                    }
                    else {

                        var Data = accountService.getBankruptcyManager($scope.accountnumber);
                        Data.then(function (acc) {
                            $scope.bankruptcyManager = acc.data;
                            var Data2 = orderService.setOrderPerson($scope.bankruptcyManager);
                            Data2.then(function (acc) {
                                $scope.persons = [];
                                $scope.persons.push(acc.data);
                                $scope.opperson = acc.data;
                                $scope.opperson.BirthString = $scope.opperson.PersonBirth;
                                $scope.opperson.PersonBirth = new Date(parseInt($scope.opperson.PersonBirth.substr(6)));

                                $scope.getCustomerDocumentWarnings($scope.opperson.CustomerNumber);
                            }, function () {
                                alert('Error CashTypes');
                            });


                        }, function () {
                            alert('Error CashTypes');
                        });




                    }
            });

            $scope.$watch('ordertype',
                function (newValue, oldValue) {
                    if ($scope.accountnumber != undefined && $scope.accountnumber != null) {
                        $scope.getOrderOPPersons($scope.accountnumber);
                    }
                    if ($scope.accountnumber != undefined)
                        if ($scope.accountType != 116) {
                            $scope.getOrderOPPersons(newValue);
                        }
                        else {

                            var Data = accountService.getBankruptcyManager($scope.accountnumber);
                            Data.then(function (acc) {
                                $scope.bankruptcyManager = acc.data;
                                var Data2 = orderService.setOrderPerson($scope.bankruptcyManager);
                                Data2.then(function (acc) {
                                    $scope.persons = [];
                                    $scope.persons.push(acc.data);
                                    $scope.opperson = acc.data;
                                    $scope.opperson.BirthString = $scope.opperson.PersonBirth;
                                    $scope.opperson.PersonBirth = new Date(parseInt($scope.opperson.PersonBirth.substr(6)));

                                    $scope.getCustomerDocumentWarnings($scope.opperson.CustomerNumber);
                                }, function () {
                                    alert('Error CashTypes');
                                });
                            }, function () {
                                alert('Error CashTypes');
                            });

                        }
                })


            $scope.getCustomerDocumentWarnings = function (customerNumber) {
                if ($scope.authorizedCustomerNumber != customerNumber) {
                    var Data = customerService.getCustomerDocumentWarnings(customerNumber);
                    Data.then(function (ord) {
                        $scope.warnings = ord.data;
                    },
                        function () {
                            alert('Error CashTypes');
                        });
                } else
                    $scope.warnings = undefined;
            };


        }
        ]
    };
});

app.directive('cashopperson', function () {
    return {
        restrict: 'E',
        scope: {
            opperson: '=',
            formname: '=',
            utility: '=',
            nonauthorizedcustomer: '=',
            armbudget: '=',
            convertation: '=',
            haspassport: '=?',
            transfer: '=?',
            ordertype: '=?',
            accountnumber: '=',

        },
        templateUrl: '/Orders/CashOPPerson',
        controller: ['$scope', '$uibModal', '$element', 'orderService', 'customerService', 'dialogService', 'paymentOrderService', function ($scope, $uibModal, $element, orderService, customerService, dialogService, paymentOrderService) {
            if ($scope.opperson == undefined) {
                $scope.opperson = {};
            }
            $scope.getAuthorizedCustomerNumber = function () {
                var Data = customerService.getAuthorizedCustomerNumber();
                Data.then(function (cust) {
                    $scope.authorizedCustomerNumber = cust.data;
                    if ($scope.opperson != undefined && $scope.opperson.CustomerNumber != undefined) {
                        $scope.getCustomerDocumentWarnings($scope.opperson.CustomerNumber);
                    }

                }, function () {
                    alert('Error getAuthorizedCustomerNumber');
                });
            };
            $scope.getAuthorizedCustomerNumber();
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


                $scope.searchCustomersModalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {

                });
            };
            $scope.getSearchedCustomer = function (customer) {
                $scope.getCustomer(customer.customerNumber);
                $scope.closeSearchCustomersModal();
            }

            $scope.closeSearchCustomersModal = function () {
                $scope.searchCustomersModalInstance.close();
            }

            $scope.getCustomerDocumentWarnings = function (customerNumber) {
                if ($scope.authorizedCustomerNumber != customerNumber) {
                    var Data = customerService.getCustomerDocumentWarnings(customerNumber);
                    Data.then(function (ord) {
                        $scope.warnings = ord.data;
                    }, function () {
                        alert('Error CashTypes');
                    });
                }
                else {
                    $scope.warnings = undefined;
                }
            };



            $scope.$watchGroup(['accountnumber', 'ordertype'], function (newValues, oldValues) {

                if ($scope.accountnumber != undefined && $scope.ordertype != undefined) {
                    $scope.getOrderOPPersons($scope.accountnumber);
                }

            });



            $scope.getOrderOPPersons = function (accountnumber) {
                if (accountnumber == undefined) {
                    accountnumber = 0;
                    return;
                }

                var Data = orderService.getOrderOPPersons(accountnumber, $scope.ordertype);
                Data.then(function (acc) {
                    $scope.persons = acc.data;

                    for (var i = 0; i < $scope.persons.length; i++) {
                        $scope.persons[i].BirthString = $scope.persons[i].PersonBirth;
                        $scope.persons[i].PersonBirth = new Date(parseInt($scope.persons[i].PersonBirth.substr(6)));
                    }

                }, function () {
                    alert('Currencies Error');
                });
            }

            $scope.setOrderPerson = function () {

                if ((($scope.ordertype == 51 || $scope.ordertype == 95) && $scope.$root.SessionProperties.CustomerType != 6) || $scope.ordertype == 139) {
                    return;
                }

                if ($scope.transfer == undefined) {
                    var Data = orderService.setOrderPerson();
                }
                else if ($scope.transfer.CustomerNumber != undefined && $scope.transfer.CustomerNumber != 0) {
                    var Data = orderService.setOrderPerson($scope.transfer.CustomerNumber);
                }


                Data.then(function (ord) {
                    $scope.opperson = ord.data;
                    $scope.opperson.PersonBirth = new Date(parseInt(ord.data.PersonBirth.substr(6)));
                    $scope.getCustomerDocumentWarnings($scope.opperson.CustomerNumber);
                }, function () {
                    alert('Error CashTypes');
                });
            };

            $scope.getCustomer = function (customerNumber) {
                var Data = customerService.getCustomer(customerNumber);
                Data.then(function (cust) {
                    $scope.customer = cust.data;
                    if ($scope.customer.IdentityID != 0) {
                        if ($scope.customer.CustomerType == 6 && $scope.customer.Quality != 43) {
                            $scope.opperson.CustomerNumber = $scope.customer.CustomerNumber;
                            $scope.opperson.PersonName = $scope.customer.FirstName;
                            $scope.opperson.PersonLastName = $scope.customer.LastName;
                            $scope.opperson.PersonDocument = $scope.customer.DocumentNumber + ", " + $scope.customer.DocumentGivenBy + ", " + $scope.customer.DocumentGivenDate;

                            if ($scope.opperson.PersonDocument != '') {
                                $scope.hasPassport = 'true';
                            }

                            $scope.opperson.PersonSocialNumber = $scope.customer.SocCardNumber;
                            $scope.opperson.PersonNoSocialNumber = $scope.customer.NoSocCardNumber;
                            $scope.opperson.PersonAddress = $scope.customer.RegistrationAddress;
                            if ($scope.customer.PhoneList != undefined) {
                                for (var i = 0; i < $scope.customer.PhoneList.length; i++) {
                                    if ($scope.customer.PhoneList[i].phoneType.key == 1) {
                                        $scope.opperson.PersonPhone = $scope.customer.PhoneList[i].phone.countryCode + $scope.customer.PhoneList[i].phone.areaCode + $scope.customer.PhoneList[i].phone.phoneNumber;
                                    }
                                }
                            }
                            if ($scope.customer.EmailList != undefined) {
                                $scope.opperson.PersonEmail = '';
                                for (var i = 0; i < $scope.customer.EmailList.length; i++) {
                                    if (($scope.opperson.PersonEmail + $scope.customer.EmailList[i]).length < 50) {
                                        $scope.opperson.PersonEmail += $scope.customer.EmailList[i];
                                        if (i < $scope.customer.EmailList.length - 1) {
                                            $scope.opperson.PersonEmail += ",";
                                        }
                                    }
                                }
                            }
                            $scope.opperson.PersonBirth = new Date(parseInt($scope.customer.BirthDate.substr(6)));
                            $scope.opperson.PersonResidence = $scope.customer.Residence;

                            $scope.getCustomerDocumentWarnings($scope.customer.CustomerNumber);
                        }
                        else {
                            if ($scope.customer.Quality == 43)
                                ShowMessage('Չի կարող լինել կրկնակի հաճախորդ:', 'error');
                            else
                                ShowMessage('Պետք է լինի ֆիզիկական անձ:', 'error');
                            $scope.opperson = undefined;
                        }
                    }
                    else {
                        $scope.opperson = undefined;
                    }

                }, function () {
                    alert('Error getCustomer');
                });
            };
            if (($scope.nonauthorizedcustomer == undefined || $scope.nonauthorizedcustomer == "false") && $scope.transfer == undefined)
                $scope.setOrderPerson();
            else if ($scope.transfer != undefined) {
                if ($scope.transfer.CustomerNumber != undefined && $scope.transfer.CustomerNumber != 0)
                    $scope.setOrderPerson();
            }

            $scope.getOPPersonStatuses = function () {

                var Data = paymentOrderService.getSyntheticStatuses();
                Data.then(function (acc) {

                    $scope.opPersonStatuses = acc.data;
                }, function () {
                    alert('Error getCreditorStatuses');
                });
            };

            $scope.changeCustomerNumber = function () {
                $scope.opperson.PersonName = '';
                $scope.opperson.PersonLastName = '';
                $scope.opperson.PersonDocument = '';
                $scope.opperson.PersonSocialNumber = '';
                $scope.opperson.PersonNoSocialNumber = '';
                $scope.opperson.PersonAddress = '';
                $scope.opperson.PersonPhone = '';
                $scope.opperson.PersonBirth = undefined;
                $scope.opperson.PersonResidence = undefined;
                $scope.opperson.PersonEmail = '';

                if (($scope.ordertype == 51 || $scope.ordertype == 95 || $scope.ordertype == 139) && $scope.$root.SessionProperties.CustomerType != 6) {
                    hasPassport = undefined;
                }
                else {
                    $scope.hasPassport = 'false';
                }
            }

            $scope.$watch('hasPassport', function (newValue, oldValue) {
                if (newValue != undefined) {
                    if ($scope.hasPassport == 'false' || $scope.hasPassport == false) {
                        $scope.haspassport = 'false';
                        $scope.opperson.CustomerNumber = undefined;
                        if ($scope.$root.SessionProperties.IsNonCustomerService != true) {
                            $scope.changeCustomerNumber();
                        }

                    }
                    else {
                        $scope.haspassport = 'true';
                    }
                }
                else {
                    if ($scope.nonauthorizedcustomer == true || $scope.nonauthorizedcustomer == 'true') {
                        $scope.hasPassport = 'false';
                    }
                    else {
                        $scope.hasPassport = 'true';
                    }

                }
            });

            $scope.copyOPPersonDetails = function () {
                localStorage.setItem('oPPersonCash', JSON.stringify($scope.opperson));
            }
            $scope.pasteOPPersonDetails = function () {
                $scope.opperson = JSON.parse(localStorage.getItem("oPPersonCash"));
            }
        }
        ]
    };
});

app.directive('paymentattachment', function () {
    return {
        restrict: 'E',
        scope: {
            arraybuffer: '=',
            attachment: '='
        },
        templateUrl: '/PaymentOrder/PaymentAttachment',
        controller: ['$scope', '$element', function ($scope, $element) {

            $scope.obj = {};

            $scope.convertfile = function ($files, $event, $flow) {
                var fr = new FileReader();

                fr.onload = function () {
                    $scope.arraybuffer = this.result;
                    $scope.arraybuffer = $scope.arraybuffer.replace('data:image/jpeg;base64,', '');
                    $scope.arraybuffer = $scope.arraybuffer.replace('data:image/png;base64,', '');
                    $scope.arraybuffer = $scope.arraybuffer.replace('data:image/jpg;base64,', '');
                    $scope.arraybuffer = $scope.arraybuffer.replace('data:application/pdf;base64,', '');
                    $scope.attachment = $scope.obj.flow.files[0];
                };



                fr.readAsDataURL($files[0].file);

            };

            $scope.removeFile = function () {
                $scope.arraybuffer = null;
                $scope.attachment = null;
            };

        }
        ]
    };
});
app.directive('orderattachments', function () {
    return {
        restrict: 'EA',
        scope: {
            orderid: '='
        },
        templateUrl: '/Orders/AttachmentDocuments'
    };
});

app.directive('transferattachments', function () {
    return {
        restrict: 'EA',
        scope: {
            id: '='
        },
        templateUrl: '/Transfers/AttachmentDocuments'
    };
});

app.directive('transitpaymentorder', function () {


    return {

        restrict: 'E',
        templateUrl: '/TransitPaymentOrder/PersonalTransitPaymentOrder'

    };
});

app.directive('labelsRequired', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.find('div.form-group').each(function (i, formGroup) {
                var formControls = $(formGroup).find('input, select, textarea');

                if (0 !== formControls.length &&
                    (undefined !== $(formControls[0]).attr('required') ||
                        undefined !== $(formControls[0]).attr('ng-required'))) {

                    jLabel = $(formGroup).find('label');
                    jLabel.html(jLabel.html() + "<span class='redStyle'>*</span>");
                }
            });
        }
    }
});

app.directive('orderdescription', function () {
    return {
        restrict: 'E',
        scope: {
            accounttype: '=',//դեբետ կամ կրեդիտ հաշվի տեսակ
            ordertype: '=',//Հայտի տեսակ
            description: '=',//նկարագրությունը
            formname: '=',//ֆորմայի անունը որում գտնվում է դիրեկտիվան
            additional: '=',//լրացուցիչ նկարագրություն,չփոխանցելու դեպքում այդ դաշտը չի երևա
            operations: '=',//նկարագրությունների ցանկը
            periodic: '=',//որոշում ենք պարբերականի դեպքում ցուցադրվի թե ոչ
            labeldescription: '=',//label-ի վերնագիրը
            getdescription: '&',
            operationsforloan: '=?', //  եթե 1,2 կամ 3 է ,ապա ընտրվում են միայն վարկի համար նախատեսված նկարագրությունները 
            disable: '=?',//եթե անհրաժեշտ ե disable անել նկարագրության դաշտը
            hidetextarea: '=?'//եթե անհրաժեշտ ե disable անել Լրացուցիչ նկարագրություն դաշտը
        },
        templateUrl: '/PaymentOrder/OrderDescription',
        controller: ['$scope', '$element', 'infoService', function ($scope, $element, infoService) {

            $scope.$watchGroup(['accounttype', 'ordertype'], function (newValues, oldValues) {
                if ($scope.ordertype == 51 && ($scope.accounttype == 10 || $scope.accounttype == 11 || $scope.accounttype == 54 || $scope.accounttype == 58)) {
                    $scope.isCombo = true;
                    if ($scope.accounttype == 10 || $scope.accounttype == 54 || $scope.accounttype == 58)
                        $scope.operations = $scope.operations2;
                    else
                        $scope.operations = $scope.operations1;
                }
                else
                    $scope.isCombo = false;

            });

            $scope.getOperationsList = function () {
                var Data = infoService.GetOperationsList();
                Data.then(function (list) {
                    $scope.operations = [];
                    for (var key in list.data) {
                        $scope.operations.push(list.data[key]);
                    }

                    $scope.operations1 = $scope.operations.concat();
                    $scope.operations2 = [list.data[0], list.data[2], list.data[3], list.data[4], list.data[28], list.data[29], list.data[99]];
                    if ($scope.operationsforloan == 1 || $scope.operationsforloan == 2 || $scope.operationsforloan == 4 || $scope.operationsforloan == 5) {
                        $scope.operations = $scope.operations2;
                        if ($scope.operationsforloan == 1)
                            $scope.description = $scope.operations[3];
                        else if ($scope.operationsforloan == 2)
                            $scope.description = $scope.operations[1];
                        else if ($scope.operationsforloan == 4)
                            $scope.description = $scope.operations[2];
                        else if ($scope.operationsforloan == 5)
                            $scope.description = $scope.operations[0];
                    }

                    $scope.getdescription();

                }, function () {
                    alert('error');
                });

            }


        }

        ]
    };
});

app.directive('countrylist', function () {
    return {
        restrict: 'E',
        scope: {
            formname: '=',//ֆորմայի անունը որում գտնվում է դիրեկտիվան 
            showriskquality: '=',//óáõó³¹ñíÇ »ñÏñÇ éÇëÏ³ÛÝáõÃÛáõÝÁ Ã» áã
            country: '=',// 
            labeldescription: '=',//label-ի վերնագիրը
            showforrussia: '=',//նշել Ռուսաստան
            disabled1: '=?',//
            selectedcountry: '=?',//
            isrequired: '=?',//

        },
        templateUrl: '/InternationalPaymentOrder/CountryList',
        controller: ['$scope', '$element', 'infoService', function ($scope, $element, infoService) {
            currentCountry = {};
            $scope.AddInf = '';
            $scope.countryList = [];
            $scope.setRussia = 0;
            if ($scope.disabled1 == undefined) {
                $scope.disabled1 = 0;
            }
            if ($scope.isrequired == undefined) {
                $scope.isrequired == 1;
            }


            $scope.getCountryList = function () {


                var Data = infoService.getCountryList();
                Data.then(function (list) {

                    for (var key in list.data) {
                        $scope.countryList.push(list.data[key]);
                    }
                    //if ($scope.selectedcountry != undefined) {
                    //    $scope.selectedCountryName = $.grep($scope.countryList, function (v) { return v.CountryCode === $scope.selectedcountry; })[0].CountryName;
                    //    $scope.country = parseInt(selectedcountry);

                    //}
                    //else {
                    //    $scope.selectedCountryName = "Ընտրեք...";
                    //}
                }, function () {
                    alert('error');
                });

            }

            $scope.setCountry = function () {
                if ($scope.setRussia == 0) {
                    $scope.setRussia = 1;
                    $scope.country = '643';
                }
                else
                    $scope.setRussia = 0;
            }

            $scope.$watch('country', function (newValue, oldValue) {
                $scope.currentCountry = $.grep($scope.countryList, function (v) { return v.CountryCode === newValue; })[0];
                if (currentCountry != undefined && newValue != undefined && $scope.showriskquality == 1) {
                    if ($scope.currentCountry.AddInf == '' && $scope.currentCountry.RiskQuality == 2) {

                        $scope.AddInf = 'Բարձր ռիսկային երկիր';
                    }
                    else {
                        $scope.AddInf = $scope.currentCountry.AddInf;
                    }
                }
            });

        }
        ]
    };
});
app.directive('accdatachangeorder', function () {
    return {
        restrict: 'EA',
        //scope: {
        //    callback: '&',
        //    close: '&'
        //},
        templateUrl: '/AccountDataChangeOrder/AccountDataChangeOrder',
        controller: 'AccountDataChangeOrderCtrl',
        link: function (scope, elem, attrs) {
            //$(".modal-dialog").draggable();
            //scope.account = scope.$parent.Account;
            //scope.AdditionType = scope.$parent.AdditionType;
            //scope.AdditionValue = scope.$parent.AdditionValue;
            //scope.additionalDetails = scope.$parent.additionalDetails

            //scope.closeModal = function () {
            //    scope.close();
            //};
        }
    };
});

app.directive('freezehistory', function () {
    return {
        restrict: 'EA',
        scope: {
            accountnumber: '=',
            accounttype: '=?'
        },
        templateUrl: '/AccountFreeze/AccountFreezeHistory'
    };
});

app.directive('accountfreezedetails', function () {
    return {
        restrict: 'EA',
        templateUrl: '/AccountFreeze/AccountFreezeDetails'
    };
});

app.directive('cashpospaymentorder', function () {


    return {

        restrict: 'EA',
        templateUrl: '/CashPosPaymentOrder/CashPosPaymentOrder',
        controller: 'CashPosPaymentOrderCtrl'
    };
});

app.directive("checklength", function () {
    return {
        restrict: "A",

        require: "ngModel",

        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.checklength = function (modelValue) {
                if (modelValue)
                    return (modelValue.length == 15 || modelValue.length == 16 || modelValue.length == 19);
                return false;
            }
        }
    };
});

app.directive('testcustomerchoosedirective', function () {
    return {
        controller: ['$scope', function ($scope) {

        }],
        link: function (scope, element, attributes) {

        }
        ,
        restrict: 'EA',
        template: '<div class="container" ng-controller="LoginCtrl"   ng-init="openServeTypeDialog()"></div>'
    }
});

app.directive("customSelectAccounts", function () {
    return {
        restrict: "E",
        scope: {
            accounts: "=",
            setDetails: "&setaccount",
            check: "=",
            required: "=",
            getAccountDesc: "&getAccountDescription",
            blur: "&"
        },
        templateUrl: '/PaymentOrder/AccountsSelectDirective',
        link: function (scope, element, attributes) {


            scope.setAccount = function (ac) {
                scope.setDetails({ account: ac });
                scope.customBlur();
            }

            scope.customBlur = function () {
                scope.blur();
            }

            scope.getAccountDescription = function (ac) {
                var accountDesc = scope.getAccountDesc({ account: ac });
                return accountDesc;
            }

            scope.isCard = function (ac) {
                if (ac.AccountType == 11)
                    return true;
                else
                    return false;
            }

        }
    };
});


app.directive("customSelectCurrencies", function () {
    return {
        restrict: "E",
        scope: {
            curencies: "=",
            setDetails: "&setaccount",
            check: "=",
            required: "="

        },
        templateUrl: '/PaymentOrder/CurrenciesSelectDirective',
        link: function (scope, element, attributes) {
            scope.setAccount = function (ac) {
                scope.setDetails({ account: ac });
            }
        }
    };
});




app.directive('provisions', function () {
    return {
        restrict: 'EA',
        scope: {
            productid: '='
        },
        templateUrl: '/Loan/Provisions',
    };
});

app.directive('loandebts', function () {
    return {
        restrict: 'EA',
        scope: {
            loan: '='
        },
        templateUrl: '/Loan/LoanDebts'
    };
});

app.directive('loanjudgment', function () {
    return {
        restrict: 'EA',
        scope: {
            loan: '='
        },
        templateUrl: '/Loan/LoanJudgment'

    };
});

app.directive('loanmaincontract', function () {
    return {
        restrict: 'EA',
        scope: {
            productid: '=?',
            type: '='//type ից ելնելով որոշում է որ ֆունկցիան կանչի օր.՝ եթե 1 է կանչում է վարկի գլխավոր պայամանգրի ֆունկցիան եթե 2 է վարկային գծի գլխավուր պայմանգրի
        },
        templateUrl: '/Loan/LoanMainContract',
        controller: ['$scope', '$element', 'creditLineService', 'loanService', function ($scope, $element, creditLineService, loanService) {

            $scope.getLoanMainContract = function (productId) {
                var Data = loanService.getLoanMainContract(productId);
                Data.then(function (acc) {
                    $scope.loanmaincontract = acc.data;
                    $scope.loanmaincontracts = [];
                    $scope.loanmaincontracts.push($scope.loanmaincontract);
                }, function () {
                    alert('Error getLoanMainContract');
                });
            };

            $scope.getCreditLineMainContract = function () {
                var Data = creditLineService.getCreditLineMainContract();
                Data.then(function (acc) {
                    $scope.loanmaincontracts = acc.data;
                }, function () {
                    alert('Error getLoanMainContract');
                });
            };


            if ($scope.type == 1) {
                $scope.getLoanMainContract($scope.productid);
            }

            if ($scope.type == 2) {
                $scope.getCreditLineMainContract();
            }

        }
        ]
    };
});

app.directive('accountfreezeorder', function () {
    return {
        restrict: 'EA',
        templateUrl: '/AccountFreeze/AccountFreezeOrder',
        controller: 'AccountFreezeCtrl',
    };
});


app.directive('accountunfreezeorder', function () {
    return {
        restrict: 'EA',
        templateUrl: '/AccountFreeze/AccountUnfreezeOrder',
        controller: 'AccountFreezeCtrl',
    };
});


app.directive('usersetnumber', function () {
    return {
        restrict: 'EA',
        scope: {
            setnumber: '=',
            formname: '=',//ֆորմայի անունը որում գտնվում է դիրեկտիվան
            labelname: '@',
            disabled: '=?',// եթե անհրաժեշտ է դաշտը disable անել
            isautofill: '=?',//Եթե դրսից է փոխանցվում setnumber-ը և անհրաժեշտ է լրացնել իրեն
            withoutlabel: '=?', // Եթե true է , directive առանց lable-i է
            ngblur: '&?',
            generatedeafaultlimits: '&?',
            ngchange: '&?'
        },
        templateUrl: '/Home/UserSetNumber',
        controller: ['$scope', '$element', '$uibModal', 'casherService', function ($scope, $element, $uibModal, casherService) {


            $scope.callBlurFunction = function () {

                if ($scope.ngblur != undefined) {
                    $scope.ngblur();
                }
            }

            $scope.callChangeFunction = function () {
                if (!$scope.isBunker) {
                    if ($scope.ngchange != undefined) {
                        $scope.ngchange();
                    }
                }
            }

            $scope.callBlurFunction2 = function () {

                if ($scope.generatedeafaultlimits != undefined) {
                    $scope.generatedeafaultlimits();
                }

            }

            $scope.getCasherDescription = function () {
                if ($scope.formname != undefined) {
                    if ($scope.formname.$name == 'InputCashBook' && $scope.setnumber === 0) {
                        $scope.CasherDescription = 'Դրամապահոց';
                        $scope.isBunker = true;
                        return;
                    }
                    if ($scope.formname.$name == 'InputCashBook' && $scope.setnumber !== 0) {
                        $scope.isBunker = false;
                    }
                }
                if ($scope.setnumber == undefined) {
                    $scope.CasherDescription = undefined;
                    return;
                }
                var Data = casherService.getCasherDescription($scope.setnumber);
                Data.then(function (dep) {
                    $scope.CasherDescription = dep.data;
                    if ($scope.CasherDescription == " ") {
                        return ShowMessage('Օգտագործողը գտնված չէ:Խնդրում ենք ստուգել որոնման տվյալները:', 'error');
                    }
                }, function () {
                    alert('Error');
                });

            };

            $scope.$watchGroup(['isautofill', 'setnumber'], function (newValues, oldValues) {

                if ($scope.isautofill != undefined && $scope.setnumber != undefined && $scope.isautofill == true) {
                    $scope.getCasherDescription();

                }

            });





            $scope.searchCashiers = function () {
                $scope.searchCashiersModalInstance = $uibModal.open({
                    template: '<searchcashier callback="getSearchedCashier(cashier)" close="closeSearchCashiersModal()"></searchcashier>',
                    scope: $scope,
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: false,
                    backdrop: 'static',
                });


                $scope.searchCashiersModalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {

                });
            };
            $scope.getSearchedCashier = function (cashier) {
                $scope.setnumber = cashier.setNumber;
                $scope.CasherDescription = cashier.firstName + ' ' + cashier.lastName;
                $scope.closeSearchCashiersModal();
            }

            $scope.closeSearchCashiersModal = function () {
                $scope.searchCashiersModalInstance.close();
            }



            $scope.setBunker = function () {
                if ($scope.isBunker) {
                    $scope.setnumber = 0;
                    $scope.CasherDescription = 'Դրամապահոց';
                }
                else {
                    $scope.setnumber = '';
                    $scope.CasherDescription = '';
                }

            }
        }
        ]
    };
});


app.directive('productotherfees', function () {
    return {
        restrict: 'EA',
        scope: {
            productid: '=',
        },
        templateUrl: '/Loan/ProductOtherFees',
        controller: ['$scope', '$element', 'loanService', function ($scope, $element, loanService) {

            $scope.getProductOtherFees = function () {
                var Data = loanService.getProductOtherFees($scope.productid);
                Data.then(function (fee) {
                    $scope.otherFee = fee.data;
                }, function () {
                    alert('Error getProductOtherFees');
                });
            };
        }
        ]
    };
});

app.directive('cardtariffs', function () {
    return {
        restrict: 'EA',

        scope: {
            productid: '='
        },
        templateUrl: '/Card/CardTariffs'
    };
});

app.directive("checknumberformat", function () {
    return {
        restrict: "A",

        require: "ngModel",

        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.checknumberformat = function (modelValue) {
                if (modelValue)
                    if (isNaN(Number(modelValue)) || (Number(modelValue).toString() != Number(modelValue).toFixed(2).toString() && Number(modelValue).toString() != Number(modelValue).toFixed(1).toString() && Number(modelValue).toString() != Number(modelValue).toFixed(0).toString()))
                        return false;
                    else
                        return true;
                return false;
            }
        }
    };
});

app.directive('preventEnterSubmit', function () {
    return function (scope, el, attrs) {
        el.bind('keydown', function (event) {
            if (13 == event.which) {
                event.preventDefault(); // Doesn't work at all
                window.stop(); // Works in all browsers but IE...
                document.execCommand('Stop'); // Works in IE
                return false; // Don't even know why it's here. Does nothing.
            }
        });
    };
});

app.directive('appendscrolltodialog', function () {
    return {
        restrict: 'A',
        scope: {
            dialogid: '@',
            maxheight: '@'
        },
        link: function (scope, elem, attrs) {

            if ($("#" + scope.dialogid + " .menu-bar").next()[0] != undefined) {
                $("#" + scope.dialogid + " .menu-bar").next()[0].className = "bp-dialog-content custom-scroll";
                $("#" + scope.dialogid + " .menu-bar").next()[0].style.maxHeight = scope.maxheight + "px";
                $("#" + scope.dialogid + " .bp-dialog-content").mCustomScrollbar({
                    theme: "rounded-dark",
                    scrollButtons: {
                        scrollAmount: 200,
                        enable: true
                    },
                    mouseWheel: {
                        scrollAmount: 200
                    }
                });
            }

        }
    }
});

app.directive('creditlinedebt', function () {
    return {
        restrict: 'EA',

        scope: {
            creditline: '=',
            card: '=?'
        },
        templateUrl: '/CreditLine/CreditLineDebt',
        controller: ['$scope', '$element', 'utilityService', function ($scope, $element, utilityService) {




            if ($scope.creditline.Currency == "AMD") {


                $scope.creditLineDebt = utilityService.formatRound($scope.creditline.CurrentRateValue, 0) +
                    utilityService.formatRound($scope.creditline.PenaltyRate, 0) +
                    utilityService.formatRound($scope.creditline.JudgmentRate, 0) +
                    $scope.creditline.OutCapital -
                    $scope.creditline.CurrentCapital +
                    utilityService.formatRound($scope.creditline.CurrentRateValueUnused, 0);
                if ($scope.card != undefined) {
                    $scope.serviceFee = $scope.card.ServiceFee;
                    $scope.creditLineDebt = $scope.creditLineDebt + ($scope.card.AMEX_MRServiceFee != -1 ? $scope.card.AMEX_MRServiceFee : 0);
                    if ($scope.card.Overdraft != null) {
                        $scope.creditLineDebt = $scope.creditLineDebt +
                            (utilityService.formatRound($scope.card.Overdraft.CurrentRateValue, 0) +
                                utilityService.formatRound($scope.card.Overdraft.PenaltyRate, 0) +
                                utilityService.formatRound($scope.card.Overdraft.JudgmentRate, 0) +
                                $scope.card.Overdraft.OutCapital -
                                $scope.card.Overdraft.CurrentCapital);
                    }
                    $scope.allDebt = $scope.creditLineDebt + parseFloat($scope.serviceFee) - $scope.creditline.ConnectAccount.AvailableBalance;
                    $scope.mrFee = parseFloat($scope.card.AMEX_MRServiceFee) != -1 ? parseFloat($scope.card.AMEX_MRServiceFee) : 0;
                    $scope.overdue = 0;
                    $scope.overdue = utilityService.formatRound($scope.creditline.PenaltyRate, 0) +
                        utilityService.formatRound($scope.creditline.JudgmentRate, 0) +
                        utilityService.formatRound($scope.creditline.OverdueCapital, 2) +
                        utilityService.formatRound($scope.creditline.InpaiedRestOfRate, 0);

                    //-$scope.creditline.ConnectAccount.AvailableBalance + $scope.mrFee + parseFloat($scope.serviceFee);


                }
                else {
                    $scope.allDebt = $scope.creditLineDebt - $scope.creditline.ConnectAccount.AvailableBalance;
                    $scope.overdue = utilityService.formatRound($scope.creditline.PenaltyRate, 0) + utilityService.formatRound($scope.creditline.JudgmentRate, 0) +
                        utilityService.formatRound($scope.creditline.OverdueCapital, 0) + utilityService.formatRound($scope.creditline.InpaiedRestOfRate, 0) - $scope.creditline.ConnectAccount.AvailableBalance;

                    if ($scope.creditline.OverdueCapital == 0)
                        $scope.overdue = 0;


                }
            }
            else {



                var Data = utilityService.getCBKursForDate(new Date(), $scope.creditline.Currency);
                Data.then(function (kurs) {
                    $scope.kurs = kurs.data;


                    $scope.creditLineDebt = utilityService.formatRound($scope.creditline.CurrentRateValue, 0) +
                        utilityService.formatRound($scope.creditline.PenaltyRate, 0) +
                        utilityService.formatRound($scope.creditline.JudgmentRate, 0) +
                        $scope.creditline.OutCapital -
                        $scope.creditline.CurrentCapital +
                        utilityService.formatRound($scope.creditline.CurrentRateValueUnused, 0);
                    if ($scope.card != undefined) {
                        $scope.serviceFee = $scope.card.ServiceFee;
                        $scope.creditLineDebt = $scope.creditLineDebt + ($scope.card.AMEX_MRServiceFee != -1 ? $scope.card.AMEX_MRServiceFee / $scope.kurs : 0);
                        if ($scope.card.Overdraft != null) {
                            $scope.creditLineDebt = $scope.creditLineDebt +
                                (utilityService.formatRound($scope.card.Overdraft.CurrentRateValue, 0) +
                                    utilityService.formatRound($scope.card.Overdraft.PenaltyRate, 0) +
                                    utilityService.formatRound($scope.card.Overdraft.JudgmentRate, 0) +
                                    $scope.card.Overdraft.OutCapital -
                                    $scope.card.Overdraft.CurrentCapital);
                        }
                        $scope.allDebt = $scope.creditLineDebt + parseFloat($scope.serviceFee) - $scope.creditline.ConnectAccount.AvailableBalance;
                        $scope.mrFee = parseFloat($scope.card.AMEX_MRServiceFee) != -1 ? parseFloat($scope.card.AMEX_MRServiceFee) : 0;
                        $scope.overdue = 0;
                        $scope.overdue = utilityService.formatRound($scope.creditline.PenaltyRate, 0) +
                            utilityService.formatRound($scope.creditline.JudgmentRate, 0) +
                            utilityService.formatRound($scope.creditline.OverdueCapital, 2) +
                            utilityService.formatRound($scope.creditline.InpaiedRestOfRate, 0);

                        //-$scope.creditline.ConnectAccount.AvailableBalance + $scope.mrFee + parseFloat($scope.serviceFee);


                    }
                    else {
                        $scope.allDebt = $scope.creditLineDebt - $scope.creditline.ConnectAccount.AvailableBalance;
                        $scope.overdue = utilityService.formatRound($scope.creditline.PenaltyRate, 0) + utilityService.formatRound($scope.creditline.JudgmentRate, 0) +
                            utilityService.formatRound($scope.creditline.OverdueCapital, 0) + utilityService.formatRound($scope.creditline.InpaiedRestOfRate, 0) - $scope.creditline.ConnectAccount.AvailableBalance;


                        if ($scope.creditline.OverdueCapital == 0)
                            $scope.overdue = 0;

                    }



                }, function () {
                    alert('Error getCBKursForDate');
                });






            }

        }
        ]
    };
});

app.directive('leasingdetails', function () {
    return {
        restrict: 'E',
        scope: {
            leasingdata: '=?',
            isperiodic: '=?',
            searchleasingcustomers: '&'
        },
        templateUrl: '/Leasing/LeasingDetails',
        controller: ['$scope', function ($scope) {
            $scope.$watch('leasingdata', function (newValue, oldValue) {
                $scope.leasingDetails = angular.copy($scope.leasingdata);
            });
        }]
    };
});


app.directive('dahkblockages', function () {
    return {
        restrict: 'EA',
        templateUrl: '/DAHK/GetDahkBlockageDetails',
        controller: 'DAHKCtrl',
        link: function (scope, elem, attr, ctrl) {
            scope.getDahkDetails();
          

            scope.$watch('dahkCustomer', function (newValue, oldValue) {
                if (newValue != oldValue)
                    scope.getDahkBlockages(newValue);
            });
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('dahkcollections', function () {
    return {
        restrict: 'EA',
        templateUrl: '/DAHK/GetDahkCollectionDetails',
        controller: 'DAHKCtrl',
        link: function (scope, elem, attr, ctrl) {

            scope.getDahkDetails();

            scope.$watch('dahkCustomer', function (newValue, oldValue) {
                if (newValue != oldValue)
                    scope.getDahkCollections(newValue);
            });

            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('dahkemployers', function () {
    return {
        restrict: 'EA',
        templateUrl: '/DAHK/GetDahkEmployersDetails',
        controller: 'DAHKCtrl',
        link: function (scope, elem, attr, ctrl) {
            scope.getDahkDetails();

            scope.$watch('dahkCustomer', function (newValue, oldValue) {
                if (newValue != oldValue)
                    scope.getDahkEmployers(newValue, 1);
            });

            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});
app.directive('blockingavailableamount', function () {
    return {
        restrict: 'EA',
        templateUrl: '/DAHK/BlockingAvailableAmount',
        controller: 'DAHKCtrl',
        link: function (scope, attr) {

            scope.getDahkDetails();            

            scope.$watch('dahkCustomer', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    scope.getCurrentInquestDetails(newValue, null, 0);
                    scope.accounts(newValue);
                }
            });

            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('amountavailabilitysetting', function () {
    return {
        restrict: 'EA',
        templateUrl: '/DAHK/AmountAvailabilitySetting',
        controller: 'DAHKCtrl',
        link: function (scope, attr) {

            scope.getDahkDetails();

            scope.$watch('dahkCustomer', function (newValue, oldValue) {
                if (newValue != oldValue)
                {
                    scope.getAccountFreezeDetails(newValue, null, 0);
                    scope.getFreezedAccounts(newValue);
                }
            });

            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('dahkamountstotal', function () {
    return {
        restrict: 'EA',
        templateUrl: '/DAHK/GetDahkAmountTotalsDetails',
        controller: 'DAHKCtrl',
        link: function (scope, elem, attr, ctrl) {

            scope.getDahkDetails();

            scope.$watch('dahkCustomer', function (newValue, oldValue) {
                if (newValue != oldValue)
                    scope.getDahkAmountTotals(newValue);
            });

            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('accountflowdetails', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Account/AccountFlowDetails',
        controller: ['$scope', 'accountService', 'dateFilter', function ($scope, accountService, dateFilter) {

            if ($scope.selectedAccountNumber != undefined && $scope.selectedAccountNumber != null) {
                $scope.accountNumber = $scope.selectedAccountNumber;
            }

            $scope.$watch("selectedAccountNumber", function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.accountNumber = $scope.selectedAccountNumber;
                    $scope.accountCurrency = $scope.selectedAccountCurrency;
                    $scope.getAccountFlowDetails();
                }

            });

            $scope.getAccountFlowDetails = function () {

                if ($scope.accountNumber == undefined || $scope.accountNumber == null) {
                    return;
                }
                var operDay = dateFilter($scope.$root.SessionProperties.OperationDate, 'yyyy/MM/dd');

                var Data = accountService.getAccountFlowDetails($scope.accountNumber, operDay, operDay);
                Data.then(function (acc) {
                    $scope.accountFlowDetails = acc.data;
                }, function () {
                    alert('Error getAccountFlowDetails');
                });
            };

            $scope.getAccountFlowDetails();
        }]
    };
});

app.directive('transferadditionaldataform', function () {
    return {
        restrict: 'E',
        scope: {
            transferamount: '=?',
            cashtransferdata: '=?',
            callback: '&',
            close: '&',
            dataformtype: '=?'
        },
        templateUrl: '/TransferAdditionalData/GetTransferAdditionalDataForm',
        controller: ['$scope', 'infoService', function ($scope, infoService) {

            $scope.error = [];

            $scope.transferAdditionalData = {};

            $scope.transferAdditionalData.transferAmountPurposes = [];

            $scope.closeTransferAdditionalDetailsModal = function () {
                $scope.close();
            };
            $scope.getTransferSenderLivingPlaceTypes = function () {
                var Data = infoService.getTransferSenderLivingPlaceTypes();
                Data.then(function (result) {
                    $scope.transferSenderLivingPlaceTypes = result.data;
                }, function () {
                    alert('Error getTransferSenderLivingPlaceTypes');
                });
            }

            $scope.getTransferReceiverLivingPlaceTypes = function () {
                var Data = infoService.getTransferReceiverLivingPlaceTypes();
                Data.then(function (result) {
                    $scope.transferReceiverLivingPlaceTypes = result.data;
                }, function () {
                    alert('Error getTransferReceiverLivingPlaceTypes');
                });
            }

            $scope.getTransferAmountTypes = function () {
                var Data = infoService.getTransferAmountTypes();
                Data.then(function (result) {
                    $scope.transferAmountTypes = result.data;
                }, function () {
                    alert('Error getTransferAmountTypes');
                });
            }

            $scope.getTransferAmountPurposeTypes = function () {
                var Data = infoService.getTransferAmountPurposes($scope.dataformtype);
                Data.then(function (result) {
                    $scope.transferAmountPurposeTypes = result.data;


                }, function () {
                    alert('Error getTransferAmountPurposes');
                });
            }

            $scope.addPurpose = function (purpose, amount, addInfo) {
                $scope.error = [];
                if ($scope.transferamount == undefined || $scope.transferamount == '') {
                    $scope.error.push({ Description: "Փոխանցման ընդհանուր գումարը ընտրված չէ" });
                    return;
                }
                for (var i = 0; i < $scope.transferAdditionalData.transferAmountPurposes.length; i++) {
                    if ($scope.transferAdditionalData.transferAmountPurposes[i].purposeCode == purpose.key) {
                        $scope.error.push({ Description: "Հետևյալ նպատակը ընտրված է" });
                        return;
                    }
                }
                if (amount <= 0) {
                    $scope.error.push({ Description: "Գումարը պետք է մեծ լինի 0-ից" });
                    return;
                }

                if ($scope.sumPurposeAmounts() + parseFloat(amount) > $scope.transferamount) {
                    $scope.error.push({ Description: "Ընդհանուր գումարը գերազանցում է փոխանցվող գումարի չափը" });
                    return;
                }
                if ($scope.purpose.key == 11 && ($scope.addInfo == "" || $scope.addInfo == undefined)) {
                    $scope.error.push({ Description: "Նշումը արված չէ" });
                    return;
                }
                $scope.error = [];
                $scope.transferAdditionalData.transferAmountPurposes.push({ purposeCode: purpose.key, description: purpose.value, amount: amount, addInfo: addInfo });
                $scope.purposeAmount = "";
            }

            $scope.deletePurpose = function () {
                $scope.transferAdditionalData.transferAmountPurposes.splice($scope.selectedRow, 1);
            }
            $scope.save = function () {
                $scope.error = [];
                if ($scope.transferAdditionalData.transferAmountPurposes.length == 0) {
                    $scope.error.push({ Description: "Նպատակ ընտրված չէ" });
                    return;
                }

                if ($scope.sumPurposeAmounts() < $scope.transferamount) {
                    $scope.error.push({ Description: "Գումարը ամբողջությամբ լրացված չէ" });
                    return;
                }

                $scope.transferAdditionalData.dataformtype = $scope.dataformtype;
                $scope.callback({ transferAdditionalData: $scope.transferAdditionalData });
            }

            $scope.setClickedRow = function (index) {
                $scope.selectedRow = index;
            };

            $scope.sumPurposeAmounts = function () {
                var totalAmount = 0;
                for (var i = 0; i < $scope.transferAdditionalData.transferAmountPurposes.length; i++) {
                    totalAmount += parseFloat($scope.transferAdditionalData.transferAmountPurposes[i].amount);
                }
                return totalAmount;
            }

        }
        ]
        ,
        link: function (scope) {
            $(".modal-dialog").draggable();
            if (scope.cashtransferdata != null) {
                scope.transferAdditionalData = scope.cashtransferdata;

            }
        }
    };
});


app.directive('transferadditionaldatadetails', function () {
    return {
        restrict: 'E',
        templateUrl: '/TransferAdditionalData/GetTransferAdditionalDataDetails',
        controller: ['$scope', function ($scope) {

        }]
    };
});


var secretEmptyKey = '[$empty$]';
app.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function (value) {
                if (value === true) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
}]);
app.directive('emptyTypeahead', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            // this parser run before typeahead's parser
            modelCtrl.$parsers.unshift(function (inputValue) {
                var value = (inputValue ? inputValue : secretEmptyKey); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
                modelCtrl.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
                return value;
            });

            // this parser run after typeahead's parser
            modelCtrl.$parsers.push(function (inputValue) {
                return inputValue === secretEmptyKey ? '' : inputValue; // set the secretEmptyKey back to empty string
            });
        }
    }
});
app.directive('notificationpanel', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Orders/NotificationPanel',
    };
});



app.directive('pensionapplications', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PensionApplication/PensionApplications',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('customerlinkedpersons', function () {
    return {
        restrict: 'EA',
        templateUrl: '../Customer/GetCustomerLinkedPersons'
    };
});


app.directive('curnominalform', function () {
    return {
        restrict: 'E',
        scope: {
            currency: '=?',
            callback: '&',
            close: '&',
        },
        templateUrl: '/PaymentOrder/GetCurNominalForm',
        controller: ['$scope', 'infoService', function ($scope, infoService) {
            $(".modal-dialog").draggable();
            $scope.getCurNominals = function (currency) {
                var Data = infoService.getCurNominals(currency);
                Data.then(function (curNominals) {

                    $scope.curNominals = curNominals.data;

                    for (var i = 0; i < $scope.curNominals.length; i++) {
                        $scope.curNominals[i].count = 0;
                        if (currency == 'AMD' && $scope.curNominals[i].Key == 25) {
                            $scope.curNominals[i].Key = 20;
                        }
                    }
                }, function () {
                    alert('getCurNominals Error');
                });
            }
            $scope.getCurNominalTotal = function (curNom, count) {
                if (count == undefined) {
                    return '';
                }
                return parseInt(curNom) * parseInt(count);
            }
            $scope.error = [];
            $scope.closeTransferAdditionalDetailsModal = function () {
                $scope.close();
            };
            $scope.save = function () {
                $scope.callback({ amount: $scope.totalAmount });
            }
            $scope.totalAmount = 0;
            $scope.updateTotalAmount = function () {
                $scope.totalAmount = 0;
                for (var i = 0; i < $scope.curNominals.length; i++) {
                    if ($scope.curNominals[i].count == undefined)
                        continue;
                    $scope.totalAmount += parseInt($scope.curNominals[i].Key) * parseInt($scope.curNominals[i].count);
                }
            }

            $scope.setClickedRow = function (index) {
                $scope.selectedRow = index;
            }

        }

        ]
    };
});

app.directive('whenScrolled', function () {
    return function (scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function () {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});


app.directive('cardtariffcontracts', function () {
    return {
        restrict: 'EA',
        templateUrl: '/CardTariffContract/CustomerCardTariffContracts',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideblank = hideBlank;
        }
    };
});

app.directive('customerposlocations', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PosLocation/CustomerPosLocations',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideblank = hideBlank;
        }
    };
});


app.directive('periodicswiftstatementorder', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PeriodicOrder/PersonalPeriodicSwiftStatementOrder',

    };
});


app.directive('insurances', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Insurance/Insurances',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideblank = hideBlank;
        }
    };
});


app.directive('maskTime', function () {
    return {
        restict: 'EA',
        link: function (scope, elem) {
            elem.mask('99:99', { placeholder: ' ' });
        }
    };
});

app.directive('hbapplication', function () {
    return {
        restrict: 'EA',
        templateUrl: '/HBApplicationOrder/HBApplication',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideblank = hideBlank;
        }
    };
});

app.directive('xbusergroups', function () {
    return {
        scope: {
            schema: '=',
            hbusers: '=',
            hbapplicationquality: '='
        },
        controller: ['$scope', function ($scope) {

        }],
        restrict: 'EA',
        templateUrl: '/XBUserGroup/XBUserGroups',

    };
});


app.directive('xbusergroupremove', function () {
    return {
        restrict: 'EA',
        templateUrl: '/XBUserGroup/XBUserGroupRemove',

    };
});


app.directive('xbusersset', function () {
    return {

        //scope: {
        //    hbusers: '=',
        //    group: '='
        //},
        //controller: ['$scope', function ($scope) {

        //}],

        restrict: 'EA',
        templateUrl: '/XBUserGroup/XBUsersSet',

    };
});

app.directive('approvementschema', function () {
    return {
        restrict: 'EA',
        templateUrl: '/ApprovementSchema/ApprovementSchema',

    };
});


app.directive('xbusergroup', function () {
    return {
        restrict: 'EA',
        templateUrl: '/XBUserGroup/XBUserGroup',

    };
});

app.directive('approvementschemadetails', function () {
    return {
        restrict: 'EA',
        templateUrl: '/ApprovementSchema/ApprovementSchemaDetails',

    };
});

app.directive('givenguaranteereductions', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Guarantee/GivenGuaranteeReductions',
        scope: {
            productid: '='
        }
    };
});


app.directive('onecustomernotes', function () {
    return {
        restrict: 'EA',
        templateUrl: '/CustomersNotes/OneCustomerNotes',

    };
});

app.directive('plasticcardorder', function () {
    return {
        restrict: 'E',
        templateUrl: '/PlasticCardOrder/PlasticCardOrder',
        controller: 'PlasticCardCtrl'
    };
});

app.directive('loanproductclassifications', function () {
    return {
        restrict: 'EA',
        scope: {
            products: '='
        },
        templateUrl: '/LoanProductClassification/LoanProductClassificationDetails',
        controller: 'LoanProductClassificationCtrl'
    };
});



app.directive('cardactivationinarcadetails', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Card/CardActivationInArCaDetails',
        scope: {
            cardnumber: '=',
        },
    };
});


app.directive('accountadditionaldetails', function () {
    return {
        restrict: 'EA',
        scope: {
            accountnumber: '=',
            ordertype: '=?',
        },
        templateUrl: '/Account/AccountAdditionalDetails',
        controller: ['$scope', 'accountService', function ($scope, accountService) {



            $scope.$watch('accountnumber', function (newValue, oldValue) {

                if ($scope.accountnumber != undefined) {
                    $scope.getAccountAdditionalDetails();
                }

            });


            $scope.getAccountAdditionalDetails = function () {
                var Data = accountService.getAccountAdditionalDetails($scope.accountnumber);
                Data.then(function (acc) {
                    $scope.additionalDetails = acc.data;
                    $scope.hasStatementDeliveryType = false;
                    if ($scope.ordertype != undefined && $scope.ordertype == 133) {
                        var deletedIndex = [];
                        for (var i = 0; i < $scope.additionalDetails.length; i++) {
                            if ($scope.additionalDetails[i].AdditionType != 2) {
                                deletedIndex.push(i);
                            }
                        }
                        for (var i = deletedIndex.length - 1; i >= 0; i--) {
                            $scope.additionalDetails.splice(deletedIndex[i], 1);
                        }
                    }
                    else {
                        for (var i = 0; i < $scope.additionalDetails.length; i++) {
                            if ($scope.additionalDetails[i].AdditionType == 5 && $scope.additionalDetails[i].Id != 0) {
                                $scope.additionalDetails.splice(i, 1);
                            }
                        }
                    }


                }, function () {
                    alert('Error getAccount');
                });
            };


        }]
    };
});

app.directive('goodsdetails', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Loan/GoodsDetails',
    };
});


app.directive('customermergeapplicationform', function () {


    return {
        restrict: 'E',
        templateUrl: '/PrintDocuments/CustomerMergeApplicationForm',
        controller: 'PrintDocumentsCtrl'
    };
});



app.directive('phonebankingcontractorder', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PhoneBankingContractOrder/PhoneBankingContractOrder',

    };
});

app.directive('loanApplications', function () {
    return {
        restrict: 'EA',
        templateUrl: '/LoanApplication/LoanApplications',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});



app.directive('loanapplicationdetails', function () {
    return {
        restrict: 'EA',
        scope: {
            docid: '=',
            getbydocid: '='
        },
        templateUrl: '/LoanApplication/LoanApplicationDetails'
    };
});

app.directive('loanmonitoring', function () {
    return {
        restrict: 'EA',
        scope: {
            loan: '='
        },
        templateUrl: '/LoanMonitoringConclusion/LoanMonitorings'

    };
});

app.directive('preorderdetailshistory', function () {
    return {
        restrict: 'EA',
        scope: {
            preordertype: '='
        },
        templateUrl: '/PreOrder/PreOrderDetailsHistory'
    };
});

app.directive('creditshereandnow', function () {
    return {
        restrict: 'EA',
        templateUrl: '/CreditHereAndNow/CreditsHereAndNow'
    };


});


app.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return val != null ? parseInt(val, 10) : null;
            });
            ngModel.$formatters.push(function (val) {
                return val != null ? '' + val : null;
            });
        }
    };
});


app.directive('classifiedloans', function () {
    return {
        restrict: 'EA',
        templateUrl: '/ClassifiedLoan/ClassifiedLoans'
    };
});


app.directive('currencyexchangeorder', function () {
    return {
        restrict: 'E',
        templateUrl: '/CurrencyExchangeOrder/PersonalCurrencyExchangeOrder',
    };
});



app.directive('productnotificationconfigurations', function () {
    return {
        restrict: 'EA',
        scope: {
            productid: '=',
            producttype: '=?',
            informationtype: '=?',
            customernumber: '='
        },
        templateUrl: '/ProductNotificationConfigurationsOrder/ProductNotificationConfigurations'
    };
});

app.directive('labelsRequiredAlways', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.find('div.form-group').each(function (i, formGroup) {
                var formControls = $(formGroup).find('input, select, textarea');

                if (0 !== formControls.length && (undefined !== $(formControls[0]).attr('required'))) {

                    jLabel = $(formGroup).find('label');
                    jLabel.html(jLabel.html() + "<span class='redStyle'>*</span>");
                }
            })
        }
    }
});

app.directive('loanequipments', function () {
    return {
        restrict: 'EA',
        templateUrl: '/LoanEquipments/LoanEquipments'
    }
});

app.directive('bonds', function () {
    return {
        restrict: 'EA',
        templateUrl: '/Bond/Bonds',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideBlank = hideBlank;
        }
    };
});

app.directive('customertransitaccounts', function () {
    return {
        restrict: 'EA',
        scope: {
            hideBlank: '@',
            forTransitAccounts: '=?'
        },
        templateUrl: '/Account/Accounts'
    };
});

app.directive('orderoppersondetails', function () {
    return {
        restrict: 'EA',
        scope: {
            opperson: '='
        },
        templateUrl: '/Orders/OrderOPPersonDetails'
    };
});


app.directive('depositaryaccount', function () {
    return {
        restrict: 'EA',
        templateUrl: '/DepositaryAccount/DepositaryAccount',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideblank = hideBlank;
        }
    };
});

app.directive('virtualcards', function () {
	return {
		restrict: 'EA',

		scope: {
			productid: '='
		},
		templateUrl: '/Card/VirtualCards'
	};
});


app.directive('reasonforouttransfer', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PaymentOrder/ReasonForOutTransfer',
        scope: {
            reasonid: '=?',
            reasoniddescription: '=?',
            formname: '=' //ֆորմայի անունը որում գտնվում է դիրեկտիվան
        },

        controller: ['$scope', 'infoService', function ($scope, infoService) {


            $scope.getTypeofPaymentReasonAboutOutTransfering = function () {
                var Data = infoService.getTypeofPaymentReasonAboutOutTransfering();
                Data.then(function (acc) {

                    $scope.typeofPaymentReasonAboutOutTransfering = acc.data;
                }, function () {
                    alert('Error getTypeofPaymentReasonAboutOutTransfering');
                });
            };
        }]
    };
});

app.directive('cardordercustomer', function () {
    return {
        restrict: 'EA',
        scope: {
            opperson: '=',
            formname: '=',
            ordertype: '='
        },
        templateUrl: '/PlasticCardOrder/PlasticCardOrderCustomer',
        controller: ['$scope', '$element', '$uibModal', 'customerService', 'plasticCardService', function ($scope, $element, $uibModal, customerService, plasticCardService) {
            $scope.opperson = {};
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
                $scope.searchCustomersModalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                });
            };
            $scope.getSearchedCustomer = function (customer) {
                $scope.getCustomer(customer.customerNumber);
                $scope.closeSearchCustomersModal();
            }
            $scope.closeSearchCustomersModal = function () {
                $scope.searchCustomersModalInstance.close();
            }
            $scope.$watch('opperson.CustomerNumber', function () {
                if (typeof $scope.opperson.CustomerNumber !== 'undefined') {
                    $scope.$parent.plasticCardOrder.cardHolderCustomerNumber = $scope.opperson.CustomerNumber;
                }
            });
            $scope.getCustomer = function (customerNumber) {
                $scope.cardSMSPhones = [];
                var Data = customerService.getCustomer(customerNumber);
                Data.then(function (cust) {

                    $scope.opperson = {};
                    $scope.customer = cust.data;
                    if ($scope.customer.IdentityID != 0) {
                        if ($scope.customer.CustomerType == 6 && $scope.customer.Quality != 43) {
                            $scope.opperson.CustomerNumber = $scope.customer.CustomerNumber;
                            //$scope.opperson.PersonName = $scope.customer.FirstName;
                            //$scope.opperson.PersonLastName = $scope.customer.LastName;
                            $scope.opperson.PersonNameEng = $scope.customer.FirstNameEng;
                            $scope.opperson.PersonLastNameEng = $scope.customer.LastNameEng;
                            $scope.opperson.PersonDocument = $scope.customer.DocumentNumber + ", " + $scope.customer.DocumentGivenBy + ", " + $scope.customer.DocumentGivenDate;
                            $scope.opperson.PersonSocialNumber = $scope.customer.SocCardNumber;
                            $scope.opperson.PersonNoSocialNumber = $scope.customer.NoSocCardNumber;
                            //$scope.opperson.PersonAddress = $scope.customer.RegistrationAddress;
                            if ($scope.customer.RegistrationAddress !== "") {
                                var PersonAddressEng = plasticCardService.GetCustomerAddressEng(customerNumber);
                                PersonAddressEng.then(function (addressEng) {
                                    $scope.$parent.plasticCardOrder.adrressEngTranslated = addressEng.data;
                                })
                            }

                            if ($scope.customer.PhoneList != undefined) {
                                $scope.customer.PhoneList.forEach(function (phone) {
                                    if (phone.phoneType.key === 1) {
                                        $scope.cardSMSPhones.push({ id: phone.phone.id, phone: ((phone.phone.countryCode.slice(1) == "374") ? "" : "00") + phone.phone.countryCode.slice(1) + phone.phone.areaCode + phone.phone.phoneNumber });
                                    }
                                });
                                $scope.cardSMSPhones.splice(0, 0, { id: 0, phone: "" });
                            }
                            if ($scope.customer.EmailList != undefined) {
                                $scope.reportReceivingEmails = $scope.customer.EmailList;
                                $scope.reportReceivingEmails.splice(0, 0, "");
                            }

                            var birthDate = $scope.customer.BirthDate;
                            var dateTmp = moment(birthDate);
                            var sec = dateTmp._d.setHours(dateTmp._d.getHours() - dateTmp._d.getTimezoneOffset() / 60);
                            $scope.opperson.PersonBirth = moment(sec).format("DD/MM/YY");

                            $scope.opperson.PersonResidence = $scope.customer.Residence;
                            $scope.getCustomerDocumentWarnings($scope.customer.CustomerNumber);
                        }
                        else {
                            if ($scope.customer.Quality == 43)
                                ShowMessage('Չի կարող լինել կրկնակի հաճախորդ:', 'error');
                            else
                                ShowMessage('Պետք է լինի ֆիզիկական անձ:', 'error');
                            $scope.opperson = undefined;
                        }
                    }
                    else {
                        $scope.opperson = undefined;
                    }
                }, function () {
                    alert('Error getCustomer');
                });

                if ($scope.$parent.$parent.ordertype == 212) {
                    var Data = customerService.getCustomer($scope.authorizedCustomerNumber);
                    Data.then(function (cust) {
                        if (cust.data.PhoneList != undefined) {
                            cust.data.PhoneList.forEach(function (phone) {
                                if (phone.phoneType.key === 1) {
                                    $scope.cardSMSPhones.push({ id: phone.phone.id, phone: ((phone.phone.countryCode.slice(1) == "374") ? "" : "00") + phone.phone.countryCode.slice(1) + phone.phone.areaCode + phone.phone.phoneNumber });
                                }
                            });
                        }
                    }, function () {
                        alert('Error getCustomer');
                    });
                }
            };
            $scope.getAuthorizedCustomerNumber = function () {
                var Data = customerService.getAuthorizedCustomerNumber();
                Data.then(function (cust) {
                    $scope.authorizedCustomerNumber = cust.data;
                    if ($scope.opperson != undefined && $scope.opperson.CustomerNumber != undefined) {
                        $scope.getCustomerDocumentWarnings($scope.opperson.CustomerNumber);
                    }
                }, function () {
                    alert('Error getAuthorizedCustomerNumber');
                });
            };
            $scope.getAuthorizedCustomerNumber();
            $scope.getCustomerDocumentWarnings = function (customerNumber) {
                if ($scope.authorizedCustomerNumber != customerNumber) {
                    var Data = customerService.getCustomerDocumentWarnings(customerNumber);
                    Data.then(function (ord) {
                        $scope.warnings = ord.data;
                    },
                        function () {
                            alert('Error CashTypes');
                        });
                } else
                    $scope.warnings = undefined;
            };
        }
        ]
    };
});

app.directive('hbAccountflowdetails', function () {
    return {
        restrict: 'EA',
        templateUrl: '/HBDocuments/HBAccountFlowDetails',
        controller: ['$scope', 'accountService', 'dateFilter', function ($scope, accountService, dateFilter) {

            if ($scope.selectedAccountNumber != undefined && $scope.selectedAccountNumber != null) {
                $scope.accountNumber = $scope.selectedAccountNumber;
            }

            $scope.$watch("selectedAccountNumber", function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.accountNumber = $scope.selectedAccountNumber;
                    $scope.accountCurrency = $scope.selectedAccountCurrency;
                    $scope.getAccountFlowDetails();
                }

            });

            $scope.getAccountFlowDetails = function () {

                if ($scope.accountNumber == undefined || $scope.accountNumber == null) {
                    return;
                }
                var operDay = dateFilter($scope.$root.SessionProperties.OperationDate, 'yyyy/MM/dd');

                var Data = accountService.getAccountFlowDetails($scope.accountNumber, operDay, operDay);
                Data.then(function (acc) {
                    $scope.accountFlowDetails = acc.data;
                }, function () {
                    alert('Error getAccountFlowDetails');
                });
            };

            $scope.getAccountFlowDetails();
        }]
    };
});

app.directive('loandigitalcontractdetails', function () {
    return {
        restrict: 'EA',
        transclude: true,
        template: `
                    <div ng-show="show" class="product-detail-cell product-detail-lable" ng-bind-html="label"></div>
                    <div ng-show="show" class="product-detail-cell product-detail-value" ng-init="getLoanDigitalContractStatus(productid)">{{description}} {{qualityDate}}</div>
                `,
        scope: {
            productid: '=',
            source: '='
        },
        link: function (scope, element, attr) {
            element.addClass('product-detail-row');
        },
        controller: ['$scope', 'loanService', function ($scope, loanService) {
            $scope.show = false;
            $scope.getLoanDigitalContractStatus = function (productId) {
                if ($scope.source == 1) { //LoanDetails
                    $scope.label = `&nbsp;&nbsp;&nbsp;&nbsp;Թվային պայմանագրերի կարգավիճակը`;
                }
                else if ($scope.source == 2) { // CreditLineDetails
                    $scope.label = `Թվային պայմանագրերի կարգավիճակը`;
                }
                var Data = loanService.GetLoanDigitalContractStatus(productId);
                Data.then(function (acc) {
                    if (acc.data.status != undefined && acc.data.status != 0) {
                        $scope.status = acc.data.status;
                        $scope.description = acc.data.name;
                        $scope.qualityDate = acc.data.date;
                        $scope.show = true;
                    }
                }, function (acc) {
                        alert('Error getLoanDigitalContractStatus');
                });
            };
        }]
    };
});

app.directive('receivedfasttransferarusorder', function () {
    return {
        restrict: 'E',
        templateUrl: '/ReceivedFastTransferPaymentOrder/ARUSReceivedFastTransferOrder',
        controller: 'ARUSReceivedFastTransferOrderCtrl'
    };
});

app.directive('arusfasttransferorder', function () {
    return {
        restrict: 'E',
        templateUrl: '/FastTransferPaymentOrder/ARUSFastTransferOrder',
        controller: 'ARUSFastTransferOrderCtrl'
    };
});

app.directive('pensionPaymentOrder', function () {
    return {
        restrict: 'EA',
        templateUrl: '/PensionPaymentOrder/PensionPaymentOrder',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideblank = hideBlank;
        }
    };
});

app.directive('cardretainhistory', function () {
    return {
        restrict: 'EA',
        scope: {
            cardnumber: '='
        },
        templateUrl: '/Card/CardRetainHistory',
        controller: 'CardCtrl'
    };
});

app.directive('safekeepingitemview', function () {
    return {
        restrict: 'EA',
        templateUrl: '/SafekeepingItem/SafekeepingItems',
        link: function (scope, elem, attr, ctrl) {
            var hideBlank = attr.hideBlank;
            scope.hideblank = hideBlank;
        }
    };
});


