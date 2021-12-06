app.controller("BondOrderCtrl", ['$scope', 'bondOrderService', 'bondIssueService', 'infoService', 'casherService', 'bondService', '$location', 'dialogService', '$uibModal', 'customerService', '$filter', '$http', 'dateFilter', 'ReportingApiService', 'orderService', 
    function ($scope, bondOrderService, bondIssueService, infoService, casherService, bondService, $location, dialogService, $uibModal, customerService, $filter, $http, dateFilter, ReportingApiService, orderService) {


        $scope.banks = [];
        $scope.depositoryAccountOperators = [];
        $scope.obj = {};

        $scope.initBondOrder = function () {
            $scope.bondOrder = {};
            $scope.bondOrder.RegistrationDate = new Date();
            $scope.bondOrder.Bond = {};
            $scope.bondOrder.Bond.AccountForBond = {};
            $scope.bondOrder.Bond.AccountForCoupon = {};
            $scope.bondOrder.Bond.CustomerDepositaryAccount = {};
            $scope.bondOrder.Bond.CustomerDepositaryAccount.BankCode = ''

            $scope.attachmentsCounter = [];
            $scope.attachmentsCounter.push(0);
            $scope.bondOrder.Attachments = [];

            if ($scope.shareType == 1) {
                $scope.shareTypeDescription = "Պարտատոմս";
                $scope.bondOrder.Bond.ShareType = 1;
            }
            else {
                $scope.shareTypeDescription = "Բաժնետոմս";
                $scope.bondOrder.Bond.ShareType = 2;
            }

            var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function (res) {
                $scope.customerNumber = res.data;
                if ($scope.shareType == 1)
                    $scope.hasCustomerDepositaryAccountInBankDB($scope.customerNumber);

                if ($scope.bondOrder.Bond.DepositaryAccountExistenceType == 1) {
                    $scope.getCustomerDepositaryAccount($scope.customerNumber);
                }
            });

            $scope.setBondDocumentNumber();




            var Data = casherService.getUserFilialCode();
            Data.then(function (filial) {
                $scope.bondOrder.Bond.FilialCode = filial.data;
            },
                function () {
                    $scope.loading = false;
                    alert('Error getUserFilialCode');
                });
        };

        $scope.saveBondOrder = function () {
            if ($http.pendingRequests.length == 0) {


                document.getElementById("bondOrderSaveLoad").classList.remove("hidden");

                if ($scope.bondOrder.Currency == 'AMD' && $scope.bondOrder.Bond.ShareType == 1) {
                    $scope.bondOrder.Bond.AccountForBond.AccountNumber = $scope.bondOrder.Bond.AccountForCoupon.AccountNumber;
                }

                if ($scope.bondOrder.Bond.DepositaryAccountExistenceType == 4) {
                    $scope.bondOrder.Bond.CustomerDepositaryAccount.Description = $scope.depositoryAccountOperators[$scope.bondOrder.Bond.CustomerDepositaryAccount.BankCode];
                }


                var Data = bondOrderService.saveBondOrder($scope.bondOrder);

                Data.then(function (res) {

                    if (validate($scope, res.data)) {

                        document.getElementById("bondOrderSaveLoad").classList.add("hidden");
                        $scope.path = '#Orders';
                        if ($scope.bondOrder.Bond.ShareType == 1) {
                            CloseBPDialog('newbondorder');
                            showMesageBoxDialog('Պարտատոմսի վաճառքի մուտքագրումը կատարված է', $scope, 'information');
                        }
                        else {
                            CloseBPDialog('newstockorder');
                            showMesageBoxDialog('Բաժնետոմսի վաճառքի մուտքագրումը կատարված է', $scope, 'information');
                        }

                        refresh(186);
                    }
                    else {
                        document.getElementById("bondOrderSaveLoad").classList.add("hidden");

                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function (err) {
                    document.getElementById("bondOrderSaveLoad").classList.add("hidden");
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                    alert('Error saveBondOrder');
                });
            }

            else {
                document.getElementById("bondOrderSaveLoad").classList.add("hidden");
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
               
            }
        };

        $scope.bondIssueChange = function () {
            if ($scope.bondOrder.Bond.BondIssueId != undefined) {
                $scope.getNonDistributedBondsCount($scope.bondOrder.Bond.BondIssueId);

                if ($scope.bondOrder.Bond.BondIssueId != undefined) {


                    var Data = bondIssueService.getBondIssue($scope.bondOrder.Bond.BondIssueId);
                    Data.then(function (b) {
                        $scope.bondIssue = b.data;
                        $scope.bondOrder.Currency = $scope.bondIssue.Currency;
                        $scope.bondOrder.Bond.Currency = $scope.bondIssue.Currency;

                        if ($scope.shareType == 1) {
                            $scope.getBondPrice($scope.bondIssue.ID);
                            $scope.getAccountsForCouponRepayment();
                            $scope.getAccountsForBondRepayment();
                        }
                        else {
                            $scope.getAccountsForStock();
                        }
                    },
                        function () {
                            $scope.loading = false;
                            alert('Error bondIssueChange');
                        });
                }
                else {
                    $scope.bondIssue = undefined;
                }

            }
            else {
                $scope.NonDistributedBondCount = undefined;
            }
            if ($scope.shareType == 2) {
                var Data = bondOrderService.getBondOrderIssueSeria($scope.bondOrder.Bond.BondIssueId);
                Data.then(function (acc) {
                    $scope.bondOrder.Bond.IssueSeria = acc.data;
                }, function () {
                    alert('Error getBondOrder');
                });

                $scope.initUnitPrice($scope.bondOrder.Bond.BondIssueId);
            }

        };

        $scope.initUnitPrice = function (bondIssueId) {
            var Data = bondIssueService.getUnitPrice(bondIssueId);
            Data.then(function (count) {
                $scope.bondOrder.Bond.UnitPrice = count.data;
                if ($scope.bondOrder.Bond.BondCount != undefined && $scope.bondOrder.Bond.BondCount != null && $scope.bondOrder.Bond.BondCount != 0)
                    $scope.bondOrder.Bond.TotalPrice = numeral($scope.bondOrder.Bond.BondCount * $scope.bondOrder.Bond.UnitPrice).format('0,0.00');
            }, function () {
                alert('Error getUnitPrice');
            });

        };

        $scope.getBondIssues = function (filter) {
            
            $scope.loading = true;

            if (filter == undefined) {
                filter = {
                    Quality: 11,
                    IssuerType: 3,
                    ShareType: $scope.shareType
                };
            }

            var Data = bondIssueService.getBondIssuesList(filter, true);
            Data.then(function (bondIssuesList) {
                $scope.bondIssuesList = bondIssuesList.data;
            },
                function () {
                    $scope.loading = false;
                    alert('Error getBondIssues');
                });
        };

        $scope.getBondOrder = function (orderId) {
            var Data = bondOrderService.getBondOrder(orderId);
            Data.then(function (acc) {
                $scope.orderDetails = acc.data;
            }, function () {
                alert('Error getBondOrder');
            });

        };

        $scope.getNonDistributedBondsCount = function (bondIssueId) {
            var Data = bondIssueService.getNonDistributedBondsCount(bondIssueId);
            Data.then(function (count) {
                $scope.NonDistributedBondCount = count.data;
            }, function () {
                alert('Error getNonDistributedBondsCount');
            });

        };

        $scope.calculateTotalPrice = function () {
            if ($scope.bondOrder.Bond.BondCount != undefined && $scope.bondOrder.Bond.UnitPrice != undefined) {
                $scope.bondOrder.Bond.TotalPrice = numeral($scope.bondOrder.Bond.BondCount * $scope.bondOrder.Bond.UnitPrice).format('0,0.00');
            }
            else {
                $scope.bondOrder.Bond.TotalPrice = undefined;
            }
        };


        $scope.getAccountsForCouponRepayment = function () {
            var Data = bondOrderService.getAccountsForCouponRepayment();
            Data.then(function (acc) {
                $scope.couponRepaymentAccounts = acc.data;
                $scope.bondOrder.Bond.AccountForCoupon.AccountNumber = undefined;
            }, function () {
                alert('Error getAccountsForCouponRepayment');
            });

        };

        $scope.getAccountsForBondRepayment = function () {
            if ($scope.bondOrder.Currency != undefined && $scope.bondOrder.Currency != "AMD") {
                var Data = bondOrderService.getAccountsForBondRepayment($scope.bondOrder.Currency);
                Data.then(function (acc) {
                    $scope.bondRepaymentAccounts = acc.data;
                    $scope.bondOrder.Bond.AccountForBond.AccountNumber = undefined;
                }, function () {
                    alert('Error getAccountsForBondRepayment');
                });
            }
            else {
                $scope.bondRepaymentAccounts = undefined;
            }


        };

        $scope.getBondPrice = function (bondIssueId) {
            var Data = bondService.getBondPrice(bondIssueId);
            Data.then(function (acc) {
                $scope.bondOrder.Bond.UnitPrice = acc.data;
            }, function () {
                $scope.bondOrder.Bond.UnitPrice = undefined;
                alert('Error getBondPrice');
            });
        };

        $scope.newFile = function () {
            var i = 0;
            if ($scope.attachmentsCounter.length == $scope.bondOrder.Attachments.length) {
                if ($scope.attachmentsCounter != undefined && $scope.attachmentsCounter.length > 0) {
                    i = $scope.attachmentsCounter.length;
                }
                $scope.attachmentsCounter.push(i);
            }
            else {
                return ShowMessage('Առկա են չկցված ֆայլեր։', 'error');
            }

        };

        $scope.removeFile = function (index) {
            $scope.bondOrder.Attachments.splice(index, 1);
            $scope.attachmentsCounter.splice(index, 1);
            if ($scope.attachmentsCounter.length == 0) {
                $scope.attachmentsCounter = [];
                //$scope.attachmentsCounter.push(0);
                $scope.bondOrder.Attachments = [];
            }
        };
               
        $scope.convertfile = function ($files, $event, $flow, index) {
            var fr = new FileReader();

            fr.onload = function () {
                $scope.arraybuffer = this.result;



                var arraybuffer = $scope.arraybuffer
                arraybuffer = arraybuffer.replace('data:image/jpeg;base64,', '');
                arraybuffer = arraybuffer.replace('data:image/png;base64,', '');
                arraybuffer = arraybuffer.replace('data:image/jpg;base64,', '');
                arraybuffer = arraybuffer.replace('data:application/pdf;base64,', '');

                var oneAttachment = {};
                oneAttachment.Attachment = arraybuffer;
                oneAttachment.FileExtension = '.' + $scope.obj.flow.files[0].getExtension();
                //oneAttachment.Id = '0';
                oneAttachment.FileName = $files[0].name;
                $scope.bondOrder.Attachments.push(oneAttachment);

            };


            fr.readAsDataURL($files[0].file);

        };

        $scope.setBondDocumentNumber = function () {
            $scope.error = [];
            var Data = infoService.getLastKeyNumber(82);
            Data.then(function (key) {

                if (key.data != 0 && key.data != null) {
                    $scope.bondOrder.Bond.DocumentNumber = key.data;
                }
                else {
                    $scope.error.push({
                        Code: 1111, Description: 'Հնարավոր չէ ստեղծել հայտի համար։ Խնդրում ենք նորից փորձել։'
                    });
                }

            }, function () {
                $scope.error.push({
                    Code: 1111, Description: 'Հնարավոր չէ ստեղծել հայտի համար։ Խնդրում ենք նորից փորձել'
                });
            })
        };

        $scope.getBanks = function () {
            var Data = infoService.getBanks();
            Data.then(function (b) {
                $scope.banks = b.data;

            }, function () {
                alert('Error getBanks');
            });
        };

        $scope.hasCustomerDepositaryAccountInBankDB = function (customerNumber) {
            var Data = bondService.hasCustomerDepositaryAccountInBankDB(customerNumber);
            Data.then(function (acc) {
                if (acc.data == true) {
                    $scope.bondOrder.Bond.DepositaryAccountExistenceType = 1;
                    $scope.getCustomerDepositaryAccount(customerNumber);
                }

            }, function () {
                $scope.bondOrder.Bond.DepositaryAccountExistenceType = undefined;
                alert('Error hasCustomerDepositaryAccountInBankDB');
            });
        };

        $scope.getCustomerDepositaryAccount = function (customerNumber) {
            var Data = bondService.getCustomerDepositaryAccount(customerNumber);
            Data.then(function (acc) {
                var account = acc.data;
                $scope.bondOrder.Bond.CustomerDepositaryAccount.AccountNumber = account.AccountNumber;
                $scope.bondOrder.Bond.CustomerDepositaryAccount.BankCode = account.BankCode.toString();
                $scope.bondOrder.Bond.CustomerDepositaryAccount.Description = account.Description;


            }, function () {
                $scope.bondOrder.Bond.CustomerDepositaryAccount = {};
                alert('Error hasCustomerDepositaryAccountInBankDB');
            });
        };


        $scope.printBondCustomerCard = function (accountNumber, accountNumberForBond) {

            if ((accountNumber != undefined && $scope.bondOrder.Currency == 'AMD') || ($scope.bondOrder.Currency != 'AMD' && accountNumber != undefined && accountNumberForBond != undefined)) {
                if ($scope.bondOrder.Currency == 'AMD') {
                    accountNumberForBond = undefined;
                }
                showloading();

                var Data = bondOrderService.printBondCustomerCard(accountNumber, accountNumberForBond);
                Data.then(function (response) {
                    var reportId = 0;
                    var result = angular.fromJson(response.data.result);
                    var customerType = angular.fromJson(response.data.customerType);
                    if (customerType == 6) {
                        reportId = 115;
                    }
                    else {
                        reportId = 116;
                    }
                    var requestObj = { Parameters: result, ReportName: reportId, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error printBondCustomerCard');
                });
            }
            else {
                return ShowMessage('Առկա են չմուտքագրված դաշտեր։', 'error');
            }
        };

        $scope.getBondContract = function (accountNumberForCoupon, accountNumberForBond, contractDate) {
            if ((accountNumberForCoupon != undefined && $scope.bondOrder.Currency == 'AMD') || ($scope.bondOrder.Currency != 'AMD' && accountNumberForCoupon != undefined && accountNumberForBond != undefined)) {
                if ($scope.bondOrder.Currency == 'AMD' && $scope.bondOrder.Bond.ShareType != 2) {
                    accountNumberForBond = undefined;
                }
                showloading();
                var Data = bondOrderService.getBondContract(accountNumberForCoupon, accountNumberForBond, contractDate);
                ShowPDF(Data);
            }
            else {
                return ShowMessage('Առկա են չմուտքագրված դաշտեր։', 'error');
            }
        };


        $scope.getcheckAndSaveDepositoryAccount = function () {
            document.getElementById("bondOrderSaveLoad").classList.remove("hidden");
            if ($scope.bondOrder.Bond.AccountForBond.AccountNumber == undefined)
                $scope.bondOrder.Bond.AccountForBond.AccountNumber = 0;

            if ($scope.bondOrder.Bond.DepositaryAccountExistenceType == 4) {
                $scope.bondOrder.Bond.CustomerDepositaryAccount.Description = $scope.depositoryAccountOperators[$scope.bondOrder.Bond.CustomerDepositaryAccount.BankCode];
            }

            var Data = bondOrderService.checkAndSaveDepositoryAccount($scope.bondOrder);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    $scope.saveBondOrder();

                }
                else {
                    document.getElementById("bondOrderSaveLoad").classList.add("hidden");
                    showMesageBoxDialog(res.data.Errors[0].Description, $scope, 'error');
                }

            }, function () {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error getcheckeAndSaveDepositoryAccount');
                document.getElementById("bondOrderSaveLoad").classList.add("hidden");
            });
        };

        $scope.checkAndGetDepositaryAccount = function () {
            showloading();
            var Data = bondOrderService.checkAndGetDepositaryAccount();
            Data.then(function (acc) {
                if (acc.data != undefined) {
                    var account = acc.data;
                    $scope.bondOrder.Bond.CustomerDepositaryAccount.AccountNumber = account.AccountNumber;
                    /*$scope.bondOrder.Bond.CustomerDepositaryAccount.StockIncomeAccount = account.StockIncomeAccountNumber;*/
                    $scope.stockIncomeaccList = account.StockIncomeAccountNumber;
                }
                hideloading();
            }, function () {
                alert('Error checkAndGetDepositaryAccount');
            });
        };

        $scope.getAccountsForStock = function () {
            var Data = bondOrderService.getAccountsForStock();
            Data.then(function (acc) {
                $scope.bondRepaymentAccounts = acc.data;
                $scope.bondOrder.Bond.AccountForBond.AccountNumber = undefined;
                $scope.bondOrder.Bond.AccountForCoupon.AccountNumber = 0;
            }, function () {
                alert('Error getAccountsForStock');
            });

        };


        $scope.clearAllFields = function () {
            $scope.bondOrder.Bond.CustomerDepositaryAccount.AccountNumber = undefined;
            $scope.bondOrder.Bond.CustomerDepositaryAccount.BankCode = ''
            $scope.bondOrder.Bond.CustomerDepositaryAccount.StockIncomeAccountNumber = undefined;
        }


        $scope.getDepositoryAccountOperators = function () {
            var Data = infoService.getDepositoryAccountOperators();
            Data.then(function (b) {
                $scope.depositoryAccountOperators = b.data;

            }, function () {
                alert('Error getDepositoryAccountOperators');
            });
        };

        $scope.printRecommendation = function () {
            
            $scope.orderNumberType = 7;
            var Data = orderService.generateNewOrderNumber($scope.orderNumberType);
            Data.then(function (nmb) {
                $scope.order = {};

                $scope.order.OrderNumber = nmb.data;
                $scope.order.Currency = $scope.bondOrder.Bond.AccountForBond.Currency;
                $scope.order.DebitAccount = {};
                $scope.order.DebitAccount.AccountNumber = $scope.bondOrder.Bond.AccountForBond.AccountNumber;
                $scope.order.DebitAccount.Currency = $scope.bondOrder.Bond.AccountForBond.Currency;
                $scope.order.ReceiverAccount = {};
                $scope.order.ReceiverAccount.AccountNumber = "220004131649000";
                $scope.order.ReceiverAccount.Currency = "AMD";
                $scope.order.ReceiverAccount.ReceiverBankCode = "22000";
                $scope.order.RegistrationDate = new Date();

                if ($scope.bondOrder.Bond.AccountForBond.Currency == "AMD") {

                    //init values
                    
                    $scope.order.Amount = parseFloat($scope.bondOrder.Bond.TotalPrice.replace(/,/g, ''));
                    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
                    $scope.order.Description = "Փոխանցում հաշվին";
                    $scope.order.SubType = 1;
                    $scope.order.Type = 1;
                    $scope.order.UseCreditLine = false;

                    var Data = bondOrderService.getPaymentOrderDetails($scope.order, false);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 63, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getPaymentOrderDetails');
                    });
                }
                else {

                    var Data = bondOrderService.getBuyKurs($scope.bondOrder.Bond.AccountForBond.Currency);
                    Data.then(function (res) {
                        //init values
                        $scope.order.Amount = parseFloat($scope.bondOrder.Bond.TotalPrice.replace(/,/g, '')) /  res.data;
                        $scope.order.AmountInAmd = parseFloat($scope.bondOrder.Bond.TotalPrice.replace(/,/g, ''));
                        $scope.order.ConvertationRate = res.data;
                        $scope.order.Rate = res.data;
                        $scope.order.ConvertationType = "Գնում";
                        $scope.order.ConvertationTypeNum = 2;
                        $scope.order.CurrencyConvertation = "AMD";
                        $scope.order.DebetAccountCurrencyAmount = true;
                        $scope.order.RoundingDirection = "1";
                        $scope.order.SubType = 1;
                        $scope.order.Type = 2;
                        $scope.order.ShortChange = 0;
                        $scope.order.checkForShortChange = false;

                        var Data = bondOrderService.getConvertationDetails($scope.order);
                        Data.then(function (response) {
                            var requestObj = { Parameters: response.data, ReportName: 64, ReportExportFormat: 1 }
                            ReportingApiService.getReport(requestObj, function (result) {
                                ShowPDFReport(result);
                            });
                        }, function () {
                            alert('Error getConvertationDetails');
                        });
                    }, function () {
                        alert('Error getConvertationDetails');
                    });


                }
            }, function () {
                alert('Error generateNewOrderNumber');
            });
        };
    }]);
