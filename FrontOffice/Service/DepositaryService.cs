using FrontOffice.ACBAServiceReference;
using FrontOffice.Models;
using FrontOffice.Models;
using FrontOffice.XBManagement;
using FrontOffice.XBS;
using FrontOffice.XBSInfo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace FrontOffice.Service
{
    public static class DepositaryService
    {
        private const string CheckAccountRequestUri = "/Depository/getCustomerSecuritiesAccount";
        private const string CreateAccountRequestUri = "/Depository/createAccount";
        private const string UpdateAccountRequestUri = "/Depository/updateBankAccountAsync";
        private const int AcbaBankCode = 22000;
        private const string AcbaBankDescription = "«ԱԿԲԱ ԲԱՆԿ» ԲԲԸ";

        private static readonly HttpClient httpClient;

        static DepositaryService()
        {
            httpClient = new HttpClient() { BaseAddress = new Uri(WebConfigurationManager.AppSettings["DepositoryApiBaseAddress"].ToString()) };
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

        }

        public static async Task<XBS.ActionResult> SaveDepositaryAccountOrderWithAccountCheck(DepositoryAccountSaveModel depositoryAccountSaveModel)
        {
            depositoryAccountSaveModel.order.Type = XBS.OrderType.DepositaryAccountOrder;
            if (depositoryAccountSaveModel.order.AccountNumber.IsOpeningAccInDepo == false)   // Ete ayl ho-uma depo account@ check chenq anum depository-um miangamic save enq anum mutqagrac tvyalner@
            {
                return XBService.SaveDepositaryAccountOrder(depositoryAccountSaveModel.order);
            }

            XBS.ActionResult result = new XBS.ActionResult() { ResultCode = XBS.ResultCode.Normal, Errors = new List<XBS.ActionError>() };
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            SearchForSecuritiesTypes searchForSecuritiesType = depositoryAccountSaveModel.fromBondOrder ? SearchForSecuritiesTypes.GetOnlyOne : SearchForSecuritiesTypes.GetAll;

            HttpResponseMessage response = await CheckAccountInDepository(customerNumber, searchForSecuritiesType);
            if (!response.IsSuccessStatusCode)
            {
                return FailedDepositary(result);
            }

            List<DepositaryApiAccount> depositoryAccounts = DeserializeJson<List<DepositaryApiAccount>>(await response.Content.ReadAsStringAsync());
            (bool isResident, bool isPhysical) = GetCustomerTypeAndResidence(customerNumber);
            if (HasActiveAccountInDepositary(depositoryAccounts) == false && isResident == false) // Hashiv@ bacvuma dilingi back office-i hastatman tak
            {
                XBService.DeleteDepoAccounts(customerNumber);
                return result;
            }

            if (HasActiveAccountInDepositary(depositoryAccounts) == true && HasStockIncomeAccountInDepositary(depositoryAccounts) == false && depositoryAccountSaveModel.fromBondOrder == true)
            {
                response = await UpdateStockIncomeAccountInDepository(customerNumber, depositoryAccounts.FirstOrDefault().Account.AccountIDInDepo, depositoryAccountSaveModel.order.AccountNumber.StockIncomeAccountNumber);
                if (!response.IsSuccessStatusCode)
                {
                    return FailedDepositary(result);
                }
            }

            if (HasAccountInDepositary(depositoryAccounts) == false)
            {
                response = await CreateAccountInDepository(customerNumber, depositoryAccountSaveModel.order.AccountNumber.StockIncomeAccountNumber);
                if (!response.IsSuccessStatusCode)
                {
                    return FailedDepositary(result);
                }
                response = await CheckAccountInDepository(customerNumber);
                if (!response.IsSuccessStatusCode)
                {
                    return FailedDepositary(result);
                }
                depositoryAccounts = DeserializeJson<List<DepositaryApiAccount>>(await response.Content.ReadAsStringAsync());
                depositoryAccountSaveModel.order.Type = XBS.OrderType.DepositaryAccountOpeningOrder;
            }
            XBService.DeleteDepoAccounts(customerNumber);
            foreach (var account in depositoryAccounts)
            {
                depositoryAccountSaveModel.order.AccountNumber.AccountNumber = double.Parse(account.Account?.SecuritiesAccount);
                depositoryAccountSaveModel.order.AccountNumber.Status = account.Account.Status;
                depositoryAccountSaveModel.order.AccountNumber.StockIncomeAccountNumber = account.Account?.BankAccountList?.Where(x => x.Currency == "AMD").FirstOrDefault().AccountNumber;
                result = XBService.SaveDepositaryAccountOrder(depositoryAccountSaveModel.order);
            }

            if (depositoryAccountSaveModel.fromBondOrder && HasPassiveAccountInDepositary(depositoryAccounts))
            {
                return FailedPassiveDepositary(result);
            }

            return result;
        }

        public static async Task<XBS.ActionResult> CreateDepositaryAccountOrder(ulong customerNumber, string stockIncomeAccountNumber)
        {
            DepositaryAccountOrder depositaryAccountOrder = new DepositaryAccountOrder()
            {
                CustomerNumber = customerNumber,
                AccountNumber = new DepositaryAccount
                {
                    BankCode = 22000,
                    Description = "«ԱԿԲԱ ԲԱՆԿ» ԲԲԸ",
                    StockIncomeAccountNumber = stockIncomeAccountNumber
                },
                Type = XBS.OrderType.DepositaryAccountOpeningOrder
            };
            XBS.ActionResult result = new XBS.ActionResult() { ResultCode = XBS.ResultCode.Normal, Errors = new List<XBS.ActionError>() };
            HttpResponseMessage response = await CreateAccountInDepository(customerNumber, depositaryAccountOrder.AccountNumber.StockIncomeAccountNumber);
            if (!response.IsSuccessStatusCode)
            {
                return FailedDepositary(result);
            }

            response = await CheckAccountInDepository(customerNumber);
            if (!response.IsSuccessStatusCode)
            {
                return FailedDepositary(result);
            }

            List<DepositaryApiAccount> depositoryAccounts = DeserializeJson<List<DepositaryApiAccount>>(await response.Content.ReadAsStringAsync());
            XBService.DeleteDepoAccounts(customerNumber);
            foreach (var account in depositoryAccounts)
            {
                depositaryAccountOrder.AccountNumber.AccountNumber = double.Parse(account.Account?.SecuritiesAccount);
                depositaryAccountOrder.AccountNumber.Status = account.Account.Status;
                depositaryAccountOrder.AccountNumber.StockIncomeAccountNumber = account.Account?.BankAccountList?.Where(x => x.Currency == "AMD").FirstOrDefault().AccountNumber;
                result = XBService.SaveDepositaryAccountOrder(depositaryAccountOrder);
            }

            return result;
        }

        public static async Task<object> CheckAndGetDepositaryAccount(SearchForSecuritiesTypes searchForSecuritiesType)
        {
            object depoAccount = new
            {
                AccountNumber = 0,
                StockIncomeAccountNumber = new List<string>()// { "123", "1234", "12344" }// {"123", "1234", "12344" }

            };

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            HttpResponseMessage response = await CheckAccountInDepository(customerNumber, searchForSecuritiesType);

            List<DepositaryApiAccount> depositoryAccounts = DeserializeJson<List<DepositaryApiAccount>>(await response.Content.ReadAsStringAsync());
            if (depositoryAccounts.Any())
            {
                var latestAccount = depositoryAccounts.Any(x => x.Account.Status == "N") ?
                depositoryAccounts.First(x => x.Account.Status == "N") :
                depositoryAccounts.First();

                depoAccount = new
                {
                    AccountNumber = double.Parse(latestAccount.Account?.SecuritiesAccount),
                    StockIncomeAccountNumber = latestAccount.Account?.BankAccountList?.Where(x => x.Currency == "AMD").Select(x => x.AccountNumber)
                };
            }
            return depoAccount;
        }

        public static (bool isResident, bool isPhysical) GetCustomerTypeAndResidence(ulong customerNumber)
        {
            (bool isResident, bool isPhysical) = InfoService.GetCustomerTypeAndResidence(customerNumber);
            return (isResident, isPhysical);
        }

        private static async Task<HttpResponseMessage> CreateAccountInDepository(ulong customerNumber, string stockIncomeAccountNumber)
        {

            object request = new { CustomerNumber = customerNumber, SecurityIncomeAccount = stockIncomeAccountNumber };
            HttpRequestMessage httpRequest = new HttpRequestMessage(HttpMethod.Post, CreateAccountRequestUri)
            {
                Content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json")
            };
            HttpResponseMessage response = await httpClient.SendAsync(httpRequest);
            return response;
        }

        private static async Task<HttpResponseMessage> UpdateStockIncomeAccountInDepository(ulong customerNumber, string AccountIDInDepo, string stockIncomeAccountNumber, string Currency = "AMD")
        {
            object request = new
            {
                CustomerNumber = customerNumber,
                AccountIDInDepo,
                BankAccountUpdateType = BankAccountUpdateTypes.AddNew,
                BankAccountNumber = stockIncomeAccountNumber,
                BankAccountCurrency = Currency,
                MandateIDInDepo = "0"
            };
            HttpRequestMessage httpRequest = new HttpRequestMessage(HttpMethod.Post, UpdateAccountRequestUri)
            {
                Content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json")
            };

            HttpResponseMessage response = await httpClient.SendAsync(httpRequest);
            return response;
        }
        private static async Task<HttpResponseMessage> CheckAccountInDepository(ulong customerNumber, SearchForSecuritiesTypes searchForSecuritiesType = SearchForSecuritiesTypes.GetOnlyOne)
        {
            object request = new { CustomerNumber = customerNumber, SearchType = searchForSecuritiesType };

            HttpRequestMessage httpRequest = new HttpRequestMessage(HttpMethod.Post, CheckAccountRequestUri)
            {
                Content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json")
            };

            HttpResponseMessage response = await httpClient.SendAsync(httpRequest);
            return response;
        }
        private static bool HasStockIncomeAccountInDepositary(List<DepositaryApiAccount> depositoryAccounts)
        {
            return depositoryAccounts?.Where(x => x?.Account?.Status == "N" && (x?.Account?.BankAccountList?.Any()) == true).Any() == true;
        }

        private static bool HasAccountInDepositary(List<DepositaryApiAccount> depositoryAccounts)
        {
            return depositoryAccounts?.Any() == true;
        }

        private static bool HasPassiveAccountInDepositary(List<DepositaryApiAccount> depositoryAccounts)
        {
            return depositoryAccounts?.Where(x => x.Account?.Status == "Y").Any() == true;
        }

        private static bool HasActiveAccountInDepositary(List<DepositaryApiAccount> depositoryAccounts)
        {
            return depositoryAccounts?.Where(x => x.Account?.Status == "N").Any() == true;
        }

        private static XBS.ActionResult FailedDepositary(XBS.ActionResult result)
        {
            result.Errors.Add(new XBS.ActionError { Code = 599, Description = "Առկա է խնդիր։ Խնդրում ենք փորձել մի փոքր ուշ։" });
            result.ResultCode = XBS.ResultCode.Failed;
            return result;
        }

        private static XBS.ActionResult FailedPassiveDepositary(XBS.ActionResult result)
        {
            result.Errors.Add(new XBS.ActionError { Code = 600, Description = "Հաճախորդի հաշիվը կասեցված է, անհրաժեշտ է մարել պարտավորությունները։" });
            result.ResultCode = XBS.ResultCode.Failed;
            return result;
        }

        private static T DeserializeJson<T>(string json)
        {
            T obj;
            obj = JsonConvert.DeserializeObject<T>(json);
            return obj;
        }

        internal static DepositaryAccountOrder SetDepositoryAccountOrder(BondOrder bondOrder)
        {
            return new DepositaryAccountOrder
            {
                AccountNumber = new DepositaryAccount()
                {
                    BankCode = bondOrder.Bond.DepositaryAccountExistenceType == DepositaryAccountExistence.Exists ? AcbaBankCode : bondOrder.Bond.CustomerDepositaryAccount.BankCode,
                    Description = bondOrder.Bond.DepositaryAccountExistenceType == DepositaryAccountExistence.Exists ? AcbaBankDescription : bondOrder.Bond.CustomerDepositaryAccount.Description,
                    IsOpeningAccInDepo = bondOrder.Bond.DepositaryAccountExistenceType == XBS.DepositaryAccountExistence.Exists ? true : false,
                    StockIncomeAccountNumber = bondOrder.Bond.CustomerDepositaryAccount.StockIncomeAccountNumber,
                    AccountNumber = bondOrder.Bond.CustomerDepositaryAccount.AccountNumber
                },
                OperationDate = XBService.GetCurrentOperDay()
            };
        }
    }
}