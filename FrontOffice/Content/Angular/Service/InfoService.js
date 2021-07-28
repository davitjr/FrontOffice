app.service("infoService", ['$http', function ($http) {
    this.getCurrencies = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCurrencies"
        });
        return response;
    };
    
    this.getCashPosCurrencies = function () {
        var response = $http({
            method: "post",
            url: "/Info/getCashPosCurrencies"
        });
        return response;
    };

    this.getCurrenciesKeyValueType = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCurrenciesKeyValueType"
        });
        return response;
    };

    this.getTypeOfDepositStatus = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTypeOfDepositStatus"
        });
        return response;
    };

    this.getDepositCurrencies = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetDepositCurrencies"
        });
        return response;
    };

    this.getTypeOfDeposit = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTypeOfDeposit"
        });

        return response;
    };

    this.clearAllCache = function () {
        var response = $http({
            method: "post",
            url: "/Info/ClearAllCache"
        });
        return response;
    };

    this.GetActiveDepositTypes = function (accountType, customertype) {

        var response = $http({
            method: "post",
            url: "/Info/GetActiveDepositTypes",
            params: {
                accountType: accountType,
                customerType: customertype
            }
        });
        return response;

    };

    this.getActiveDepositTypesForNewDepositOrder = function (accountType, customertype) {

        var response = $http({
            method: "post",
            url: "/Info/GetActiveDepositTypesForNewDepositOrder",
            params: {
                accountType: accountType,
                customerType: customertype
            }
        });
        return response;

    };



    this.getTransferTypes = function (isActive) {
        var response = $http({
            method: "post",
            url: "/Info/GetTransferTypes",
            params: {
                isActive: isActive
            }
        });
        return response;
    };

    this.getAllTransferTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetAllTransferTypes",
        });
        return response;
    };

    this.getTransferSystemCurrency = function (transferSystem) {
        var response = $http({
            method: "post",
            url: "/Info/GetTransferSystemCurrency",
            params: {
                transferSystem: transferSystem
            }
        });
        return response;
    };


    this.GetFilialAddressList = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetFilialAddressList",
        });
        return response;
    };


    this.GetCardSystemTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCardSystemTypes"
        });
        return response;
    };

    this.getCardTypes = function (cardSystem) {

        var response = $http({
            method: "post",
            url: "/Info/GetCardTypes",
            params: {
                cardSystem: cardSystem
            }
        });
        return response;
    }

    this.GetCardReportReceivingTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCardReportReceivingTypes"
        });
        return response;
    };

    this.GetCardPINCodeReceivingTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCardPINCodeReceivingTypes"
        });
        return response;
    };

    this.getAllCardTypes = function (cardSystem) {

        var response = $http({
            method: "post",
            url: "/Info/GetAllCardTypes",
            params: {
                cardSystem: cardSystem
            }
        });
        return response;
    }

    this.GetReferenceLanguages = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetReferenceLanguages",
        });
        return response;
    };
    this.GetReferenceTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetReferenceTypes",
        });
        return response;
    };
    this.GetEmbassyList = function (embassyList) {

        var response = $http({
            method: "post",
            url: "/Info/GetEmbassyList",
            params: {
                referenceTypes: embassyList
            }
        });
        return response;
    };
    this.GetCashOrderTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCashOrderTypes",
        });
        return response;
    };
    this.GetStatementFrequency = function () {

        var response = $http({
            method: "post",
            url: "/Info/GetStatementFrequency",

        });
        return response;
    };

    this.searchRelatedOfficeTypes = function (searchParam) {

        var response = $http({
            method: "post",
            url: "/Info/SearchRelatedOfficeTypes",
            params: {
                searchParam: searchParam
            }

        });
        return response;

    }

    this.PeriodiclyType = function () {

        var response = $http({
            method: "post",
            url: "/PeriodicOrder/PeriodiclyType",

        });
        return response;
    };

    this.DebtType = function () {

        var response = $http({
            method: "post",
            url: "/PeriodicOrder/DebtType",

        });
        return response;
    };

    this.GetPeriodicUtilityTypes = function () {

        var response = $http({
            method: "post",
            url: "/Info/GetPeriodicUtilityTypes",

        });
        return response;
    };

    this.GetPeriodicsSubTypes = function () {

        var response = $http({
            method: "post",
            url: "/Info/GetPeriodicsSubTypes",

        });
        return response;
    };



    this.getLTACodes = function () {

        var response = $http({
            method: "post",
            url: "/Info/GetLTACodes",

        });
        return response;
    };

    this.getPoliceCodes = function (accountNumber) {

        var response = $http({
            method: "post",
            url: "/Info/GetPoliceCodes",
            params: {
                accountNumber: accountNumber
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

    this.GetCardClosingReasons = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCardClosingReasons",
        });
        return response;
    };

    this.GetStatementDeliveryTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetStatementDeliveryTypes",
        });
        return response;
    };

    this.GetAccountOrderFeeChanrgesTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetAccountOrderFeeChanrgesTypes",
        });
        return response;
    };

    this.GetJointTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetJointTypes",
        });
        return response;
    };

    this.GetOperationsList = function () {

        var response = $http({
            method: "post",
            url: "/Info/GetOperationsList",

        });
        return response;
    };

    this.getCountries = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCountries",
        });
        return response;
    };

    this.getCountryList = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCountryList ",
        });
        return response;
    };

    this.getSourceType = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSourceType",
        });
        return response;
    };

    this.getInfoFromSwiftCode = function (swiftCode, type) {



        var response = $http({
            method: "post",
            url: "/Info/GetInfoFromSwiftCode",
            params: {
                swiftCode: swiftCode,
                type: type
            }
        });
        return response;
    };

    this.getCountyRiskQuality = function (country) {
        var response = $http({
            method: "post",
            url: "/Info/GetCountyRiskQuality",
            params: {
                country: country
            }
        });
        return response;
    };

    this.GetBankOperationFeeTypes = function (type) {
        var response = $http({
            method: "post",
            url: "/Info/GetBankOperationFeeTypes",
            params: {
                type: type
            }
        });
        return response;
    };

    this.GetCashPosOperationFeeTypes = function (type) {
        var response = $http({
            method: "post",
            url: "/Info/GetCashPosOperationFeeTypes",
            params: {
                type: type
            }
        });
        return response;
    };

    this.GetInternationalPaymentCurrencies = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetInternationalPaymentCurrencies"
        });
        return response;
    };

    this.GetAccountStatuses = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetAccountStatuses",
        });
        return response;
    };

    this.GetDepositStatmentDeliveryTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetDepositStatmentDeliveryTypes",
        });
        return response;
    };

    this.GetTransitAccountTypes = function (forLoanMature) {
        var response = $http({
            method: "post",
            url: "/Info/GetTransitAccountTypes",
            params: {
                forLoanMature: forLoanMature,
            }
        });
        return response;
    };

    this.getNextOperDay = function () {
        var response = $http({
            method: "post",
            url: "Info/GetNextOperDay",
        });
        return response;
    };
    this.GetAccountFreezeReasonsTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetAccountFreezeReasonsTypes",
        });
        return response;
    };

    this.GetAccountFreezeStatuses = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetAccountFreezeStatuses",
        });
        return response;
    };

    this.getUtilitySearchBranches = function (utilityType) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetUtilitySearchBranches",
            params: {
                communalType: utilityType,
            }
        });
        return response;
    };

    this.getCurrentAccountCurrencies = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCurrentAccountCurrencies"
        });
        return response;
    };

    this.getServiceProvidedTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetServiceProvidedTypes"
        });
        return response;
    };

    this.getOrderRemovingReasons = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetOrderRemovingReasons"
        });
        return response;
    };

    this.getSourceDescription = function (source) {

        var response = $http({
            method: "post",
            url: "/Info/GetSourceDescription",
            params: {
                source: source
            }
        });
        return response;
    };

    this.GetCredentialTypes = function (typeOfCustomer) {
        var response = $http({
            method: "post",
            url: "/Info/GetCredentialTypes",
            params: {
                typeOfCustomer: typeOfCustomer
            }
        });
        return response;
    };

    this.GetCredentialClosingReasons = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCredentialClosingReasons"
        });
        return response;
    };

    this.IsWorkingDay = function (date) {
        var response = $http({
            method: "post",
            url: "/Info/IsWorkingDay",
            params: {
                date: date
            }
        });
        return response;
    };

    this.GetActionPermissionTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetActionPermissionTypes"
        });
        return response;
    }

    this.GetAccountClosingReasonsTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetAccountClosingReasonsTypes",
        });
        return response;
    };

    this.GetCashBookQualityTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCashBookQualityTypes"
        });
        return response;
    };


    this.getMonths = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetMonths"
        });
        return response;
    };

    this.getCommunalDate = function (cmnlType, abonentType) {
        var response = $http({
            method: "post",
            url: "/Info/GetCommunalDate",
            params: {
                cmnlType: cmnlType,
                abonentType: abonentType
            }
        });
        return response;
    };

    this.getPensionAppliactionQualityTypes = function () {

        var response = $http({
            method: "post",
            url: "/Info/GetPensionAppliactionQualityTypes",

        });
        return response;
    };

    this.getPensionAppliactionClosingTypes = function () {

        var response = $http({
            method: "post",
            url: "/Info/GetPensionAppliactionClosingTypes",

        });
        return response;
    };

    this.getPensionAppliactionServiceTypes = function () {

        var response = $http({
            method: "post",
            url: "/Info/GetPensionAppliactionServiceTypes",
        });
        return response;
    };


    this.getCardsType = function () {

        var response = $http({
            method: "post",
            url: "/Info/GetCardsType",
        });
        return response;
    }


    this.getServicePaymentNoteReasons = function (customerType) {
        var response = $http({
            method: "post",
            url: "/Info/GetServicePaymentNoteReasons",
            params: {
                customerType: customerType
            }
        });
        return response;
    };

    this.getLastKeyNumber = function (keyId) {
        var response = $http({
            method: "post",
            url: "/Info/GetLastKeyNumber",
            params: {
                keyId: keyId
            }
        });
        return response;
    };

    this.getGlobalLastKeyNumber = function (keyId) {
        var response = $http({
            method: "post",
            url: "/Info/GetGlobalLastKeyNumber",
            params: {
                keyId: keyId
            }
        });
        return response;
    };


    this.getTransferSenderLivingPlaceTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTransferSenderLivingPlaceTypes"
        });
        return response;
    };


    this.getTransferReceiverLivingPlaceTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTransferReceiverLivingPlaceTypes"

        });
        return response;
    };



    this.getTransferAmountTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTransferAmountTypes"
        });
        return response;
    };



    this.getTransferAmountPurposes = function (dataformtype) {
        var response = $http({
            method: "post",
            url: "/Info/GetTransferAmountPurposes",
            params: {
                dataformtype: dataformtype
            }
        });
        return response;
    };


    this.getCurNominals = function (currency) {
        var response = $http({
            method: "post",
            url: "/Info/GetCurNominals",
            params: {
                currency: currency
            }
        });
        return response;
    };
    this.getDepositCaseContractDays = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetDepositCaseContractDays"
        });
        return response;
    };

    this.GetSMSMessagingStatusTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSMSMessagingStatusTypes"
        });
        return response;
    };

    this.getProvisionTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetProvisionTypes"
        });
        return response;
    };


    this.getInsuranceTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetInsuranceTypes"
        });
        return response;
    };

    this.getInsuranceCompanies = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetInsuranceCompanies"
        });
        return response;
    };


    this.getCardDataChangeFieldTypeDescription = function (type) {
        var response = $http({
            method: "post",
            url: "/Info/GetCardDataChangeFieldTypeDescription",
            params: {
                type: type
            }
        });
        return response;
    };

    this.getCardRelatedOfficeName = function (relatedOfficeNumber) {
        var response = $http({
            method: "post",
            url: "/Info/GetCardRelatedOfficeName",
            params: {
                relatedOfficeNumber: relatedOfficeNumber
            }
        });
        return response;
    };


    this.getDepositClosingReasonTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetDepositClosingReasonTypes"
        });
        return response;
    };

    this.getSubTypesOfTokens = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSubTypesOfTokens"
        });
        return response;
    };

    this.getPrintReportTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetPrintReportTypes"
        });
        return response;
    };

    this.getHBApplicationReportType = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetHBApplicationReportType"
        });
        return response;
    };


    this.getTransferRejectReasonTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTransferRejectReasonTypes"
        });
        return response;
    };

    this.getDepositTypes = function (accountType, customertype) {

        var response = $http({
            method: "post",
            url: "/Info/GetDepositTypes",
            params: {
                accountType: accountType,
                customerType: customertype
            }
        });
        return response;

    };

    this.getTransferRequestStepTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTransferRequestStepTypes"
        });
        return response;
    };

    this.getTransferRequestStatusTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTransferRequestStatusTypes"
        });
        return response;
    };

    this.getBusinesDepositOptions = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetBusinesDepositOptions"
        });
        return response;
    };


    this.isTestingMode = function () {
        var response = $http({
            method: "post",
            url: "/Login/IsTestingMode"
        });
        return response;

    }


    this.getTransferSessions = function (dateStart, dateEnd, transferGroup) {
        var response = $http({
            method: "post",
            url: "/Info/GetTransferSessions",
            params: {
                dateStart: dateStart,
                dateEnd: dateEnd,
                transferGroup: transferGroup
            }
        });
        return response;
    };

    this.getRegions = function (country) {
        var response = $http({
            method: "post",
            url: "/Info/GetRegions",
            params: {
                country: country
            }
        });
        return response;
    };

    this.getArmenianPlaces = function (region) {
        var response = $http({
            method: "post",
            url: "/Info/GetArmenianPlaces",
            params: {
                region: region
            }
        });
        return response;
    };


    this.getPhoneBankingContractQuestions = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetPhoneBankingContractQuestions",
        });
        return response;
    };
    this.getTypeOfLoanRepaymentSource = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTypeOfLoanRepaymentSource"
        });
        return response;
    };


    this.getCardTariffAdditionalInformation = function (officeID, cardType) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardTariffAdditionalInformation",
            params: {
                officeID: officeID,
                cardType: cardType
            }
        });
        return response;
    };

    this.getDepositDataChangeFieldTypeDescription = function (type) {
        var response = $http({
            method: "post",
            url: "/Info/GetDepositDataChangeFieldTypeDescription",
            params: {
                type: type
            }
        });
        return response;
    };


    this.getInsuranceCompaniesByInsuranceType = function (insuranceType) {
        var response = $http({
            method: "post",
            url: "/Info/GetInsuranceCompaniesByInsuranceType",
            params: {
                insuranceType: insuranceType
            }
        });
        return response;
    };

    this.getInsuranceTypesByProductType = function (isLoanProduct, isSeparatelyProduct) {
        var response = $http({
            method: "post",
            url: "/Info/GetInsuranceTypesByProductType",
            params: {
                isLoanProduct: isLoanProduct,
                isSeparatelyProduct: isSeparatelyProduct

            }
        });
        return response;
    };



    this.getLoanTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetLoanTypes",
        });
        return response;
    };

    this.getLoanMatureTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetLoanMatureTypes"
        });
        return response;
    };


    this.getListOfLoanApplicationAmounts = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetListOfLoanApplicationAmounts"
        });
        return response;
    };


    this.getFastOverdraftFeeAmount = function (amount) {

        var response = $http({
            method: "post",
            url: "/Info/GetFastOverdraftFeeAmount",
            params: {
                amount: amount
            }
        });
        return response;

    };

    this.getLoanMonitoringTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetLoanMonitoringTypes"
        });
        return response;
    };

    this.getLoanMonitoringFactorGroupes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetLoanMonitoringFactorGroupes"
        });
        return response;
    };

    this.getLoanMonitoringFactors = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetLoanMonitoringFactors"
        });
        return response;
    };

    this.getProfitReductionTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetProfitReductionTypes"
        });
        return response;
    };

    this.getProvisionCostConclusionTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetProvisionCostConclusionTypes"
        });
        return response;
    };

    this.getProvisionQualityConclusionTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetProvisionQualityConclusionTypes"
        });
        return response;
    };

    this.getLoanMonitoringConclusions = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetLoanMonitoringConclusions"
        });
        return response;
    };

    this.getLoanMonitoringFactorsForTree = function (loanType) {
        var response = $http({
            method: "post",
            url: "/Info/GetLoanMonitoringFactorsForTree",
            params: {
                loanType: loanType
            }
        });
        return response;
    };

    this.getLoanMonitoringSubTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetLoanMonitoringSubTypes"
        });
        return response;
    };

    this.getDemandDepositsTariffGroups = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetDemandDepositsTariffGroups"
        });
        return response;
    };



    this.getAccountRestrictionGroups = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetAccountRestrictionGroups"
        });
        return response;
    };

    this.getDemandDepositRateTariffs = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetDemandDepositRateTariffs"
        });
        return response;
    };
    this.getBondIssueQualities = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetBondIssueQualities",
        });
        return response;
    };
    this.getBondIssuerTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetBondIssuerTypes"
        });
        return response;
    };

    this.getBondIssuePeriodTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetBondIssuePeriodTypes"
        });
        return response;
    };


    this.getProductNotificationInformationTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetProductNotificationInformationTypes"
        });
        return response;
    };
    this.getProductNotificationFrequencyTypes = function (informationType) {
        var response = $http({
            method: "post",
            params: {
                informationType: informationType
            },
            url: "/Info/GetProductNotificationFrequencyTypes"
        });
        return response;
    };
    this.getProductNotificationOptionTypes = function (informationType) {
        var response = $http({
            method: "post",
            params: {
                informationType: informationType
            },
            url: "/Info/GetProductNotificationOptionTypes"
        });
        return response;
    };
    this.getProductNotificationLanguageTypes = function (informationType) {
        var response = $http({
            method: "post",
            params: {
                informationType: informationType
            },
            url: "/Info/GetProductNotificationLanguageTypes"
        });
        return response;
    };
    this.getProductNotificationFileFormatTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetProductNotificationFileFormatTypes"
        });
        return response;
    };

    this.getSwiftMessageTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSwiftMessageTypes"
        });
        return response;
    };

    this.getSwiftMessageSystemTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSwiftMessageSystemTypes"
        });
        return response;
    };

    this.getSwiftMessagMtCodes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSwiftMessagMtCodes"
        });
        return response;
    };

    this.getSwiftMessageAttachmentExistenceTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSwiftMessageAttachmentExistenceTypes"
        });
        return response;
    };

    this.getArcaCardSMSServiceActionTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetArcaCardSMSServiceActionTypes"
        });
        return response;
    }
        this.getDemandDepositRateTariffs = function () {
            var response = $http({
                method: "post",
                url: "/Info/GetDemandDepositRateTariffs"
            });
            return response;
        };
       
        
    this.getDemandDepositRateTariffs = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetDemandDepositRateTariffs"
        });
        return response;
    };
    this.getBondIssueQualities = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetBondIssueQualities",
        });
        return response;
    };
    this.getBondIssuerTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetBondIssuerTypes"
        });
        return response;
    };

    this.getAccountCustomerNumber = function (account) {
        var response = $http({
            method: "post",
            url: "/Info/GetAccountCustomerNumber",
            data: JSON.stringify(account),
            dataType: "json",
            
        });
        return response;
    };

    this.getBondIssuePeriodTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetBondIssuePeriodTypes"
        });
        return response;
    };

    this.GetAnalyseTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetAnalyseTypes"
        });
        return response;

    };

    this.GetContractSalaryTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetContractSalaryTypes"
        });
        return response;

    };

    this.GetLoanTypesForLoanApplication = function (loanApplicationType)
    {
        var response = $http({
            method: "post",
            url: "/Info/GetLoanTypesForLoanApplication",
            params: {
                loanApplicationType: loanApplicationType
            }
        });
        //var response = $http({
        //    method: "post",
        //    url: "/Info/GetLoanTypesForLoanApplication",
        //    data: JSON.stringify(loanApplicationType),
        //    dataType: "json",

        //});
        return response;
    }

    this.getBanks = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetBanks"
        });
        return response;
    };

    this.getCurrenciesForBondIssue = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCurrenciesForBondIssue"
        });
        return response;
    };
    this.getDepositTypeCurrency = function () {
        var response = $http({
            method: "post",
            url: "/Info/ GetDepositTypeCurrency"
        });
        return response;
    };
    this.getBondRejectReasonTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetBondRejectReasonTypes"
        });
        return response;
    };

    this.getBondQualityTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetBondQualityTypes"
        });
        return response;
    };


    this.getTypeOfPaymentDescriptions = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTypeOfPaymentDescriptions"
        });
        return response;
    };
    
    this.getTypeofPaymentReasonAboutOutTransfering = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTypeofPaymentReasonAboutOutTransfering"
        });
        return response;
    };

	this.getTypeofOperDayClosingOptions = function () {
		var response = $http({
			method: "post",
			url: "/Info/GetTypeofOperDayClosingOptions"
		});
		return response;
	};

    this.getTypeOf24_7Modes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetTypeOf24_7Modes"
        });
        return response;
    };

    this.getProblemLoanTaxQualityTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetProblemLoanTaxQualityTypes "
        });
        return response;
    };

    this.getProblemLoanTaxCourtDecisionTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetProblemLoanTaxCourtDecisionTypes "
        });
        return response;
    };
	this.getTypeOfCommunals = function () {
		var response = $http({
			method: "post",
			url: "/Info/GetTypeOfCommunals",
		});
		return response;
    };

    this.GetAccountFreezeReasonsTypesForOrder = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetAccountFreezeReasonsTypesForOrder",
        });
        return response;
    };


    this.GetUnFreezeReasonTypesForOrder = function (freezeId) {
        var response = $http({
            method: "post",
            url: "/Info/GetUnFreezeReasonTypesForOrder",
            params: {
                freezeId: freezeId
            }
        });
        return response;
    };

 
   

    
    this.getSSTOperationTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSSTOperationTypes",
        });
        return response;
    };

    this.getSSTerminals = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSSTerminals",
        });
        return response;
    };

   
    this.GetSwiftPurposeCode = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSwiftPurposeCode "
        });
        return response;
    };

    this.TranslateArmToEnglish = function (armText, isUnocode) {
        var response = $http({
            method: "post",
            url: "/Info/TranslateArmToEnglish",
            params: {
                armText: armText,
                isUnicode: isUnocode
            }
        });
        return response;
    }

    
    this.GetOrderableCardSystemTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetOrderableCardSystemTypes"
        });
        return response;
    };this.GetOrderableCardSystemTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetOrderableCardSystemTypes"
        });
        return response;
    };

    this.getShopList = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetShopList",
        });
        return response;
    };


    this.getSSTOperationTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSSTOperationTypes",
        });
        return response;
    };

    this.getSSTerminals = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetSSTerminals",
        });
        return response;
    };

    this.GetCardReportReceivingTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCardReportReceivingTypes"
        });
        return response;
    };

    this.GetCardPINCodeReceivingTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCardPINCodeReceivingTypes"
        });
        return response;
    };

    this.TranslateArmToEnglish = function (armText, isUnocode) {
        var response = $http({
            method: "post",
            url: "/Info/TranslateArmToEnglish",
            params: {
                armText: armText,
                isUnicode: isUnocode
            }
        });
        return response;
    }


    this.GetOrderableCardSystemTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetOrderableCardSystemTypes"
        });
        return response;
    };

    this.getInsuranceContractTypesByProductType = function (isLoanProduct, isSeparatelyProduct, isProvision) {
        var response = $http({
            method: "post",
            url: "/Info/GetInsuranceContractTypes",
            params: {
                isLoanProduct: isLoanProduct,
                isSeparatelyProduct: isSeparatelyProduct,
                isProvision: isProvision
            }
        });
        return response;
    };

    // Հեռախոսային փոխանցման  մերժման պատճառները
    this.getCallTransferRejectionReasons = function () {
        var response = $http({
            method: "get",
            url: "/Info/GetCallTransferRejectionReasons"
        });
        return response;
    };
	this.getInsuranceTypesByContractType = function (insuranceContractType, isLoanProduct, isSeparatelyProduct, isProvision) {
		var response = $http({
			method: "post",
			url: "/Info/GetInsuranceTypesByContractType",
			params: {
				insuranceContractType: insuranceContractType,
				isLoanProduct: isLoanProduct,
				isSeparatelyProduct: isSeparatelyProduct,
				isProvision: isProvision
			}
		});
		return response;
	};

	this.GetVirtualCardStatusChangeReasons = function () {
		var response = $http({
			method: "post",
			url: "/Info/GetVirtualCardStatusChangeReasons",
			params: { status: status }
		});
		return response;
	};

	this.GetVirtualCardChangeActions = function (status) {
		var response = $http({
			method: "post",
			url: "/Info/GetVirtualCardChangeActions",
			params: { status: status }
		});
		return response;
	};

    this.GetCardReceivingTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCardReceivingTypes"
        });
        return response;
    };

    this.GetCardApplicationAcceptanceTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCardApplicationAcceptanceTypes"
        });
        return response;
    };

    this.getARUSSexes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSSexes"
        });
        return response;
    };

    this.getARUSYesNo = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSYesNo"
        });
        return response;
    };

    this.getARUSDocumentTypes = function (MTOAgentCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSDocumentTypes",
            params: {
                MTOAgentCode: MTOAgentCode
            }
        });
        return response;
    };

    this.getARUSCountriesByMTO = function (MTOAgentCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSCountriesByMTO",
            params: {
                MTOAgentCode: MTOAgentCode
            }
        });
        return response;
    };

    this.getARUSSendingCurrencies = function (MTOAgentCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSSendingCurrencies",
            params: {
                MTOAgentCode: MTOAgentCode
            }
        });
        return response;
    };

    this.getARUSCitiesByCountry = function (MTOAgentCode, countryCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSCitiesByCountry",
            params: {
                MTOAgentCode: MTOAgentCode,
                countryCode: countryCode
            }
        });
        return response;
    };

    this.getARUSStates = function (MTOAgentCode, countryCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSStates",
            params: {
                MTOAgentCode: MTOAgentCode,
                countryCode: countryCode
            }
        });
        return response;
    };

    this.getARUSCitiesByState = function (MTOAgentCode, countryCode, stateCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSCitiesByState",
            params: {
                MTOAgentCode: MTOAgentCode,
                countryCode: countryCode,
                stateCode: stateCode
            }
        });
        return response;
    };

    this.getARUSMTOList = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSMTOList",

        });
        return response;
    };

    this.getCountriesWithA3 = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCountriesWithA3",
        });
        return response;
    };

    this.getARUSDocumentTypeCode = function (ACBADocumentTypeCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSDocumentTypeCode",
            params: {
                ACBADocumentTypeCode: ACBADocumentTypeCode,
            }
        });
        return response;
    };

    this.getARUSCancellationReversalCodes = function (MTOAgentCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSCancellationReversalCodes",
            params: {
                MTOAgentCode: MTOAgentCode
            }
        });
        return response;
    };

    this.getARUSPayoutDeliveryCodes = function (MTOAgentCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSPayoutDeliveryCodes",
            params: {
                MTOAgentCode: MTOAgentCode
            }
        });
        return response;
    };

    this.getRemittancePurposes = function (MTOAgentCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetRemittancePurposes",
            params: {
                MTOAgentCode: MTOAgentCode
            }
        });
        return response;
    };


    this.getMTOAgencies = function (MTOAgentCode, countryCode, cityCode, currencyCode, stateCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetMTOAgencies",
            params: {
                MTOAgentCode: MTOAgentCode,
                countryCode: countryCode,
                stateCode: stateCode,
                cityCode: cityCode,
                currencyCode: currencyCode
            }
        });
        return response;
    };



    this.getSTAKPayoutDeliveryCodesByBenificiaryAgentCode = function (MTOAgentCode, parent) {
        var response = $http({
            method: "post",
            url: "/Info/GetSTAKPayoutDeliveryCodesByBenificiaryAgentCode",
            params: {
                MTOAgentCode: MTOAgentCode,
                parent: parent
            }
        });
        return response;
    };


    this.getReferenceReceiptTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetReferenceReceiptTypes"
        });
        return response;
    };

    this.getCustomerAllPassports = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCustomerAllPassports"
        });
        return response;
    };

    this.getCustomerAllPhones = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCustomerAllPhones"
        });
        return response;
    };


    this.getARUSAmendmentReasons = function (MTOAgentCode) {
        var response = $http({
            method: "post",
            url: "/Info/GetARUSAmendmentReasons",
            params: {
                MTOAgentCode: MTOAgentCode
            }
        });
        return response;
    };

    this.GetCardAdditionalDataTypes = function (cardNumber, expiryDate) {
        var response = $http({
            method: "post",
            url: "/Info/GetCardAdditionalDataTypes",
            data: {
                cardNumber: cardNumber,
                expiryDate: expiryDate
            }
        });
        return response;
    }

    this.GetCardNotRenewReasons = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetCardNotRenewReasons"
        });
        return response;
    };

    this.getRejectFeeTypes = function () {
        var response = $http({
            method: "post",
            url: "/Info/GetRejectFeeTypes"
        });
        return response;
    };
}]);