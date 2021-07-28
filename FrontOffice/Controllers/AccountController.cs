using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using acba = FrontOffice.ACBAServiceReference;
using System.Web.SessionState;
using System.Web.UI;
using FrontOffice.Models;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class AccountController : Controller
    {

        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult Accounts()
        {
            return PartialView("Accounts");
        }

        // GET: /Accounts/
        //[CustomerAccountsAccessFilter(accountContextResultType = AccountContextResultTypes.ListAccount)]
        public JsonResult GetCurrentAccounts(int filter)
        {
            return Json(XBService.GetCurrentAccounts((xbs.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCustomerTransitAccounts(int filter)
        {
            return Json(XBService.GetCustomerTransitAccounts((xbs.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllAccounts()     
        {
            return Json(XBService.GetAccounts(), JsonRequestBehavior.AllowGet);          
        }
        public ActionResult AccountDetails()
        {
            return View("AccountDetails");
        }

        // GET: /Account/
        public JsonResult GetAccount(string accountNumber)
        {
           return Json(XBService.GetAccount(accountNumber), JsonRequestBehavior.AllowGet);
        }

        //[CustomerAccountsAccessFilter(accountContextResultType = AccountContextResultTypes.Account)]
        public JsonResult GetCurrentAccount(string accountNumber)
        {
            xbs.Account account = XBService.GetCurrentAccount(accountNumber);
            ViewBag.accountGroup = account.AccountPermissionGroup;
            return Json(account, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetListAccount(string accountNumber)
        {
            List<xbs.Account> accounts = new List<xbs.Account>();
            accounts.Add(XBService.GetAccount(accountNumber));
            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AccountStatement()
        {
            return PartialView("AccountStatement");
        }

        // GET: /AccountStatement/
        [FrontLoggingFilterAttribute(ActionType = (int)ActionType.AccountStatementOpen)]
        public JsonResult GetAccountStatement(string accountNumber,string dateFrom,string dateTo)
        {
            return Json(XBService.GetAccountStatement(accountNumber, Convert.ToDateTime(dateFrom), Convert.ToDateTime(dateTo)), JsonRequestBehavior.AllowGet);
        }

        public JsonResult IsPoliceAccount(string accountNumber)
        {
            return Json(XBService.IsPoliceAccount(accountNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CheckAccountForPSN(string accountNumber)
        {
            return Json(XBService.CheckAccountForPSN(accountNumber), JsonRequestBehavior.AllowGet);
        }
       
        public void GetAccountOpenContract(string accountNumber, string confirmationPerson)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid + "_User"]).filialCode.ToString();
            string armNumber= accountNumber.Split(',').Last();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "armNumber", value: armNumber);            
            parameters.Add(key: "filialCode", value: filialCode);
            parameters.Add(key: "armNumberStr", value: "(" + accountNumber + ")");
            parameters.Add(key: "reopen", value: "0");//????
            parameters.Add(key: "HbDocID", value: "0");
            parameters.Add(key: "currencyHB", value: "");
            parameters.Add(key: "accountTypeHB", value: "");
            parameters.Add(key: "thirdPersonCustomerNumberHB", value: "");
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);

            ContractService.CurrentAccountContract(parameters);
        }

        public void PrintDetailsForTransfer(string accountNumber, string currency)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "accountNumber", value: accountNumber.ToString());
            ContractService.PrintAccountTransferDetails(parameters, currency);

        }

        public ActionResult GetAccountAdditionalDetails(string accountNumber)
        {
            return Json(XBService.GetAccountAdditionalDetails(accountNumber), JsonRequestBehavior.AllowGet);
        }

        [FrontLoggingFilterAttribute(ActionType = (int)ActionType.AccountStatementPrint)]
        public JsonResult PrintAccountStatement(string accountNumber, ushort lang, string dateFrom, string dateTo, ushort averageRest, ushort currencyRegulation, ushort payerData, ushort additionalInformationByCB, string exportFormat="pdf")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            if (XBService.AccountAccessible(accountNumber, currentUser.AccountGroup))
            {
                parameters.Add(key: "account_gl", value: accountNumber);
                parameters.Add(key: "start_date", value: Convert.ToDateTime(dateFrom).ToString("dd/MMM/yy"));
                parameters.Add(key: "end_date", value: Convert.ToDateTime(dateTo).ToString("dd/MMM/yy"));
                parameters.Add(key: "lang_id", value: lang.ToString());
                parameters.Add(key: "set_number", value: currentUser.userID.ToString());
                parameters.Add(key: "payerData", value: payerData.ToString());
                parameters.Add(key: "additionalInformationByCB", value: additionalInformationByCB.ToString());
                parameters.Add(key: "filial_code", value: currentUser.filialCode.ToString());
                parameters.Add(key: "averageRest", value: averageRest.ToString());
                parameters.Add(key: "currencyRegulation", value: currencyRegulation.ToString());
            
            }
            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult PrintAccountStatementNew(string accountNumber, ushort lang, string dateFrom, string dateTo, ushort averageRest, ushort currencyRegulation, ushort payerData, ushort additionalInformationByCB, ushort includingExchangeRate, string exportFormat = "pdf")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            if (XBService.AccountAccessible(accountNumber, currentUser.AccountGroup))
            {
                parameters.Add(key: "account_gl", value: accountNumber);
                parameters.Add(key: "start_date", value: Convert.ToDateTime(dateFrom).ToString("dd/MMM/yy"));
                parameters.Add(key: "end_date", value: Convert.ToDateTime(dateTo).ToString("dd/MMM/yy"));
                parameters.Add(key: "lang_id", value: lang.ToString());
                parameters.Add(key: "set_number", value: currentUser.userID.ToString());
                parameters.Add(key: "payerData", value: payerData.ToString());
                parameters.Add(key: "additionalInformationByCB", value: additionalInformationByCB.ToString());
                parameters.Add(key: "filial_code", value: currentUser.filialCode.ToString());
                parameters.Add(key: "averageRest", value: averageRest.ToString());
                parameters.Add(key: "currencyRegulation", value: currencyRegulation.ToString());
                parameters.Add(key: "includingExchangeRate", value: includingExchangeRate.ToString());

            }
            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult PrintMemorial(string accountNumber, string dateFrom, string dateTo, ushort correct_mo)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid +"_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "account", value: accountNumber);
            parameters.Add(key: "start_date", value: Convert.ToDateTime(dateFrom).ToString("dd/MMM/yy"));
            parameters.Add(key: "end_date", value: Convert.ToDateTime(dateTo).ToString("dd/MMM/yy"));
            parameters.Add(key: "correct_mo", value: (correct_mo==1 ? "true":"false"));
            parameters.Add(key: "bankCode", value: currentUser.filialCode.ToString());
            parameters.Add(key: "filter_str", value: String.Empty);

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public void PrintStatementDeliveryApplication(string accountNumber)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid +"_User"]).filialCode.ToString();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "bankCode", value: filialCode.ToString());

            int statementDeliveryType = XBService.GetAccountStatementDeliveryType(accountNumber);
            parameters.Add(key: "additionValue", value: statementDeliveryType.ToString());

            if (statementDeliveryType == 1 || statementDeliveryType == 3 || statementDeliveryType == 4)
            {

                string email = "";
              ACBAServiceReference.Customer customer = ACBAOperationService.GetCustomerData(customerNumber);
               List<acba.CustomerEmail> emailList = new List<acba.CustomerEmail>();

                if (customer.customerType.key == 6)
                {
                    ACBAServiceReference.PhysicalCustomer physical = (ACBAServiceReference.PhysicalCustomer)customer;
                    emailList = physical.person.emailList;
                }
                else
                {
                    acba.LegalCustomer legal = (acba.LegalCustomer)customer;
                    emailList = legal.Organisation.emailList;
                }

                if (emailList.Exists(m=> m.emailType.key == 5))
                {
                    email = emailList.Find(m=> m.emailType.key == 5).email.emailAddress;
                }

                parameters.Add(key: "email", value: email);
            }
            
            ContractService.GetAccountStatementApplication(parameters);
        }

        public int GetAccountStatementDeliveryType(string accountNumber)
        {
            return XBService.GetAccountStatementDeliveryType(accountNumber);
        }

        public void PrintAccountOpenApplication(string accountNumber)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid +"_User"]).filialCode.ToString();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "armNumber", value: "(" + accountNumber.ToString() + ")");
            parameters.Add(key: "filialCode", value: filialCode.ToString());

            ContractService.GetAccountOpenApplication(parameters);
        }


        public JsonResult GetAccountsForCurrency(string currency)
        {
            List<xbs.Account> accounts = new List<xbs.Account>();
            accounts.AddRange(XBService.GetAccountsForOrder(1, 2, 1).FindAll(m => m.AccountType == 10 && m.Currency == currency));
            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public ActionResult JointAccountCustomersDetails()
        {
            return PartialView("JointAccountCustomersDetails");
        }

        public JsonResult GetAccountJointCustomers(string accountNumber)
        {
            return Json(XBService.GetAccountJointCustomers(accountNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult HasAccountPensionApplication(string accountNumber)
        {
            return Json(XBService.HasAccountPensionApplication(accountNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountSource(string accountNumber)
        {
            return Json(XBService.GetAccountSource(accountNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountAvailableBalance(string accountNumber)
        {
            return Json(XBService.GetAcccountAvailableBalance(accountNumber), JsonRequestBehavior.AllowGet);
        }

        public void GetCurrentAccountServiceFee(string accountNumber)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
           
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "armNumberString", value: "(" + accountNumber + ")");
            parameters.Add(key: "armNumber", value: accountNumber);
            ContractService.GetCurrentAccountServiceFee(parameters);
            
        }

        public JsonResult GetOperationSystemAccountForLeasing(string operationCurrency, ushort filialCode)
        {
            return Json(XBService.GetOperationSystemAccountForLeasing(operationCurrency,filialCode), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetAccountClosinghistory()
        {
            return Json(XBService.GetAccountClosinghistory(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AccountClosingHistory()
        {
            return PartialView("AccountClosingHistory");
        }


        public JsonResult GetAccountFlowDetails(string accountNumber, DateTime startDate, DateTime endDate)
        {
            return Json(XBService.GetAccountFlowDetails(accountNumber, startDate, endDate), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AccountFlowDetails()
        {
            return PartialView("AccountFlowDetails");
        }

        public JsonResult GetATSSystemAccounts(string currency)
        {
            List<xbs.Account> accounts = new List<xbs.Account>();
            accounts = XBService.GetATSSystemAccounts(currency);
            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AccountAdditionalDetails()
        {
            return PartialView("AccountAdditionalDetails");
        }

        public JsonResult GetAccountOpeningClosingDetails(string accountNumber)
        {
            List<xbs.AccountOpeningClosingDetail> list = new List<xbs.AccountOpeningClosingDetail>();
            list = XBService.GetAccountOpeningClosingDetails(accountNumber);
            foreach (xbs.AccountOpeningClosingDetail accountAction in list)
            {
                accountAction.UserDescription = Utility.ConvertAnsiToUnicode(ACBAOperationService.GetCasherDescription(accountAction.ActionSetNumber));
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountOpeningDetail(string accountNumber)
        {
            xbs.AccountOpeningClosingDetail openingDetail = new xbs.AccountOpeningClosingDetail();
            openingDetail = XBService.GetAccountOpeningDetail(accountNumber);
            openingDetail.UserDescription = Utility.ConvertAnsiToUnicode(ACBAOperationService.GetCasherDescription(openingDetail.ActionSetNumber));
            return Json(openingDetail,JsonRequestBehavior.AllowGet);
        }

        public ActionResult AccountActionDetails()
        {
            return PartialView("AccountActionDetails");
        }


        public JsonResult GetDemandDepositRate(string accountNumber)
        {
            return Json(XBService.GetDemandDepositRate(accountNumber), JsonRequestBehavior.AllowGet);
        }


        public ActionResult DemandDepositRateDetails()
        {
            return PartialView("DemandDepositRateDetails");
        }

        public ActionResult DemandDepositRateTariffDetails()
        {
            return PartialView("DemandDepositRateTariffDetails");
        }
        public JsonResult GetBankruptcyManager(string accountNumber)
        {
            return Json(XBService.GetBankruptcyManager(accountNumber), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAccountInfo(string accountNumber)
        {
            return Json(XBService.GetAccountInfo(accountNumber), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCreditCodesTransitAccounts(int filter)
        {
            return Json(XBService.GetCreditCodesTransitAccounts((xbs.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PostAccountRemovingOrder(xbs.AccountRemovingOrder order)
        {
            xbs.ActionResult result = XBService.SaveAndApproveAccountRemoving(order);
            return Json(result);
        }


        public JsonResult GetCheckCustomerFreeFunds(string accountNumber)
        {
            return Json(XBService.CheckCustomerFreeFunds(accountNumber), JsonRequestBehavior.AllowGet);
        }
        public void GetThirdPersonAccountRightsTransferReport(string accountNumber, long thirdPersonCustomerNumber)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "armNumber", value: accountNumber);
            parameters.Add(key: "thirdPersonCustomerNumber", value: thirdPersonCustomerNumber.ToString());
            ContractService.ThirdPersonAccountRightsTransfer(parameters);
        }
        public JsonResult GetRightsTransferTransactionAvailability(string accountNumber)
        {
            return Json(XBService.GetRightsTransferAvailability(accountNumber), JsonRequestBehavior.AllowGet);
        }
        public JsonResult PostTransferThirdPersonAccountRights(xbs.ThirdPersonAccountRightsTransferOrder order)
        {
            return Json(XBService.SaveAndApproveThirdPersonAccountRightsTransfer(order), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRightsTransferVisibility(string accountNumber)
        {
            return Json(XBService.GetRightsTransferVisibility(accountNumber), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCheckCustomerIsThirdPerson(string accountNumber)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            return Json(XBService.GetCheckCustomerIsThirdPerson(accountNumber, customerNumber), JsonRequestBehavior.AllowGet);
        }
    }
}