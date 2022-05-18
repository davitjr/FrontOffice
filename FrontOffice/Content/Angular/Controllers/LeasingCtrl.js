app.controller("LeasingCtrl", ['$scope', 'LeasingService', 'infoService', 'ReportingApiService', 'paymentOrderService', 'casherService', 'accountService', 'orderService', 'transitPaymentOrderService', 'dialogService', '$uibModal', '$http', 'limitToFilter', '$confirm', '$filter', '$timeout', '$controller', '$rootScope', 'leasingFactory', '$state',
    function ($scope, LeasingService, infoService, ReportingApiService, paymentOrderService, casherService, accountService, orderService, transitPaymentOrderService, dialogService, $uibModal, $http, limitToFilter, $confirm, $filter, $timeout, $controller, $rootScope, leasingFactory, $state) {
        $scope.loanFullNumber;
        $scope.dateOfBeginning;
        $scope.leasingContractNumber;
        $scope.selectedDetailRow;        
        $rootScope.selectedLeasing;
        $rootScope.selectedProductId;
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        $scope.selectedLeasingLoanDetails = "";
        $scope.addDescription = "";
        $scope.description = "";
        $scope.checkForDebitAccount = 0;
        $scope.selectedLeasingInsuranceAmount = 0;
        $scope.forBankTransfers = true;
        $scope.confirm = false;
        $scope.isTransit = 0;
        $scope.isNewLeasingDate = new Date("01/JAN/2017");
        $scope.showFeeTypeBlock = true;

        $scope.initDetailedInformation = function () {
            $scope.dateOfBeginning = new Date(parseInt($scope.dateOfBeginning.substr(6)));
            var Data = LeasingService.getDetailedInformationObject($scope.loanFullNumber, $scope.dateOfBeginning);
            Data.then(function (acc) {
                $scope.detailedInfoObj = acc.data;

            }, function () {
                alert('Error initDetailedInformation');
            });
        };

        $scope.initInsuranceInformation = function () {
            $scope.loanFullNumber = params.loanFullNumber;
            $scope.dateOfBeginning = params.dateOfBeginning;
            var Data = LeasingService.getInsuranceInformationObject($scope.loanFullNumber, $scope.dateOfBeginning);
            Data.then(function (acc) {
                $scope.detailedInfoObj = acc.data;
                if (acc.data.length != 0) {
                    sessionStorage.setItem("hasLeasingInsurance", true);
                }
                else {
                    sessionStorage.setItem("hasLeasingInsurance", false);
                }
                leasingFactory.LeasingInsuranceId = 0;
                leasingFactory.LeasingInsuranceAmount = 0;
                leasingFactory.rootCtrlScope.selectedLeasingInsuranceAmount = 0;
                sessionStorage.setItem("leasingInsuranceId", null);
                sessionStorage.setItem("leasingInsuranceAmount", null);
            }, function () {
                alert('Error initInsuranceInformation');
            });
        };

        $scope.closeDetailedInformationModal = function () {
            CloseBPDialog("LeasingDetailedInfoForm");
        };


        $scope.setClickedInsurance = function (detailRow) {
            $scope.selectedDetailRow = detailRow;
            leasingFactory.LeasingInsuranceId = detailRow.Id;
            leasingFactory.LeasingInsuranceAmount = detailRow.SumAmd;
            leasingFactory.rootCtrlScope.selectedLeasingInsuranceAmount = detailRow.SumAmd;
        };

        $scope.selectLeasingInsurance = function (detailRow) {
            $scope.selectedDetailRow = detailRow;
            leasingFactory.LeasingInsuranceId = detailRow.Id;
            leasingFactory.LeasingInsuranceAmount = detailRow.SumAmd;
            leasingFactory.rootCtrlScope.selectedLeasingInsuranceAmount = detailRow.SumAmd;
            CloseBPDialog("leasingInsuranceInfo");
        };

        //getLeasingOperDay
        $scope.initLeasingOperDay = function () {
            var Data = LeasingService.getLeasingOperDay();
            Data.then(function (acc) {
                $scope.leasingOperDay = acc.data;

            }, function () {
                alert('Error initLeasingOperDay');
            });
        };

        $scope.getLeasings = function () {
            $scope.loading = true;
            var Data = LeasingService.getLeasings();
            Data.then(function (leasings) {
                $scope.leasings = leasings.data;
                $scope.loading = false;

            }, function () {
                $scope.loading = false;
                alert('Error getLeasings');
            });
        };

        $scope.setClickedRow = function (index, leasing) {
            $scope.selectedRow = index;
            $rootScope.selectedProductId = leasing.ProductId;
            $scope.selectedQuality = leasing.Quality;
            $scope.selectedRowClose = null;
            //$rootScope.selectedLeasing = leasing;
            //$scope.getLeasing(leasing.ProductId);
        };

        $scope.getLeasing = function (productId) {
            $scope.loading = true;            
            var Data = LeasingService.getLeasing(productId);
            Data.then(function (leasing) {
                $scope.leasing = leasing.data;
                //$scope.selectedLeasing = leasing.data;
                $scope.loading = false;
                $scope.productId = productId;
                $rootScope.selectedLeasing = leasing.data;
                if (new Date(parseInt($rootScope.selectedLeasing.StartDate.substr(6))) > $scope.isNewLeasingDate) {
                    $scope.accountBalanceCurrency = 'AMD';
                }
                else {
                    $scope.accountBalanceCurrency = $rootScope.selectedLeasing.Currency;
                }
            }, function () {
                $scope.loading = false;
                alert('Error getLeasing');
            });
        };

        $scope.openLeasingDetails = function (leasing) {
            if (leasing.Quality != 11) {                
                $state.go('leasingMainDetails', { productId: leasing.ProductId });
            }
            else {
                return ShowMessage('Դուրսգրված լիզինգների դիտարկում չեք կարող անել', 'error');
            }            
        };

        $scope.getLeasingGrafikApplication = function () {
            showloading();

            $scope.beginningDate = new Date(parseInt($rootScope.selectedLeasing.StartDate.substr(6)));

            if ($rootScope.selectedLeasing.SubsidRate > 0) {
                var Data = LeasingService.printLeasingScheduleSubsid($rootScope.selectedLeasing.LoanFullNumber, $scope.beginningDate, 'pdf');
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 47, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error getLeasingGrafikApplication');
                });
            }
            else {
                var Data = LeasingService.printLeasingSchedule($rootScope.selectedLeasing.LoanFullNumber, $scope.beginningDate, 'pdf');
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 46, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error getLeasingGrafikApplication');
                });
            }            
        };

        $scope.getLeasingGrafik = function (firstReschedule) {

            var Data = LeasingService.getLeasingGrafik($rootScope.selectedLeasing.ProductId, firstReschedule);
            Data.then(function (rep) {
                $scope.leasingGrafik = rep.data;
                var sum1 = 0;
                var sum2 = 0;
                var sum3 = 0;
                //var sum4 = 0;
                //var sum5 = 0;
                //var sum6 = 0;
                //var sum7 = 0;

                //$scope.checkRescheduledAmount = false;

                for (var i = 0; i < rep.data.length; i++) {
                    //if (rep.data[i].RescheduledAmount > 0 && $scope.checkRescheduledAmount == false) {
                    //    $scope.checkRescheduledAmount = true;
                    //}

                    sum1 += rep.data[i].RateRepayment;
                    sum2 += rep.data[i].CapitalRepayment;
                    sum3 += rep.data[i].PayableAmount;
                    //sum4 += rep.data[i].FeeRepayment;
                    //if (rep.data[i].FeeRepayment == 0) {
                    //    rep.data[i].FeeRepayment = "";
                    //}
                    //sum5 += rep.data[i].SubsidiaRateRepayment;
                    //sum6 += rep.data[i].NonSubsidiaRateRepayment;
                    //sum7 += rep.data[i].RescheduledAmount;

                }

                $scope.sum1 = sum1;
                $scope.sum2 = sum2;
                $scope.sum3 = sum3;
                //$scope.sum4 = sum4;
                //$scope.sum5 = sum5;
                //$scope.sum6 = sum6;
                //$scope.sum7 = sum7;
                //if ($scope.checkRescheduledAmount) {
                //    $scope.tableColspanCount = 6;
                //} else {
                //    $scope.tableColspanCount = 5;
                //}

                //if ($scope.sum5 != 0)
                //    $scope.tableColspanCount = $scope.tableColspanCount + 1;
                //if ($scope.sum6 != 0)
                //    $scope.tableColspanCount = $scope.tableColspanCount + 1;
                $scope.tableColspanCount = 3;


            }, function () {
                alert('Error getLeasingGrafik');
            });
        };

        $scope.getCurrencies = function () {
            var Data = infoService.getCurrencies();
            Data.then(function (rep) {
                $scope.currencies = rep.data;
            }, function () {
                alert('Error getCurrencies');
            });
        };

        $scope.getLeasingOverdueDetails = function (productId) {
            var Data = LeasingService.getLeasingOverdueDetails(productId);
            Data.then(function (overdue) {
                $scope.overduedetails = overdue.data;
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                alert('Error getLeasingOverdueDetails');
            });
        };

        $scope.getLeasingTransitOrder = function () {
            $scope.getLeasingOrder();
            $scope.isTransit = 1;
            $scope.order.Type = 63;
            $scope.order.Currency = "AMD";            
            $scope.order.TransitAccountType = '3';
            $scope.nonCashPayment = false;
            //$scope.getManagerCustomerNumber();

            var DataOPPerson = orderService.setOrderPerson($rootScope.selectedLeasing.CustomerNumber);
            DataOPPerson.then(function (ord) {
                $scope.order.OPPerson = ord.data;
                $scope.order.OPPerson.PersonBirth = new Date(parseInt(ord.data.PersonBirth.substr(6)));
            }, function () {
                alert('Error CashTypes');
            });
        };

        $scope.getLeasingOrder = function () {

            $scope.getLeasing($rootScope.selectedProductId);
            $scope.nonCashPayment = true;

            if ($rootScope.selectedLeasing != "") {
                $scope.order.ProductId = $rootScope.selectedLeasing.ProductId;                
                $scope.order.Type = 1;
                $scope.order.SubType = 1;
                $scope.feeType = '0';
                $scope.isTransit = 0;
                $scope.isLeasingAccount = true;

                $scope.description = "Հաճախորդ N  " + $rootScope.selectedLeasing.LeasingCustomerNumber + " " + ($rootScope.selectedLeasing.OrganizationName == "" ? $rootScope.selectedLeasing.Name + " " + $rootScope.selectedLeasing.LastName : $rootScope.selectedLeasing.OrganizationName);
                $scope.description += ";Պայմ.N" + $rootScope.selectedLeasing.GeneralNumber;
                if ($rootScope.selectedLeasing.Currency != "AMD") {
                    $scope.description += "; ՀՀ ԿԲ 1" + $rootScope.selectedLeasing.Currency + " = " + $rootScope.selectedLeasing.Kurs + " AMD ";
                }

                $scope.order.AdditionalParametrs = [
                    { 'AdditionTypeDescription': 'LeasingCustomerNumber', 'AdditionValue': $rootScope.selectedLeasing.LeasingCustomerNumber },
                    { 'AdditionTypeDescription': 'LoanFullNumber', 'AdditionValue': $rootScope.selectedLeasing.LoanFullNumber },
                    { 'AdditionTypeDescription': 'StartDate', 'AdditionValue': $rootScope.selectedLeasing.StartDate != undefined ? $filter('mydate')($rootScope.selectedLeasing.StartDate, "dd/MM/yyyy") : null },
                    { 'AdditionTypeDescription': 'StartCapital', 'AdditionValue': $rootScope.selectedLeasing.StartCapital },
                    { 'AdditionTypeDescription': 'Currency', 'AdditionValue': $rootScope.selectedLeasing.Currency },
                    { 'AdditionTypeDescription': 'Description', 'AdditionValue': $scope.description },
                    { 'AdditionTypeDescription': 'AddDescription', 'AdditionValue': $rootScope.selectedLeasing.AddDescription },
                    { 'AdditionTypeDescription': 'AccountType', 'AdditionValue': 'LeasingAccount' },
                    { 'AdditionTypeDescription': 'PrepaymentAmount', 'AdditionValue': $rootScope.selectedLeasing.PrepaymentAmount },
                    { 'AdditionTypeDescription': 'LeasingInsuranceId', 'AdditionValue': $scope.selectedLeasingInsuranceId }
                ];
            }

            $scope.getOperationSystemAccountForLeasing();
            $scope.generateNewOrderNumber();
        };       

        $scope.getOperationSystemAccountForLeasing = function () {
            var Data = casherService.getUserFilialCode();
            Data.then(function (filial) {
                $scope.operationFilialCode = filial.data;
                var Data = accountService.getOperationSystemAccountForLeasing("AMD", $scope.operationFilialCode);
                Data.then(function (acc) {
                    $scope.order.ReceiverAccount = acc.data;
                    $scope.receiverAccountAccountNumber = acc.data.AccountNumber;
                    $scope.order.ReceiverAccount.AccountNumber = acc.data.AccountNumber;
                    $scope.order.Receiver = acc.data.AccountDescription;

                    $scope.order.ReceiverAccount.Description = $scope.order.ReceiverAccount.AccountDescription;
                    $scope.isLeasingAccount = true;

                    $scope.checkForBudgetAccountAndBankAccount(false);
                    $scope.ReceiverBank = acc.data.AccountDescription;
                    $scope.isTransferFromBusinessmanToOwnerAccount();
                    $scope.order.FeeAccount = '';
                    $scope.order.UrgentSign = false;
                    if ($scope.forBankTransfers == true) {
                        $scope.setReceiverBank();
                        $scope.getReceiverAccountWarnings($scope.order.ReceiverAccount.AccountNumber);                        
                    }

                }, function () {
                    alert('Error Get Filial');
                });

            }, function () {
                alert('Error getOperationSystemAccountForLeasing');
            });
        };

        
        //*********************
        $scope.isTransferFromBusinessmanToOwnerAccount = function () {
            if ($scope.order.DebitAccount != undefined && $scope.order.ReceiverAccount != undefined && $scope.order.ReceiverAccount.AccountNumber != undefined && $scope.forBankTransfers == true) {
                var Data = paymentOrderService.isTransferFromBusinessmanToOwnerAccount($scope.order.DebitAccount.AccountNumber, $scope.order.ReceiverAccount.AccountNumber);
                Data.then(function (acc) {
                    $scope.checkOwnerAccount = acc.data;                    
                    if ($scope.checkOwnerAccount == true) {
                        $scope.order.FeeAccount = undefined;
                        $scope.checkForFeeAccount = 0;
                        $scope.getFeeAccounts(1, 2);

                    }
                    if ($scope.checkOwnerAccount == false && $scope.order.Fees != undefined && $scope.order.Fees.length > 0) {
                        for (var i = 0; i < $scope.order.Fees.length; i++) {
                            if ($scope.order.Fees[i].Type == 11) {
                                $scope.order.Fees.splice(i, 1);
                            }
                        }
                    }
                }, function () {
                    alert('Error in isTransferFromBusinessmanToOwnerAccount');
                });
            }
        };

        $scope.getCardWithOutBallance = function () {
            var Data = paymentOrderService.getCardWithOutBallance($scope.order.DebitAccount.AccountNumber);
            Data.then(function (acc) {
                $scope.card = acc.data;
            }, function () {
                alert('Error getCardWithOutBallance');
            });
        };

        $scope.generateNewOrderNumber = function () {
            $scope.getOrderNumberType();
            var Data = orderService.generateNewOrderNumber($scope.orderNumberType);
            Data.then(function (nmb) {
                $scope.order.OrderNumber = nmb.data;
            }, function () {
                alert('Error generateNewOrderNumber');
            });
        };

        $scope.getOrderNumberType = function () {            
            if ($scope.order.Type == 1)
                if ($scope.order.Type == 1 && $scope.order.SubType == 3) {
                    $scope.orderNumberType = 10;
                }
                else {
                    $scope.orderNumberType = 6;
                }            
        };

        //Հայտի պահպանում
        $scope.savePayment = function () {

            if ($scope.order.DebitAccount == undefined || $scope.order.ReceiverAccount == undefined ||
                $scope.order.DebitAccount.AccountNumber == undefined || $scope.order.ReceiverAccount.AccountNumber == undefined) {
                return;
            }

            $scope.error = null;
            
            if ($scope.order.DebitAccount.Currency != $scope.order.ReceiverAccount.Currency) {
                return ShowMessage('Ընտրված են տարբեր արժույթներով հաշիվներ', 'error');
            }

            if ($http.pendingRequests.length == 0) {
                document.getElementById("leasingPaymentOrder").classList.remove("hidden");
                                
                $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);
                $scope.order.Description = $scope.description;                
                $scope.setCurrency();                
                
                var Data = paymentOrderService.savePaymentOrder($scope.order, $scope.confirm);
                
                Data.then(function (res) {
                    $scope.confirm = false;
                    if (validate($scope, res.data)) {
                        document.getElementById("leasingPaymentOrder").classList.add("hidden");
                        CloseBPDialog('leasingPayment');
                        $scope.path = '#Orders';
                        //showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        ShowToaster('Հայտի մուտքագրումը կատարված է', 'success');
                        refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.ReceiverAccount);
                    }
                    else {

                        document.getElementById("leasingPaymentOrder").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.savePayment);                        
                    }
                }, function (err) {
                    $scope.confirm = false;
                    document.getElementById("leasingPaymentOrder").classList.add("hidden");
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                    alert('Error in savePayment');
                });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել «Պահպանել» կոճակը:', 'error');
            }
        };

        $scope.saveTransitPaymentOrder = function () {
            if ($http.pendingRequests.length == 0) {

                document.getElementById("leasingTransitPaymentOrder").classList.remove("hidden");                                                
                $scope.order.Description = $scope.description;

                var Data = transitPaymentOrderService.saveTransitPaymentOrder($scope.order);
                Data.then(function (ch) {
                    if (validate($scope, ch.data)) {
                        document.getElementById("leasingTransitPaymentOrder").classList.add("hidden");
                        CloseBPDialog('leasingTransitPayment');
                        $scope.path = '#Orders';
                        //showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        ShowToaster('Հայտի մուտքագրումը կատարված է', 'success');
                        refresh($scope.order.Type);
                    }
                    else {
                        document.getElementById("leasingTransitPaymentOrder").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function () {
                    document.getElementById("leasingTransitPaymentOrder").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error SaveCheque');
                });
            }
            else {
                ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել «Պահպանել» կոճակը:', 'error');
            }
        };

        $scope.getManagerCustomerNumber = function () {
            var Data = LeasingService.getManagerCustomerNumber($rootScope.selectedLeasing.CustomerNumber);
            Data.then(function (managerCustomerNumber) {
                $scope.managerCustomerNumber = managerCustomerNumber.data;
            }, function () {
                alert('Error getManagerCustomerNumber');
            });
        };

        $scope.setCurrency = function () {
            if ($scope.order.DebitAccount != undefined)
                $scope.order.Currency = $scope.order.DebitAccount.Currency;
        };

        $scope.openCurNominalModal = function () {
            if ($scope.order.Currency == undefined) {
                $scope.isClickingCalc = true;
                return;
            }
            $scope.curNominalModal = $uibModal.open({
                template: '<curnominalform  currency="order.Currency"  callback="getAmount(amount)" close="closeCurNominalModal()"></curnominalform>',
                scope: $scope,
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                backdrop: 'static'
            });
        };

        $scope.closeCurNominalModal = function () {
            $scope.curNominalModal.close();
        };
        $scope.getAmount = function (amount) {
            $scope.order.Amount = amount;
            $scope.closeCurNominalModal();
        };

        $scope.updateDescription = function () {
            $scope.description = $scope.description.trim().replace(';Լիզինգի մասնակի մարում', '').replace(';Գույքահարկի մարում', '').replace(';Ապահովագրավճարի մարում', '')
                .replace(';Միջնորդավճարի մարում', '').replace(';Նախավարձի մարում', '').replace(';Փոխհատուցվող հարկերի և տուրքերի մարում', '')
                .replace(';Լիզինգի լրիվ մարում', '').replace(';Լիզինգի Կանխավճար', '');
            if ($scope.order.PayType === "2") {
                $scope.description = $scope.description.trim() + ";Լիզինգի մասնակի մարում";
            }
            else if ($scope.order.PayType === "3") {
                $scope.description = $scope.description.trim() + ";Գույքահարկի մարում";
            }
            else if ($scope.order.PayType === "4") {
                $scope.description = $scope.description.trim() + ";Ապահովագրավճարի մարում";
            }
            else if ($scope.order.PayType === "5") {
                $scope.description = $scope.description.trim() + ";Միջնորդավճարի մարում";
            }
            else if ($scope.order.PayType === "6") {
                $scope.description = $scope.description.trim() + ";Նախավարձի մարում";
            }
            else if ($scope.order.PayType === "7") {
                $scope.description = $scope.description.trim() + ";Փոխհատուցվող հարկերի և տուրքերի մարում";
            }
            else if ($scope.order.PayType === "8") {
                $scope.description = $scope.description.trim() + ";Լիզինգի լրիվ մարում";
            }
            else if ($scope.order.PayType === "9") {
                $scope.description = $scope.description.trim() + ";Լիզինգի Կանխավճար";
            }
        };

        $scope.getLeasingInsuranceDeatils = function () {
            var dateBeginning = new Date(parseInt($rootScope.selectedLeasing.StartDate.substr(6)));
            if ($scope.order.PayType === "4") {
                params = { loanFullNumber: $rootScope.selectedLeasing.LoanFullNumber, dateOfBeginning: dateBeginning };
                leasingFactory.rootCtrlScope = $scope;
                $scope.openWindow('/Leasing/LeasingInsuranceDetails', 'Ապահովագրավճար', 'leasingInsuranceInfo');
            }
        };

        $scope.checkLeasingPayments = function () {
            if ($http.pendingRequests.length == 0) {
                if ($scope.isLeasingAccount && $scope.order.PayType == 4) {
                    var hasLeasingInsurance = sessionStorage.getItem("hasLeasingInsurance");
                    if (hasLeasingInsurance != null && hasLeasingInsurance != "false") {
                        $scope.selectedLeasingInsuranceId = leasingFactory.LeasingInsuranceId;
                        if ($scope.selectedLeasingInsuranceId != 0) {
                            $scope.order.AdditionalParametrs[9].AdditionValue = $scope.selectedLeasingInsuranceId;

                            var leasingInsuranceAmount = leasingFactory.LeasingInsuranceAmount;

                            if (parseFloat(leasingInsuranceAmount) < parseFloat($scope.order.Amount)) {
                                showMesageBoxDialog('Վճարվող գումարը մեծ է ապահովագրավճարի գումարից, մուտքագրեք ճիշտ գումար', $scope, 'error');
                                return;
                            }
                            else if (parseFloat(leasingInsuranceAmount) > parseFloat($scope.order.Amount)) {
                                $confirm({ title: 'Շարունակե՞լ', text: 'Վճարվող գումարը փոքր է ապահովագրավճարի գումարից, շարունակե՞լ' })
                                    .then(function () {
                                        if ($scope.isTransit == 0) {
                                            $scope.savePayment();
                                        }
                                        else {
                                            $scope.saveTransitPaymentOrder
                                        }                                        
                                    });
                            }
                            else {
                                if ($scope.isTransit == 0) {
                                    $scope.savePayment();
                                }
                                else {
                                    $scope.saveTransitPaymentOrder
                                }
                            }
                        }
                        else {
                            $scope.order.AdditionalParametrs[9].AdditionValue = null;
                            showMesageBoxDialog('Ապահովագրավճարի տողը ընտրված չէ։', $scope, 'error');
                            return;
                        }
                    }
                    else {
                        if ($scope.isTransit == 0) {
                            $scope.savePayment();
                        }
                        else {
                            $scope.saveTransitPaymentOrder
                        }
                    }
                }

                if ($scope.selectedLeasingLoanDetails != "" && $scope.order.AdditionalParametrs[8].AdditionTypeDescription == "PrepaymentAmount" &&
                    $scope.order.AdditionalParametrs[8].AdditionValue != 0 && $scope.order.PayType == 9) {
                    if (parseFloat($scope.order.AdditionalParametrs[8].AdditionValue) + 1 < parseFloat($scope.order.Amount)) {
                        ShowMessage('Վճարվող կանխավճարի գումարը մեծ է պայմանագրով սահմանված կանխավճարի գումարից, մուտքագրեք ճիշտ գումար', 'error');
                        return;
                    }
                    if (parseFloat($scope.order.AdditionalParametrs[8].AdditionValue) > parseFloat($scope.order.Amount)) {
                        $confirm({ title: 'Շարունակե՞լ', text: 'Վճարվող կանխավճարի գումարը փոքր է պայմանագրով սահմանված կանխավճարի գումարից' })
                            .then(function () {
                                if ($scope.isTransit == 0) {
                                    $scope.savePayment();
                                }
                                else {
                                    $scope.saveTransitPaymentOrder
                                }
                            });
                    }
                    else {
                        if ($scope.isTransit == 0) {
                            $scope.savePayment();
                        }
                        else {
                            $scope.saveTransitPaymentOrder
                        }
                    }
                }
            }
        };

        $scope.getDebitAccounts = function (orderSubType) {
            var orderType = $scope.order.Type;
            if ($scope.forBankTransfers) {
                orderSubType = 1;
            }

            if ($scope.checkForDebitAccount == 0){                    
                orderType = $scope.order.Type;                    
                var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 1);
                Data.then(function (acc) {                    
                    $scope.accLength = acc.data.length;
                    $scope.indexAccount = 0;

                    for (var i = 0; i < $scope.accLength; i++) {
                        if (acc.data[$scope.indexAccount].Currency != 'AMD') {
                            acc.data.splice($scope.indexAccount, 1);
                        }
                        else {
                            $scope.indexAccount++;
                        }
                    }
                    $scope.debitAccounts = acc.data;
                    
                }, function () {
                    alert('Error getdebitaccounts');
                });               
            }
        };

        $scope.openWindow = function (url, title, id, callbackFunction) {
            $scope.disabelButton = true;
            if ($scope.$root.openedView.includes(id + '_isOpen') != true) {
                $scope.$root.openedView.push(id + '_isOpen');
                var dialogOptions = {
                    callback: function () {
                        if (dialogOptions.result !== undefined) {
                            cust.mncId = dialogOptions.result.whateverYouWant;
                        }
                    },
                    result: {}
                };

                dialogService.open(id, $scope, title, url, dialogOptions, undefined, undefined, callbackFunction);
            }
            else {
                $scope.disabelButton = true;
            }

        };


        $scope.setFocusAmount = function () {
            $timeout(function () {
                var amount = document.getElementById('amount');
                amount.focus();
            }, 200);
        }

        $scope.getPersonalPaymentOrderDetailsCash = function (isCopy) {
            if (isCopy == undefined)
                isCopy = false;
            showloading();

            if ($scope.description != undefined)
                $scope.order.Description = $scope.description;

            if ($scope.order != undefined) {
                var Data = transitPaymentOrderService.getCashInPaymentOrder($scope.order, isCopy);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error getCashInPaymentOrder');
                });
            }

            $scope.getPaymentOrderFeeDetailsCash(isCopy);

        };

        $scope.setCreditorDocumentNumbers = function () {
            if ($scope.order.CreditorDocumentType == 1)
                $scope.order.CreditorDocumentNumber = $scope.transferArmPaymentOrderForm.CreditorDocumentNumber1;
            else if ($scope.order.CreditorDocumentType == 2)
                $scope.order.CreditorDocumentNumber = $scope.transferArmPaymentOrderForm.CreditorDocumentNumber2;
            else if ($scope.order.CreditorStatus != null && $scope.order.CreditorStatus == '20') {
                $scope.order.CreditorDocumentType = 3;
                $scope.order.CreditorDocumentNumber = $scope.transferArmPaymentOrderForm.CreditorDocumentNumber3;
            }
            else if ($scope.order.CreditorStatus != '10' && $scope.order.CreditorStatus != null) {
                $scope.order.CreditorDocumentType = 4;
                $scope.order.CreditorDocumentNumber = $scope.transferArmPaymentOrderForm.CreditorDocumentNumber4;
            }
        };


        $scope.generateNewOrderNumberForFee = function () {
            if ($scope.OrderNumberForFee == undefined) {
                var Data = orderService.generateNewOrderNumber(1);
                Data.then(function (nmb) {
                    $scope.OrderNumberForFee = nmb.data;
                }, function () {
                    alert('Error generateNewOrderNumber');
                });
            }
        };


        $scope.getCardFee = function () {

            if ($scope.order.DebitAccount != undefined) {
                if ($scope.order.DebitAccount.AccountType == 11 && $scope.order.DebitAccount.Currency != null && $scope.order.Amount != null && $scope.order.Amount > 0) {
                    var receiverAccount = 0;

                    if ($scope.order.ReceiverAccount != undefined) {
                        receiverAccount = $scope.order.ReceiverAccount.AccountNumber;
                    }
                    if (receiverAccount != null && parseInt(receiverAccount.toString().substring(0, 5)) >= 22000 && parseInt(receiverAccount.toString().substring(0, 5)) < 22300) {
                        $scope.order.SubType = 1;
                    }
                    var Data = paymentOrderService.getCardFee($scope.order);

                    Data.then(function (fee) {
                        $scope.order.CardFee = fee.data;
                        if (($scope.order.Fees == undefined || $scope.order.Fees.length == 0) && fee.data > 0) {
                            $scope.order.Fees = [{ Amount: fee.data, Type: 7, Account: $scope.order.DebitAccount, Currency: $scope.order.DebitAccount.Currency, OrderNumber: $scope.order.OrderNumber, Description: 'Քարտային ելքագրման միջնորդավճար' }];
                        }
                        else if ($scope.order.Fees != undefined && $scope.order.Fees.length > 0) {
                            var hasCardFee = false;
                            for (var i = 0; i < $scope.order.Fees.length; i++) {
                                if ($scope.order.Fees[i].Type == 7) {
                                    hasCardFee = true;
                                    if (fee.data > 0) {
                                        $scope.order.Fees[i].Amount = fee.data;
                                        $scope.order.Fees[i].Account = $scope.order.DebitAccount;
                                        $scope.order.Fees[i].Currency = $scope.order.DebitAccount.Currency;
                                        $scope.order.Fees[i].Description = 'Քարտային ելքագրման միջնորդավճար';
                                    }
                                    else {
                                        $scope.order.Fees.splice(i, 1);
                                    }


                                }
                            }
                            if (hasCardFee == false && fee.data > 0) {
                                $scope.order.Fees.push({
                                    Amount: fee.data,
                                    Type: 7,
                                    Account: $scope.order.DebitAccount,
                                    Currency: $scope.order.DebitAccount.Currency,
                                    OrderNumber: $scope.order.OrderNumber,
                                    Description: 'Քարտային ելքագրման միջնորդավճար'
                                });
                            }
                        }

                        if ($scope.order.DebitAccount.AccountType == 11) {
                            $scope.CardFeeCurrency = $scope.order.DebitAccount.Currency;
                        }
                        if ($scope.order.CardFee == 0) {
                            $scope.order.CardFee = null;
                        }
                    }, function () {
                        alert('Error getcardfee');
                    });

                }
                else {
                    if ($scope.order.Fees != undefined) {
                        for (var i = 0; i < $scope.order.Fees.length; i++) {
                            if ($scope.order.Fees[i].Type == 7) {
                                $scope.order.Fees.splice(i, 1);
                            }
                        }
                    }
                    $scope.order.CardFee = null;
                    $scope.order.CardFeeCurrency = "";
                }
            }
        };

        $scope.getFee = function () {

            if ($scope.nonCashPayment != true) {
                $scope.order.Type = 63;
                $scope.order.SubType = 1;
            }



            $scope.generateNewOrderNumberForFee();

            if ($scope.feeType == 0) {
                if ($scope.order.Fees != undefined && $scope.order.Fees.length > 0) {
                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                        if ($scope.order.Fees[i].Type == 1 || $scope.order.Fees[i].Type == 2 ||
                            $scope.order.Fees[i].Type == 3 || $scope.order.Fees[i].Type == 4 ||
                            $scope.order.Fees[i].Type == 5 || $scope.order.Fees[i].Type == 6 ||
                            $scope.order.Fees[i].Type == 8 || $scope.order.Fees[i].Type == 9 ||
                            $scope.order.Fees[i].Type == 28 || $scope.order.Fees[i].Type == 29) {
                            $scope.order.Fees.splice(i, 1);
                        }
                    }
                }
            }

            if ($scope.order.Amount != null && $scope.order.Amount > 0) {
                if ($scope.feeType == undefined) {
                    $scope.feeType = 0;
                }
                //$scope.setOrderType();
                if ($scope.feeType != 0) {
                    var Data = transitPaymentOrderService.getFee($scope.order, $scope.feeType);

                    Data.then(function (fee) {
                        $scope.order.TransferFee = fee.data;
                        if (fee.data == -1) {
                            $scope.order.Fees = undefined;
                            return ShowMessage('Սակագին նախատեսված չէ:Ստուգեք փոխանցման տվյալները:', 'error');
                        }

                        if (fee.data == 0) {
                            $scope.showFeeTypeBlock = false;
                        }
                        else {
                            $scope.showFeeTypeBlock = true;
                        }


                        if ($scope.order.Fees == undefined || $scope.order.Fees.length == 0) {
                            $scope.order.Fees = [];
                        }
                        //Կանխիկ մուտք հաշվին եթե RUR է մուտքագրում իր RUR հաշվին
                        if ($scope.feeType == '8' || $scope.feeType == '9' || $scope.feeType == '28' || $scope.feeType == '29') {
                            if ($scope.order.Fees.length != 0) {
                                for (var i = 0; i < $scope.order.Fees.length; i++) {
                                    if ($scope.order.Fees[i].Type == '8' || $scope.order.Fees[i].Type == '9' ||
                                        $scope.order.Fees[i].Type == '28' || $scope.order.Fees[i].Type == '29') {
                                        $scope.order.Fees[i].Amount = fee.data;
                                        $scope.order.Fees[i].Type = $scope.feeType;
                                        $scope.order.Fees[i].Description = "Կանխիկ գումարի մուտքագրման միջնորդավճար(" +
                                            numeral($scope.order.Amount).format('0,0.00') +
                                            $scope.order.Currency +
                                            " " +
                                            $scope.order.CustomerNumber +
                                            ")";
                                        if ($scope.order.Fees[i].Type == '8' || $scope.order.Fees[i].Type == '28') {
                                            //   $scope.order.Fees[i].OrderNumber = $scope.order.OrderNumber;
                                        } else {
                                            $scope.order.Fees[i].OrderNumber = "";
                                        }

                                        if ($scope.order.Fees[i].Type == '8' || $scope.order.Fees[i].Type == '28') {
                                            $scope.order.Fees[i].Account = {
                                                AccountNumber: 0,
                                                Currency: 'AMD'
                                            };
                                        } else {
                                            if ($scope.order.Fees[i].Account.AccountNumber != undefined) {
                                                $scope.order.Fees[i].Account = {
                                                };
                                            }
                                        }
                                    }
                                }
                            } else {
                                if ($scope.feeType == '8') {
                                    $scope.order.Fees.push({
                                        Amount: fee.data,
                                        Type: $scope.feeType,
                                        Currency: 'AMD',
                                        Account: { AccountNumber: 0, Currency: 'AMD' },
                                        OrderNumber: $scope.OrderNumberForFee,
                                        Description: "Կանխիկ գումարի մուտքագրման միջնորդավճար(" +
                                            numeral($scope.order.Amount).format('0,0.00') +
                                            $scope.order.Currency +
                                            " " +
                                            $scope.order.CustomerNumber +
                                            ")"
                                    });
                                }
                                else if ($scope.feeType == '28') {
                                    $scope.order.Fees.push({
                                        Amount: fee.data,
                                        Type: $scope.feeType,
                                        Currency: 'AMD',
                                        Account: { AccountNumber: 0, Currency: 'AMD' },
                                        OrderNumber: $scope.order.OrderNumber,
                                        Description: "Կանխիկ գումարի մուտքագրման միջնորդավճար(" +
                                            numeral($scope.order.Amount).format('0,0.00') +
                                            $scope.order.Currency +
                                            " " +
                                            $scope.order.CustomerNumber +
                                            ")"
                                    });
                                }
                                else {
                                    $scope.order.Fees.push({
                                        Amount: fee.data,
                                        Type: $scope.feeType,
                                        Currency: 'AMD',
                                        OrderNumber: "",
                                        Description: "Կանխիկ գումարի մուտքագրման միջնորդավճար(" +
                                            numeral($scope.order.Amount).format('0,0.00') +
                                            $scope.order.Currency +
                                            " " +
                                            $scope.order.CustomerNumber +
                                            ")"
                                    });
                                }
                            }
                        }
                    });

                }
            }
        }

        $scope.getTransitAccountTypes = function (forTranferFromTransit) {
            var forLoanMature = false;
            if ($scope.matureOrder != undefined && $scope.claimRepayment != true && forTranferFromTransit != true)
                forLoanMature = true;

            var Data = infoService.GetTransitAccountTypes(forLoanMature);
            Data.then(function (trans) {
                if (forTranferFromTransit == true) {
                    $scope.transitAccountTypesforTranferFromTransit = trans.data;
                } else {
                    $scope.transitAccountTypes = trans.data;

                }
            }, function () {
                alert('Error CashTypes');
            });
        };

        $scope.getPersonalPaymentOrderDetails = function (isCopy) {
            if ($http.pendingRequests.length == 0) {
                if (isCopy == undefined) {
                    $scope.order.SubType = 1;
                    isCopy = false;
                }
                if (isCopy == false) {
                    $scope.setCreditorDocumentNumbers();
                }
                showloading();

                if (!$scope.interBankTransfer) {
                    $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);
                }
                if ($scope.description != undefined)
                    $scope.order.Description = $scope.description;

                if ($scope.transfer != undefined)
                    if ($scope.transfer.InstantMoneyTransfer == 1)
                        $scope.order.DebitAccount = $scope.transfer.DebitAccount;
                    else if ($scope.transfer.TransferGroup == 4)
                        $scope.order.DebitAccount = $scope.transfer.CreditAccount;

                $scope.order.Currency = $scope.order.DebitAccount.Currency;
                if ($scope.order != undefined) {
                    if (!$scope.interBankTransfer) {
                        $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);
                    }
                    var Data = paymentOrderService.getPaymentOrderDetails($scope.order, isCopy);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 63, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getPaymentOrderDetails');
                    });

                    $scope.getPaymentOrderFeeDetails(isCopy);
                }

            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }

        };

        
        $scope.getPaymentOrderFeeDetails = function (isCopy) {
            $scope.orderForFee = {
            };
            if ($scope.order.Fees != null) {
                for (var fee in $scope.order.Fees) {

                    if (($scope.order.Fees[fee].Type == 1 || $scope.order.Fees[fee].Type == 3 || $scope.order.Fees[fee].Type == 8 || (($scope.transfer != undefined || ($scope.order.TransferID != 0 && $scope.order.TransferID != undefined)) && $scope.order.Fees[fee].Type == 5)) && $scope.order.Fees[fee].Amount > 0) {

                        $scope.orderForFee = {
                        };
                        $scope.orderForFee.Amount = $scope.order.Fees[fee].Amount;
                        $scope.orderForFee.OPPerson = {
                        };
                        $scope.orderForFee.OPPerson = $scope.order.OPPerson;
                        $scope.orderForFee.ReceiverAccount = {
                        };
                        $scope.orderForFee.Type = $scope.order.Type;
                        $scope.orderForFee.RegistrationDate = $scope.order.RegistrationDate;
                        $scope.orderForFee.OperationDate = $scope.order.OperationDate;
                        $scope.orderForFee.Description = $scope.order.Fees[fee].Description;
                        $scope.orderForFee.OrderNumber = $scope.order.Fees[fee].OrderNumber;

                        if (!isCopy) {
                            $scope.orderForFee.Currency = $scope.order.Currency;
                            if ($scope.order.Fees[fee].Type == 5 && $scope.order.Type == 56)
                                $scope.orderForFee.Currency = "AMD";

                            var Data = paymentOrderService.getOperationSystemAccountForFee($scope.orderForFee,
                                $scope.order.Fees[fee].Type);
                            Data.then(function (result) {
                                $scope.orderForFee.ReceiverAccount.AccountNumber = result.data;
                                $scope.orderForFee.Currency = "AMD";
                                var Data = paymentOrderService.getCashInPaymentOrder($scope.orderForFee, isCopy);
                                Data.then(function (response) {
                                    var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                                    ReportingApiService.getReport(requestObj, function (result) {
                                        ShowPDFReport(result);
                                    });
                                }, function () {
                                    alert('Error getCashInPaymentOrder');
                                });
                            });
                        }
                        else if ($scope.order.TransferID != 0 && $scope.order.TransferID != undefined) {
                            $scope.orderForFee.Currency = "AMD";
                            var Data = paymentOrderService.getOperationSystemAccountForFee($scope.orderForFee,
                                $scope.order.Fees[fee].Type);
                            Data.then(function (result) {

                                $scope.orderForFee.ReceiverAccount.AccountNumber = result.data;
                                $scope.orderForFee.Currency = $scope.order.Fees[fee].Currency;
                                var Data = paymentOrderService.getCashInPaymentOrder($scope.orderForFee, isCopy);
                                Data.then(function (response) {
                                    var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                                    ReportingApiService.getReport(requestObj, function (result) {
                                        ShowPDFReport(result);
                                    });
                                }, function () {
                                    alert('Error getCashInPaymentOrder');
                                });
                            });
                        }
                        else {
                            $scope.orderForFee.Currency = $scope.order.Fees[fee].Currency;
                            $scope.orderForFee.ReceiverAccount.AccountNumber = $scope.order.Fees[fee].CreditAccount.AccountNumber;
                            var Data = paymentOrderService.getCashInPaymentOrder($scope.orderForFee, isCopy);
                            Data.then(function (response) {
                                var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                                ReportingApiService.getReport(requestObj, function (result) {
                                    ShowPDFReport(result);
                                });
                            }, function () {
                                alert('Error getCashInPaymentOrder');
                            });
                        }


                    }

                }
            }

        }

        $scope.setTransitAccount = function () {
            $scope.order.Currency = "AMD";            
            $scope.isLeasingAccount = true;            
        };

        $scope.getPaymentOrderFeeDetailsCash = function (isCopy) {
            $scope.orderForFee = {
            };
            if ($scope.order.Fees != null) {
                for (var fee in $scope.order.Fees) {

                    if (($scope.order.Fees[fee].Type == 1 || $scope.order.Fees[fee].Type == 3 || $scope.order.Fees[fee].Type == 8) && $scope.order.Fees[fee].Amount > 0) {

                        $scope.orderForFee = {};
                        $scope.orderForFee.Amount = $scope.order.Fees[fee].Amount;
                        $scope.orderForFee.OPPerson = {};
                        $scope.orderForFee.OPPerson = $scope.order.OPPerson;
                        $scope.orderForFee.ReceiverAccount = {
                        };
                        $scope.orderForFee.Type = $scope.order.Type;
                        $scope.orderForFee.RegistrationDate = $scope.order.RegistrationDate;
                        $scope.orderForFee.OperationDate = $scope.order.OperationDate;
                        $scope.orderForFee.Description = $scope.order.Fees[fee].Description;
                        $scope.orderForFee.OrderNumber = $scope.order.Fees[fee].OrderNumber;
                        $scope.orderForFee.TransitAccountType = $scope.order.TransitAccountType;
                        $scope.orderForFee.Fees = [];

                        if ($scope.order.Fees[fee].Type == 28) {
                            $scope.orderForFee.Fees.push($scope.order.Fees[fee]);
                        }

                        if (!isCopy) {
                            $scope.orderForFee.Currency = $scope.order.Currency;
                            if ($scope.order.Fees[fee].Type == 5 && $scope.order.Type == 56)
                                $scope.orderForFee.Currency = "AMD";

                            var Data = transitPaymentOrderService.getOperationSystemAccountForFee($scope.orderForFee,
                                $scope.order.Fees[fee].Type);
                            Data.then(function (result) {
                                $scope.orderForFee.ReceiverAccount.AccountNumber = result.data;
                                $scope.orderForFee.Currency = "AMD";
                                var Data = paymentOrderService.getCashInPaymentOrder($scope.orderForFee, isCopy);
                                Data.then(function (response) {
                                    var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                                    ReportingApiService.getReport(requestObj, function (result) {
                                        ShowPDFReport(result);
                                    });
                                }, function () {
                                    alert('Error getCashInPaymentOrder');
                                });
                            });
                        }
                        else {
                            $scope.orderForFee.Currency = $scope.order.Fees[fee].Currency;
                            $scope.orderForFee.ReceiverAccount.AccountNumber = $scope.order.Fees[fee].CreditAccount.AccountNumber;
                            var Data = paymentOrderService.getCashInPaymentOrder($scope.orderForFee, isCopy);
                            Data.then(function (response) {
                                var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                                ReportingApiService.getReport(requestObj, function (result) {
                                    ShowPDFReport(result);
                                });
                            }, function () {
                                alert('Error getCashInPaymentOrder');
                            });
                        }


                    }

                }
            }

        }

        $scope.getFeeAccounts = function (orderType, orderSubType) {
            if ($scope.checkForFeeAccount == 0 && $scope.order.Type != 56 && $scope.order.Type != 83 && $scope.order.Type != 86) {
                if ($scope.swiftMessage != undefined) {
                    var Data = paymentOrderService.getCustomerAccountsForOrder($scope.swiftMessage.CustomerNumber, orderType, orderSubType, 3);
                    Data.then(function (acc) {
                        $scope.feeAccounts = acc.data;
                    }, function () {
                        alert('Error getfeeaccounts');
                    });
                }
                else {
                    var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 3);
                    Data.then(function (acc) {
                        $scope.feeAccounts = acc.data;
                    }, function () {
                        alert('Error getfeeaccounts');
                    });
                }
            }
        };

        $scope.$watch('feeType', function (newValue, oldValue) {
            if ($scope.details != true) {
                //$scope.feeAccounts = null;
                if ($scope.feeType == 1 || $scope.feeType == 3 || $scope.feeType == 5 || $scope.feeType == 6 || $scope.feeType == 8 || $scope.feeType == 28 || $scope.feeType == 0) {
                    $scope.checkForFeeAccount = 1;
                    $scope.getFee();
                }
                if ($scope.feeType == 2 || $scope.feeType == 4 || $scope.feeType == 9 || $scope.feeType == 20 || $scope.feeType == 11 || $scope.feeType == 29) {
                    $scope.checkForFeeAccount = 0;
                    $scope.getFee();
                    if ($scope.feeAccounts == undefined) {
                        $scope.getFeeAccounts(1, 2);
                    }
                }

                if ((newValue == 2 || newValue == 4 || newValue == 9 || newValue == 20 || newValue == 11 || newValue == 29) &&
                    (oldValue == 1 || oldValue == 3 || oldValue == 5 || oldValue == 6 || oldValue == 8 || oldValue == 0 || oldValue == 28)) {
                    $scope.order.FeeAccount = null;
                }

            }

        });

        $scope.$watchGroup(['order.Currency', 'order.TransitAccountType'], function (newValue, oldValue) {
            if ($scope.details != true) {

                var forAMDAccountFee = false;
                if ($scope.order != undefined && $scope.order.Currency == 'AMD' && ($scope.order.TransitAccountType == '5' || $scope.order.TransitAccountType == '3')) {
                    forAMDAccountFee = true;
                }

                if (newValue[0] == "RUR" || newValue[0] == "GBP" || newValue[0] == "CHF" || forAMDAccountFee) {
                    $scope.getBankOperationFeeTypes(forAMDAccountFee);
                }
                else {
                    $scope.order.Fees = undefined;
                }
            }

        });

        $scope.getBankOperationFeeTypes = function (forAMDAccountFee) {
            if (forAMDAccountFee) {
                $scope.BankOperationFeeType = 6;
            }
            else {
                $scope.BankOperationFeeType = 2;
            }
            if ($scope.details != true) {
                if ($scope.BankOperationFeeType != 0) {
                    var Data = infoService.GetBankOperationFeeTypes($scope.BankOperationFeeType);
                    Data.then(function (acc) {
                        $scope.feeTypes = acc.data;
                        if ($scope.BankOperationFeeType == 2) {
                            if ($scope.paymentOrder != undefined) {
                                if ($scope.paymentOrder.Type == 76) {
                                    $scope.feeType = '0';
                                }
                                else {
                                    $scope.feeType = '8';
                                }
                            }
                            else {
                                $scope.feeType = '8';
                            }

                            $scope.getFee();
                        } else if ($scope.BankOperationFeeType == 6) {
                            $scope.feeType = '28';
                            $scope.getFee();
                        }
                    }, function () {
                        alert('Currencies Error');
                    });
                }
            }
        };

        $scope.getRejectFeeTypes = function () {
            var Data = infoService.getRejectFeeTypes();
            Data.then(function (acc) {
                $scope.rejectFeeTypes = acc.data;
            }, function () {
                alert('Error getRejectFeeTypes');
            });

        };


    }
]);


function CloseBPDialog(dialogID) {
    var dialog = document.querySelector('#' + dialogID);
    $('#' + dialogID).hide();
    dialog.parentNode.removeChild(dialog);
    if (document.querySelector('.bp-dialog-overlay')) {
        $('.bp-dialog-overlay').css("display", "none");
    }
    return false;
};