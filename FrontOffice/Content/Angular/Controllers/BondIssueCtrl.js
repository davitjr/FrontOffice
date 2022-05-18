app.controller("BondIssueCtrl", ['$scope', '$confirm', 'bondIssueService', 'infoService', '$rootScope', '$filter', '$http', function ($scope, $confirm, bondIssueService, infoService,$rootScope, $filter, $http) {

    $rootScope.OpenMode = 13;

    $scope.filter = {
        StartDate: new Date(),
        EndDate: new Date(),
        ISIN: ""
    };

    $scope.initBondIssue = function () {
        if ($scope.actionType != 2)
        {
            //Նոր թողարկում
            $scope.bondIssueNew = {};
            $scope.bondIssueNew.RegistrationDate = new Date();
            $scope.bondIssueNew.Quality = 1;
            $scope.bondIssueNew.BankAccount = {};
        }
        else
        {
            //Թողարկման խմբագրում
            //$scope.bondIssueNew.Quality = 11;  //Հաստատված
            $scope.getBondIssueForEdit($scope.bondIssueId);
        }
       
    };
    
    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.currentBondIssue = $scope.bondsIssuesList[index]
    };

    $scope.getBondIssue = function (id) {
        var Data = bondIssueService.getBondIssue(id);
        Data.then(function (bond) {
            $scope.bondIssue = bond.data;
        }, function () {
            alert('Error getBondIssue'); 
        });
    };

    $scope.getBondIssueForEdit = function (id) {
        $scope.bondIssueNew = {};
      
        var Data = bondIssueService.getBondIssue(id);
        Data.then(function (b) {
            $scope.bondIssueNew = b.data;

            $scope.bondIssueNew.InterestRate = $scope.bondIssueNew.InterestRate * 100;

            $scope.bondIssueNew.RegistrationDate = ($scope.bondIssueNew.RegistrationDate) ? $filter('mydate')($scope.bondIssueNew.RegistrationDate, "dd/MM/yyyy") : '';
            $scope.bondIssueNew.ReplacementDate = ($scope.bondIssueNew.ReplacementDate) ? $filter('mydate')($scope.bondIssueNew.ReplacementDate, "dd/MM/yyyy") : '';
            $scope.bondIssueNew.ReplacementEndDate = ($scope.bondIssueNew.ReplacementEndDate) ? $filter('mydate')($scope.bondIssueNew.ReplacementEndDate, "dd/MM/yyyy") : '';
            $scope.bondIssueNew.RepaymentDate = ($scope.bondIssueNew.RepaymentDate) ? $filter('mydate')($scope.bondIssueNew.RepaymentDate, "dd/MM/yyyy") : '';
            $scope.bondIssueNew.IssueDate = ($scope.bondIssueNew.IssueDate) ? $filter('mydate')($scope.bondIssueNew.IssueDate, "dd/MM/yyyy") : '';
            $scope.bondIssueNew.IssuerType = $scope.bondIssueNew.IssuerType.toString();
            $scope.bondIssueNew.PeriodType = $scope.bondIssueNew.PeriodType.toString();

            var today = new Date();
            $scope.bondIssueNew.PurchaseDeadlineDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), $scope.bondIssueNew.PurchaseDeadlineTime.Hours, $scope.bondIssueNew.PurchaseDeadlineTime.Minutes);
      
        
        }, function () {
            alert('Error getBondIssueForEdit');
        });
    };

    $scope.deleteBondIssue = function (deleteId) {
        $confirm({ title: 'Հեռացնե՞լ', text: 'Հեռացնե՞լ պարտատոմսի թողարկումը' })
            .then(function () {
                showloading();
                $scope.error = null;

                var Data = bondIssueService.deleteBondIssue(deleteId);
                Data.then(function (bond) {
                    if (validate($scope, bond.data)) {
                        CloseBPDialog('oneBondIssueDetails');
                        showMesageBoxDialog('Հեռացված է', $scope, 'information');
                        $scope.refreshBondIssues();
                        $scope.getBondIssuesList();
                        hideloading();
                    }
                    else {
                        hideloading();

                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function () {
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error deleteBondIssue');
                });
            });
    };

    $scope.approveBondIssue = function (getId) {
        $confirm({ title: 'Հաստատե՞լ', text: 'Հաստատե՞լ պարտատոմսի թողարկումը'})
            .then(function () {
                showloading();
                $scope.error = null;

                var Data = bondIssueService.approveBondIssue(getId);
                Data.then(function (bond) {
                    if (validate($scope, bond.data)) {
                        CloseBPDialog('oneBondIssueDetails');
                        showMesageBoxDialog('Հաստատված է', $scope, 'information');
                        $scope.refreshBondIssues();
                        $scope.getBondIssuesList();
                        hideloading();
                    }
                    else {
                        hideloading();

                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function () {
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error approveBondIssue');
                });
            });
    };
    
    $scope.getCurrencies = function () {
        var Data = infoService.getCurrenciesForBondIssue();
        Data.then(function (currency) {
            var currencies = currency.data;
           
            $scope.currencies = currency.data;

        }, function () {
            alert('Error getCurrencies');
        });
    };

    $scope.getBondIssueQualities = function () {
        var Data = infoService.getBondIssueQualities();
        Data.then(function (qualities) {
            $scope.bondIssueQualities = qualities.data;
        },function () {
            alert('Error getBondIssueQualities');
        });
    };
    
    $scope.getBondIssuesList = function () {
        $scope.loading = true;
        var Data = bondIssueService.getBondIssuesList($scope.filter, false);
        Data.then(function (bondIssuesList) {
            $scope.bondsIssuesList = bondIssuesList.data;
        },
        function () {
            $scope.loading = false;
            alert('Error getBondIssuesList');
        });
    };
    
    $scope.saveBondIssue = function () {
        if ($http.pendingRequests.length == 0) {
            
            $scope.bondIssueNew.ShareType = 1;

            document.getElementById("bondIssueSaveLoad").classList.remove("hidden");

            if ($scope.bondIssueNew.IssuerType == 3)
            {
                var minutes = $scope.bondIssueNew.PurchaseDeadlineDate.getMinutes()
                var hours = $scope.bondIssueNew.PurchaseDeadlineDate.getHours()
                $scope.bondIssueNew.PurchaseDeadlineTime = hours + ':' + minutes;
            }
      
           
            var Data = bondIssueService.saveBondIssue($scope.bondIssueNew);

            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    document.getElementById("bondIssueSaveLoad").classList.add("hidden");
                    CloseBPDialog('newbondissue');
                    var refreshScope = angular.element(document.getElementById('oneBondIssueDetails')).scope();
                    if (refreshScope != undefined) {
                        CloseBPDialog('oneBondIssueDetails');
                    }
                    showMesageBoxDialog('Պարտատոմսի մուտքագրումը կատարված է', $scope, 'information');
                    $scope.refreshBondIssues();
                    $scope.getBondIssuesList();
                }
                else {
                    document.getElementById("bondIssueSaveLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function (err) {
                document.getElementById("bondIssueSaveLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveBondIssue');
            });
        }

        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.refreshBondIssues = function () {
        var refreshScope = angular.element(document.getElementById('BondIssue')).scope()
        if (refreshScope != undefined) {
            refreshScope.getBondIssuesList();
        }
    };

    $scope.calculateTotalCount = function () {
        if ($scope.bondIssueNew.TotalVolume != undefined && $scope.bondIssueNew.NominalPrice != undefined && $scope.bondIssueNew.NominalPrice != 0)
        $scope.bondIssueNew.TotalCount = $scope.bondIssueNew.TotalVolume / $scope.bondIssueNew.NominalPrice;
    }

    $scope.calculateCouponRepaymentSchedule = function (bondIssue) {
        $scope.loading = true;
        var Data = bondIssueService.calculateCouponRepaymentSchedule(bondIssue);
        Data.then(function (schedule) {
            $scope.bondIssueSchedule = schedule.data;
        },
        function () {
            $scope.loading = false;
            alert('Error calculateCouponRepaymentSchedule');
        });
    };

    $scope.getCouponRepaymentSchedule = function (bondIssue) {
        $scope.loading = true;
        var Data = bondIssueService.getCouponRepaymentSchedule(bondIssue);
        Data.then(function (schedule) {
            $scope.bondIssueSchedule = schedule.data;
        },
        function () {
            $scope.loading = false;
            alert('Error getCouponRepaymentSchedule');
        });
    };

    $scope.getBondIssueCouponRepaymentSchedule = function (bondIssue, forNew) {
        if (forNew == 1)
        {
            $scope.calculateCouponRepaymentSchedule(bondIssue);
        }
        else
        {
            $scope.getCouponRepaymentSchedule(bondIssue);
        }
    };

    $scope.calculateRepaymentDate = function () {
        if ($scope.bondIssueNew.ReplacementDate != undefined && $scope.bondIssueNew.EditionCirculation != undefined && $scope.bondIssueNew.IssuerType == 3) {
            $scope.bondIssueNew.RepaymentDate = new Date($scope.bondIssueNew.ReplacementDate.getFullYear(), $scope.bondIssueNew.ReplacementDate.getMonth() + parseInt($scope.bondIssueNew.EditionCirculation), $scope.bondIssueNew.ReplacementDate.getDate());
        }

        else {
            $scope.bondIssueNew.RepaymentDate = undefined;
        }

    };

    $scope.getBondIssuerTypes = function () {
        var Data = infoService.getBondIssuerTypes();
        Data.then(function (types) {
            $scope.issuerTypes = types.data;
        }, function () {
            alert('Error getBondIssuerTypes');
        });
    };

    $scope.getBondIssuePeriodTypes = function () {
        var Data = infoService.getBondIssuePeriodTypes();
        Data.then(function (types) {
            $scope.periodTypes = types.data;
        }, function () {
            alert('Error getBondIssuePeriodTypes');
        });
    };
    
    $scope.clearBondIssueFields = function () {
        $scope.bondIssueNew.ISIN = null;
        $scope.bondIssueNew.Currency = null;
        $scope.bondIssueNew.TotalVolume = null;
        $scope.bondIssueNew.NominalPrice = null;
        $scope.bondIssueNew.EditionCirculation = null;
        $scope.bondIssueNew.InterestRate = null;
        $scope.bondIssueNew.CouponPaymentPeriodicity = null;
        $scope.bondIssueNew.RepaymentDate = null;
        $scope.bondIssueNew.ReplacementDate = null;
        $scope.bondIssueNew.ReplacementEndDate = null;
        $scope.bondIssueNew.TotalCount = null;
        $scope.bondIssueNew.MinSaleQuantity = null;
        $scope.bondIssueNew.MaxSaleQuantity = null;
        $scope.bondIssueNew.PurchaseDeadlineTime = null;
        $scope.bondIssueNew.IssueDate = null;
        $scope.bondIssueNew.CouponPaymentCount = null;
        $scope.bondIssueNew.PeriodType = null;
        $scope.bondIssueNew.BankAccount.AccountNumber = null;

    };

    $scope.issuerTypeChange = function () {
        $scope.clearBondIssueFields();

        if($scope.bondIssueNew.IssuerType == 3)
        {
            $scope.bondIssueNew.PeriodType = "1";
        }

    };
    
    $scope.initStockIssue = function () {
        //var Data = bondIssueService.getCheckedCustomerIsResident();
        //Data.then(function (types) {
            
        //}, function () {
        //        alert('Error getCheckedCustomerIsResident');
        //});        
        if ($scope.actionType != 2) {
            //Նոր թողարկում
            $scope.stockIssueNew = {};
            $scope.stockIssueNew.RegistrationDate = new Date();
            $scope.stockIssueNew.Quality = 1;
            $scope.stockIssueNew.BankAccount = {};
            $scope.stockIssueNew.BankAccountForNonResident = {};
            $scope.stockIssueNew.BankAccount.AccountNumber = "220004200055000";
            $scope.stockIssueNew.BankAccountForNonResident.AccountNumber = "220006190098000";
            $scope.stockIssueNew.OperationDescription = "Բաժնետոմսերի լրացուցիչ տեղաբաշխում";

            $scope.minRegDate = new Date();
            $scope.minRegDate.setDate($scope.stockIssueNew.RegistrationDate.getDate() - 1);
        }
        else {
            //Թողարկման խմբագրում
            //$scope.bondIssueNew.Quality = 11;  //Հաստատված
            $scope.getStockIssueForEdit($scope.bondIssueId);
        }
    };

    $scope.getStockIssueForEdit = function (id) {
        $scope.stockIssueNew = {};

        var Data = bondIssueService.getBondIssue(id);
        Data.then(function (b) {
            $scope.stockIssueNew = b.data;

            $scope.stockIssueNew.RegistrationDate = ($scope.stockIssueNew.RegistrationDate) ? $filter('mydate')($scope.stockIssueNew.RegistrationDate, "dd/MM/yyyy") : '';
            $scope.stockIssueNew.ReplacementDate = ($scope.stockIssueNew.ReplacementDate) ? $filter('mydate')($scope.stockIssueNew.ReplacementDate, "dd/MM/yyyy") : '';
            $scope.stockIssueNew.ReplacementEndDate = ($scope.stockIssueNew.ReplacementEndDate) ? $filter('mydate')($scope.stockIssueNew.ReplacementEndDate, "dd/MM/yyyy") : '';
            $scope.stockIssueNew.RepaymentDate = ($scope.stockIssueNew.RepaymentDate) ? $filter('mydate')($scope.stockIssueNew.RepaymentDate, "dd/MM/yyyy") : '';
            $scope.stockIssueNew.IssueDate = ($scope.stockIssueNew.IssueDate) ? $filter('mydate')($scope.stockIssueNew.IssueDate, "dd/MM/yyyy") : '';
            $scope.stockIssueNew.IssuerType = $scope.stockIssueNew.IssuerType.toString();
            $scope.stockIssueNew.DecisionDate = ($scope.stockIssueNew.DecisionDate) ? $filter('mydate')($scope.stockIssueNew.DecisionDate, "dd/MM/yyyy") : '';

            if ($scope.stockIssueNew.PlacementFactualCount == 0)
                $scope.stockIssueNew.PlacementFactualCount = "";

            if ($scope.stockIssueNew.ReplacementFactualEndDate != '/Date(-62135596800000)/')
                $scope.stockIssueNew.ReplacementFactualEndDate = ($scope.stockIssueNew.ReplacementFactualEndDate) ? $filter('mydate')($scope.stockIssueNew.ReplacementFactualEndDate, "dd/MM/yyyy") : '';

            var today = new Date();
            $scope.stockIssueNew.PurchaseDeadlineDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), $scope.stockIssueNew.PurchaseDeadlineTime.Hours, $scope.stockIssueNew.PurchaseDeadlineTime.Minutes);


        }, function () {
                alert('Error getStockIssueForEdit');
        });
    };

    $scope.calculateTotalVolume = function () {
        if ($scope.stockIssueNew.TotalCount != undefined && $scope.stockIssueNew.TotalCount != null && $scope.stockIssueNew.TotalCount != 0 &&
            $scope.stockIssueNew.NominalPrice != undefined && $scope.stockIssueNew.NominalPrice != null && $scope.stockIssueNew.NominalPrice != 0){

            $scope.stockIssueNew.TotalVolume = $scope.stockIssueNew.TotalCount * $scope.stockIssueNew.NominalPrice;

        }
    };

    $scope.saveStockIssue = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("bondIssueSaveLoad").classList.remove("hidden");

            if ($scope.stockIssueNew.IssuerType == 3) {
                var minutes = $scope.stockIssueNew.PurchaseDeadlineDate.getMinutes()
                var hours = $scope.stockIssueNew.PurchaseDeadlineDate.getHours()
                $scope.stockIssueNew.PurchaseDeadlineTime = hours + ':' + minutes;
            }

            $scope.stockIssueNew.ShareType = 2;

            var Data = bondIssueService.saveStockIssue($scope.stockIssueNew);

            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    document.getElementById("bondIssueSaveLoad").classList.add("hidden");
                    CloseBPDialog('newstockissue');
                    var refreshScope = angular.element(document.getElementById('oneBondIssueDetails')).scope();
                    if (refreshScope != undefined) {
                        CloseBPDialog('oneBondIssueDetails');
                    }
                    showMesageBoxDialog('Բաժնետոմսի մուտքագրումը կատարված է', $scope, 'information');
                    $scope.refreshBondIssues();
                    $scope.getBondIssuesList();
                }
                else {
                    document.getElementById("bondIssueSaveLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function (err) {
                document.getElementById("bondIssueSaveLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                    alert('Error saveStockIssue');
            });
        }

        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.setMinReplacementDate = function () {
        $scope.minReplacementDate = new Date();
        $scope.minReplacementDate.setDate($scope.stockIssueNew.ReplacementDate.getDate() - 1);
    };


    $scope.prepareForPlacement = function () {
        showloading();
        var Data = bondIssueService.postPrepareForPlacement($scope.bondIssue.ID);
        Data.then(function (res) {
            if (validate($scope, res.data)) {
                if (res.data.Count == 0) {
                    hideloading();
                    howMesageBoxDialog('Տեղաբաշխման գրանցման համար արժեթղթեր առկա չեն։ ', $scope, 'information');
                }
                else if (res.data.Count == undefined) {
                    hideloading();
                    showMesageBoxDialog(res.data, $scope, 'error');
                }
                else {
                    hideloading();
                    CloseBPDialog('oneBondIssueDetails');
                    showMesageBoxDialog(res.data.Count + ' արժեթղթի համար գործողությունը հաջողությամբ կատարվել է։', $scope, 'information');
                    $scope.refreshBondIssues();
                    $scope.getBondIssuesList();
                }
             
            }
            else {
                hideloading();
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function () {
            hideloading();
            alert('Error PostPrepareForPlacement');
        });
    };


    $scope.placeStocks = function () {
        showloading();
        var Data = bondIssueService.postPlaceStocks($scope.bondIssue.ID);
        Data.then(function (res) {
            if (validate($scope, res.data)) {
                if (res.data.Count == 0) {
                    hideloading();
                    howMesageBoxDialog('Տեղաբաշխման համար արժեթղթեր առկա չեն։ ', $scope, 'information');
                }
                else if (res.data.Count == undefined) {
                    hideloading();
                    showMesageBoxDialog(res.data, $scope, 'error');
                }
                else {
                    hideloading();
                    CloseBPDialog('oneBondIssueDetails');
                    showMesageBoxDialog('Կատարվել է ' + res.data.Count + ' հատ արժեթղթի տեղաբաշխում։', $scope, 'information');
                    $scope.refreshBondIssues();
                    $scope.getBondIssuesList();
                }
            }
            else {
                hideloading();
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function () {
            hideloading();
            alert('Error PostPlaceStocks');
        });
    };

}]); 