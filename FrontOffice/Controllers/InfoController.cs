using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using FrontOffice.XBSInfo;
using System.Web.UI;
using FrontOffice.Filters;

namespace FrontOffice.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class InfoController : Controller
    {

        public JsonResult GetCurrencies()
        {
            return Json(InfoService.GetCurrencies(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetCurrenciesKeyValueType()
        {
            List<KeyValuePair<string, string>> currencies = InfoService.GetCashOrderCurrencies();
            return Json(currencies, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ClearAllCache()
        {
            return Json(InfoService.ClearAllCache(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetActiveDepositTypesForNewDepositOrder(int accountType, int customerType)
        {
            Dictionary<string, string> types = InfoService.GetActiveDepositTypesForNewDepositOrder(accountType, customerType);
            return Json(types, JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetActiveDepositTypes(int accountType, int customerType)
        {
            Dictionary<string, string> types = InfoService.GetActiveDepositTypes();
            if (accountType == 0 || accountType == 1)
            {
                types.Remove("4");
                if (customerType != 6)
                {
                    types.Remove("12");
                }
                //else
                //{
                //    types.Remove("15");
                //}
            }
            else
            {
                types.Remove("2");
                types.Remove("6");
                types.Remove("12");
                //types.Remove("15");
            }
            return Json(types, JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetDepositTypes()
        {
            Dictionary<string, string> types = InfoService.GetActiveDepositTypes();
            return Json(types, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetFilialAddressList()
        {
            return Json(InfoService.GetFilialAddressList(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCardSystemTypes()
        {
            return Json(InfoService.GetCardSystemTypes(), JsonRequestBehavior.AllowGet);
        }




        public JsonResult GetCardTypes(int cardSystem)
        {
            return Json(InfoService.GetCardTypes(cardSystem), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllCardTypes(int cardSystem)
        {
            return Json(InfoService.GetAllCardTypes(cardSystem), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetReferenceTypes()
        {
            return Json(InfoService.GetReferenceTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetEmbassyList(List<ushort> referenceTypes)
        {
            return Json(InfoService.GetEmbassyList(referenceTypes), JsonRequestBehavior.AllowGet);
        }

        //public JsonResult GetDepositCurrencies()
        //{
        //    return Json(InfoService.GetDepositCurrencies(), JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult GetTypeOfDepositStatus()
        //{
        //    return Json(InfoService.GetTypeOfDepositStatus(), JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult GetTypeOfDeposit()
        //{
        //    return Json(InfoService.GetTypeOfDeposit(), JsonRequestBehavior.AllowGet);
        //}


        public JsonResult GetReferenceLanguages()
        {
            return Json(InfoService.GetReferenceLanguages(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCashOrderTypes()
        {
            return Json(InfoService.GetCashOrderTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetStatementFrequency()
        {
            return Json(InfoService.GetStatementFrequency(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPeriodicsSubTypes()
        {
            return Json(InfoService.GetPeriodicsSubTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPeriodicUtilityTypes()
        {
            return Json(InfoService.GetPeriodicUtilityTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult SearchRelatedOfficeTypes(string searchParam)
        {
            string officeId = "";
            string officeName = "";

            int n;
            bool isNumeric = int.TryParse(searchParam, out n);

            if (isNumeric)
            {
                officeId = searchParam;
            }
            else
            {
                officeName = searchParam;
            }

            Dictionary<string, string> relType = InfoService.SearchRelatedOfficeTypes(officeId, officeName);
            List<KeyValuePair<int, string>> list = new List<KeyValuePair<int, string>>();

            foreach (KeyValuePair<string, string> entry in relType)
            {
                list.Add(new KeyValuePair<int, string>(key: int.Parse(entry.Key), value: entry.Value));
            }

            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPoliceCodes(string accountNumber = "")
        {
            return Json(InfoService.GetPoliceCodes(accountNumber), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetLTACodes()
        {
            return Json(InfoService.GetLTACodes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetSyntheticStatus(string value)
        {
            return Json(InfoService.GetSyntheticStatus(value), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetFilialList()
        {
            return Json(InfoService.GetFilialList(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCardClosingReasons()
        {
            return Json(InfoService.GetCardClosingReasons(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetStatementDeliveryTypes()
        {
            return Json(InfoService.GetStatementDeliveryTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetAccountOrderFeeChanrgesTypes()
        {
            return Json(InfoService.GetAccountOrderFeeChanrgesTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetJointTypes()
        {

            Dictionary<string, string> jointTypes = new Dictionary<string, string>();
            jointTypes = InfoService.GetJointTypes();
            jointTypes.Add("0", "Անհատական");
            return Json(jointTypes, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetOperationsList()
        {
            return Json(InfoService.GetOperationsList(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCountries()
        {
            return Json(InfoService.GetCountries(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCountryList()
        {
            return Json(InfoService.GetCountryList(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetSourceType()
        {
            return Json(XBService.GetSourceType(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetInfoFromSwiftCode(string swiftCode, short type)
        {
            return Json(InfoService.GetInfoFromSwiftCode(swiftCode, type), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetCountyRiskQuality(string country)
        {
            return Json(InfoService.GetCountyRiskQuality(country), JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetInternationalPaymentCurrencies()
        {
            return Json(InfoService.GetInternationalPaymentCurrencies(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetTransferSystemCurrency(short transferSystem)
        {
            return Json(InfoService.GetTransferSystemCurrency(transferSystem), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetAccountStatuses()
        {
            return Json(InfoService.GetAccountStatuses(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBankOperationFeeTypes(int type)
        {
            return Json(InfoService.GetBankOperationFeeTypes(type), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransitAccountTypes(bool forLoanMature = false)
        {
            return Json(InfoService.GetTransitAccountTypes(forLoanMature), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetNextOperDay()
        {
            return Json(XBService.GetNextOperDay(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetAccountFreezeReasonsTypes()
        {
            return Json(InfoService.GetAccountFreezeReasonsTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetAccountFreezeStatuses()
        {
            return Json(InfoService.GetAccountFreezeStatuses(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCurrentAccountCurrencies()
        {
            return Json(InfoService.GetCurrentAccountCurrencies(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetServiceProvidedTypes()
        {
            return Json(InfoService.GetServiceProvidedTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult getCashPosCurrencies()
        {
            Dictionary<string, string> cashPosCurrencies = new Dictionary<string, string>();

            foreach (var entry in InfoService.GetCashOrderCurrencies())
            {
                if (entry.Value == "AMD" || entry.Value == "USD" || entry.Value == "EUR")
                    cashPosCurrencies.Add(entry.Key, entry.Value);
            }

            return Json(cashPosCurrencies, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetCashPosOperationFeeTypes(int type)
        {
            Dictionary<string, string> cashFeeTypes = new Dictionary<string, string>();

            foreach (var entry in InfoService.GetBankOperationFeeTypes(type))
            {
                if (entry.Key == "0" || entry.Key == "6")
                    cashFeeTypes.Add(entry.Key, entry.Value);
            }

            return Json(cashFeeTypes, JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetOrderRemovingReasons()
        {
            return Json(InfoService.GetOrderRemovingReasons(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSourceDescription(xbs.SourceType source)
        {
            return Json(Enum.GetName(typeof(xbs.SourceType), source), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTransferTypes(short isActive)
        {
            return Json(InfoService.GetTransferTypes(isActive), JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetAllTransferTypes()
        {
            return Json(InfoService.GetAllTransferTypes(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetCredentialTypes(int typeOfCustomer)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            string guid = Utility.GetSessionId();
            int userFilialCode = ((xbs.User)Session[guid + "_User"]).filialCode;

            ACBAServiceReference.Customer customer = ACBAOperationService.GetCustomerData(customerNumber);
            int customerFilialCode = (ushort)customer.filial.key;

            return Json(InfoService.GetCredentialTypes(typeOfCustomer, customerFilialCode, userFilialCode), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCredentialClosingReasons()
        {
            return Json(InfoService.GetCredentialClosingReasons(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult IsWorkingDay(DateTime date)
        {
            return Json(InfoService.IsWorkingDay(date), JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetAccountClosingReasonsTypes()
        {
            return Json(InfoService.GetAccountClosingReasonsTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCashBookQualityTypes()
        {
            return Json(InfoService.GetCashBookQualityTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetMonths()
        {
            return Json(InfoService.GetMonths(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCommunalDate(XBSInfo.CommunalTypes cmnlType, short abonentType = 1)
        {
            return Json(InfoService.GetCommunalDate(cmnlType, abonentType), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetServicePaymentNoteReasons(string customerType)
        {

            List<KeyValuePairOfunsignedShortstring> allNoteReasons = InfoService.GetServicePaymentNoteReasons();
            List<KeyValuePairOfunsignedShortstring> filteredNoteReasons;
            if (customerType == "6")
            {
                filteredNoteReasons = allNoteReasons.Where(n => n.key != 9).ToList();
            }
            else
            {
                filteredNoteReasons = allNoteReasons.Where(n => n.key != 0).ToList();
            }
            return Json(filteredNoteReasons, JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetTransferSenderLivingPlaceTypes()
        {
            return Json(InfoService.GetTransferSenderLivingPlaceTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTransferReceiverLivingPlaceTypes()
        {
            return Json(InfoService.GetTransferReceiverLivingPlaceTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTransferAmountTypes()
        {
            return Json(InfoService.GetTransferAmountTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPensionAppliactionQualityTypes()
        {
            return Json(InfoService.GetPensionAppliactionQualityTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPensionAppliactionClosingTypes()
        {
            return Json(InfoService.GetPensionAppliactionClosingTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPensionAppliactionServiceTypes()
        {
            return Json(InfoService.GetPensionAppliactionServiceTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCardsType()
        {
            return Json(InfoService.GetCardsType(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetOpenCardsType()
        {
            return Json(InfoService.GetOpenCardsType(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransferAmountPurposes(short dataformtype)
        {
            List<KeyValuePairOfunsignedShortstring> transferAmountPurposes = new List<KeyValuePairOfunsignedShortstring>();
            transferAmountPurposes = InfoService.GetTransferAmountPurposes();
            if (dataformtype == 1)
            {
                transferAmountPurposes.RemoveAll(m => m.key == 16 || m.key == 17 ||
                m.key == 5 || m.key == 22);
            }
            else
            {
                transferAmountPurposes.RemoveAll(m => m.key == 20 ||
                m.key == 21 || m.key == 13 || m.key == 18 || m.key == 19 || m.key == 23);
            }
            return Json(transferAmountPurposes, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLastKeyNumber(int keyId)
        {
            string guid = Utility.GetSessionId();
            ushort userFilialCode = ((xbs.User)Session[guid + "_User"]).filialCode;
            return Json(InfoService.GetLastKeyNumber(keyId, userFilialCode), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetGlobalLastKeyNumber(int keyId)
        {
            //Վերադարձնում է Id-ներ հեռահար բանկինգի համար
            ushort userFilialCode = 22000;
            return Json(InfoService.GetLastKeyNumber(keyId, userFilialCode), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCurNominals(string currency)
        {
            return Json(InfoService.GetCurNominals(currency), JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetDepositCaseContractDays()
        {
            return Json(InfoService.GetDepositCaseContractDays(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetSMSMessagingStatusTypes()
        {
            return Json(InfoService.GetSMSMessagingStatusTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetProvisionTypes()
        {
            return Json(InfoService.GetProvisionTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetInsuranceTypes()
        {
            return Json(InfoService.GetInsuranceTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetInsuranceCompanies()
        {
            return Json(InfoService.GetInsuranceCompanies(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardDataChangeFieldTypeDescription(ushort type)
        {
            return Json(InfoService.GetCardDataChangeFieldTypeDescription(type), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardRelatedOfficeName(ushort relatedOfficeNumber)
        {
            return Json(InfoService.GetCardRelatedOfficeName(relatedOfficeNumber), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetDepositClosingReasonTypes()
        {
            return Json(InfoService.GetDepositClosingReasonTypes(), JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetHBApplicationReportType()
        {
            return Json(InfoService.GetHBApplicationReportType(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSubTypesOfTokens()
        {
            return Json(InfoService.GetSubTypesOfTokens(), JsonRequestBehavior.AllowGet);

        }

        [ReportAccessFilter(FormName = "Reports")]
        public JsonResult GetPrintReportTypes()
        {
            return Json(InfoService.GetPrintReportTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTransferRejectReasonTypes()
        {
            return Json(InfoService.GetTransferRejectReasonTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTransferRequestStepTypes()
        {
            return Json(InfoService.GetTransferRequestStepTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTransferRequestStatusTypes()
        {
            return Json(InfoService.GetTransferRequestStatusTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetBusinesDepositOptions()
        {
            return Json(InfoService.GetBusinesDepositOptions(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPhoneBankingContractQuestions()
        {
            return Json(InfoService.GetPhoneBankingContractQuestions(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransferSessions(DateTime dateStart, DateTime dateEnd, short transferGroup)
        {
            return Json(InfoService.GetTransferSessions(dateStart, dateEnd, transferGroup), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRegions(int country)
        {
            return Json(InfoService.GetRegions(country), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetArmenianPlaces(int region)
        {
            return Json(InfoService.GetArmenianPlaces(region), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTypeOfLoanRepaymentSource()
        {
            return Json(InfoService.GetTypeOfLoanRepaymentSource(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDepositDataChangeFieldTypeDescription(ushort type)
        {
            return Json(InfoService.GetDepositDataChangeFieldTypeDescription(type), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetInsuranceCompaniesByInsuranceType(ushort insuranceType)
        {
            return Json(InfoService.GetInsuranceCompaniesByInsuranceType(insuranceType), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetInsuranceTypesByProductType(bool isLoanProduct, bool isSeparatelyProduct)
        {
            return Json(InfoService.GetInsuranceTypesByProductType(isLoanProduct, isSeparatelyProduct), JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetLoanTypes()
        {
            return Json(InfoService.GetLoanTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetLoanMatureTypes()
        {
            return Json(InfoService.GetLoanMatureTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetListOfLoanApplicationAmounts()
        {
            return Json(InfoService.GetListOfLoanApplicationAmounts(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFastOverdraftFeeAmount(double amount)
        {
            return Json(InfoService.GetFastOverdraftFeeAmount(amount), JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetLoanMonitoringTypes()
        {
            return Json(InfoService.GetLoanMonitoringTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetLoanMonitoringFactorGroupes()
        {
            return Json(InfoService.GetLoanMonitoringFactorGroupes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetProfitReductionTypes()
        {
            return Json(InfoService.GetProfitReductionTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetProvisionCostConclusionTypes()
        {
            return Json(InfoService.GetProvisionCostConclusionTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetProvisionQualityConclusionTypes()
        {
            return Json(InfoService.GetProvisionQualityConclusionTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetLoanMonitoringConclusions()
        {
            return Json(InfoService.GetLoanMonitoringConclusions(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanMonitoringFactorsForTree(int loanType)
        {
            Dictionary<string, string> groups = new Dictionary<string, string>();
            groups = InfoService.GetLoanMonitoringFactorGroupes();
            List<object> z = new List<object>();
            foreach (var item in groups.Keys)
            {
                var k = new { GroupId = item, GroupDescription = groups[item], Factors = InfoService.GetLoanMonitoringFactors(loanType, int.Parse(item)).ToList() };
                z.Add(k);
            }

            return Json(z, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetLoanMonitoringSubTypes()
        {
            return Json(InfoService.GetLoanMonitoringSubTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetDemandDepositsTariffGroups()
        {
            return Json(InfoService.GetDemandDepositsTariffGroups(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetAccountRestrictionGroups()
        {
            return Json(InfoService.GetAccountRestrictionGroups(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetDemandDepositRateTariffs()
        {
            return Json(XBService.GetDemandDepositRateTariffs(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetProductNotificationInformationTypes()
        {
            return Json(InfoService.GetProductNotificationInformationTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductNotificationFrequencyTypes(byte informationType)
        {
            return Json(InfoService.GetProductNotificationFrequencyTypes(informationType), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductNotificationOptionTypes(byte informationType)
        {
            return Json(InfoService.GetProductNotificationOptionTypes(informationType), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductNotificationLanguageTypes(byte informationType)
        {
            return Json(InfoService.GetProductNotificationLanguageTypes(informationType), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetProductNotificationFileFormatTypes()
        {
            return Json(InfoService.GetProductNotificationFileFormatTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetSwiftMessageTypes()
        {
            return Json(InfoService.GetSwiftMessageTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetSwiftMessageSystemTypes()
        {
            return Json(InfoService.GetSwiftMessageSystemTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetSwiftMessagMtCodes()
        {
            return Json(InfoService.GetSwiftMessagMtCodes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetSwiftMessageAttachmentExistenceTypes()
        {
            return Json(InfoService.GetSwiftMessageAttachmentExistenceTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetArcaCardSMSServiceActionTypes()
        {
            return Json(InfoService.GetArcaCardSMSServiceActionTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetBondIssueQualities()
        {
            return Json(InfoService.GetBondIssueQualities(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetBondIssuerTypes()
        {
            return Json(InfoService.GetBondIssuerTypes(), JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetBondIssuePeriodTypes()
        {
            return Json(InfoService.GetBondIssuePeriodTypes(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetAccountCustomerNumber(XBS.Account account)
        {
            return Json(XBService.GetAccountCustomerNumber(account), JsonRequestBehavior.AllowGet);
        }


        [OutputCache(CacheProfile = "AppInfoCache")]
        public JsonResult GetAnalyseTypes()
        {
            return Json(InfoService.GetAnalyseTypes(), JsonRequestBehavior.AllowGet);
        }

        //[OutputCache(CacheProfile = "AppInfoCache")]
        //public JsonResult GetContractSalaryTypes()
        //{
        //    return Json(InfoService.GetContractSalaries, JsonRequestBehavior.AllowGet);
        //}

        public JsonResult GetLoanTypesForLoanApplication(string loanApplicationType)
        {
            return Json(InfoService.GetLoanTypesForLoanApplication(loanApplicationType), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetBanks()
        {
            return Json(InfoService.GetBanks(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetCurrenciesForBondIssue()
        {
            return Json(InfoService.GetCurrenciesForBondIssue(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetBondRejectReasonTypes()
        {
            return Json(InfoService.GetBondRejectReasonTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBondQualityTypes()
        {
            return Json(InfoService.GetBondQualityTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTypeOfPaymentDescriptions()
        {
            return Json(InfoService.GetTypeOfPaymentDescriptions(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTypeofPaymentReasonAboutOutTransfering()
        {
            return Json(InfoService.GetTypeofPaymentReasonAboutOutTransfering(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTypeofOperDayClosingOptions()
        {
            return Json(InfoService.GetTypeofOperDayClosingOptions(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTypeOf24_7Modes()
        {
            return Json(InfoService.GetTypeOf24_7Modes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProblemLoanTaxQualityTypes()
        {
            return Json(InfoService.GetProblemLoanTaxQualityTypes(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetTypeOfCommunals()
        {
            return Json(InfoService.GetTypeOfCommunals(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetProblemLoanTaxCourtDecisionTypes()
        {
            return Json(InfoService.GetProblemLoanTaxCourtDecisionTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountFreezeReasonsTypesForOrder()
        {
            string guid = Utility.GetSessionId();
            SessionProperties sessionProperties = (SessionProperties)Session[guid + "_SessionProperties"];
            bool isHb = false;

            if (sessionProperties.IsCalledFromHB)
            {
                isHb = true;
            }

            return Json(XBService.GetAccountFreezeReasonsTypesForOrder(isHb), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetUnFreezeReasonTypesForOrder(int freezeId)
        {
            return Json(InfoService.GetUnFreezeReasonTypesForOrder(freezeId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetShopList()
        {
            return Json(InfoService.GetShopList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSSTOperationTypes()
        {
            return Json(InfoService.GetSSTOperationTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSSTerminals()
        {
            return Json(InfoService.GetSSTerminals(), JsonRequestBehavior.AllowGet);
        }




        public JsonResult GetSwiftPurposeCode()
        {
            return Json(InfoService.GetSwiftPurposeCode(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardReportReceivingTypes()
        {
            return Json(InfoService.GetCardReportReceivingTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardPINCodeReceivingTypes()
        {
            return Json(InfoService.GetCardPINCodeReceivingTypes(), JsonRequestBehavior.AllowGet);
        }

        public string TranslateArmToEnglish(string armText, bool isUnicode)
        {
            return InfoService.TranslateArmToEnglish(armText, isUnicode);
        }

        public JsonResult GetOrderableCardSystemTypes()
        {
            return Json(InfoService.GetOrderableCardSystemTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInsuranceContractTypes(bool isLoanProduct, bool isSeparatelyProduct, bool isProvision)
        {
            return Json(InfoService.GetInsuranceContractTypes(isLoanProduct, isSeparatelyProduct, isProvision));
        }

        public JsonResult GetInsuranceTypesByContractType(int insuranceContractType, bool isLoanProduct, bool isSeparatelyProduct, bool isProvision)
        {
            return Json(InfoService.GetInsuranceTypesByContractType(insuranceContractType, isLoanProduct, isSeparatelyProduct, isProvision));
        }

        /// <summary>
        /// Հեռախոսային փոխանցման  մերժման պատճառները
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetCallTransferRejectionReasons()
        {
            return Json(InfoService.GetCallTransferRejectionReasons(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardReceivingTypes()
        {
            return Json(InfoService.GetCardReceivingTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardApplicationAcceptanceTypes()
        {
            return Json(InfoService.GetCardApplicationAcceptanceTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetVirtualCardStatusChangeReasons()
        {
            return Json(InfoService.GetVirtualCardStatusChangeReasons(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetVirtualCardChangeActions(int status)
        {
            return Json(InfoService.GetVirtualCardChangeActions(status), JsonRequestBehavior.AllowGet);
        }

        public string GetAuthorizedUserSessionToken()
        {
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();
            return authorizedUserSessionToken;
        }

        public JsonResult GetARUSSexes()
        {
            return Json(InfoService.GetARUSSexes(GetAuthorizedUserSessionToken()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSYesNo()
        {
            return Json(InfoService.GetARUSYesNo(GetAuthorizedUserSessionToken()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSDocumentTypes(string MTOAgentCode)
        {
            return Json(InfoService.GetARUSDocumentTypes(GetAuthorizedUserSessionToken(), MTOAgentCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSCountriesByMTO(string MTOAgentCode)
        {
            return Json(InfoService.GetARUSCountriesByMTO(GetAuthorizedUserSessionToken(), MTOAgentCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSSendingCurrencies(string MTOAgentCode)
        {
            return Json(InfoService.GetARUSSendingCurrencies(GetAuthorizedUserSessionToken(), MTOAgentCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSCitiesByCountry(string MTOAgentCode, string countryCode)
        {
            return Json(InfoService.GetARUSCitiesByCountry(GetAuthorizedUserSessionToken(), MTOAgentCode, countryCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSStates(string MTOAgentCode, string countryCode)
        {
            return Json(InfoService.GetARUSStates(GetAuthorizedUserSessionToken(), MTOAgentCode, countryCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSCitiesByState(string MTOAgentCode, string countryCode, string stateCode)
        {
            return Json(InfoService.GetARUSCitiesByState(GetAuthorizedUserSessionToken(), MTOAgentCode, countryCode, stateCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSMTOList()
        {
            return Json(InfoService.GetARUSMTOList(GetAuthorizedUserSessionToken()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCountriesWithA3()
        {
            return Json(InfoService.GetCountriesWithA3(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSDocumentTypeCode(int ACBADocumentTypeCode)
        {
            return Json(InfoService.GetARUSDocumentTypeCode(ACBADocumentTypeCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSCancellationReversalCodes(string MTOAgentCode)
        {
            return Json(InfoService.GetARUSCancellationReversalCodes(GetAuthorizedUserSessionToken(), MTOAgentCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSPayoutDeliveryCodes(string MTOAgentCode)
        {
            return Json(InfoService.GetARUSPayoutDeliveryCodes(GetAuthorizedUserSessionToken(), MTOAgentCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRemittancePurposes(string MTOAgentCode)
        {
            return Json(InfoService.GetRemittancePurposes(GetAuthorizedUserSessionToken(), MTOAgentCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMTOAgencies(string MTOAgentCode, string countryCode, string cityCode, string currencyCode, string stateCode)
        {
            return Json(InfoService.GetMTOAgencies(GetAuthorizedUserSessionToken(), MTOAgentCode, countryCode, cityCode, currencyCode, stateCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetARUSAmendmentReasons(string MTOAgentCode)
        {
            return Json(InfoService.GetARUSAmendmentReasons(GetAuthorizedUserSessionToken(), MTOAgentCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReferenceReceiptTypes()
        {
            return Json(InfoService.GetReferenceReceiptTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerAllPassports()
        {
            return Json(InfoService.GetCustomerAllPassports(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerAllPhones()
        {
            return Json(InfoService.GetCustomerAllPhones(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSTAKPayoutDeliveryCodesByBenificiaryAgentCode(string MTOAgentCode, string parent)
        {
            return Json(InfoService.GetSTAKPayoutDeliveryCodesByBenificiaryAgentCode(GetAuthorizedUserSessionToken(), MTOAgentCode, parent), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardAdditionalDataTypes(string cardNumber, string expiryDate)
        {
            return Json(InfoService.GetCardAdditionalDataTypes(cardNumber, expiryDate), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardNotRenewReasons()
        {
            return Json(InfoService.GetCardNotRenewReasons(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRejectFeeTypes()
        {
            return Json(InfoService.GetCommissionNonCollectionReasons(), JsonRequestBehavior.AllowGet);
        }
    }
}
