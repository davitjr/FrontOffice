app.service("outPutReportsService", ['$http', function ($http) {
    this.currentAccountJournalReport = function (startDate, endDate, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/CurrentAccountJournalReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format:format
            }

        });
        return response;
    };

    this.closedCurrentAccountJournalReport = function (startDate, endDate,format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/ClosedCurrentAccountJournalReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format
            }

        });
        return response;
    };


    this.transactionReport = function (startDate, endDate, filialCode, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/TransactionReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                filialCode: filialCode,
                format: format
            }

        });
        return response;
    };

    this.reopenededCurrentAccountJournalReport = function (startDate, endDate,format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/ReopenededCurrentAccountJournalReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format
            }

        });
        return response;
    };

    this.depositsJournalReport = function (startDate, endDate, setNumber, currency, depositType, quality,format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/DepositsJournalReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                setNumber: setNumber,
                currency: currency,
                depositType: depositType,
                quality: quality,
                format: format

            }

        });
        return response;
    };


    this.intraTransactionsByPeriodReport = function (startDate, endDate,format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/IntraTransactionsByPeriodReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format
            }

        });
        return response;
    };

    this.cashTransactionExceededReport = function (startDate, endDate,format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/CashTransactionExceededReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format
            }

        });
        return response;
    };

    this.cardsOverAccRestsReport = function (calculationDate,format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/CardsOverAccRestsReport",
            responseType: 'arraybuffer',
            params: {
                calculationDate: calculationDate,
                format: format
            }

        });
        return response;
    };

    this.givenCardsReport = function (startDate, endDate, dateType, cardSystemType, cardType, cardCurrency, relatedOfficeNumber,format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/GivenCardsReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                dateType: dateType,
                cardSystemType: cardSystemType,
                cardType: cardType,
                cardCurrency: cardCurrency,
                relatedOfficeNumber: relatedOfficeNumber,
                format: format
            }

        });
        return response;
    };

    this.printProvisionsReport = function (startDate, endDate, activeType,loanType, quality,format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintProvisionsReport",
            responseType: 'arraybuffer',
            params: {
                startDate:startDate,
                endDate:endDate,
                activeType:activeType,
                loanType:loanType,
                quality: quality,
                format: format
            }
        });
        return response;
    };

    this.printPeriodicTransferReport = function (startDate, endDate, format, obp_Starts, periodicTransferType) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintPeriodicTransferReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format,
                obpStarts: obp_Starts,
                periodicTransferType: periodicTransferType
            }
        });
        return response;
    };
    this.printClosedDepositReport = function (startDate, endDate, format, reportType ) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintClosedDepositReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format,
                reportType: reportType
            }
        });
        return response;
    };

    this.printDailyBalanceReport = function (startDate, endDate, format, byOldPlan ) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintDailyBalanceReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format,
                byOldPlan: byOldPlan
            }
        });
        return response;
    };

    this.printCashJurnalReport = function (startDate, cashJurnalType, onlyInkasDepartment, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintCashJurnalReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                cashJurnalType: cashJurnalType,
                onlyInkasDepartment: onlyInkasDepartment,
                format: format,
            }
        });
        return response;
    };

    this.cashTotalQuantityReport = function (startDate, onlyInkasDepartment, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/CashTotalQuantityReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                format: format,
                onlyInkasDepartment: onlyInkasDepartment
            }
        });
        return response;
    };

    this.transfersByCallReport = function (startDate, endDate, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/TransfersByCallReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format
            }

        });
        return response;
    };

    this.hbActiveUsersReport = function (format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/HBActiveUsersReport",
            responseType: 'arraybuffer',
            params: {
                format: format
            }

        });
        return response;
    };

    this.printNotMaturedLoans = function (format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintNotMaturedLoans",
            responseType: 'arraybuffer',
            params: {
                format: format
            }
        });
        return response;
    };

    this.printSSTOperationsReport = function (startDate, endDate, format, authId, SSTerminalId, SSTOperationType, SSTOperationStatus, SSTReportType) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintSSTOperationsReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format,
                authId: authId,
                SSTerminalId: SSTerminalId,
                SSTOperationType: SSTOperationType,
                SSTOperationStatus: SSTOperationStatus,
                SSTReportType: SSTReportType
            }
        });
        return response;
    };

    this.printEOGetClientResponsesReport = function (startDate, endDate, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintEOGetClientResponsesReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format
            }

        });
        return response;
    };


    this.forgivenessReport = function (startDate, endDate, filialCode, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/ForgivenessReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                filialCode: filialCode,
                format: format
            }

        });
        return response;
    };

    this.GetFilialList = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetFilialList",
        });
        return response;
    };

    this.GetUserFilialCode = function () {
        var response = $http({
            method: "post",
            url: "/OutPutReports/GetUserFilialCode",
        });
        return response;
    };
    this.getHBApplicationReport = function (Date, filialCode, HBApplicationReportType) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/GetHBApplicationReport",
            responseType: 'arraybuffer',
            params: {
                endDate: Date,
                filialCode: filialCode,
                HBApplicationReportType: HBApplicationReportType
            }
        });
        return response;
    };

    this.printHBApplicationsAndOrdersReport = function (startDate, endDate, filialCode, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintHBApplicationsAndOrdersReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                filialCode: filialCode,
                format: format

            }

        });
        return response;
    };

    this.printAparikReport = function (aparikReportType, startDate, endDate, calculationDate, fundType, shopIdentityIDList, shopIDList, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintAparikReport",
            responseType: 'arraybuffer',
            params: {
                aparikReportType: aparikReportType,
                startDate: startDate,
                endDate: endDate,
                calculationDate: calculationDate,
                fundType: fundType,
                shopIdentityIDList: shopIdentityIDList,
                shopIDList: shopIDList,
                format: format
            }
        });
        return response;
    };

    this.printCardsToBeShippedReport = function (startDate, endDate, filialcode, cardNumber, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintCardsToBeShippedReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                filialCode: filialcode,
                cardNumber: cardNumber,
                format: format
            }
        });
        return response;
    };
            


    ////  Տերմինալների հաշվետվություն
    this.terminalReport = (date, terminalId, format) => {
        const response = $http({
            method: "post",
            url: "/OutPutReports/TerminalReport",
            responseType: 'arraybuffer',
            params: {
                date: date,
                terminalId: terminalId,
                format: format
            }
        });
        return response;
    }
            

    this.printVirtualCardsReport = function (startDate, endDate, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintVirtualCardsReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format
            }

        });
        return response;
    };

    this.printRemoteServicesMonitoringReport = function (startDate, endDate) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintRemoteServicesMonitoringReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
            }
        });
        return response;
    };

    this.printVDTransfersReport = function (startDate, endDate, format) {
        var response = $http({
            method: "post",
            url: "/OutPutReports/PrintVDTransfersReport",
            responseType: 'arraybuffer',
            params: {
                startDate: startDate,
                endDate: endDate,
                format: format
            }

        });
        return response;
    };
    
}]);