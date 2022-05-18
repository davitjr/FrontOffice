var app = angular.module('FrontOffice', ['ui.router', 'angularModalService', 'localytics.directives', 'ui.bootstrap', 'ngMessages', 'ui.grid', 'ui.grid.selection', 'ui.grid.cellNav', 'directive.contextMenu', 'ncy-angular-breadcrumb', 'angular-confirm', 'dialogService', 'searchCustomerControl', 'searchCashierControl', 'searchCardControl', 'SearchSwiftCodeControl', 'searchAccountControl', 'flow', 'fcsa-number', 'ngSanitize', 'ui.select', 'angular.filter', 'SearchInternationalTransferControl', 'SearchReceivedTransferControl', 'SearchTransferBankMailControl', 'SearchBudgetAccountControl', 'searchLeasingControl', 'ui.tree', 'SearchDAHKControl', 'angular-img-cropper', 'SearchRemittanceControl', 'RemittanceDetailsControl', 'RemittanceFeeInuqiryControl']);
app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false);
}]);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('sessionExpireChecker');
    $httpProvider.useApplyAsync(true);
}]);

app.config(['fcsaNumberConfigProvider', function (fcsaNumberConfigProvider) {
    fcsaNumberConfigProvider.setDefaultOptions({
        maxDecimals: 2,
        min: 0
    });
}]);

app.config(['uiSelectConfig', function (uiSelectConfig) {
    uiSelectConfig.theme = 'selectize';
    uiSelectConfig.searchEnabled = true;
}]);

app.factory('sessionExpireChecker', ['$q', '$injector', function ($q, $injector) {

    var sessionChecker = {
        // Add authorization token to headers
        request: function (config) {
            config.headers = config.headers || {};

            var data = sessionStorage.getItem('sessionId');

            if (data != undefined) {
                config.headers['SessionId'] = data;
            }
            // var rootscope = $injector.get("$rootScope");
            //  if (rootscope.sessionGuid != undefined)
            //   {
            //       config.headers.Authorization = rootscope.sessionGuid;
            //  }


            return config;
        },
        responseError: function (response) {
            if (response.status == 419 || response.status == 420 || response.status == 421 || response.status == 423 || response.status == 424) {  // Session is timed out
                if (response.status != 424)
                    hideloading();

                var modal = $injector.get("$uibModal");
                if (response.status == 419) {

                    modal.open({
                        templateUrl: '/Login/SessionExpiredDialog',
                        keyboard: false,
                        controller: 'LoginCtrl',
                        backdrop: 'static',
                        size: ''
                    });
                }
                else if (response.status == 421) {
                    modal.open({
                        templateUrl: '/Login/ProductPermissionDeniedDialog',
                        keyboard: false,
                        controller: 'LoginCtrl',
                        backdrop: 'static',
                        size: ''
                    });
                }
                else if (response.status == 424) {
                    modal.open({
                        templateUrl: '/Login/TimeZoneProblemDialog',
                        keyboard: false,
                        controller: 'LoginCtrl',
                        backdrop: 'static',
                        size: ''
                    });
                }
                else if (response.status == 423) {
                    modal.open({
                        templateUrl: '/Login/ActionPermissionDeniedDialog',
                        keyboard: false,
                        controller: 'LoginCtrl',
                        backdrop: 'static',
                        size: ''
                    });
                }
                else {

                    modal.open({
                        templateUrl: '/Login/OpenSmsAuthorization',
                        keyboard: false,
                        backdrop: 'static',
                        controller: 'LoginCtrl',
                        size: ''
                    });
                    return $q.reject(response);
                }

                var defer = $q.defer();
                return defer.promise;
            }

            return $q.reject(response);
        }
    }

    return sessionChecker;
}]);

app.factory('leasingFactory', function () {
    return {
        rootCtrlScope: null,
        LeasingInsuranceId: 0,
        LeasingInsuranceAmount: 0,
    };
});

app.config(['$breadcrumbProvider', function ($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        template: '<div class="page_bradcramp" style= "border-bottom:none;"><div class="page_bradcramp_inner"> ' +
            ' <img src="/Content/Images/ico_15.png"><div class="page_bradcramp_item"> ' +
            '	<a href=""> ' +
            '		Գլխավոր >> ' +
            '	</a> ' +
            '</div> ' +
            '<div ng-repeat="step in steps" class="page_bradcramp_item"> ' +
            '	<a href=""> ' +
            '		{{step.ncyBreadcrumbLabel}} ' +
            '	</a> ' +
            '</div> ' +
            '	<div class="clearfix"></div> ' +
            '</div> ' +
            '</div>'

    });

}]);


// դրամարկղի կառավարման նոր էջ    

app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('cashierTransactions',
            {
                url: '/cashierTransactions',
                templateUrl: '/CashierTransactions/CashierTransactions.cshtml',
                controller: 'CashierTransactionsCntr'
            }
        )
}
])


app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('main',
            {
                url: '/main',
                templateUrl: 'Home/MainPage',
                ncyBreadcrumb: {
                    label: ' '
                },
            })
        .state('allcards',
            {
                url: '/allcards',
                templateUrl: 'Card/Cards',
                ncyBreadcrumb: {
                    label: ' '
                },
            })
        .state('accountdetails',
            {
                url: "/accountdetails",
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Հաշիվներ >> Հաշվի տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    selectedAccount: null,
                    account: null


                },
                templateUrl: '/Account/AccountDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.selectedAccount == null && $stateParams.account == null) {
                            $scope.selectedAccount = sessionStorage.getItem('account');
                            $scope.account = JSON.parse(sessionStorage.getItem('closedaccount'));
                        } else {
                            $scope.selectedAccount = $stateParams.selectedAccount;
                            $scope.account = $stateParams.account;
                            sessionStorage.setItem('account', $stateParams.selectedAccount);
                            sessionStorage.setItem('closedaccount', JSON.stringify($stateParams.account));
                        }
                    }
                ]
            })
        .state('accountstatement',
            {
                url: "/accountstatement",
                params: {
                    accountNumber: null
                },
                templateUrl: '/Account/AccountStatement',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        $scope.accountNumber = $stateParams.accountNumber;
                    }
                ]
            })
        .state('periodicdetails',
            {
                url: "/periodicdetails",
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >> Պարբերական փոխանցումներ >> Պարբերական փոխանցման տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    productId: null,
                    closedPeriodic: null
                },
                templateUrl: '/PeriodicTransfer/PeriodicTransferDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {

                        if ($stateParams.productId == null && $stateParams.closedPeriodic == null) {
                            $scope.productId = sessionStorage.getItem('periodictransfer');
                            $scope.periodic = JSON.parse(sessionStorage.getItem('closedPeriodic'));

                        } else {
                            $scope.productId = $stateParams.productId;
                            $scope.periodic = $stateParams.closedPeriodic;
                            sessionStorage.setItem('periodictransfer', $stateParams.productId);
                            sessionStorage.setItem('closedPeriodic', JSON.stringify($stateParams.closedPeriodic));
                        }
                    }
                ]
            })
        .state('depositdetails',
            {
                url: "/depositdetails",
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ավանդներ >> Ավանդի տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    productId: null,
                    deposit: null,
                },
                templateUrl: 'Deposit/DepositDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        if ($stateParams.productId == null && $stateParams.deposit == null) {
                            $scope.productId = sessionStorage.getItem('depositId');
                            $scope.deposit = JSON.parse(sessionStorage.getItem('deposit'));
                        } else {
                            $scope.productId = $stateParams.productId;
                            $scope.deposit = $stateParams.deposit;
                            sessionStorage.setItem('depositId', $stateParams.productId);
                            sessionStorage.setItem('deposit', JSON.stringify($stateParams.deposit));
                        }
                    }
                ]
            })
        .state('newdeposit',
            {
                url: "/newdeposit",
                templateUrl: 'DepositOrder/PersonalDepositOrder',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ավանդներ >> Ավանդի հայտի մուտքագրում' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        $scope.selectedDeposit = $stateParams.selectedDeposit;
                    }
                ]
            })
        .state('newBrokerContract',
            {
                url: "/newBrokerContract",
                templateUrl: 'BrokerContractOrder/BrokerContractOrder'
            })
        .state('terminatedepositdetails',
            {
                url: "/terminatedepositdetails",
                params: {
                    selectedDeposit: null
                },
                templateUrl: 'Deposit/TerminateDepositDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {

                        $scope.selectedDeposit = $stateParams.selectedDeposit;
                    }
                ]
            })
        .state('phoneBanking',
            {
                url: '/phoneBanking',
                templateUrl: 'PhoneBanking/Index'
            })
        .state('cardDetails',
            {
                url: "/cardDetails",
                params: {
                    productId: null,
                    closedCard: null
                },
                templateUrl: 'Card/CardDetails',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Քարտեր >> Քարտի տվյալներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null && $stateParams.closedCard != null) {

                            $scope.card = $stateParams.closedCard;
                            sessionStorage.setItem('card', $stateParams.productId);
                            sessionStorage.setItem('closedcard', JSON.stringify($stateParams.closedCard));
                            $scope.productId = sessionStorage.getItem('card');
                            //$scope.card = JSON.parse(localStorage.getItem('closedcard'));
                        } else {
                            $scope.productId = $stateParams.productId;
                            $scope.card = $stateParams.closedCard;
                            if ($scope.productId == undefined) {
                                $scope.productId = sessionStorage.getItem('card');
                            } else {
                                sessionStorage.setItem('card', $stateParams.productId);
                                sessionStorage.setItem('closedcard', JSON.stringify($stateParams.closedCard));
                            }


                        }
                    }
                ]
            })
        .state('loanDetails',
            {
                url: "/loanDetails",
                params: {
                    productId: null,
                    closedLoan: null
                },
                templateUrl: '/Loan/LoanDetails',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Վարկեր  >>Վարկի տվյալներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null && $stateParams.closedLoan == null) {
                            $scope.productId = sessionStorage.getItem('loan');
                            if ($scope.productId == null) {
                                $scope.productId = $scope.$root.SessionProperties.LoanProductId;
                            }
                            $scope.loan = JSON.parse(sessionStorage.getItem('closedloan'));
                        } else {
                            $scope.productId = $stateParams.productId;
                            $scope.loan = $stateParams.closedLoan;
                            sessionStorage.setItem('loan', $stateParams.productId);
                            sessionStorage.setItem('closedloan', JSON.stringify($stateParams.closedLoan));
                        }
                    }
                ]
            })
        .state('utilityType',
            {
                url: '/utilityType',
                templateUrl: '/UtilityPayment/UtilityPaymentTypes',
                ncyBreadcrumb: {
                    label: 'Փոխանցումներ >> Կոմունալ վճարումներ' // angular-breadcrumb's configuration
                }
            })
        .state('utilityPayment',
            {
                url: '/utilityPayment',

                params: {
                    utilityType: null,
                    abonentNumber: null,
                    branch: null

                },
                templateUrl: '/UtilityPayment/UtilityPaymentOrder',
                ncyBreadcrumb: {
                    label: 'Կոմունալ վճարման հայտ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        $scope.utilityType = $stateParams.utilityType;
                        $scope.abonentNumber = $stateParams.abonentNumber;
                        $scope.branch = $stateParams.branch;
                    }
                ]
            })
        .state('searchUtilityPayment',
            {
                url: "/searchUtilityPayment",
                templateUrl: '/UtilityPayment/UtilityPaymentSearch',
                params: {
                    utilityType: null,
                    nonauthorizedcustomer: 'false',
                    isreestr: null
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id

                        if ($stateParams.nonauthorizedcustomer == null) {
                            $scope.nonauthorizedcustomer = sessionStorage.getItem('nonauthorizedcustomer');
                        } else {
                            $scope.nonauthorizedcustomer = $stateParams.nonauthorizedcustomer;
                            sessionStorage.setItem('nonauthorizedcustomer', $stateParams.nonauthorizedcustomer);
                        }

                        if ($stateParams.utilityType == null) {
                            $scope.utilityType = sessionStorage.getItem('utilityType');
                        } else {
                            $scope.utilityType = $stateParams.utilityType;
                            sessionStorage.setItem('utilityType', $stateParams.utilityType);
                        }

                        if ($stateParams.isreestr == null) {
                            $scope.isreestr = sessionStorage.getItem('isreestr');
                        } else {
                            $scope.isreestr = $stateParams.isreestr;
                            sessionStorage.setItem('isreestr', $stateParams.isreestr);
                        }
                        if ($scope.utilityType == 15) {
                            $scope.utilityType = 14;
                        } else
                            $scope.isreestr = null;

                    }
                ],
                ncyBreadcrumb: {
                    label:
                        'Փոխանցումներ >> Կոմունալ վճարումներ >> Կոմունալ վճարման որոնում' // angular-breadcrumb's configuration
                }
            })
        .state('Orders',
            {
                url: '/Orders',
                templateUrl: '/Orders/Index',
                params: {
                    utilityType: null,
                    nonauthorizedcustomer: null
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id

                        if ($scope.$root.SessionProperties.IsNonCustomerService) {
                            $scope.nonauthorizedcustomer = 'true';
                        } else {
                            $scope.nonauthorizedcustomer = 'false';
                        }
                    }
                ],

                ncyBreadcrumb: {
                    label: 'Գործարքներ' // angular-breadcrumb's configuration
                }
            })
        .state('PrintDocuments',
            {
                url: '/PrintDocuments',
                templateUrl: 'PrintDocuments/GetDocumentsList',
                ncyBreadcrumb: {
                    label: 'Փաստաթղթեր' // angular-breadcrumb's configuration
                }
            })
        .state('transfersByCall',
            {
                url: '/transfersByCall',
                templateUrl: '/TransferByCall/TransfersByCallFilter',
                ncyBreadcrumb: {
                    label: 'Հեռախոսազանգով փոխանցումներ' // angular-breadcrumb's configuration
                }

            })
        .state('newTransferByCall',
            {
                url: "/newTransferByCall",
                templateUrl: '/TransferByCall/PersonalTransferByCall',
                ncyBreadcrumb: {
                    label: 'Հեռախոսազանգով փոխանցումներ >> Նոր հեռախոսազանգ' // angular-breadcrumb's configuration
                }

            })
        .state('transferDetails',
            {
                url: "/transferDetails",
                ncyBreadcrumb: {
                    label: 'Հեռախոսազանգով փոխանցումներ >> Փոխանցման տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    selectedID: null
                },
                templateUrl: '/TransferByCall/TransferByCallDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {

                        $scope.selectedID = $stateParams.selectedID;
                    }
                ]
            })
        .state('SearchOrders',
            {
                url: '/SearchOrders',
                templateUrl: '/Orders/SearchOrders'
            })
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about',
            {
                // we'll get to this in a bit       

            })
        .state('allProducts',
            {
                url: '/allProducts',
                templateUrl: '/PhoneBanking/Index',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Բոլոր պրոդուկտները' // angular-breadcrumb's configuration
                }
            })
        .state('currentAccounts',
            {
                url: '/currentAccounts',
                templateUrl: '/Account/Accounts',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ընթացիկ հաշիվներ' // angular-breadcrumb's configuration
                }
            })
        .state('currentTransitAccounts',
            {
                url: '/currentTransitAccounts',
                templateUrl: '/Account/Accounts',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ընթացիկ հաշիվներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        $scope.forTransitAccounts = true;
                    }
                ],
            })
        .state('cards',
            {
                url: '/cards',
                templateUrl: '/Card/Cards',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Քարտեր' // angular-breadcrumb's configuration
                }
            })
        .state('loanApplications',
            {
                url: '/loanApplications',
                templateUrl: '/LoanApplication/LoanApplications',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Վարկային դիմումներ' // angular-breadcrumb's configuration
                }
            })
        .state('deposits',
            {
                url: '/deposits',
                templateUrl: '/Deposit/Deposits',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ավանդներ' // angular-breadcrumb's configuration
                }
            })
        .state('loans',
            {
                url: '/loans',
                templateUrl: '/Loan/Loans',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Վարկեր' // angular-breadcrumb's configuration
                }
            })
        .state('creditlines',
            {
                url: '/creditlines',
                templateUrl: '/Creditline/Creditlines',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >>  Ընթացիկ հաշվի վարկային գծեր' // angular-breadcrumb's configuration
                }
            })
        .state('transferArm',
            {
                url: '/transferArm',
                templateUrl: '/PaymentOrder/TransferArmPaymentOrder',
                ncyBreadcrumb: {
                    label: 'Փոխանցումներ >> Փոխանցում ՀՀ տարածքում' // angular-breadcrumb's configuration
                }
            })
        .state('credentials',
            {
                url: '/credentials',
                templateUrl: '/Credential/Credentials',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Լիազորագրեր' // angular-breadcrumb's configuration
                }
            })
        .state('transfers',
            {

                url: '/transfers',
                templateUrl: '/Transfers/CustomerTransfers',
                params: {
                    setHBFilter: null
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($scope.$root.SessionProperties.IsCalledFromHB) {
                            $scope.setHBFilter = 'true';
                            $scope.$root.SessionProperties.IsNonCustomerService = true;
                        } else {
                            $scope.setHBFilter = 'false';
                        }
                    }
                ],
                ncyBreadcrumb: {
                    label: 'Փոխանցումներ' // angular-breadcrumb's configuration
                }
            })
        .state('receivedbankmailtransfers',
            {
                url: '/receivedbankmailtransfers',
                templateUrl: '/ReceivedBankMailTransfers/CustomerTransfers',
                ncyBreadcrumb: {
                    label: 'Փոխանցումներ' // angular-breadcrumb's configuration
                }
            })
        .state('personalPayment',
            {
                url: '/personalPayment',
                templateUrl: '/PaymentOrder/PersonalPaymentOrder',
                params: {
                    selectedAccount: null
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        if ($stateParams.selectedAccount == null) {
                            $scope.selectedAccount = sessionStorage.getItem('selectedAccount');
                        } else {
                            $scope.selectedAccount = $stateParams.selectedAccount;
                            sessionStorage.setItem('selectedAccount', $stateParams.selectedAccount);
                        }
                    }
                ],
                ncyBreadcrumb: {
                    label: 'Փոխանցումներ >> Փոխանցում սեփական հաշիվների միջև' // angular-breadcrumb's configuration
                }
            })
        .state('creditLineDetails',
            {
                url: "/creditLineDetails",
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >>  Ընթացիկ հաշվի վարկային գծեր >> Վարկային գծի տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    productId: null,
                    closedCreditLine: null
                },
                templateUrl: 'CreditLine/CreditLineDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null && $stateParams.closedCreditLine == null) {
                            $scope.productid = sessionStorage.getItem('creditline');
                            if ($scope.productid == null) {
                                $scope.productid = $scope.$root.SessionProperties.LoanProductId;
                            }
                            $scope.creditline = JSON.parse(sessionStorage.getItem('closedcreditline'));
                        } else {
                            $scope.productid = $stateParams.productId;
                            $scope.creditline = $stateParams.closedCreditLine;
                            sessionStorage.setItem('creditline', $stateParams.productId);
                            sessionStorage.setItem('closedcreditline', JSON.stringify($stateParams.closedCreditLine));
                        }
                    }
                ]
            })
        .state('depositcases',
            {
                url: '/depositcases',
                templateUrl: '/DepositCase/DepositCases',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Պահատուփեր' // angular-breadcrumb's configuration
                }
            })
        .state('depositCaseDetails',
            {
                url: "/depositCaseDetails",
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Պահատուփեր >> Պահատուփի տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    productId: null,
                    depositCase: null
                },
                templateUrl: 'DepositCase/DepositCaseDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null && $stateParams.depositCase == null) {
                            $scope.productId = sessionStorage.getItem('depositcase');
                        } else {
                            $scope.productId = $stateParams.productId;
                            sessionStorage.setItem('depositcase', $stateParams.productId);
                        }
                    }
                ]
            })
        .state('periodicTransfers',
            {
                url: '/periodicTransfers',
                templateUrl: '/PeriodicTransfer/PeriodicTransfers',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Պարբերական փոխանցումներ' // angular-breadcrumb's configuration
                }
            })
        .state('ChequeBookOrder',
            {
                url: '/ChequeBookOrder',
                ncyBreadcrumb: {
                    label: 'Հայտեր >> Չեկային գրքույկի ստացման հայտի ձևակերպում' // angular-breadcrumb's configuration
                },
                templateUrl: 'ChequeBookOrder/PersonalChequeBookOrder'
            })
        .state('CashOrder',
            {
                url: '/CashOrder',
                ncyBreadcrumb: {
                    label:
                        'Հայտեր >> Գումարի ստացման և փոխանցման հայտի ձևակերպում' // angular-breadcrumb's configuration
                },
                templateUrl: 'CashOrder/PersonalCashOrder'
            })
        .state('StatmentByEmailOrder',
            {
                url: '/StatmentByEmailOrder',
                ncyBreadcrumb: {
                    label:
                        'Հայտեր >> Քաղվածքն էլեկտրոնային ստացման հայտի ձևակերպում' // angular-breadcrumb's configuration
                },
                templateUrl: 'StatmentByEmailOrder/PersonalStatmentByEmailOrder'
            })
        .state('SwiftCopyOrder',
            {
                url: '/SwiftCopyOrder',
                ncyBreadcrumb: {
                    label: 'Հայտեր >> Swift հաղորդագրության պատճենի ստացման հայտ' // angular-breadcrumb's configuration
                },
                templateUrl: 'SwiftCopyOrder/PersonalSwiftCopyOrder'
            })
        .state('CustomerDataOrder',
            {
                url: '/CustomerDataOrder',
                ncyBreadcrumb: {
                    label: 'Հայտեր >> Տվյալների խմբագրման հայտի ձևակերպում' // angular-breadcrumb's configuration
                },
                templateUrl: 'CustomerDataOrder/PersonalCustomerDataOrder'
            })
        .state('ReferenceOrder',
            {
                url: '/ReferenceOrder',
                ncyBreadcrumb: {
                    label: 'Հայտեր >> Տեղեկանքի հայտի ձևակերպում' // angular-breadcrumb's configuration
                },
                templateUrl: 'ReferenceOrder/PersonalReferenceOrder'
            })
        .state('CustomerDetails',
            {
                url: '/CustomerDetails',
                templateUrl: '/Customer/CustomerDetails'
            })
        .state('customerDebts',
            {
                url: '/customerDebts',
                ncyBreadcrumb: {
                    label: 'Պարտավորություններ' // angular-breadcrumb's configuration
                },
                templateUrl: '/Customer/CustomerDebtsDirective',
            })
        .state('overdue',
            {
                url: '/overdue',
                templateUrl: '/Overdue/OverdueDetails',
                ncyBreadcrumb: {
                    label: 'Ժամկետանց պրոդուկտների պատմություն' // angular-breadcrumb's configuration
                }
            })
        .state('attachmentdocument',
            {
                url: "/attachmentdocument",
                params: {
                    productID: null
                },
                templateUrl: 'AttachmentDocument/AttachmentDocuments',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        $scope.productID = $stateParams.productID;
                    }
                ],
                view: "AttachmentDocument/AttachmentDocuments"
            })
        .state('Mature',
            {
                url: "/Mature",
                params: {
                    loan: null
                },
                templateUrl: 'MatureOrder/PersonalMatureOrder',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Վարկեր  >>Վարկի մարում' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.loan == null) {
                            $scope.loan = sessionStorage.getItem('Mature');
                        } else {
                            $scope.loan = $stateParams.loan;
                            sessionStorage.setItem('Mature', $stateParams.loan);
                        }
                    }
                ]
            })
        .state('guarantees',
            {
                url: '/guarantees',
                templateUrl: '/Guarantee/Guarantees',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Երաշխիքներ' // angular-breadcrumb's configuration
                }
            })
        .state('guaranteeDetails',
            {
                url: "/guaranteeDetails",
                params: {
                    productId: null,
                    closedGuarantee: null
                },
                templateUrl: 'Guarantee/GuaranteeDetails',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Երաշխիքներ  >>Երաշխիքի տվյալներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null && $stateParams.closedGuarantee == null) {
                            $scope.productId = sessionStorage.getItem('guarantee');
                            $scope.guarantee = JSON.parse(sessionStorage.getItem('closedguarantee'));
                        } else {
                            $scope.productId = $stateParams.productId;
                            $scope.guarantee = $stateParams.closedGuarantee;
                            sessionStorage.setItem('guarantee', $stateParams.productId);
                            sessionStorage.setItem('closedguarantee', JSON.stringify($stateParams.closedGuarantee));
                        }
                    }
                ]
            })
        .state('accreditiveDetails',
            {
                url: "/accreditiveDetails",
                params: {
                    productId: null,
                    closedAccreditive: null
                },
                templateUrl: 'Accreditive/AccreditiveDetails',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ակրեդիտիվներ  >>Ակրեդիտիվի տվյալներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null && $stateParams.closedAccreditive == null) {
                            $scope.productId = sessionStorage.getItem('accreditive');
                            $scope.accreditive = JSON.parse(sessionStorage.getItem('closedaccreditive'));
                        } else {
                            $scope.productId = $stateParams.productId;
                            $scope.accreditive = $stateParams.closedAccreditive;
                            sessionStorage.setItem('accreditive', $stateParams.productId);
                            sessionStorage.setItem('closedaccreditive', JSON.stringify($stateParams.closedAccreditive));
                        }
                    }
                ]
            })
        .state('accreditives',
            {
                url: '/accreditives',
                templateUrl: '/Accreditive/Accreditives',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ակրեդիտիվներ' // angular-breadcrumb's configuration
                }
            })
        .state('paidGuarantees',
            {
                url: '/paidGuarantees',
                templateUrl: '/PaidGuarantee/PaidGuarantees',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Վճարված երաշխիքներ' // angular-breadcrumb's configuration
                }
            })
        .state('paidGuaranteeDetails',
            {
                url: "/paidGuaranteeDetails",
                params: {
                    productId: null,
                    closedPaidGuarantee: null
                },
                templateUrl: 'PaidGuarantee/PaidGuaranteeDetails',
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >> Վճարված երաշխիքներ  >>Վճարված երաշխիքի տվյալներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null && $stateParams.closedPaidGuarantee == null) {
                            $scope.productId = sessionStorage.getItem('paidGuarantee');
                            $scope.paidGuarantee = JSON.parse(sessionStorage.getItem('closdePaidGuarantee'));
                        } else {
                            $scope.productId = $stateParams.productId;
                            $scope.paidGuarantee = $stateParams.closedPaidGuarantee;
                            sessionStorage.setItem('paidGuarantee', $stateParams.productId);
                            sessionStorage.setItem('closedPaidGuarantee', $stateParams.closedPaidGuarantee);
                        }
                    }
                ]
            })
        .state('paidAccreditives',
            {
                url: '/paidAccreditives',
                templateUrl: '/PaidAccreditive/PaidAccreditives',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Վճարված ակրեդիտիվներ' // angular-breadcrumb's configuration
                }
            })
        .state('paidAccreditiveDetails',
            {
                url: "/paidAccreditiveDetails",
                params: {
                    productId: null,
                    closedPaidAccreditive: null
                },
                templateUrl: 'PaidAccreditive/PaidAccreditiveDetails',
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >> Վճարված ակրեդիտիվներ >>Վճարված ակրեդիտիվի տվյալներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null && $stateParams.closedPaidAccreditive == null) {
                            $scope.productId = sessionStorage.getItem('paidAccreditive');

                        } else {
                            $scope.productId = $stateParams.productId;
                            $scope.paidAccreditive = $stateParams.closedPaidAccreditive;
                            sessionStorage.setItem('paidAccreditive', $stateParams.productId);
                            sessionStorage.setItem('closedpaidAccreditive',
                                JSON.stringify($stateParams.closedPaidAccreditive));
                        }
                    }
                ]
            })
        .state('factoringDetails',
            {
                url: "/factoringDetails",
                params: {
                    productId: null,
                    closedFactoring: null
                },
                templateUrl: 'Factoring/FactoringDetails',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ֆակտորինգներ  >>Ֆակտորինգի տվյալներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null && $stateParams.closedFactoring == null) {
                            $scope.productId = sessionStorage.getItem('factoring');
                            $scope.factoring = JSON.parse(sessionStorage.getItem('closedfactoring'));
                        } else {
                            $scope.productId = $stateParams.productId;
                            $scope.factoring = $stateParams.closedFactoring;
                            sessionStorage.setItem('factoring', $stateParams.productId);
                            sessionStorage.setItem('closedfactoring', JSON.stringify($stateParams.closedFactoring));
                        }
                    }
                ]
            })
        .state('paidFactoringDetails',
            {
                url: "/paidFactoringDetails",
                params: {
                    productId: null,
                    closedPaidFactoring: null
                },
                templateUrl: 'PaidFactoring/PaidFactoringDetails',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ֆակտորինգներ  >>Ֆակտորինգի տվյալներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null && $stateParams.closedPaidFactoring == null) {
                            $scope.productId = sessionStorage.getItem('factoring');
                            $scope.paidFactoring = JSON.parse(sessionStorage.getItem('closedpaidfactoring'));
                        } else {
                            $scope.productId = $stateParams.productId;
                            $scope.paidFactoring = $stateParams.closedPaidFactoring;
                            sessionStorage.setItem('factoring', $stateParams.productId);
                            sessionStorage.setItem('closedpaidfactoring',
                                JSON.stringify($stateParams.closedPaidFactoring));
                        }
                    }
                ]
            })
        .state('factorings',
            {
                url: '/factorings',
                templateUrl: '/Factoring/Factorings',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Վճարված երաշխիքներ' // angular-breadcrumb's configuration
                }
            })
        .state('paidFactorings',
            {
                url: '/paidFactorings',
                templateUrl: ' /PaidFactoring/PaidFactorings',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Վճարված երաշխիքներ' // angular-breadcrumb's configuration
                }
            })
        .state('newCredential',
            {
                url: "/newCredential",
                templateUrl: 'CredentialOrder/PersonalCredentialOrder',
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >> Լիազորագրեր >> Լիազորագրի հայտի մուտքագրում' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        //$scope.selectedDeposit = $stateParams.selectedDeposit;
                    }
                ]
            })
        .state('vehicleViolations',
            {
                url: '/vehicleViolations',
                templateUrl: '/VehicleViolation/VehicleViolations',
                params: {
                    nonauthorizedcustomer: null
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id

                        if ($scope.$root.SessionProperties.IsNonCustomerService) {
                            $scope.nonauthorizedcustomer = 'true';
                        } else {
                            $scope.nonauthorizedcustomer = 'false';
                        }
                    }
                ]
            })
        .state('AllDahkDetails',
            {
                url: '/AllDahkDetails',
                templateUrl: '/DAHK/GetAllDahkDetails',
                params: {
                    nonauthorizedcustomer: null
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id

                        if ($scope.$root.SessionProperties.IsNonCustomerService) {
                            $scope.nonauthorizedcustomer = 'true';
                        } else {
                            $scope.nonauthorizedcustomer = 'false';
                        }
                    }
                ]
            })
        .state('pensionapplications',
            {
                url: '/pensionapplications',
                templateUrl: '/PensionApplication/PensionApplications',
                ncyBreadcrumb: {
                    label: 'Կենսաթոշակ ստանալու դիմում-համաձայնագրերի հաշվառում' // angular-breadcrumb's configuration
                }
            })
        .state('transferCallContracts',
            {
                url: '/transferCallContracts',
                templateUrl: '/TransferCallContractDetails/TransferCallContractDetails',
                ncyBreadcrumb: {
                    label: 'Հեռախոսազանգով փոխանցման համաձայնագրի հաշվառում' // angular-breadcrumb's configuration
                }
            })
        .state('cardTariffContractDetails',
            {
                url: "/cardTariffContractDetails",
                params: {
                    selectedContract: null
                },
                templateUrl: 'CardTariffContract/CardTariffContractDetails',
                ncyBreadcrumb: {
                    label: 'TO DO' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        if ($stateParams.selectedContract == null) {
                            $scope.tariffID = JSON.parse(sessionStorage.getItem('selectedContract')).TariffID;
                        } else {
                            $scope.tariffID = $stateParams.selectedContract.TariffID;
                            sessionStorage.setItem('selectedContract', JSON.stringify($stateParams.selectedContract));
                        }
                    }
                ]
            })
        .state('cardtariffcontracts',
            {
                url: '/cardtariffcontracts',
                templateUrl: '/CardTariffContract/CustomerCardTariffContracts',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Աշխատավարձային ծրագրեր' // angular-breadcrumb's configuration
                }
            })
        .state('customerposlocations',
            {
                url: '/customerposlocations',
                templateUrl: '/PosLocation/CustomerPosLocations',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Սպասարկամն կետեր' // angular-breadcrumb's configuration
                }
            })
        .state('posLocationDetails',
            {
                url: "/posLocationDetails",
                params: {
                    selectedPosLoc: null
                },
                templateUrl: 'PosLocation/PosLocationDetails',
                ncyBreadcrumb: {
                    label: 'TO DO' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        if ($stateParams.selectedPosLoc == null) {
                            $scope.posLocationId = JSON.parse(sessionStorage.getItem('selectedPosLoc')).Id;
                        } else {
                            $scope.posLocationId = $stateParams.selectedPosLoc.Id;
                            sessionStorage.setItem('selectedPosLoc', JSON.stringify($stateParams.selectedPosLoc));
                        }
                    }
                ]
            })
        .state('provisionloans',
            {
                url: '/provisionloans',
                templateUrl: '/Provision/ProvisionLoans',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Գրավներ և վարկեր' // angular-breadcrumb's configuration
                }
            })
        .state('insurances',
            {
                url: '/insurances',
                templateUrl: '/Insurance/Insurances',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ապահովագրություն' // angular-breadcrumb's configuration
                }
            })
        .state('insuranceDetails',
            {
                url: "/insuranceDetails",
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >> Ապահովագրություն >> Ապահովագրության տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    productId: null
                },
                templateUrl: 'Insurance/InsuranceDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        if ($stateParams.productId == null) {
                            $scope.productId = sessionStorage.getItem('insuranceId');
                        } else {
                            $scope.productId = $stateParams.productId;
                            sessionStorage.setItem('insuranceId', $stateParams.productId);
                        }
                    }
                ]
            })
        .state('hbapplicationdetails',
            {
                url: "/hbapplicationdetails",
                params: {
                    hbApplication: null,
                    hbGroupIds: null
                },
                templateUrl: 'HBApplicationOrder/HBApplicationDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        if ($stateParams.hbApplication == null && $stateParams.hbGroupIds == null) {
                            $scope.hbApplication = JSON.parse(sessionStorage.getItem('hbApplicationCash'));
                            $scope.hbGroupIds = JSON.parse(sessionStorage.getItem('hbGroupIdsCash'));
                        } else {
                            $scope.hbApplication = $stateParams.hbApplication;
                            $scope.hbGroupIds = $stateParams.hbGroupIds;
                            sessionStorage.setItem('hbApplicationCash', JSON.stringify($stateParams.hbApplication));
                            sessionStorage.setItem('hbGroupIdsCash', JSON.stringify($stateParams.hbGroupIds));
                        }
                    }
                ],
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> HB Applications  >>HB App-i տվյալներ' // angular-breadcrumb's configuration
                }
            })
        .state('hbuserdetails',
            {
                url: "/hbuserdetails",
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >> Հեռահար Բանկինգ >> ՀԲ օգտագործողներ >> ՀԲ օգտագործողի տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    selectedhbuserid: null
                },
                templateUrl: 'HBUser/HBUserDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id

                        if ($stateParams.selectedhbuserid == null) {
                            $scope.selectedhbuserid = sessionStorage.getItem('selectedhbuserid');
                        } else {
                            $scope.selectedhbuserid = $stateParams.selectedhbuserid;
                            sessionStorage.setItem('selectedhbuserid', $stateParams.selectedhbuserid);
                        }
                    }
                ]

            })
        .state('hbtokendetails',
            {
                url: "/hbtokendetails",
                templateUrl: 'HBToken/HBTokenDetails',
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >> Հեռահար Բանկինգ >> ՀԲ թոքեններ >> ՀԲ թոքենի տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    hbtokenid: null
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {


                        if ($stateParams.hbtokenid == null) {
                            $scope.hbtokenid = sessionStorage.getItem('hbtokenid');
                        } else {
                            $scope.hbtokenid = $stateParams.hbtokenid;
                            sessionStorage.setItem('hbtokenid', $stateParams.hbtokenid);
                        }
                    }
                ]


            })
        .state('hbapplication',
            {
                url: '/hbapplication',
                templateUrl: '/HBApplicationOrder/HBApplication',
                ncyBreadcrumb: {
                    label: 'Հեռահար բանկինգ' // angular-breadcrumb's configuration
                }
            })
        .state('customersNotes',
            {
                url: '/customersNotes',
                templateUrl: '/CustomersNotes/CustomersNotes',
                ncyBreadcrumb: {
                    label: 'Գրառումներ' // angular-breadcrumb's configuration
                }
            })
        .state('approvementSchema',
            {
                url: '/approvementSchema',
                templateUrl: '/ApprovementSchema/ApprovementSchema',
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >> HB Applications  >> Հաստատման սխեմայի քայլեր' // angular-breadcrumb's configuration
                }
            })
        .state('xbUserGroups',
            {
                url: '/xbUserGroups',
                templateUrl: '/XBUserGroup/XBUserGroups',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> HB Applications  >> Հաստատման խմբեր' // angular-breadcrumb's configuration
                }
            })
        .state('outPutReports',
            {
                url: '/outPutReports',
                templateUrl: '/OutPutReports/Reports',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ելքային ձևեր' // angular-breadcrumb's configuration
                }
            })
        .state('transitAccounts',
            {
                url: '/transitAccounts',
                templateUrl: '/TransitAccountsForDebitTransactions/FilialTransitAccountsForDebitTransactionsList',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Տարանցիկ հաշիվներ' // angular-breadcrumb's configuration
                }
            })
        .state('pensionPaymentOrder',
                {
                    url: '/pensionPaymentOrder',
                    templateUrl: '/PensionPaymentOrder/PensionPaymentOrder',
                    ncyBreadcrumb: {
                        label: 'Պրոդուկտներ >> Կենսաթոշակի/նպաստի գումար' // angular-breadcrumb's configuration
                    }
            })
        .state('transitAccountDetails',
            {
                url: '/transitAccounts',
                templateUrl: '/TransitAccountsForDebitTransactions/TransitAccountDetails',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Տարանցիկ հաշիվներ' // angular-breadcrumb's configuration
                },
                params: {
                    selectedAccount: null
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        $scope.selectedAccount = $stateParams.selectedAccount;
                        //if ($stateParams.selectedAccount) {
                        //    $scope.selectedAccount = localStorage.getItem('account');
                        //}
                        //else {
                        //    $scope.selectedAccount = $stateParams.selectedAccount;
                        //    localStorage.setItem('account', $stateParams.selectedAccount)
                        //}
                    }
                ]
            })
        .state('employeeWorks',
            {
                url: '/employeeWorks',
                templateUrl: '/EmployeeWorks/EmployeeWorks',
                ncyBreadcrumb: {
                    label: 'Աշխատանքներ' // angular-breadcrumb's configuration
                }
            })
        .state('hbapplicationrestore',
            {
                url: "/hbapplicationrestore",
                params: {
                    hbApplication: null,
                    hbGroupIds: null
                },
                templateUrl: 'HBApplicationOrder/HBApplicationRestoreOrder',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        $scope.hbApplication = $stateParams.hbApplication;

                    }
                ],
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >> Հեռահար բանկինգ  >> Հեռահար բանկինգի վերականգնում' // angular-breadcrumb's configuration
                }
            })
        .state('phonebankingcontract',
            {
                url: '/phonebankingcontract',
                templateUrl: '/PhoneBankingContract/PhoneBankingContract',
                ncyBreadcrumb: {
                    label: 'Հեռախոսային բանկինգ' // angular-breadcrumb's configuration
                }
            })
        .state('phonebankingcontractdetails',
            {
                url: "/phonebankingcontractdetails",
                ncyBreadcrumb: {
                    label:
                        'Պրոդուկտներ >> Հեռախոսային բանկինգ >> Հեռախոսային բանկինգի տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    phoneBankingContract: null,
                },
                templateUrl: 'PhoneBankingContract/PhoneBankingContractDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        $scope.phoneBankingContract = $stateParams.phoneBankingContract;

                    }
                ]
            })
        .state('cashBook',
            {
                url: "/cashBook",
                templateUrl: '/CashBook/CashBook',
                ncyBreadcrumb: {
                    label: 'Դրամարկղի մատյան >> Դրամարկղի մատյան' // angular-breadcrumb's configuration
                }

            })
        .state('operDayOptions',
            {
                url: "/operDayOptions",
                templateUrl: '/OperDayOptions/OperDayOptions',
                ncyBreadcrumb: {
                    label: ' >> ' // angular-breadcrumb's configuration
                }

            })
        .state('cardStatements',
            {
                url: '/cardStatements',
                templateUrl: '/CardStatementSession/CardStatementSessionIndex',
                ncyBreadcrumb: {
                    label: ''
                }
            })
        .state('cardStatementAdvertisements',
            {
                url: '/cardStatementAdvertisements',
                templateUrl: '/CardStatementAdvertisement/CardStatementAdvertisements',
                ncyBreadcrumb: {
                    label: ''
                }
            })
        .state('loanDetailsForCurrentCustomer',
            {
                url: '/Loan/LoanDetailsForCurrentCustomer?productId',
                templateUrl: function ($stateParams) {
                    return '/Loan/LoanDetailsForCurrentCustomer/' + $stateParams.productId;
                },
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Վարկեր  >>Վարկի տվյալներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        $scope.productId = $stateParams.productId;
                    }
                ]
            })

        .state('swiftmessages', {
            url: '/swiftmessages',
            templateUrl: '/SwiftMessages/SwiftMessages',
            ncyBreadcrumb: {
                label: 'Swift հաղորդագրություններ' // angular-breadcrumb's configuration
            }
        })
        .state('bonds',
            {
                url: '/bonds',
                templateUrl: '/Bond/Bonds',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Պարտատոմսեր'
                }
            })
        .state('BondDetails',
            {
                url: "/bonddetails",
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Պարտատոմսեր >> Պարտատոմսերի տվյալներ'
                },
                params: {
                    ProductId: null,
                    bondFilterType: null
                },
                templateUrl: '/Bond/BondDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.ProductId == null) {
                            $scope.ProductId = sessionStorage.getItem('currentBondID');
                        } else {
                            $scope.ProductId = $stateParams.ProductId;
                            sessionStorage.setItem('currentBondID', $stateParams.ProductId);
                        }

                        if ($stateParams.bondFilterType == null) {
                            $scope.bondFilterType = sessionStorage.getItem('bondFilterType');
                        } else {
                            $scope.ProductId = $stateParams.ProductId;
                            sessionStorage.setItem('bondFilterType', $stateParams.bondFilterType);
                        }

                    }
                ]
            })
        .state('bondDealing',
            {
                url: '/bondDealing',
                templateUrl: '/Bond/BondDealing',
                params: {
                    bondFilterType: null
                },
                ncyBreadcrumb: {
                    label: ''
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        $scope.bondFilterType = $stateParams.bondFilterType;
                        if ($stateParams.bondFilterType == null) {
                            $scope.bondFilterType = sessionStorage.getItem('bondFilterType');
                        } else {
                            $scope.bondFilterType = $stateParams.bondFilterType;
                            sessionStorage.setItem('bondFilterType', $stateParams.bondFilterType);
                        }
                    }
                ]
            })
        .state('securitiesTrading',
            {
                url: '/securitiesTrading',
                templateUrl: '/SecuritiesTrading/Index',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        $scope.$root.SessionProperties.IsNonCustomerService = false;
                    }
                ]
            })
        .state('depositaryAccount',
            {
                url: '/depositaryAccount',
                templateUrl: '/DepositaryAccount/DepositaryAccount',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Արժեթղթերի հաշիվ'
                }
            })
        .state('depositaryAccountDetails',
            {
                url: "/depositaryAccountDetails",
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Արժեթղթերի հաշիվ >> Արժեթղթերի հաշվի տվյալներ'
                },
                params: {
                    ProductId: null
                },
                templateUrl: '/DepositaryAccount/DepositaryAccountDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.ProductId == null) {
                            $scope.ProductId = sessionStorage.getItem('currentDepoAccountID');
                        } else {
                            $scope.ProductId = $stateParams.ProductId;
                            sessionStorage.setItem('currentDepoAccountID', $stateParams.ProductId);
                        }

                    }
                ]
            })
        .state('bondIssue',
            {
                url: '/bondIssue',
                templateUrl: '/BondIssue/BondIssuePartial',

                ncyBreadcrumb: {
                    label: 'Պարտատոմսերի թողարկում'
                }

            })

        .state('operDayMode',
            {
                url: '/operDayMode',
                templateUrl: '/OperDayMode/OperDayMode',

                ncyBreadcrumb: {

                }
            })

        .state('fonds',
            {
                url: '/fonds',
                templateUrl: '/Fond/AllFonds',
                ncyBreadcrumb: {
                    label: 'Ֆոնդեր' // angular-breadcrumb's configuration
                }
            })
        .state('customerArrestsInfo',
            {
                url: '/customerArrestsInfo',
                templateUrl: '/CustomerArrestsInfo/CustomerInfo',
                controller: "CustomerArrestsInfoCtrl",
                ncyBreadcrumb: {
                    label: 'Տեղեկություն հաճախորդի մասին (Արգելքներ)' // angular-breadcrumb's configuration
                }
            })
        .state('hbDocuments',
            {
                url: '/HomeBanking',
                templateUrl: '/HomeBankingDocuments/HBDocuments',
                //controller: "HBDocumentsCtrl",
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        $scope.$root.SessionProperties.IsNonCustomerService = false;
                    }
                ],
                ncyBreadcrumb: {
                    label: '«Home Banking» համակարգով ստացված փոխանցումներ' // angular-breadcrumb's configuration
                }
            })
        .state('safekeepingItems',
            {
                url: '/SafekeepingItems ',
                templateUrl: '/SafekeepingItem/SafekeepingItems',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ի պահ ընդունված գրավներ (ոսկի)' // angular-breadcrumb's configuration
                }
            })
        .state('brokerContract',
            {
                url: '/brokerContract ',
                templateUrl: '/BrokerContract/BrokerContract',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Բրոկերային պայմանագիր' // angular-breadcrumb's configuration
                }
            })
        .state('safekeepingItemDetails',
            {
                url: '/SafekeepingItemDetails ',
                templateUrl: '/SafekeepingItem/SafekeepingItemDetails',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ի պահ ընդունված գրավներ (ոսկի) >> Ի պահ ընդունված գրավի տվյալներ' // angular-breadcrumb's configuration
                },
                params: {
                    productId: null
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.productId == null) {
                            $scope.productId = sessionStorage.getItem('safekeepingProductId');
                        }
                        else {
                            $scope.productId = $stateParams.productId;
                            sessionStorage.setItem('safekeepingProductId', $stateParams.productId);
                        }
                    }
                ]
            })
        .state('StockDetails',
            {
                url: "/stockdetails",
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Արժեթղթեր >> Բաժնետոմսերի տվյալներ'
                },
                params: {
                    ProductId: null,
                    bondFilterType: null
                },
                templateUrl: '/Bond/BondDetails',
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                        if ($stateParams.ProductId == null) {
                            $scope.ProductId = sessionStorage.getItem('currentBondID');
                        } else {
                            $scope.ProductId = $stateParams.ProductId;
                            sessionStorage.setItem('currentBondID', $stateParams.ProductId);
                        }

                        if ($stateParams.bondFilterType == null) {
                            $scope.bondFilterType = sessionStorage.getItem('bondFilterType');
                        } else {
                            $scope.ProductId = $stateParams.ProductId;
                            sessionStorage.setItem('bondFilterType', $stateParams.bondFilterType);
                        }

                    }
                ]
            })
        .state('leasingMainDetails',
            {
                url: "/leasingMainDetails",
                params: {
                    productId: null
                },
                templateUrl: '/Leasing/LeasingMainDetails',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Լիզինգներ  >>Լիզինգի տվյալներ' // angular-breadcrumb's configuration
                },
                controller: [
                    '$scope', '$stateParams', function ($scope, $stateParams) {
                        // get the id
                       
                    $scope.productId = $stateParams.productId;
                            //$scope.loan = $stateParams.closedLoan;
                    sessionStorage.setItem('leasing', $stateParams.productId);
                            /*sessionStorage.setItem('closedloan', JSON.stringify($stateParams.closedLoan));*/
                       
                    }
                ]
            })
        .state('leasingAllProducts',
            {
                url: '/leasingAllProducts',
                templateUrl: '/LeasingProducts/Index',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Բոլոր պրոդուկտները' // angular-breadcrumb's configuration
                }
            })
        .state('leasingOutPutReports',
            {
                url: '/leasingOutPutReports',
                templateUrl: '/LeasingOutPutReports/Reports',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Ելքային ձևեր' // angular-breadcrumb's configuration
                }
            })
        .state('leasingCredentials',
            {
                url: '/leasingCredentials',
                templateUrl: '/LeasingCredential/Credentials',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Լիազորագրեր' // angular-breadcrumb's configuration
                }
            })
        .state('leasingCredentialDetails',
            {
                url: '/leasingCredentialDetails',
                templateUrl: '/LeasingCredential/CredentialDetails',
                ncyBreadcrumb: {
                    label: 'Պրոդուկտներ >> Լիազորագրեր' // angular-breadcrumb's configuration
                }
            })
    //.state('FTPRate',
    //{
    //    url: '/FTPRate',
    //    templateUrl: '/FTPRateOrder/FTPRates',
    //    ncyBreadcrumb: {
    //        label: 'Սեփական միջոցներ' // angular-breadcrumb's configuration
    //    }
    //})

    //.state('resource_payments',
    //{
    //    url: '/resource_payments',
    //    templateUrl: '/Fond/AllFonds',
    //    ncyBreadcrumb: {
    //        label: 'Ֆոնդեր' // angular-breadcrumb's configuration
    //    }
    //})
}]);



app.filter("mydate", function () {
    return function (x) {

        if (x != undefined) {
            var _date = new Date(parseInt(x.substr(6)));
            _date = _date.setHours(_date.getHours() - _date.getTimezoneOffset() / 60);
            _date = new Date(parseInt(_date));
            var newDate = new Date(_date.getMonth() + 1 + "/" + _date.getDate() + "/" + _date.getFullYear());
            return newDate;
        }
        else
            return "-";
    };
});

app.filter('nl2br', ['$sce', function ($sce) {
    return function (text) {
        return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
    };
}]);

var ngContextMenu = angular.module('directive.contextMenu', []);

ngContextMenu.directive('context', [function () {
    return {
        restrict: 'A',
        scope: '@&',
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                post: function postLink(scope, iElement, iAttrs, controller) {
                    var ul = $('#' + iAttrs.context),
                        last = null;

                    ul.css({ 'display': 'none' });

                    $(iElement).click(function (event) {
                        var left = event.clientX;
                        var top = event.clientY;
                        var ulWidth, ulHeight;

                        if ($(event.target).attr("context") != undefined) {
                            ulWidth = $($('#' + $(event.target).attr("context"))[0]).width();
                            ulHeight = $($('#' + $(event.target).attr("context"))[0]).height();
                        }
                        else {
                            ulWidth = $($('#' + $(event.target.parentNode).attr("context"))[0]).width();
                            ulHeight = $($('#' + $(event.target.parentNode).attr("context"))[0]).height();
                        }
                        if (left + ulWidth > $(window).width()) {
                            left = left - ulWidth;
                        }
                        if (top + ulHeight > $(window).height()) {
                            top = top - ulHeight;
                        }
                        ul.css({
                            position: "fixed",
                            display: "block",
                            left: left,
                            top: top
                        });
                        last = event.timeStamp;
                    });

                    $(document).click(function (event) {
                        var target = $(event.target);
                        if (!target.is(".popover") && !target.parents().is(".popover")) {
                            if (target.is("#contextMenu"))
                                return;
                            ul.css({
                                'display': 'none'
                            });
                        }
                    });

                    $(document).scroll(function (event) {
                        ul.css({
                            'display': 'none'
                        });
                    });

                }
            };
        }
    };
}]);

app.filter('datediff', function () {
    var magicNumber = (1000 * 60 * 60 * 24);

    return function (toDate, fromDate) {
        if (toDate && fromDate) {
            var toDate = new Date(parseInt(toDate.substr(6)));
            var fromDate = new Date(parseInt(fromDate.substr(6)));
            var dayDiff = Math.floor((toDate - fromDate) / magicNumber);
            if (angular.isNumber(dayDiff)) {
                //return dayDiff + 1;
                return dayDiff;
            }
        }
    };
});

app.filter('stringShorten', function () {
    return function (input, length) {
        if (input != undefined && input.length > length) {
            return input.substring(0, length) + '...';
        } else {
            return input;
        }
    }
});

app.filter('arrayFilter', function () {
    return function (array, ksyArrayFilter) {
        arr = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].Key == undefined || ksyArrayFilter.indexOf(array[i].Key) != -1) {
                arr.push(array[i]);
            }
        }
        return arr;
    }
});

app.filter("ABS", function () {
    return function (number) {
        if (number || number == 0) {
            return Math.abs(number);
        }
        else
            return "-";
    };
});

app.filter("fordahkamount", ['$filter', function ($filter) {
    return function (x) {
        if (x != undefined) {
            var index = x.indexOf("(");
            var amount;
            amount = x.substring(0, index);
            amount = $filter('number')(amount, "2");
            x = amount + " " + x.substring(index);
            return x;
        }
        else
            return "-";
    };
}]);


app.filter("mydatetime", [function () {
    return function (x) {
        if (x != undefined) {
            var d = new Date(parseInt(x.substr(6)));
            var formattedDate = d.getDate() + "/" + ((d.getMonth() < 9 ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1))) + "/" + d.getFullYear();
            var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            var formattedTime = hours + ":" + minutes;
            return formattedDate + " " + formattedTime;
        }
        else {
            return "-";
        }

    };
}]);

app.filter('bondQualityFilter', function () {
    return function (items, qualityFilter) {
        var filtered = [];

        if (qualityFilter != undefined && items != undefined) {
            if (qualityFilter == '100') {
                for (var i = 0; i < items.length; i++) {

                    if (items[i].Quality != 40 && items[i].Quality != 41 && items[i].Quality != 31) {
                        filtered.push(items[i]);
                    }
                }
            }
            else {
                for (var i = 0; i < items.length; i++) {

                    if (items[i].Quality == qualityFilter) {
                        filtered.push(items[i]);
                    }
                }
            }
        }
        return filtered;
    };
});

app.filter("dateCompare", function () {

    return function (input, PaymentDate) {
        if (input != undefined && (PaymentDate != undefined && PaymentDate != "")) {
            var out = [];
            angular.forEach(input,
                function (item) {
                    if (item.PaymentDate == PaymentDate) {
                        out.push(item);
                    }
                });
            return out;
        }
        else
            return input;
    };
});


app.filter('reestrDetails', function () {
    return function (items, transactionConfirmStatus) {
        var filtered = [];
        if (transactionConfirmStatus == '0' || transactionConfirmStatus == undefined) {
            return items;
        }
        else {
            angular.forEach(items, function (el) {
                if (transactionConfirmStatus == '1') {
                    if (el.TransactionsGroupNumber != null) {
                        filtered.push(el);
                    }
                }
                else if (transactionConfirmStatus == '2') {
                    if (el.TransactionsGroupNumber == null) {
                        filtered.push(el);
                    }
                }
            });
        }
        return filtered;
    };
});
app.filter('reestrDetails2', function () {
    return function (items, transactionCheckStatus) {
        var filtered = [];

        if (transactionCheckStatus == '0' || transactionCheckStatus == undefined) {
            return items;
        }
        else {
            angular.forEach(items, function (el) {
                if (transactionCheckStatus == '1') {
                    if (el.CardClosed == false && el.CardHasDAHK == false) {
                        filtered.push(el);
                    }
                }
                else if (transactionCheckStatus == '2') {
                    if (el.CardClosed == true || el.CardHasDAHK == true) {
                        filtered.push(el);
                    }
                }
            });
        }
        return filtered;
    }


});


