app.controller("OutPutReportsCtrl", ['$scope', 'outPutReportsService', 'dateFilter', 'infoService', '$uibModal', 'loanService', function ($scope, outPutReportsService, dateFilter, infoService, $uibModal, loanService) {

    $scope.$root.OpenMode = 8;
    $scope.$root.UserFilial = 0;
    $scope.searchParams = {};
    $scope.searchParams.StartDate = new Date();
    $scope.searchParams.EndDate = new Date();
    $scope.searchParams.Date = new Date();
    $scope.searchParams.calculationDate = new Date();
    $scope.searchParams.HBApplicationReportType;
    $scope.searchParams.selectedShop = [];
    $scope.searchParams.selectedShopID = [];
    //Տերմինալների հաշվետվություն
    $scope.searchParams.terminalId = 0;

    //defaults
    $scope.searchParams.dateType = "1";
    $scope.searchParams.activeType = "0";
    $scope.searchParams.quality = "1";
    $scope.searchParams.loanType = "1";


    //Առաքման ենթակա քարտեր
    $scope.searchParams.cardNumber = "";

    $scope.showSearchParamByReportType = function (reportType) {
        $scope.showUserID = false;
        $scope.showCurrency = false;
        $scope.showDepositType = false;
        $scope.showStartDate = false;
        $scope.showEndDate = false;
        $scope.showCalculationDate = false;

        $scope.showDateType = false;
        $scope.showCard = false;
        $scope.showRelatedOfficeNumber = false;

        $scope.showActiveType = false;
        $scope.showLoanType = false;
        $scope.showQuality = false;
        $scope.showPDF = true;

        $scope.showCardNumber = false;

        ////////145/////////////
        $scope.showPeriodicTransfersType = false;
        $scope.showOBPStarts = false;

        //////146/////////////////
        $scope.showClosedDepositType = false;


        //////150/////////////////
        $scope.showFilialCode = false;

        /////155///////
        $scope.showHBApplicationReportType = false;
        $scope.showDate = false;


        /////154/////
        $scope.showFilialList = false;

        ////1/////////////////////////

        $scope.showDailyBalance = false;

        ////////151//////////////
        $scope.showSSTparams = false;
        $scope.showSSTReportTypes = false;

        ////////156/////////
        $scope.showAparikReportTypes = false;
        $scope.showShopList = false;
        $scope.showfundType = false;

        /////////////CashJurnal Reports //////////////////
        $scope.showTypeOfCashJurnal = false;
        $scope.showOnlyInkasDepartment = false;

        ///////Տերմինալների հաշվետվություն   159/////
        $scope.showTerminalId = false;


        switch (reportType) {
            case "105":
                $scope.showUserID = true;
                $scope.showCurrency = true;
                $scope.showDepositType = true;
                break;
            case "106":
                $scope.showUserID = true;
                $scope.showCurrency = true;
                $scope.showDepositType = true;
                $scope.showStartDate = true;
                $scope.showEndDate = true;
                break;
            case "15":
            case "20":
            case "142":
            case "141":
            case "139":
            case "148":
                {
                    $scope.showStartDate = true;
                    $scope.showEndDate = true;
                    break;
                }
            case "45":
                $scope.showCalculationDate = true;
                break;
            case "52":
                $scope.showCurrency = true;
                $scope.showStartDate = true;
                $scope.showEndDate = true;

                $scope.showDateType = true;
                $scope.showCard = true;
                $scope.showRelatedOfficeNumber = true;
                break;
            case "144":
                $scope.showStartDate = true;
                $scope.showEndDate = true;


                $scope.showLoanType = true;
                $scope.showQuality = true;
                $scope.showActiveType = true;
                break;

            case "145":
                $scope.showPeriodicTransfersType = true;
                $scope.periodicTransferType = 0;
                $scope.OBP_Starts = 3;
                break;

            case "146":
                $scope.showStartDate = true;
                $scope.showEndDate = true;
                $scope.showClosedDepositType = true;
                break;

            case "1":
                $scope.showStartDate = true;
                $scope.showEndDate = true;
                $scope.showDailyBalance = true;
                break;
            case "147":
                $scope.showStartDate = true;
                $scope.showTypeOfCashJurnal = true;
                $scope.showOnlyInkasDepartment = true;
                $scope.searchParams.onlyInkasDepartment = 1;
                $scope.searchParams.cashJurnalType = 0;
                break;
            case "29":
                $scope.showStartDate = true;
                $scope.showOnlyInkasDepartment = true;
                break;
            case "151":
                $scope.showSSTReportTypes = true;
                break;
            case "153":
                $scope.showStartDate = true;
                $scope.showEndDate = true;
                break;
            case "150":
                {
                    $scope.GetUserFilialCode();
                    $scope.showStartDate = true;
                    $scope.showEndDate = true;
                    $scope.showPDF = false;
                    if ($scope.UserFilial == 22000) {
                        $scope.showFilialCode = true;
                    }
                    break;
                }
            case "152":
                {
                    $scope.GetUserFilialCode();
                    $scope.showStartDate = true;
                    $scope.showEndDate = true;
                    $scope.showPDF = false;
                    if ($scope.UserFilial == 22000) {
                        $scope.showFilialList = true;
                    }
                    break;
                }
            case "155":
                {
                    $scope.GetUserFilialCode();
                    $scope.showDate = true;
                    $scope.showPDF = false;
                    $scope.showHBApplicationReportType = true;
                    if ($scope.UserFilial == 22000) {
                        $scope.showFilialList = true;
                    }
                    break;
                }
            case "154":
                {
                    $scope.GetUserFilialCode();
                    $scope.showStartDate = true;
                    $scope.showEndDate = true;
                    if ($scope.UserFilial == 22000) {
                        $scope.showFilialList = true;
                    }
                    break;
                }
            case "156":
                {
                    $scope.showAparikReportTypes = true;
                    break;
                }
            //Առաքման ենթակա քարտեր
            case '160':
                {
                    $scope.showStartDate = true;
                    $scope.showEndDate = true;
                    $scope.showCardNumber = true;
                    $scope.showFilialCode = true;
                    break;
                }
            // Տերմինալների հաշվետվություն
            case '159':
                {
                    $scope.showTerminalId = true;
                    break;
                }
            case "162":
                {
                    $scope.showStartDate = true;
                    $scope.showEndDate = true;
                    $scope.showPDF = false;
                    break;
                }
            case "161":
                {
                    $scope.showStartDate = true;
                    $scope.showEndDate = true;
                    $scope.showPDF = false;
                    break;
                }
            case "163":
                {
                    $scope.showStartDate = true;
                    $scope.showEndDate = true;
                    $scope.showPDF = false;
                    break;
                }
            default: break;

        }
    };

    $scope.currentAccountJournalReport = function (format) {
        showloading();

        var startDate = null;
        var endDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        var Data = outPutReportsService.currentAccountJournalReport(startDate, endDate, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'CurrentAccountJournalReport');
        }
    };

    $scope.transfersByCallReport = function (format) {
        showloading();

        var startDate = null;
        var endDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        var Data = outPutReportsService.transfersByCallReport(startDate, endDate, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'transfersByCallReport');
        }
    };

    $scope.closedCurrentAccountJournalReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        var Data = outPutReportsService.closedCurrentAccountJournalReport(startDate, endDate, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'ClosedCurrentAccountJournalReport');
        }
    };

    $scope.reopenededCurrentAccountJournalReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        var Data = outPutReportsService.reopenededCurrentAccountJournalReport(startDate, endDate, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'ReopenededCurrentAccountJournalReport');
        }

    };

    $scope.getPrintReportTypes = function () {
        var Data = infoService.getPrintReportTypes();
        Data.then(function (ord) {
            $scope.printReportTypes = ord.data;
        }, function () {
            alert('Error getPrintReportTypes');
        });
    };

    //  Տերմինալների հաշվետվություն

    $scope.terminalReport = function (format) {
        showloading();
        let date = null;
        let terminalId = null;

        //ստուգել մւտքագրված տվյալները 

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }
        else if (date > new Date()) {
            showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
            hideloading();
            return
        }
        else {
            showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.terminalId == null) {
            showMesageBoxDialog('Տերմինալի համարը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }
        else if ($scope.searchParams.terminalId.length < 8) {
            showMesageBoxDialog('Տերմինալի համարը պետք է լինի 8 նիշ', $scope, 'error');
            hideloading();
            return;
        }
        else {
            terminalId = $scope.searchParams.terminalId;
        }

        //տվյալների ճիշտ լինելու դեպքում կատարել տվյալների ֆորմատ

        let data = outPutReportsService.terminalReport(date, terminalId, format);
        if (format == 1) {
            ShowPDF(data);
        }
        else if (format == 2) {
            ShowExcel(data, 'terminalReport');
        }
    };

    $scope.printReport = function (format) {

        switch ($scope.searchParams.ReportType) {

            case "15":
                $scope.currentAccountJournalReport(format);
                break;
            case "20":
                $scope.closedCurrentAccountJournalReport(format);
                break;
            case "105":
                $scope.depositsJournalReport(1, format);
                break;
            case "106":
                $scope.depositsJournalReport(0, format);
                break;
            case "142":
                $scope.reopenededCurrentAccountJournalReport(format);
                break;
            case "141":
                $scope.intraTransactionsByPeriodReport(format);
                break;
            case "139":
                $scope.cashTransactionExceededReport(format);
                break;
            case "45":
                $scope.cardsOverAccRestsReport(format);
                break;
            case "52":
                $scope.givenCardsReport(format);
                break;
            case "143":
                $scope.printNotMaturedLoans(format);
                break;
            case "144":
                $scope.printProvisionsReport(format);
                break;
            case "145":
                $scope.printPeriodicTransferReport(format);
                break;
            case "146":
                $scope.printClosedDepositReport(format);
                break;
            case "1":
                $scope.printDailyBalanceReport(format);
                break;
            case "147":
                $scope.printCashJurnalReport(format);
                break;
            case "29":
                $scope.cashTotalQuantityReport(format);
                break;
            case "148":
                $scope.transfersByCallReport(format);
                break;
            case "149":
                $scope.hbActiveUsersReport(format);
                break;
            case "150":
                $scope.forgivenessReport(format);
                break;
            case "151":
                $scope.printSSTOperationsReport(format);
                break;
            case "153":
                $scope.printEOGetClientResponsesReport(format);
                break;
            case "152":
                $scope.transactionReport(format);
                break;
            case "155":
                $scope.getHBApplicationReport(format);
                break;
            case "154":
                $scope.printHBApplicationsAndOrdersReport(format);
                break;
            case "156":
                $scope.printAparikReport(format);
                break;
            case "160":
                $scope.printCardsToBeShippedReport(format);
                break;
            case "159":
                $scope.terminalReport(format);
                break;

            case "162":
                $scope.printVirtualCardsReport(format);
                break;
            case "161":
                $scope.printRemoteServicesMonitoringReport();
                break;
            case "163":
                $scope.printVDTransfersReport(format);
                break;
            default:
                showMesageBoxDialog('Ընտրեք հաշվետվության տեսակը', $scope, 'error');
                break;
        }

    };

    $scope.getDepositTypes = function () {
        var Data = infoService.getDepositTypes();
        Data.then(function (ord) {
            $scope.depositTypes = ord.data;
        }, function () {
            alert('Error getDepositTypes');
        });
    };

    $scope.searchCashiers = function () {
        $scope.searchCashiersModalInstance = $uibModal.open({
            template: '<searchcashier callback="getSearchedCashier(cashier)" close="closeSearchCashiersModal()"></searchcashier>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static'
        });


        $scope.searchCashiersModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };
    $scope.getSearchedCashier = function (cashier) {
        $scope.searchParams.UserID = cashier.setNumber;
        //$scope.CasherDescription = cashier.firstName + ' ' + cashier.lastName;
        $scope.closeSearchCashiersModal();
    }

    $scope.closeSearchCashiersModal = function () {
        $scope.searchCashiersModalInstance.close();
    }

    $scope.depositsJournalReport = function (quality, format) {
        showloading();
        var startDate = null;
        var endDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');

        var setNumber = 0;
        var currency = null;
        var depositType = 0;
        if ($scope.searchParams.UserID != undefined)
            setNumber = $scope.searchParams.UserID;

        if ($scope.searchParams.Currency != undefined)
            currency = $scope.searchParams.Currency;

        if ($scope.searchParams.DepositType != undefined)
            depositType = $scope.searchParams.DepositType;



        var Data = outPutReportsService.depositsJournalReport(startDate, endDate, setNumber, currency, depositType, quality, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'DepositsJournalReport');
        }

    };

    $scope.getCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (ord) {
            $scope.currencies = ord.data;
        }, function () {
            alert('Error getCurrencies');
        });
    };


    $scope.intraTransactionsByPeriodReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }
        var Data = outPutReportsService.intraTransactionsByPeriodReport(startDate, endDate, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'IntraTransactionsByPeriodReport');
        }

    };

    $scope.cashTransactionExceededReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }
        var Data = outPutReportsService.cashTransactionExceededReport(startDate, endDate, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'CashTransactionExceededReport');
        }

    };


    $scope.cardsOverAccRestsReport = function (format) {
        showloading();
        var calculationDate = null;
        if ($scope.searchParams.calculationDate != undefined)
            calculationDate = dateFilter($scope.searchParams.calculationDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }
        var Data = outPutReportsService.cardsOverAccRestsReport(calculationDate, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'CardsOverAccRestsReport');
        }

    };


    $scope.givenCardsReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        var dateType = null;
        var cardSystemType = null;
        var cardType = null;
        var cardCurrency = null;

        var relatedOfficeNumber = 0;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');

        if ($scope.searchParams.dateType != undefined)
            dateType = $scope.searchParams.dateType;

        if ($scope.searchParams.cardSystemType != undefined)
            cardSystemType = $scope.searchParams.cardSystemType;

        if ($scope.searchParams.cardType != undefined)
            cardType = $scope.searchParams.cardType;

        if ($scope.searchParams.Currency != undefined)
            cardCurrency = $scope.searchParams.Currency;

        if ($scope.searchParams.relatedOfficeNumber != undefined)
            relatedOfficeNumber = $scope.searchParams.relatedOfficeNumber;


        var Data = outPutReportsService.givenCardsReport(startDate, endDate, dateType, cardSystemType, cardType, cardCurrency, relatedOfficeNumber, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'GivenCardsReport');
        }

    };

    $scope.printProvisionsReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        var activeType = null;
        var loanType = null;
        var quality = null;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');

        if ($scope.searchParams.activeType != undefined)
            activeType = $scope.searchParams.activeType;

        if ($scope.searchParams.loanType != undefined)
            loanType = $scope.searchParams.loanType;
        else {
            showMesageBoxDialog('Վարկի տեսակը ընտրված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.quality != undefined)
            quality = $scope.searchParams.quality;

        var Data = outPutReportsService.printProvisionsReport(startDate, endDate, activeType, loanType, quality, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'PrintProvisionsReport');
        }

    };


    $scope.printNotMaturedLoans = function (format) {
        showloading();
        var Data = outPutReportsService.printNotMaturedLoans(format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'NotMaturedLoans');
        }

    };



    $scope.getCardSystemTypes = function () {
        var Data = infoService.GetCardSystemTypes();
        Data.then(function (ref) {
            $scope.cardSystemTypes = ref.data;
        }, function () {
            alert('Error CardSystemTypes');
        });
    };

    $scope.getCardTypes = function (cardSystem) {
        var Data = infoService.getCardTypes(cardSystem);
        Data.then(function (ref) {
            $scope.cardTypes = ref.data;
        }, function () {
            alert('Error CardTypes');
        });
    };

    $scope.getLoanTypes = function () {
        $scope.searchParams.loanType = undefined;
        if ($scope.searchParams.activeType == '1' || $scope.searchParams.activeType == '2') {
            $scope.loanTypes = [];
            $scope.loanTypes['8'] = 'Վարկային գիծ';
            $scope.loanTypes['18'] = 'Ընթացիկ հաշվի վ/գիծ';

        }
        else {
            var Data = infoService.getLoanTypes();
            Data.then(function (acc) {
                $scope.loanTypes = acc.data;
            }, function () {
                alert('Error getLoanTypes');
            });
        }

    };

    $scope.showPeriodicTransfer = function () {
        $scope.showStartDate = false;
        $scope.showEndDate = false;
        $scope.showOBPStarts = false;

        if ($scope.periodicTransferType == 1) {
            $scope.showStartDate = true;
            $scope.showEndDate = true;
            $scope.showOBPStarts = true;
        }
        else if ($scope.periodicTransferType == 2) {
            $scope.showStartDate = true;
            $scope.showEndDate = true;
            $scope.showOBPStarts = true;
        }
        else if ($scope.periodicTransferType == 3) {
            $scope.showOBPStarts = true;
        }
        else if ($scope.periodicTransferType == 4) {
            $scope.showStartDate = true;
            $scope.showEndDate = true;
            $scope.showOBPStarts = true;
        }
    }


    $scope.printPeriodicTransferReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        var obp_Starts = 0;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');

        if ($scope.searchParams.OBP_Starts != undefined)
            obp_Starts = $scope.searchParams.OBP_Starts;


        var Data = outPutReportsService.printPeriodicTransferReport(startDate, endDate, format, obp_Starts, $scope.periodicTransferType);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'printPeriodicTransferReport');
        }

    };


    $scope.printClosedDepositReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        var reportType = 0;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');

        if ($scope.searchParams.closedDepositReportType != undefined)
            reportType = $scope.searchParams.closedDepositReportType;


        var Data = outPutReportsService.printClosedDepositReport(startDate, endDate, format, reportType);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'printPeriodicTransferReport');
        }


    }


    $scope.printDailyBalanceReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        var byOldPlan = false;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');

        if ($scope.searchParams.byOldPlan != undefined)
            byOldPlan = $scope.searchParams.byOldPlan;


        var Data = outPutReportsService.printDailyBalanceReport(startDate, endDate, format, byOldPlan);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'printPeriodicTransferReport');
        }


    }


    $scope.printCashJurnalReport = function (format) {
        showloading();
        var startDate = null;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        var Data = outPutReportsService.printCashJurnalReport(startDate, $scope.searchParams.cashJurnalType, $scope.searchParams.onlyInkasDepartment, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'printCashJurnalReport');
        }


    }


    $scope.cashTotalQuantityReport = function (format) {
        showloading();
        var startDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        var Data = outPutReportsService.cashTotalQuantityReport(startDate, $scope.searchParams.onlyInkasDepartment, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'printPeriodicTransferReport');
        }

    }

    $scope.hbActiveUsersReport = function (format) {
        showloading();
        var Data = outPutReportsService.hbActiveUsersReport(format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'hbActiveUsersReport');
        }
    };

    $scope.showSSTerminalParams = function () {
        $scope.showStartDate = false;
        $scope.showEndDate = false;
        $scope.showSSTparams = false;
        if ($scope.searchParams.SSTReportType == 1 || $scope.searchParams.SSTReportType == 2) {
            $scope.showStartDate = true;
            $scope.showEndDate = true;
            $scope.showSSTparams = true;
        }
        else if ($scope.searchParams.SSTReportType == 3) {
            $scope.showStartDate = true;
            $scope.showEndDate = true;
        }
    };

    $scope.getSSTOperationTypes = function () {
        var Data = infoService.getSSTOperationTypes();
        Data.then(function (ord) {
            $scope.SSTOperationTypes = ord.data;
        }, function () {
            alert('Error getSSTOperationTypes');
        });
    };

    $scope.getSSTerminals = function () {
        var Data = infoService.getSSTerminals();
        Data.then(function (ord) {
            $scope.SSTerminals = ord.data;
        }, function () {
            alert('Error getSSTerminals');
        });
    };

    $scope.printSSTOperationsReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        var authId = null;
        var SSTerminalId = null;
        var SSTOperationType = null;
        var SSTOperationStatus = null;
        var SSTReportType = null;


        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');

        if ($scope.searchParams.authId != undefined)
            authId = $scope.searchParams.authId;

        if ($scope.searchParams.SSTerminalId != undefined)
            SSTerminalId = $scope.searchParams.SSTerminalId;

        if ($scope.searchParams.SSTOperationType != undefined)
            SSTOperationType = $scope.searchParams.SSTOperationType;

        if ($scope.searchParams.SSTOperationStatus != undefined)
            SSTOperationStatus = $scope.searchParams.SSTOperationStatus;

        if ($scope.searchParams.SSTReportType != undefined)
            SSTReportType = $scope.searchParams.SSTReportType;
        else {
            showMesageBoxDialog('Հաշվետվության տեսակն ընտրված չէ', $scope, 'error');
            hideloading();
            return;
        }
        if (startDate != null && endDate != null && startDate > endDate) {
            showMesageBoxDialog('Մուտքագրված է սխալ ամսաթիվ', $scope, 'error');
            hideloading();
            return;
        }

        var Data = outPutReportsService.printSSTOperationsReport(startDate, endDate, format, authId, SSTerminalId, SSTOperationType, SSTOperationStatus, SSTReportType);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'printSSTOperationsReport');
        }


    }
    $scope.printEOGetClientResponsesReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');

        var Data = outPutReportsService.printEOGetClientResponsesReport(startDate, endDate, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'printEOGetClientResponsesReport');
        }
    }
    $scope.forgivenessReport = function (format) {
        showloading();

        var startDate = null;
        var endDate = null;
        var filialCode = null;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if (endDate < startDate) {
            showMesageBoxDialog('Սկիզբը ավելի մեծ է քան վերջը', $scope, 'error');
            hideloading();
            return;
        }

        filialCode = $scope.searchParams.filialCode;

        var Data = outPutReportsService.forgivenessReport(startDate, endDate, filialCode, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'forgivenessReport');
        }
    };

    $scope.getFilialList = function () {
        var Data = outPutReportsService.GetFilialList();
        Data.then(function (options) {
            $scope.FilialList = options.data;
        }, function () {
            alert('Error GetFilialList');
        });
    };

    $scope.GetUserFilialCode = function () {
        var Data = outPutReportsService.GetUserFilialCode();
        Data.then(function (options) {
            $scope.UserFilial = options.data;
        }, function () {
            alert('Error GetUserFilialCode');
        });
    };


    $scope.transactionReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        var filialCode = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if (endDate < startDate) {
            showMesageBoxDialog('Սկիզբը ավելի մեծ է քան վերջը', $scope, 'error');
            hideloading();
            return;
        }

        filialCode = $scope.searchParams.filialCode;

        var Data = outPutReportsService.transactionReport(startDate, endDate, filialCode, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'OnlineBankingOrdersReport');
        }

    };


    $scope.getHBApplicationReportType = function () {
        var Data = infoService.getHBApplicationReportType();
        Data.then(function (ord) {
            $scope.HBApplicationReportType = ord.data;
        }, function () {
            alert('Error getHBApplicationReportType');
        });
    };


    $scope.getHBApplicationReport = function () {
        showloading();
        var Date = null;
        var filialCode = null;
        var HBApplicationReportType = 0;

        if ($scope.searchParams.Date != undefined)
            Date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Ամսաթիվը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.HBApplicationReportType != undefined)
            HBApplicationReportType = $scope.searchParams.HBApplicationReportType;
        else {
            showMesageBoxDialog('Հաշվետվության տեսակը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        filialCode = $scope.searchParams.filialCode;

        var Data = outPutReportsService.getHBApplicationReport(Date, filialCode, HBApplicationReportType);
        ShowExcel(Data, 'getHBApplicationReport');

    };

    $scope.printHBApplicationsAndOrdersReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        var filialCode = null;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if (startDate != null && endDate != null && startDate > endDate) {
            showMesageBoxDialog('Մուտքագրված է սխալ ամսաթիվ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.filialCode != undefined)
            filialCode = $scope.searchParams.filialCode;

        var Data = outPutReportsService.printHBApplicationsAndOrdersReport(startDate, endDate, filialCode, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'PrintHBApplicationsAndOrdersReport');
        }
    };


    $scope.getShopList = function () {
        var Data = infoService.getShopList();
        Data.then(function (ord) {
            $scope.shopList = ord.data;
        }, function () {
            alert('Error getShopList');
        });
    };

    $scope.showAparikReportParams = function () {
        $scope.showShopList = true;
        $scope.showfundType = false;
        $scope.showStartDate = false;
        $scope.showEndDate = false;
        $scope.showCalculationDate = false;

        if ($scope.searchParams.AparikReportType == 1) {
            $scope.showStartDate = true;
            $scope.showEndDate = true;
            $scope.showfundType = true;
        }
        else if ($scope.searchParams.AparikReportType == 2) {
            $scope.showStartDate = true;
            $scope.showEndDate = true;
        }
        else if ($scope.searchParams.AparikReportType == 3) {
            $scope.showCalculationDate = true;
        }
    };

    $scope.printAparikReport = function (format) {
        showloading();
        var aparikReportType = null;
        var startDate = null;
        var endDate = null;
        var calculationDate = null;
        var fundType = null;
        var shopIdentityIDList = '';
        var shopIDList = '';

        if ($scope.searchParams.selectedShopID.length > 0) {
            $scope.getSelectedShopIDs = function () {
                var selectedShopIDs = '';
                for (var i = 0; i < $scope.searchParams.selectedShopID.length; i++) {
                    selectedShopIDs += $scope.searchParams.selectedShopID[i] + ',';
                }
                selectedShopIDs = selectedShopIDs.slice(0, -1);
                return selectedShopIDs;
            }
            shopIDList = $scope.getSelectedShopIDs();
        }
        else if ($scope.searchParams.selectedShop.length > 0) {
            $scope.getSelectedIdentityIDs = function () {
                var selectedIdentityIDs = '';
                for (var i = 0; i < $scope.searchParams.selectedShop.length; i++) {
                    selectedIdentityIDs += $scope.searchParams.selectedShop[i] + ',';
                }
                selectedIdentityIDs = selectedIdentityIDs.slice(0, -1);
                return selectedIdentityIDs;
            }
            shopIdentityIDList = $scope.getSelectedIdentityIDs();
        }

        if ($scope.searchParams.AparikReportType != undefined)
            aparikReportType = $scope.searchParams.AparikReportType;
        else {
            showMesageBoxDialog('Հաշվետվության տեսակն ընտրված չէ', $scope, 'error');
            hideloading();
            return;
        }
        if (aparikReportType == 1 || aparikReportType == 2) {
            if ($scope.searchParams.StartDate != undefined)
                startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
            else {
                showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
                hideloading();
                return;
            }

            if ($scope.searchParams.EndDate != undefined)
                endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
            else {
                showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
                hideloading();
                return;
            }

            if (startDate != null && endDate != null && startDate > endDate) {
                showMesageBoxDialog('Մուտքագրված է սխալ ամսաթիվ', $scope, 'error');
                hideloading();
                return;
            }
        }
        else {
            if ($scope.searchParams.calculationDate != undefined)
                calculationDate = dateFilter($scope.searchParams.calculationDate, 'yyyy/MM/dd');
            else {
                showMesageBoxDialog('Հաշվարկման ամսաթիվը նշված չէ', $scope, 'error');
                hideloading();
                return;
            }
        }

        if ($scope.searchParams.fundType != undefined)
            fundType = $scope.searchParams.fundType;

        var Data = outPutReportsService.printAparikReport(aparikReportType, startDate, endDate, calculationDate, fundType, shopIdentityIDList, shopIDList, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'AparikReport');
        }
    };
    $scope.printCardsToBeShippedReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        var filialcode = null;
        var cardNumber = null;

        if ($scope.searchParams.StartDate != undefined) {
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        }

        if ($scope.searchParams.EndDate != undefined) {
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        }
        if ($scope.searchParams.filialCode != undefined) {
            filialcode = $scope.searchParams.filialCode;
        }

        if ($scope.searchParams.cardNumber != "") {
            cardNumber = $scope.searchParams.cardNumber;
        }

        var Data = outPutReportsService.printCardsToBeShippedReport(startDate, endDate, filialcode, cardNumber, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'cardsToBeShippedReport');
        }
    }

    $scope.printVirtualCardsReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');

        var Data = outPutReportsService.printVirtualCardsReport(startDate, endDate, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'printVirtualCardsReport');
        }
    }

    $scope.printRemoteServicesMonitoringReport = function () {
        showloading();
        var startDate = null;
        var endDate = null;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        var Data = outPutReportsService.printRemoteServicesMonitoringReport(startDate, endDate);
        ShowExcel(Data, 'RemoteServicesMonitoringReport');
    };

    $scope.printVDTransfersReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;

        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'yyyy/MM/dd');

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'yyyy/MM/dd');

        var Data = outPutReportsService.printVDTransfersReport(startDate, endDate, format);
        if (format == 1) {
            ShowPDF(Data);
        }
        else if (format == 2) {
            ShowExcel(Data, 'printVirtualCardsReport');
        }
    }

}]);
