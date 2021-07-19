angular.module('searchLeasingControl', [])
    .directive('searchleasing', ['infoService', 'utilityService', 'LeasingService', 'ReportingApiService', function (infoService, utilityService, LeasingService, ReportingApiService) {
        return {
            scope: {
                callback: '&',
                close: '&',
                customernumber: '='
            },
            templateUrl: '../Content/Controls/SearchLeasingCustomer.html',

            link: function (scope, element, attr) {
                $(".modal-dialog").draggable();

                //scope.selectLeasingCustomer = function () {
                //    scope.callback({ selectedLeasingCustomer: scope.selectedLeasingCustomer });
                //};

                scope.closeSearchLeasingCustomersModal = function () {
                    scope.close();
                };

            },
            controller: ['$scope', '$rootScope', '$element', function ($scope, $rootScope, $element) {

                $scope.leasingCustomersList;
                $scope.leasingCustomerLoans = [];
                $scope.oneSearchedLeasingCustomer = {};
                $scope.selectedLeasingLoan = "";
                $scope.selectedLeasingCustomer = "";

                $scope.loanFullNumber;
                $scope.dateOfBeginning;
                $scope.leasingContractNumber;

                $scope.addDescription = "";
                $scope.description = "";

                $scope.loanFullN;
                $scope.beginningDate;
                $scope.contractNum;
                $scope.subsid;

                $scope.setClickedCustomer = function (index) {

                    $scope.isCustomerSelected = true;

                    $scope.selectedCustomerRow = index;
                    $scope.selectedLeasingCustomerNumber = $scope.leasingCustomersList[index].LeasingCustomerNumber;
                    $scope.selectedLeasingCustomer = $scope.leasingCustomersList[index];

                    $scope.searchLoansParams = {};
                    $scope.searchLoansParams.LeasingCustomerNumber = $scope.selectedLeasingCustomerNumber;

                    $.ajax({
                        url: "/Leasing/GetCustomerLoans",
                        type: 'GET',
                        dataType: 'json',
                        cache: false,
                        async: true,
                        data: { searchParams: JSON.stringify($scope.searchLoansParams) },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (response) {
                            $scope.leasingCustomerLoans = response;
                            if ($scope.leasingCustomerLoans.length == 0) {
                                $scope.fillDescription(false);
                            }
                            else {
                                $scope.setClickedLoan(0);
                            }

                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }
                        }
                        , error: function (xhr) {
                            console.log("error");
                            console.log(xhr);
                        }
                    });



                };

                $scope.setClickedLoan = function (index) {

                    $scope.isLoanSelected = true;

                    $scope.advanceAndFee = 0;
                    $scope.advanceAmount = 0;
                    $scope.feeAmount = 0;
                    $scope.leasingPayment = 0;
                    $scope.insurancePayments = 0;
                    $scope.otherPayments = 0;
                    $scope.totalAmount = 0;

                    $scope.loanFullN = $scope.leasingCustomerLoans[index].LoanAccount.AccountNumber;
                    $scope.beginningDate = $scope.leasingCustomerLoans[index].StartDate;
                    $scope.contractNum = $scope.leasingCustomerLoans[index].GeneralNumber;

                    $scope.selectedLeasingLoanRow = index;
                    $scope.selectedLeasingLoan = $scope.leasingCustomerLoans[index];

                    $scope.getCBKursForDateAndFillDescription(new Date(), $scope.selectedLeasingLoan.Currency);

                }
                $scope.selectLeasingLoan = function () {

                    if ($scope.selectedLeasingCustomer == "") {
                        $scope.isCustomerSelected = false;
                        return;
                    }
                    if ($scope.selectedLeasingLoan == "") {
                        $scope.isLoanSelected = false;
                        return;
                    }
                    var customerLoanDetails = "";
                    if ($scope.selectedLeasingCustomer != "" && $scope.selectedLeasingLoan != "") {
                        customerLoanDetails = {

                            Name: $scope.selectedLeasingCustomer.Name,
                            LastName: $scope.selectedLeasingCustomer.LastName,
                            OrganizationName: $scope.selectedLeasingCustomer.OrganizationName,

                            GeneralNumber: $scope.selectedLeasingLoan.GeneralNumber,
                            StartCapital: $scope.selectedLeasingLoan.StartCapital,
                            LeasingCustomerNumber: $scope.selectedLeasingCustomerNumber,
                            LoanFullNumber: $scope.selectedLeasingLoan.LoanAccount.AccountNumber,
                            StartDate: $scope.selectedLeasingLoan.StartDate,
                            EndDate: $scope.selectedLeasingLoan.EndDate,
                            Currency: $scope.selectedLeasingLoan.Currency,
                            Description: $scope.description,
                            AddDescription: $scope.addDescription,
                            PrepaymentAmount: $scope.selectedLeasingLoan.PrepaymentAmount
                        }
                        $scope.callback({ selectedLeasingLoanDetails: customerLoanDetails });

                    }
                    else if ($scope.selectedLeasingCustomer != "" && $scope.leasingCustomerLoans.length == 0) {
                        customerLoanDetails = {

                            Name: $scope.selectedLeasingCustomer.Name,
                            LastName: $scope.selectedLeasingCustomer.LastName,
                            OrganizationName: $scope.selectedLeasingCustomer.OrganizationName,

                            GeneralNumber: null,
                            StartCapital: null,
                            LeasingCustomerNumber: $scope.selectedLeasingCustomerNumber,
                            LoanFullNumber: null,
                            StartDate: null,
                            EndDate: null,
                            Currency: null,
                            Description: $scope.description,
                            AddDescription: $scope.addDescription,
                        }
                        $scope.callback({ selectedLeasingLoanDetails: customerLoanDetails });
                    }
                };

                $scope.btnFindLeasingClick = function () {
                    $scope.findLeasingCustomers();
                };


                $scope.findLeasingCustomers = function () {

                    $scope.leasingCustomerLoans = [];
                    $scope.description = "";
                    $scope.addDescription = "";

                    $scope.advanceAndFee = 0;
                    $scope.advanceAmount = 0;
                    $scope.feeAmount = 0;
                    $scope.leasingPayment = 0;
                    $scope.insurancePayments = 0;
                    $scope.otherPayments = 0;
                    $scope.totalAmount = 0;

                    $.ajax({
                        url: "/Leasing/GetLeasingCustomers",
                        type: 'GET',
                        dataType: 'json',
                        cache: false,
                        async: false,
                        data: { searchParams: JSON.stringify($scope.oneSearchedLeasingCustomer) },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (response) {
                            $scope.leasingCustomersList = response;
                            $scope.totalCustomers = response.length;

                            if ($scope.leasingCustomersList.length != 0) {
                                $scope.setClickedCustomer(0);
                            }


                        }
                        , error: function (xhr) {
                            console.log("error");
                            console.log(xhr);
                        }
                    });

                    return false;
                }

                $scope.fillDescription = function (hasLeasingLoans) {
                    var name = $scope.selectedLeasingCustomer.Name;
                    var lastName = $scope.selectedLeasingCustomer.LastName;
                    var organizationName = $scope.selectedLeasingCustomer.OrganizationName;
                    var generalNumber = "";
                    var currency = "";
                    if (hasLeasingLoans != false) {
                        generalNumber = $scope.selectedLeasingLoan.GeneralNumber;
                        currency = $scope.selectedLeasingLoan.Currency;
                    }


                    $scope.description = "Հաճախորդ N  " + $scope.selectedLeasingCustomerNumber + " " + (organizationName == "" ? name + " " + lastName : organizationName);
                    if (hasLeasingLoans != false) {
                        $scope.description += ";Պայմ.N" + generalNumber;
                    }
                    if (hasLeasingLoans == undefined) {
                        if (currency != "AMD") {
                            $scope.description += "; ՀՀ ԿԲ 1" + currency + " = " + $scope.kurs + " AMD ";
                        }
                    }
                    else if (hasLeasingLoans != true) {
                        $scope.description += "; առանց համարի";
                    }

                }


                $scope.getCBKursForDateAndFillDescription = function (date, currency) {
                    var Data = utilityService.getCBKursForDate(date, currency);
                    Data.then(function (kurs) {
                        $scope.kurs = kurs.data;

                        $scope.advanceAndFee = Math.round($scope.selectedLeasingLoan.AdvanceAndFee * 100) / 100 * ($scope.selectedLeasingLoan.MultiplyRate == true ? $scope.kurs : 1);
                        $scope.advanceAmount = Math.round($scope.selectedLeasingLoan.AdvanceAmount * 100) / 100 * ($scope.selectedLeasingLoan.MultiplyRate == true ? $scope.kurs : 1);
                        $scope.feeAmount = Math.round($scope.selectedLeasingLoan.FeeAmount * 100) / 100 * ($scope.selectedLeasingLoan.MultiplyRate == true ? $scope.kurs : 1);
                        $scope.leasingPayment = Math.round($scope.selectedLeasingLoan.LeasingPayment * 100) / 100 * ($scope.selectedLeasingLoan.MultiplyRate == true ? $scope.kurs : 1) + $scope.selectedLeasingLoan.PenaltyRate;
                        $scope.insurancePayments = Math.round($scope.selectedLeasingLoan.InsurancePayments * 100) / 100;
                        $scope.otherPayments = Math.round($scope.selectedLeasingLoan.OtherPayments * 100) / 100;
                        $scope.totalAmount = $scope.advanceAndFee + $scope.leasingPayment + $scope.otherPayments + $scope.insurancePayments;

                        $scope.fillDescription();

                    }, function () {
                        alert('Error getCBKursForDate');
                    });
                };


                
                if ($scope.customernumber != undefined && $scope.customernumber != 0) {
                    $scope.oneSearchedLeasingCustomer.customerNumber = $scope.customernumber;
                    $scope.findLeasingCustomers();
                }

                $scope.printLeasingSchedule = function () {

                    $scope.beginningDate = new Date(parseInt($scope.beginningDate.substr(6)));
                    var Data = LeasingService.printLeasingSchedule($scope.loanFullN, $scope.beginningDate, 'pdf');
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 46, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        }); 
                    }, function () {
                            alert('Error printLeasingSchedule');
                    });
                }

                $scope.printLeasingScheduleSubsid = function () {

                    $scope.beginningDate = new Date(parseInt($scope.beginningDate.substr(6)));
                    var Data = LeasingService.printLeasingScheduleSubsid($scope.loanFullN, $scope.beginningDate, 'pdf');
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 47, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });  
                    }, function () {
                            alert('Error printLeasingScheduleSubsid');
                    });
                }


                $scope.initDetailedInformation = function () {
                    $scope.dateOfBeginning = new Date(parseInt($scope.dateOfBeginning.substr(6)));
                    var Data = LeasingService.getDetailedInformationObject($scope.loanFullNumber, $scope.dateOfBeginning);
                    Data.then(function (acc) {
                        $scope.detailedInfoObj = acc.data;

                    }, function () {
                        alert('Error initDetailedInformation');
                    });
                    $rootScope.isSubsid = detailedInfoObj.IsSubsid;
                }

                $scope.check = function () {
                    $scope.dateOfBeginning = new Date(parseInt($scope.beginningDate.substr(6)));
                    var Data = LeasingService.getDetailedInformationObject($scope.loanFullN, $scope.dateOfBeginning);
                    Data.then(function (acc) {
                        $rootScope.isSubsid = acc.data.IsSubsid;
                        if ($rootScope.isSubsid == 1) {
                            $scope.printLeasingScheduleSubsid();
                        }
                        else {
                            $scope.printLeasingSchedule();
                        }

                    }, function () {
                        alert('Error initDetailedInformation');
                    });

                }

            }
            ]
        };
    }]);





