using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
//using acs = FrontOffice.ACBAServiceReference;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class DepositOrderController : Controller
    {

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.DepositFormulationOrderSave)]
        public ActionResult SaveDepositOrder(xbs.DepositOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            if (order.Deposit.EndDate.Hour != 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                error.Description = "Ավանդի վերջը սխալ է։Ստուգեք համակարգչի ժամը։";
                result.Errors = new List<xbs.ActionError>();
                result.Errors.Add(error);
                result.ResultCode = xbs.ResultCode.ValidationError;
                return Json(result);
            }
            else
            {
                result = XBService.SaveDepositOrder(order);
                return Json(result);
            }
        }

        public JsonResult GetAccountsForPercentAccount(xbs.DepositOrder order)
        {
            List<xbs.Account> accounts = new List<xbs.Account>();
            order.Type = xbs.OrderType.Deposit;
           
            if (order.AccountType == 0)
            {
                order.AccountType = 1;
                if (order.Currency?.Length != 3)
                {
                    return Json(accounts, JsonRequestBehavior.AllowGet);
                }
            }
            else if (order.AccountType == 1)
            {
                order.AccountType = 2;
                if (order.Currency.Length != 3 || order.ThirdPersonCustomerNumbers == null || order.ThirdPersonCustomerNumbers.Count == 0)
                {
                    return Json(accounts, JsonRequestBehavior.AllowGet);
                }
            }
            else if (order.AccountType == 2)
            {
                order.AccountType = 3;
                if (order.Currency.Length != 3 || order.ThirdPersonCustomerNumbers == null || order.ThirdPersonCustomerNumbers.Count == 0)
                {
                    return Json(accounts, JsonRequestBehavior.AllowGet);
                }
            }
            accounts = XBService.GetAccountsForNewDeposit(order);
            
            if (order.Currency != "AMD")
            {
                order.Currency = "AMD";
                List<xbs.Account> AMDAccounts = new List<xbs.Account>();
                AMDAccounts = XBService.GetAccountsForNewDeposit(order);
                accounts.AddRange(AMDAccounts);
            }

            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountsForNewDeposit(xbs.DepositOrder order)
        {
            List<xbs.Account> accounts = new List<xbs.Account>();
            order.Type = xbs.OrderType.Deposit;
            if (order.AccountType == 0)
            {
                order.AccountType = 1;
                if (order.Currency.Length != 3)
                {
                    return Json(accounts, JsonRequestBehavior.AllowGet);
                }
            }
            else if (order.AccountType == 1)
            {
                order.AccountType = 2;
                if (order.Currency.Length != 3 || order.ThirdPersonCustomerNumbers==null || order.ThirdPersonCustomerNumbers.Count == 0)
                {
                    return Json(accounts, JsonRequestBehavior.AllowGet);
                }
            }
            else if (order.AccountType == 2)
            {
                order.AccountType = 3;
                if (order.Currency.Length != 3 || order.ThirdPersonCustomerNumbers == null || order.ThirdPersonCustomerNumbers.Count == 0)
                {
                    return Json(accounts, JsonRequestBehavior.AllowGet);
                }
            }
            accounts = XBService.GetAccountsForNewDeposit(order);
            //if (currency == null||currency=="")
            //{
            //    account.AddRange(XBService.GetAccountsForOrder(1, 2, 1).FindAll(m => m.AccountType == 10));
            //    return Json(account, JsonRequestBehavior.AllowGet);
            //}
            //else if (currency != null || currency != "")
            //{
            //    account.AddRange(XBService.GetAccountsForOrder(1, 2, 1).FindAll(m => m.AccountType == 10 && m.Currency == currency));
            //}
            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetThirdPersons()
        {
            Dictionary<ulong, string> AllThirdPerson = XBService.GetThirdPersons();
            Dictionary<string, string> all = new Dictionary<string, string>();
            for (int i = 0; i < AllThirdPerson.Count; i++)
            {
                all.Add(AllThirdPerson.ElementAt(i).Key.ToString(), AllThirdPerson.ElementAt(i).Value);
            }
                return Json(all, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDepositCondition(xbs.DepositOrder order)
        {
            if (order.DepositType == 0 || order.Deposit.Currency == "" || order.Deposit.Currency==null)
            {
                return Json("", JsonRequestBehavior.AllowGet);
            }
            else
            {
                xbs.ActionResult result = new xbs.ActionResult();

                if (order.AccountType == 0)
                {
                    order.AccountType = 1;
                }
                else if (order.AccountType == 1)
                {
                    order.AccountType = 2;
                }
                else if (order.AccountType == 2)
                {
                    order.AccountType = 3;
                }

                result = XBService.CheckDepositOrderCondition(order);
                if (result.Errors != null && result.Errors.Count > 0)
                {
                    return Json(result.Errors[0].Description, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(XBService.GetDepositCondition(order), JsonRequestBehavior.AllowGet);
                }
            }
        }

        public ActionResult PersonalDepositOrder()
        {
            return PartialView("PersonalDepositOrder");
        }

        public JsonResult GetDepositOrder(long orderId)
        {
            return Json(XBService.GetDepositOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PersonalDepositOrderDetails()
        {
            return PartialView("PersonalDepositOrderDetails");
        }

        public JsonResult GetCurrencies()
        {
            Dictionary<string, string> currencies = new Dictionary<string, string>();
            Dictionary<string, string> depositOrderCurrencies = new Dictionary<string, string>();
            currencies = InfoService.GetCurrencies();
            for (int i = 0; i < currencies.Count; i++)
            {
                if (currencies.ElementAt(i).Key == "AMD" || currencies.ElementAt(i).Key == "USD" || currencies.ElementAt(i).Key == "EUR" || currencies.ElementAt(i).Key == "GBP" || currencies.ElementAt(i).Key == "CHF" || currencies.ElementAt(i).Key == "RUR")
                {
                    depositOrderCurrencies.Add(currencies.ElementAt(i).Key, currencies.ElementAt(i).Value);
                }
            }
                return Json(depositOrderCurrencies, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetDepositTypeCurrency(short depositType)
        {
            Dictionary<string, string> depositOrderCurrencies = new Dictionary<string, string>();
            depositOrderCurrencies = InfoService.GetDepositTypeCurrency(depositType);
            return Json(depositOrderCurrencies, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetThirdPersonsBirthDate(ulong customerNumber)
        {

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);
            DateTime birthDate = customer.BirthDate.Value.AddYears(18);

            while (InfoService.IsWorkingDay(birthDate) != true)
            {
               birthDate=birthDate.AddDays(1);

            }

            return Json(birthDate, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetDepositTerminationOrder(long orderID)
        {
            return Json(XBService.GetDepositTerminationOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetClosedDepositAccountList(xbs.DepositOrder order)
        {
            List<xbs.Account> accounts = null;

            order.Type = xbs.OrderType.Deposit;
            if (order.AccountType == 0)
            {
                order.AccountType = 1;
                if (order.Currency.Length != 3)
                {
                    return Json(accounts, JsonRequestBehavior.AllowGet);
                }
            }
            else if (order.AccountType == 1)
            {
                order.AccountType = 2;
                if (order.Currency.Length != 3 || order.ThirdPersonCustomerNumbers == null || order.ThirdPersonCustomerNumbers.Count == 0)
                {
                    return Json(accounts, JsonRequestBehavior.AllowGet);
                }
            }
            else if (order.AccountType == 2)
            {
                order.AccountType = 3;
                if (order.Currency.Length != 3 || order.ThirdPersonCustomerNumbers == null || order.ThirdPersonCustomerNumbers.Count == 0)
                {
                    return Json(accounts, JsonRequestBehavior.AllowGet);
                }
            }


            accounts = XBService.GetClosedDepositAccountList(order);

            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBusinesDepositOptionRate(ushort depositOption, string currency)
        {
            return Json(XBService.GetBusinesDepositOptionRate(depositOption, currency), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDepositActions(xbs.DepositOrder order)
        {
            return Json(XBService.GetDepositActions(order), JsonRequestBehavior.AllowGet);
        }


    }
}