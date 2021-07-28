app.service("accountService",['$http', function ($http) {

    this.getAccounts = function () {
        return $http.get("/Account/GetAllAccounts");
    };

    this.getAccount = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetAccount",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };

    this.getCurrentAccount = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetCurrentAccount",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };

    this.GetListAccount = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetListAccount",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };


    this.GetCustomerTransitAccounts = function (filter) {
        var response = $http({
            method: "post",
            url: "/Account/GetCustomerTransitAccounts",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.GetCurrentAccounts = function (filter) {
        var response = $http({
            method: "post",
            url: "/Account/GetCurrentAccounts",
            params: {
                filter: filter
            }
        });
        return response;
    };



    this.getAccountStatement = function (accountNumber, dateFrom, dateTo) {
        var response = $http({
            method: "post",
            url: "/Account/GetAccountStatement",
            params: {
                accountNumber: accountNumber,
                dateFrom: dateFrom,
                dateTo: dateTo
            }
        });
        return response;
    };

    this.isPoliceAccount = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/IsPoliceAccount",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };

    this.checkAccountForPSN = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/CheckAccountForPSN",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };    



    this.getAccountJointCustomers = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetAccountJointCustomers",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };

    this.getAccountOpenContract = function (accountNumber, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/Account/GetAccountOpenContract",
            responseType: 'arraybuffer',
            params: {
                accountNumber: accountNumber,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };

    this.getAccountAdditionalDetails = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetAccountAdditionalDetails",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };

    this.printDetailsForTransfer = function (accountNumber,currency) {
        var response = $http({
            method: "post",
            url: "/Account/PrintDetailsForTransfer",
            responseType: 'arraybuffer',
            params: {
                accountNumber: accountNumber,
                currency: currency
            }
        });
        return response;
    };
     
    this.printAccountStatement = function (accountNumber, lang, dateFrom, dateTo, averageRest, currencyRegulation, payerData, additionalInformationByCB, exportFormat) {
        var response = $http({
            method: "post",
            url: "/Account/PrintAccountStatement",
            params: {
                accountNumber: accountNumber,
                lang: lang,
                dateFrom: dateFrom,
                dateTo: dateTo,
                averageRest: averageRest,
                currencyRegulation: currencyRegulation,
                payerData: payerData,
                additionalInformationByCB: additionalInformationByCB,
                exportFormat: exportFormat
            }
        });
        return response;
    };

    this.printAccountStatementNew = function (accountNumber, lang, dateFrom, dateTo, averageRest, currencyRegulation, payerData, additionalInformationByCB, exportFormat,includingExchangeRate) {
        var response = $http({
            method: "post",
            url: "/Account/PrintAccountStatementNew",
            params: {
                accountNumber: accountNumber,
                lang: lang,
                dateFrom: dateFrom,
                dateTo: dateTo,
                averageRest: averageRest,
                currencyRegulation: currencyRegulation,
                payerData: payerData,
                additionalInformationByCB: additionalInformationByCB,
                includingExchangeRate: includingExchangeRate,
                exportFormat: exportFormat
            }
        });
        return response;
    };



    this.printMemorial = function (accountNumber, dateFrom, dateTo, correct_mo){
        var response = $http({
            method: "post",
            url: "/Account/PrintMemorial",
            params: {
                accountNumber: accountNumber, 
                dateFrom: dateFrom,
                dateTo: dateTo,   
                correct_mo: correct_mo
            }
        });
        return response;
    };
    

    this.GetAccountStatementDeliveryType = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetAccountStatementDeliveryType",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };

    this.printStatementDeliveryApplication = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/PrintStatementDeliveryApplication",
            responseType: 'arraybuffer',
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };


    this.printAccountOpenApplication = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/PrintAccountOpenApplication",
            responseType: 'arraybuffer',

            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };
   
      this.getAccountsForCurrency = function (currency) {
        var response = $http({
            method: "post",
            url: "/Account/GetAccountsForCurrency",
            params: {
                currency: currency
            }
        });
        return response;
      };

      this.hasAccountPensionApplication = function (accountNumber) {
          var response = $http({
              method: "post",
              url: "/Account/HasAccountPensionApplication",
              params: {
                  accountNumber: accountNumber
              }
          });
          return response;
      };

      this.getAccountSource = function (accountNumber) {

          var response = $http({
              method: "post",
              url: "/Account/GetAccountSource",
              params: {
                  accountNumber: accountNumber
              }
          });
          return response;

      };

      this.getAccountBalance = function (accountNumber) {

          var response = $http({
              method: "post",
              url: "/Account/GetAccountAvailableBalance",
              params: {
                  accountNumber: accountNumber
              }
          });
          return response;

      };

      this.getSearchedAccounts = function (searchParams) {

          var response = $http({
              method: "post",
              url: "/SearchAccounts/GetSearchedAccounts",
              data: JSON.stringify(searchParams),
              dataType: "json"
          });
          return response;

      };

      this.getCurrentAccountServiceFee = function (accountNumber) {
          var response = $http({
              method: "post",
              url: "/Account/GetCurrentAccountServiceFee",
              responseType: 'arraybuffer',

              params: {
                  accountNumber: accountNumber
              }
          });
          return response;
      };

      this.getOperationSystemAccountForLeasing = function (operationCurrency,filialCode) {
          var response = $http({
              method: "post",
              url: "/Account/GetOperationSystemAccountForLeasing",
              params: {
                  operationCurrency: operationCurrency,
                  filialCode: filialCode
              }
          });
          return response;
      };



      this.getAccountClosinghistory = function () {

          var response = $http({
              method: "post",
              url: "/Account/GetAccountClosinghistory",
          });
          return response;

      };


      this.getAccountFlowDetails = function (accountNumber, startDate, endDate) {
          var response = $http({
              method: "post",
              url: "/Account/GetAccountFlowDetails",
              params: {
                  accountNumber: accountNumber,
                  startDate: startDate,
                  endDate: endDate
              }
          });
          return response;
      };

      this.getATSSystemAccounts = function (currency) {
          var response = $http({
              method: "post",
              url: "/Account/GetATSSystemAccounts",
              params: {
                  currency: currency
              }
          });
          return response;
      };


      
            this.getAccountOpeningClosingDetails = function (accountNumber) {
          var response = $http({
              method: "post",
              url: "/Account/GetAccountOpeningClosingDetails",
              params: {
                  accountNumber: accountNumber
              }
          });
          return response;
            };

            this.getAccountOpeningDetail = function (accountNumber) {
                var response = $http({
                    method: "post",
                    url: "/Account/GetAccountOpeningDetail",
                    params: {
                        accountNumber: accountNumber
                    }
                });
                return response;
            };

            this.getBankruptcyManager = function (accountNumber) {
                var response = $http({
                    method: "post",
                    url: "/Account/GetBankruptcyManager",
                    params: {
                        accountNumber: accountNumber
                    }
                });
                return response;
            };



      this.getDemandDepositRate = function (accountNumber) {
          var response = $http({
              method: "post",
              url: "/Account/GetDemandDepositRate",
              params: {
                  accountNumber: accountNumber
              }
          });
          return response;
            };

      this.getAccountInfo = function (accountNumber) {
          var response = $http({
              method: "post",
              url: "/Account/GetAccountInfo",
              params: {
                  accountNumber: accountNumber
              }
          });
          return response;
    };
    this.GetCreditCodesTransitAccounts = function (filter) {
        var response = $http({
            method: "post",
            url: "/Account/GetCreditCodesTransitAccounts",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.postAccountRemovingOrder = function (order) {

        var response = $http({
            method: "post",
            url: "/Account/PostAccountRemovingOrder",
            data: order,
            dataType: "json"
        });
        return response;
    };

    this.getCheckCustomerFreeFunds = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetCheckCustomerFreeFunds",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };
    this.getThirdPersonAccountRightsTransferReport = function (accountNumber, thirdPersonCustomerNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetThirdPersonAccountRightsTransferReport",
            responseType: 'arraybuffer',
            params: {
                accountNumber: accountNumber,
                thirdPersonCustomerNumber: thirdPersonCustomerNumber
            }
        });
        return response;
    };
    this.postTransferThirdPersonAccountRights = function (order) {
        var response = $http({
            method: "post",
            url: "/Account/PostTransferThirdPersonAccountRights",
            data: order,
            dataType: "json"
        });
        return response;
    };
    this.getRightsTransferTransactionAvailability = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetRightsTransferTransactionAvailability",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;

    };
    this.getRightsTransferVisibility = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetRightsTransferVisibility",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };
    this.getcheckCustomerIsThirdPerson = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/Account/GetCheckCustomerIsThirdPerson",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };


}]);