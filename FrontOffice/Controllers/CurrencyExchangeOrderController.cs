using FrontOffice.Models;
using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CurrencyExchangeOrderController : Controller
    {
        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveCurrencyExchangeOrder(xbs.CurrencyExchangeOrder order, bool confirm = false)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();
            if ((order.Type == xbs.OrderType.CashConvertation || order.Type == xbs.OrderType.CashCreditConvertation || order.Type == xbs.OrderType.CashDebitConvertation
                || order.Type == xbs.OrderType.InBankConvertation)
                && order.DebitAccount.Currency == order.ReceiverAccount.Currency)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                error.Description = "Ընտրված արժույթները նույնն են";
                result.Errors = new List<xbs.ActionError>();
                result.Errors.Add(error);
                result.ResultCode = xbs.ResultCode.ValidationError;
                return Json(result);

            }



            if (order.Type == xbs.OrderType.CashCreditConvertation && XBService.CheckCustomerCashOuts(order.DebitAccount.Currency, order.Amount) && !confirm)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                error.Description = "Հաճախորդի կանխիկ ելքագրումները գերազանցում են 6,000,000.00 դրամ սահմանաչափը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = xbs.ResultCode.Warning;
                result.Errors.Add(error);
                return Json(result);
            }
            else if (order.Type == xbs.OrderType.CashDebitConvertation && !confirm)
            {
                List<xbs.CustomerDebts> debts = new List<xbs.CustomerDebts>();
                debts = XBService.GetCustomerDebts(XBService.GetAuthorizedCustomerNumber());
                result.Errors = new List<xbs.ActionError>();
                if (debts.FindAll(m => m.DebtType == xbs.DebtTypes.Dahk).Count > 0)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Հաճախորդը ունի ԴԱՀԿ արգելանք:";
                    result.ResultCode = xbs.ResultCode.Warning;
                    result.Errors.Add(error);
                }
                if (debts.FindAll(m => m.DebtType == xbs.DebtTypes.PEK).Count > 0)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Գոյություն ունի ՊԵԿ արգելանք:";
                    result.ResultCode = xbs.ResultCode.Warning;
                    result.Errors.Add(error);

                }
                if (CheckForCurrencyExchangeOrderTransactionLimit(order))
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Ուշադրություն, գործարքի գումարը գերազանցում է " + GetTransactionLimit().ToString() + " ՀՀ դրամը կամ դրան համարժեք արտարժույթը, եթե ցանկանում եք հաստատել, սեղմեք «այո»:";
                    result.ResultCode = xbs.ResultCode.Warning;
                    result.Errors.Add(error);
                }
                if (result.Errors.Count > 0)
                    return Json(result);
            }
            else if (order.Type == xbs.OrderType.Convertation && !confirm)
            {
                if (CheckForCurrencyExchangeOrderTransactionLimit(order))
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Ուշադրություն, գործարքի գումարը գերազանցում է " + GetTransactionLimit().ToString() + " ՀՀ դրամը կամ դրան համարժեք արտարժույթը, եթե ցանկանում եք հաստատել, սեղմեք «այո»:";
                    result.Errors = new List<xbs.ActionError>();
                    result.ResultCode = xbs.ResultCode.Warning;
                    result.Errors.Add(error);
                    return Json(result);
                }
            }


            order.Amount = Utility.RoundAmount(order.Amount, order.Currency);
            order.AmountInAmd = Utility.RoundAmount(Convert.ToDouble(order.AmountInAmd), "AMD");
            order.AmountInCrossCurrency = Utility.RoundAmount(Convert.ToDouble(order.AmountInCrossCurrency), order.Currency);
            result = XBService.SaveCurrencyExchangeOrder(order);

            return Json(result);
        }

        public ActionResult PersonalCurrencyExchangeOrder()
        {
            return PartialView("PersonalCurrencyExchangeOrder");
        }



        public void GetConvertationCashPaymentOrder(xbs.CurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            byte operationType = 0;


            if (order.DebitAccount.Currency == "AMD" && order.ReceiverAccount.Currency != "AMD")
            {
                operationType = 1;
            }
            else
            if (order.DebitAccount.Currency != "AMD" && order.ReceiverAccount.Currency == "AMD")
            {
                operationType = 2;
            }



            customerNumber = XBService.GetAuthorizedCustomerNumber();
            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);


            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName) && !order.ForThirdPerson)
            {
                if (order.OPPerson != null)
                {
                    customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
                }
                else
                {
                    customerName = customer.OrganisationName;
                }
            }
            else
            {
                if (order.OPPerson != null)
                {
                    customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
                }
                else
                {
                    customerName = customer.FirstName + " " + customer.LastName;
                }
            }

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)System.Web.HttpContext.Current.Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "title", value: Utility.ConvertAnsiToUnicode(order.HasPassport == true ? "²ñï³ñÅáõÛÃÇ ÷áË³ñÏÙ³Ý ¹ñ³Ù³ñÏÕÇ »ÉùÇ ûñ¹»ñ" : "²é³Ýó ³ÝÓÁ Ñ³ëï³ïáÕ ÷³ëï³ÃÕÃÇ Ý»ñÏ³Û³óÙ³Ý ³ñÅáõÛÃÇ ÷áË³Ý³ÏÙ³Ý ¹ñ³Ù³ñÏÕÇ »ÉùÇ ûñ¹»ñ"));
            parameters.Add(key: "passport_title", value: Utility.ConvertAnsiToUnicode(order.HasPassport == true ? "²ÝÓÝ³·Çñ" : ""));
            parameters.Add(key: "num_r", value: order.OrderNumberForCredit);
            parameters.Add(key: "num_p", value: order.OrderNumberForDebet);
            parameters.Add(key: "fileName", value: "Convertation_Cash");
            parameters.Add(key: "oper", value: operationType == 1 ? "Վաճառք" : "Առք");   //1` Վաճառք, 2`  Առք
            parameters.Add(key: "exch_rate", value: order.ConvertationRate.ToString());
            parameters.Add(key: "amount", value: operationType == 1 ? order.Amount.ToString() : order.AmountInAmd.ToString());
            parameters.Add(key: "currency", value: order.ReceiverAccount.Currency);

            parameters.Add(key: "amount_exch", value: operationType == 1 ? order.AmountInAmd.ToString() : order.Amount.ToString());
            parameters.Add(key: "currency_exch", value: order.DebitAccount.Currency);

            parameters.Add(key: "customer_number", value: customerNumber.ToString());
            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "cust_pass", value: order.HasPassport == true ? order.OPPerson != null ? order.OPPerson.PersonDocument : customer.DocumentNumber + ", " + customer.DocumentGivenBy + ", " + customer.DocumentGivenDate : "");
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: order.OPPerson == null ? customer.Address != null ? customer.Address : "" : order.OPPerson != null && order.OPPerson.PersonAddress != null ? order.OPPerson.PersonAddress : "");
            parameters.Add(key: "User", value: user.userID.ToString());

            int code = -1;
            string currency = "";
            if (order.DebitAccount.Currency != "AMD")
            {
                currency = order.DebitAccount.Currency;
            }

            else if (order.ReceiverAccount.Currency != "AMD")
            {
                currency = order.ReceiverAccount.Currency;
            }
            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }
            parameters.Add(key: "seria", value: XBService.CreateSerialNumber(code, operationType));
            parameters.Add(key: "nn", value: order.OrderNumber);
            parameters.Add(key: "purpose", value: order.Description);

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }
            ReportService.GetConvertationCashPaymentOrder(parameters);
        }
        public void GetConvertationCashNonCashPaymentOrder(xbs.CurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            byte operationType = 0;


            if (order.DebitAccount.Currency == "AMD" && order.ReceiverAccount.Currency != "AMD")
            {
                operationType = 1;
            }
            else
            if (order.DebitAccount.Currency != "AMD" && order.ReceiverAccount.Currency == "AMD")
            {
                operationType = 2;
            }


            string cashInFeeAccountNumber = "0";
            double cashInFeeAmount = 0;
            if (order.Fees != null && order.Fees.Count > 0)
            {

                foreach (var oneFeeItem in order.Fees)
                {
                    if (oneFeeItem.Type == 28)
                    {
                        xbs.Account feeAccount = XBService.GetOperationSystemAccountForFee(order, oneFeeItem.Type);
                        cashInFeeAccountNumber = feeAccount.AccountNumber;
                        cashInFeeAmount = oneFeeItem.Amount;
                    }
                }

            }


            customerNumber = XBService.GetAuthorizedCustomerNumber();
            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)System.Web.HttpContext.Current.Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName))
                if (order.DebitAccount != null && order.DebitAccount.AccountNumber != null && order.DebitAccount.AccountNumber != "0" && order.DebitAccount.AccountNumber != "")
                    customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
                else
                    customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            else
                customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;



            parameters.Add(key: "customer_credit_account", value: order.ReceiverAccount.AccountNumber);
            parameters.Add(key: "num_p", value: order.OrderNumberForDebet);
            parameters.Add(key: "passport_title", value: Utility.ConvertAnsiToUnicode(order.HasPassport == true ? "²ÝÓÝ³·Çñ" : ""));
            parameters.Add(key: "fileName", value: "Convertation_Cash_NonCash");
            parameters.Add(key: "oper", value: operationType == 1 ? "Վաճառք" : "Առք");   //1` Վաճառք, 2`  Առք
            parameters.Add(key: "exch_rate", value: order.ConvertationRate.ToString("N2"));
            parameters.Add(key: "amount", value: operationType == 1 ? order.Amount.ToString() : order.AmountInAmd.ToString());
            parameters.Add(key: "currency", value: order.ReceiverAccount.Currency);

            parameters.Add(key: "amount_exch", value: operationType == 1 ? order.AmountInAmd.ToString() : order.Amount.ToString());
            parameters.Add(key: "currency_exch", value: order.DebitAccount.Currency);

            parameters.Add(key: "customer_number", value: customerNumber.ToString());
            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "cust_pass", value: order.HasPassport == true ? order.OPPerson.PersonDocument : "");
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: String.IsNullOrEmpty(customer.OrganisationName) ? order.OPPerson.PersonAddress != null ? order.OPPerson.PersonAddress : "" : customer.Address);
            parameters.Add(key: "User", value: user.userID.ToString());

            int code = -1;
            string currency = "";
            if (order.DebitAccount.Currency != "AMD")
            {
                currency = order.DebitAccount.Currency;
            }

            else if (order.ReceiverAccount.Currency != "AMD")
            {
                currency = order.ReceiverAccount.Currency;
            }
            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }
            parameters.Add(key: "seria", value: XBService.CreateSerialNumber(code, operationType));
            parameters.Add(key: "nn", value: order.OrderNumber);
            parameters.Add(key: "purpose", value: order.Description);

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            parameters.Add(key: "commissionAmount", value: cashInFeeAmount.ToString());
            parameters.Add(key: "commissionAccount", value: cashInFeeAccountNumber);

            ReportService.GetConvertationCashNonCashPaymentOrder(parameters);
        }
        public void GetConvertationNonCashCashPaymentOrder(xbs.CurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            byte operationType = 0;

            if (order.DebitAccount.Currency == "AMD" && order.ReceiverAccount.Currency != "AMD")
            {
                operationType = 1;
            }
            else
            if (order.DebitAccount.Currency != "AMD" && order.ReceiverAccount.Currency == "AMD")
            {
                operationType = 2;
            }

            if (order.TransferID != 0)
            {
                xbs.Transfer transfer = new xbs.Transfer();
                transfer.Id = order.TransferID;
                transfer = XBService.GetTransfer(transfer.Id);
                if (transfer.InstantMoneyTransfer == 1)
                    order.DebitAccount = transfer.DebitAccount;
                if (transfer.TransferGroup == 4)
                    order.DebitAccount = transfer.CreditAccount;

            }
            customerNumber = XBService.GetAuthorizedCustomerNumber();
            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);



            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName) && !order.ForThirdPerson)
            {
                customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            }
            else
            {
                if (order.OPPerson != null)
                {
                    customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
                }
                else
                {
                    customerName = customer.FirstName + " " + customer.LastName;
                }
            }

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)System.Web.HttpContext.Current.Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customer_debit_account", value: order.DebitAccount.AccountNumber);
            parameters.Add(key: "num_r", value: order.OrderNumberForCredit);
            parameters.Add(key: "passport_title", value: order.HasPassport == true ? "Անձնագիր" : "");
            parameters.Add(key: "fileName", value: "Convertation_NonCash_Cash");
            parameters.Add(key: "oper", value: operationType == 1 ? "Վաճառք" : "Առք");   //1` Վաճառք, 2`  Առք
            parameters.Add(key: "exch_rate", value: order.ConvertationRate.ToString("N2"));
            parameters.Add(key: "amount", value: operationType == 1 ? order.Amount.ToString() : order.AmountInAmd.ToString());
            parameters.Add(key: "currency", value: order.ReceiverAccount.Currency);

            parameters.Add(key: "amount_exch", value: operationType == 1 ? order.AmountInAmd.ToString() : order.Amount.ToString());
            parameters.Add(key: "currency_exch", value: order.DebitAccount.Currency);

            parameters.Add(key: "customer_number", value: customerNumber.ToString());
            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "cust_pass", value: order.HasPassport == true ? order.OPPerson.PersonDocument : "");
            parameters.Add(key: "Customer_address", value: String.IsNullOrEmpty(customer.OrganisationName) ? order.OPPerson.PersonAddress : customer.Address);
            parameters.Add(key: "User", value: user.userID.ToString());
            int code = -1;
            string currency = "";

            if (order.DebitAccount.Currency != "AMD")
            {
                currency = order.DebitAccount.Currency;
            }

            else if (order.ReceiverAccount.Currency != "AMD")
            {
                currency = order.ReceiverAccount.Currency;
            }

            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }
            parameters.Add(key: "seria", value: XBService.CreateSerialNumber(code, operationType));
            parameters.Add(key: "nn", value: order.OrderNumber);
            parameters.Add(key: "purpose", value: order.Description);

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            ReportService.GetConvertationNonCashCashPaymentOrder(parameters);
        }
        public void GetCrossConvertationCash(xbs.CurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            int code = -1;
            string currency = "";
            currency = order.ReceiverAccount.Currency;
            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];


            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName) && !order.ForThirdPerson)
            {
                customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            }
            else
            {
                if (order.OPPerson != null)
                {
                    customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
                }
                else
                {
                    customerName = customer.FirstName + " " + customer.LastName;
                }
            }

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "num_rasx_for_ost", value: !string.IsNullOrEmpty(order.OrderNumberForShortChange) ? order.OrderNumberForShortChange : "0");
            parameters.Add(key: "num_r", value: order.OrderNumberForCredit);
            parameters.Add(key: "num_p", value: order.OrderNumberForDebet);
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: order.OPPerson == null ? customer.Address != null ? customer.Address : "" : order.OPPerson != null && order.OPPerson.PersonAddress != null ? order.OPPerson.PersonAddress : " ");
            parameters.Add(key: "User", value: user.userID.ToString());
            parameters.Add(key: "purpose", value: order.Description);
            parameters.Add(key: "seria", value: Utility.ConvertAnsiToUnicode(XBService.CreateSerialNumber(code, 3)));
            parameters.Add(key: "nn", value: order.OrderNumber);

            parameters.Add(key: "amount_buy", value: order.Amount.ToString());
            parameters.Add(key: "currency_buy", value: order.Currency);
            parameters.Add(key: "kurs_buy", value: order.ConvertationRate.ToString());
            parameters.Add(key: "amount_sell", value: order.AmountInCrossCurrency.ToString());
            parameters.Add(key: "currency_sell", value: (order.ReceiverAccount.Currency).ToString());
            parameters.Add(key: "Kurs_sell", value: order.ConvertationRate1.ToString());

            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());

            parameters.Add(key: "cust_pass", value: order.HasPassport == true ? order.OPPerson != null ? order.OPPerson.PersonDocument : customer.DocumentNumber + ", " + customer.DocumentGivenBy + ", " + customer.DocumentGivenDate : " ");



            parameters.Add(key: "cross_kurs", value: order.ConvertationCrossRate.ToString());
            parameters.Add(key: "diff_inAMD", value: order.ShortChange.ToString());
            parameters.Add(key: "customer_number", value: customer.CustomerNumber.ToString());

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));// DateTime.Now.ToString("dd/MMM/yyyy/ hh:mm:ss.fff tt"));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            ReportService.GetCrossConvertationCash(parameters);
        }
        public void GetCrossConvertationCashNonCash(xbs.CurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            int code = -1;
            string currency = "";

            string dCur = order.DebitAccount.Currency;
            string cCur = order.ReceiverAccount.Currency;
            currency = order.ReceiverAccount.Currency;
            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];

            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName) && !order.ForThirdPerson)
                customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            else
                customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;


            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "num_p", value: order.OrderNumberForDebet);
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: !string.IsNullOrEmpty(order.OPPerson.PersonAddress) ? order.OPPerson.PersonAddress : " ");
            parameters.Add(key: "customer_credit_account", value: order.ReceiverAccount.AccountNumber);
            parameters.Add(key: "User", value: user.userID.ToString());
            parameters.Add(key: "purpose", value: order.Description);
            parameters.Add(key: "seria", value: Utility.ConvertAnsiToUnicode(XBService.CreateSerialNumber(code, 3)));
            parameters.Add(key: "nn", value: order.OrderNumber);

            parameters.Add(key: "amount_buy", value: order.Amount.ToString());
            parameters.Add(key: "currency_buy", value: order.Currency);
            parameters.Add(key: "kurs_buy", value: order.ConvertationRate.ToString());
            parameters.Add(key: "amount_sell", value: order.AmountInCrossCurrency.ToString());
            parameters.Add(key: "currency_sell", value: order.ReceiverAccount.Currency);
            parameters.Add(key: "Kurs_sell", value: order.ConvertationRate1.ToString());

            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "cust_pass", value: order.HasPassport ? order.OPPerson.PersonDocument : " ");
            parameters.Add(key: "cross_kurs", value: order.ConvertationCrossRate.ToString());
            parameters.Add(key: "diff_inAMD", value: "0");
            parameters.Add(key: "customer_number", value: customer.CustomerNumber.ToString());

            ulong reciverCustomerNumber = XBService.GetAccountCustomerNumber(order.ReceiverAccount);

            CustomerMainDataViewModel reciverCustomer = new CustomerMainDataViewModel();
            reciverCustomer.Get(reciverCustomerNumber);
            //reciverCustomer.Get(reciverCustomerNumber);
            string creditAccountDescription = "";
            if (reciverCustomer.CustomerType != 6)
            {
                creditAccountDescription = order.Receiver + "-ի";
            }
            else
            {
                creditAccountDescription = order.Receiver + "ի";
            }

            parameters.Add(key: "cred_acc_descr", value: order.Receiver == null ? " " : creditAccountDescription);

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));

            }
            else
            {

                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            ReportService.GetCrossConvertationCashNonCash(parameters);
        }
        public void GetCrossConvertationNonCashCash(xbs.CurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            int code = -1;
            string currency = "";

            string dCur = order.DebitAccount.Currency;
            string cCur = order.ReceiverAccount.Currency;

            if (order.TransferID != 0)
            {
                xbs.Transfer transfer = new xbs.Transfer();
                transfer.Id = order.TransferID;
                transfer = XBService.GetTransfer(transfer.Id);
                if (transfer.InstantMoneyTransfer == 1)
                    order.DebitAccount = transfer.DebitAccount;
                if (transfer.TransferGroup == 4)
                    order.DebitAccount = transfer.CreditAccount;
            }


            currency = order.ReceiverAccount.Currency;
            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];

            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName) && !order.ForThirdPerson)
                customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            else
                customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;


            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "num_rasx_for_ost", value: order.OrderNumberForShortChange != null ? order.OrderNumberForShortChange : "0");

            parameters.Add(key: "num_r", value: order.OrderNumberForCredit);
            parameters.Add(key: "num_p", value: order.OrderNumberForDebet);
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: order.OPPerson.PersonAddress);
            parameters.Add(key: "customer_debit_account", value: order.DebitAccount.AccountNumber);
            parameters.Add(key: "User", value: user.userID.ToString());
            parameters.Add(key: "purpose", value: order.Description);
            parameters.Add(key: "seria", value: Utility.ConvertAnsiToUnicode(XBService.CreateSerialNumber(code, 3)));
            parameters.Add(key: "nn", value: order.OrderNumber);

            parameters.Add(key: "amount_buy", value: order.Amount.ToString());
            parameters.Add(key: "currency_buy", value: order.Currency);
            parameters.Add(key: "kurs_buy", value: order.ConvertationRate.ToString());
            parameters.Add(key: "amount_sell", value: order.AmountInCrossCurrency.ToString());
            parameters.Add(key: "currency_sell", value: order.ReceiverAccount.Currency);
            parameters.Add(key: "Kurs_sell", value: order.ConvertationRate1.ToString());

            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "cust_pass", value: order.OPPerson.PersonDocument);
            parameters.Add(key: "cross_kurs", value: order.ConvertationCrossRate.ToString());
            parameters.Add(key: "diff_inAMD", value: order.ShortChange.ToString());
            parameters.Add(key: "customer_number", value: customer.CustomerNumber.ToString());

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            ReportService.GetCrossConvertationNonCashCash(parameters);
        }


        public void GetCrossConvertationDetails(xbs.CurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            int code = -1;
            string currency = "";

            string dCur = order.DebitAccount.Currency;
            string cCur = order.ReceiverAccount.Currency;


            currency = order.ReceiverAccount.Currency;
            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }

            if (order.TransferID != 0)
            {
                xbs.Transfer transfer = new xbs.Transfer();
                transfer.Id = order.TransferID;
                transfer = XBService.GetTransfer(transfer.Id);
                if (transfer.InstantMoneyTransfer == 1)
                    order.DebitAccount = transfer.DebitAccount;
                if (transfer.TransferGroup == 4)
                    order.DebitAccount = transfer.CreditAccount;
            }

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];


            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName))
                customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            else
                customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;


            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: order.OPPerson.PersonAddress);
            parameters.Add(key: "customer_debit_account", value: order.DebitAccount.AccountNumber);
            parameters.Add(key: "customer_credit_account", value: order.ReceiverAccount.AccountNumber);
            parameters.Add(key: "User", value: user.userID.ToString());
            parameters.Add(key: "purpose", value: order.Description);
            parameters.Add(key: "seria", value: XBService.CreateSerialNumber(code, 3));
            parameters.Add(key: "nn", value: order.OrderNumber);

            parameters.Add(key: "amount_buy", value: order.Amount.ToString());
            parameters.Add(key: "currency_buy", value: order.Currency);
            parameters.Add(key: "kurs_buy", value: order.ConvertationRate.ToString());
            parameters.Add(key: "amount_sell", value: order.AmountInCrossCurrency.ToString());
            parameters.Add(key: "currency_sell", value: order.ReceiverAccount.Currency);
            parameters.Add(key: "Kurs_sell", value: order.ConvertationRate1.ToString());

            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "cust_pass", value: order.OPPerson.PersonDocument);
            parameters.Add(key: "cross_kurs", value: order.ConvertationCrossRate.ToString());
            parameters.Add(key: "diff_inAMD", value: "0");
            parameters.Add(key: "customer_number", value: customer.CustomerNumber.ToString());

            ulong reciverCustomerNumber = XBService.GetAccountCustomerNumber(order.ReceiverAccount);

            CustomerViewModel reciverCustomer = new CustomerViewModel();
            reciverCustomer.Get(reciverCustomerNumber);
            string creditAccountDescription = "";
            if (order.Receiver != null)
            {
                if (reciverCustomer.CustomerType != 6)
                {
                    creditAccountDescription = order.Receiver + "-ի";
                }
                else
                {
                    creditAccountDescription = order.Receiver + "ի";
                }
            }

            parameters.Add(key: "cred_acc_descr", value: order.Receiver == null ? " " : creditAccountDescription);

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            ReportService.GetCrossConvertation(parameters);
        }


        public void GetConvertationDetails(xbs.CurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            int code = -1;
            string currency = "";
            byte operationType = 0;

            if (order.DebitAccount.Currency != "AMD")
            {
                currency = order.DebitAccount.Currency;
            }

            else if (order.ReceiverAccount.Currency != "AMD")
            {
                currency = order.ReceiverAccount.Currency;
            }

            if (order.DebitAccount.Currency == "AMD" && order.ReceiverAccount.Currency != "AMD")
            {
                operationType = 1;
            }
            else
            if (order.DebitAccount.Currency != "AMD" && order.ReceiverAccount.Currency == "AMD")
            {
                operationType = 2;
            }

            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }

            if (order.TransferID != 0)
            {
                xbs.Transfer transfer = new xbs.Transfer();
                transfer.Id = order.TransferID;
                transfer = XBService.GetTransfer(transfer.Id);
                if (transfer.InstantMoneyTransfer == 1)
                    order.DebitAccount = transfer.DebitAccount;
                if (transfer.TransferGroup == 4)
                    order.DebitAccount = transfer.CreditAccount;
            }
            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];


            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName))
                customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            else
                customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;


            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: String.IsNullOrEmpty(customer.OrganisationName) ? order.OPPerson.PersonAddress != null ? order.OPPerson.PersonAddress : "" : customer.Address);
            parameters.Add(key: "User", value: user.userID.ToString());
            parameters.Add(key: "seria", value: XBService.CreateSerialNumber(code, operationType));
            parameters.Add(key: "nn", value: order.OrderNumber);
            parameters.Add(key: "amount", value: operationType == 1 ? order.Amount.ToString() : order.AmountInAmd.ToString());
            parameters.Add(key: "currency", value: order.ReceiverAccount.Currency);

            parameters.Add(key: "exch_rate", value: order.ConvertationRate.ToString("N2"));
            parameters.Add(key: "amount_exch", value: operationType == 1 ? order.AmountInAmd.ToString() : order.Amount.ToString());
            parameters.Add(key: "currency_exch", value: order.DebitAccount.Currency);
            parameters.Add(key: "oper", value: operationType == 1 ? "Վաճառք" : "Առք");   //1` Վաճառք, 2`  Առք
            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "cust_pass", value: order.OPPerson.PersonDocument);
            parameters.Add(key: "customer_number", value: customer.CustomerNumber.ToString());
            parameters.Add(key: "customer_debit_account", value: order.DebitAccount.AccountNumber);
            parameters.Add(key: "customer_credit_account", value: order.ReceiverAccount.AccountNumber);
            parameters.Add(key: "fileName", value: "Convertation_NonCash");
            parameters.Add(key: "transaction_purpose", value: "Ներբանկային փոխարկման հայտ");  //Ներբանկային փոխարկման հայտ
            parameters.Add(key: "transaction_purpose1", value: "Արտարժույթի առք ու վաճառքի գործառնությունների վերաբերյալ"); //Արտարժույթի առք ու վաճառքի գործառնությունների վերաբերյալ
            parameters.Add(key: "purpose", value: order.Description);

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));// DateTime.Now.ToString("dd/MMM/yyyy/ hh:mm:ss.fff tt"));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            ReportService.GetConvertation(parameters);
        }



        public ActionResult GetShortChangeAmount(xbs.CurrencyExchangeOrder order)
        {
            return Json(XBService.GetShortChangeAmount(order));
        }
        public ActionResult GetCrossConvertationVariant(string debitCurrency, string creditCurrency)
        {
            return Json(XBService.GetCrossConvertationVariant(debitCurrency, creditCurrency));
        }

        public JsonResult IsBigAmountForCurrencyExchangeOrder(xbs.CurrencyExchangeOrder paymentOrder)
        {
            return Json(XBService.IsBigAmountForCurrencyExchangeOrder(paymentOrder), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCardFeeForCurrencyExchangeOrder(xbs.CurrencyExchangeOrder paymentOrder)
        {
            return Json(XBService.GetCardFeeForCurrencyExchangeOrder(paymentOrder), JsonRequestBehavior.AllowGet);
        }


        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveTransitCurrencyExchangeOrder(xbs.TransitCurrencyExchangeOrder order, bool confirm = false)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();
            if (order.Type == xbs.OrderType.CashTransitCurrencyExchangeOrder
                && order.DebitAccount.Currency == order.ReceiverAccount.Currency)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                error.Description = "Ընտրված արժույթները նույնն են";
                result.Errors = new List<xbs.ActionError>();
                result.Errors.Add(error);
                result.ResultCode = xbs.ResultCode.ValidationError;
                return Json(result);

            }

            order.Amount = Utility.RoundAmount(order.Amount, order.Currency);
            order.AmountInAmd = Utility.RoundAmount(Convert.ToDouble(order.AmountInAmd), "AMD");
            order.AmountInCrossCurrency = Utility.RoundAmount(Convert.ToDouble(order.AmountInCrossCurrency), order.Currency);
            result = XBService.SaveTransitCurrencyExchangeOrder(order);

            return Json(result);
        }


        public JsonResult GetTransitCurrencyExchangeOrderSystemAccount(xbs.TransitCurrencyExchangeOrder order, string operationCurrency)
        {
            return Json(XBService.GetTransitCurrencyExchangeOrderSystemAccount(order, xbs.OrderAccountType.CreditAccount, operationCurrency), JsonRequestBehavior.AllowGet);
        }


        public void GetConvertationCashNonCashForMatureOrder(xbs.TransitCurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            byte operationType = 0;


            if (order.DebitAccount.Currency == "AMD" && order.ReceiverAccount.Currency != "AMD")
            {
                operationType = 1;
            }
            else
            if (order.DebitAccount.Currency != "AMD" && order.ReceiverAccount.Currency == "AMD")
            {
                operationType = 2;
            }


            string cashInFeeAccountNumber = "0";
            double cashInFeeAmount = 0;
            if (order.Fees != null && order.Fees.Count > 0)
            {

                foreach (var oneFeeItem in order.Fees)
                {

                    
                    if (oneFeeItem.Type == 28)
                    {
                        xbs.Account feeAccount = XBService.GetOperationSystemAccountForFee(order, oneFeeItem.Type);
                        cashInFeeAccountNumber = feeAccount.AccountNumber;
                        cashInFeeAmount = oneFeeItem.Amount;
                    }
                   


                }

            }


            customerNumber = XBService.GetAuthorizedCustomerNumber();
            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)System.Web.HttpContext.Current.Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName))
                if (order.DebitAccount != null && order.DebitAccount.AccountNumber != null && order.DebitAccount.AccountNumber != "0" && order.DebitAccount.AccountNumber != "")
                    customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
                else
                    customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            else
                customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;

            xbs.Account receiverAccount = XBService.GetTransitCurrencyExchangeOrderSystemAccount(order, xbs.OrderAccountType.CreditAccount, order.ReceiverAccount.Currency);


            parameters.Add(key: "customer_credit_account", value: receiverAccount.AccountNumber);
            parameters.Add(key: "num_p", value: order.OrderNumberForDebet);
            parameters.Add(key: "passport_title", value: Utility.ConvertAnsiToUnicode(order.HasPassport == true ? "²ÝÓÝ³·Çñ" : ""));
            parameters.Add(key: "fileName", value: "Convertation_Cash_NonCash");
            parameters.Add(key: "oper", value: operationType == 1 ? "Վաճառք" : "Առք");   //1` Վաճառք, 2`  Առք
            parameters.Add(key: "exch_rate", value: order.ConvertationRate.ToString("N2"));
            parameters.Add(key: "amount", value: operationType == 1 ? order.Amount.ToString() : order.AmountInAmd.ToString());
            parameters.Add(key: "currency", value: receiverAccount.Currency);

            parameters.Add(key: "amount_exch", value: operationType == 1 ? order.AmountInAmd.ToString() : order.Amount.ToString());
            parameters.Add(key: "currency_exch", value: order.DebitAccount.Currency);

            parameters.Add(key: "customer_number", value: customerNumber.ToString());
            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "cust_pass", value: order.HasPassport == true ? order.OPPerson.PersonDocument : "");
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: String.IsNullOrEmpty(customer.OrganisationName) ? order.OPPerson.PersonAddress != null ? order.OPPerson.PersonAddress : "" : customer.Address);
            parameters.Add(key: "User", value: user.userID.ToString());

            int code = -1;
            string currency = "";
            if (order.DebitAccount.Currency != "AMD")
            {
                currency = order.DebitAccount.Currency;
            }

            else if (receiverAccount.Currency != "AMD")
            {
                currency = receiverAccount.Currency;
            }
            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }
            parameters.Add(key: "seria", value: XBService.CreateSerialNumber(code, operationType));
            parameters.Add(key: "nn", value: order.OrderNumber);
            parameters.Add(key: "purpose", value: order.Description);

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));// DateTime.Now.ToString("dd/MMM/yyyy/ hh:mm:ss.fff tt"));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            parameters.Add(key: "commissionAmount", value: cashInFeeAmount.ToString());
            parameters.Add(key: "commissionAccount", value: cashInFeeAccountNumber);

            ReportService.GetConvertationCashNonCashPaymentOrder(parameters);
        }

        public void GetCrossConvertationCashNonCashForMatureOrder(xbs.TransitCurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            int code = -1;
            string currency = "";

            currency = order.ReceiverAccount.Currency;
            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];

            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName) && !order.ForThirdPerson)
                customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            else
                customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;


            xbs.Account receiverAccount = XBService.GetTransitCurrencyExchangeOrderSystemAccount(order, xbs.OrderAccountType.CreditAccount, order.ReceiverAccount.Currency);

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "num_p", value: order.OrderNumberForDebet);
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: !string.IsNullOrEmpty(order.OPPerson.PersonAddress) ? order.OPPerson.PersonAddress : " ");
            parameters.Add(key: "customer_credit_account", value: receiverAccount.AccountNumber);
            parameters.Add(key: "User", value: user.userID.ToString());
            parameters.Add(key: "purpose", value: order.Description);
            parameters.Add(key: "seria", value: Utility.ConvertAnsiToUnicode(XBService.CreateSerialNumber(code, 3)));
            parameters.Add(key: "nn", value: order.OrderNumber);

            parameters.Add(key: "amount_buy", value: order.Amount.ToString());
            parameters.Add(key: "currency_buy", value: order.Currency);
            parameters.Add(key: "kurs_buy", value: order.ConvertationRate.ToString());
            parameters.Add(key: "amount_sell", value: order.AmountInCrossCurrency.ToString());
            parameters.Add(key: "currency_sell", value: receiverAccount.Currency);
            parameters.Add(key: "Kurs_sell", value: order.ConvertationRate1.ToString());

            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "cust_pass", value: order.HasPassport ? order.OPPerson.PersonDocument : " ");
            parameters.Add(key: "cross_kurs", value: order.ConvertationCrossRate.ToString());
            parameters.Add(key: "diff_inAMD", value: (((order.Amount * (order.ConvertationRate / order.ConvertationRate1)) - order.Amount) * order.ConvertationRate1).ToString());
            parameters.Add(key: "customer_number", value: customer.CustomerNumber.ToString());

            string creditAccountDescription = "";
            creditAccountDescription = receiverAccount.AccountDescription + "-ի ";

            parameters.Add(key: "cred_acc_descr", value: " " + creditAccountDescription);
            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            ReportService.GetCrossConvertationCashNonCash(parameters);
        }

        public void GetConvertationDetailsForMatureOrder(xbs.TransitCurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            int code = -1;
            string currency = "";
            byte operationType = 0;

            if (order.DebitAccount.Currency != "AMD")
            {
                currency = order.DebitAccount.Currency;
            }

            else if (order.ReceiverAccount.Currency != "AMD")
            {
                currency = order.ReceiverAccount.Currency;
            }

            if (order.DebitAccount.Currency == "AMD" && order.ReceiverAccount.Currency != "AMD")
            {
                operationType = 1;
            }
            else
            if (order.DebitAccount.Currency != "AMD" && order.ReceiverAccount.Currency == "AMD")
            {
                operationType = 2;
            }

            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }


            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];


            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName))
                customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            else
                customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;

            xbs.Account receiverAccount = XBService.GetTransitCurrencyExchangeOrderSystemAccount(order, xbs.OrderAccountType.CreditAccount, order.ReceiverAccount.Currency);
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: String.IsNullOrEmpty(customer.OrganisationName) ? order.OPPerson.PersonAddress != null ? order.OPPerson.PersonAddress : "" : customer.Address);
            parameters.Add(key: "User", value: user.userID.ToString());
            parameters.Add(key: "seria", value: XBService.CreateSerialNumber(code, operationType));
            parameters.Add(key: "nn", value: order.OrderNumber);
            parameters.Add(key: "amount", value: operationType == 1 ? order.Amount.ToString() : order.AmountInAmd.ToString());
            parameters.Add(key: "currency", value: order.ReceiverAccount.Currency);

            parameters.Add(key: "exch_rate", value: order.ConvertationRate.ToString("N2"));
            parameters.Add(key: "amount_exch", value: operationType == 1 ? order.AmountInAmd.ToString() : order.Amount.ToString());
            parameters.Add(key: "currency_exch", value: order.DebitAccount.Currency);
            parameters.Add(key: "oper", value: operationType == 1 ? "Վաճառք" : "Առք");   //1` Վաճառք, 2`  Առք
            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "cust_pass", value: order.OPPerson.PersonDocument);
            parameters.Add(key: "customer_number", value: customer.CustomerNumber.ToString());
            parameters.Add(key: "customer_debit_account", value: order.DebitAccount.AccountNumber);
            parameters.Add(key: "customer_credit_account", value: receiverAccount.AccountNumber);
            parameters.Add(key: "fileName", value: "Convertation_NonCash");
            parameters.Add(key: "transaction_purpose", value: "Ներբանկային փոխարկման հայտ");  //Ներբանկային փոխարկման հայտ
            parameters.Add(key: "transaction_purpose1", value: "Արտարժույթի առք ու վաճառքի գործառնությունների վերաբերյալ"); //Արտարժույթի առք ու վաճառքի գործառնությունների վերաբերյալ
            parameters.Add(key: "purpose", value: order.Description);

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));// DateTime.Now.ToString("dd/MMM/yyyy/ hh:mm:ss.fff tt"));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            ReportService.GetConvertation(parameters);
        }
        public void GetCrossConvertationDetailsForMatureOrder(xbs.TransitCurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            int code = -1;
            string currency = "";

            string dCur = order.DebitAccount.Currency;
            string cCur = order.ReceiverAccount.Currency;


            currency = order.ReceiverAccount.Currency;
            switch (currency)
            {
                case "AMD":
                    code = 0;
                    break;
                case "CAD":
                    code = 124;
                    break;
                case "CHF":
                    code = 6;
                    break;
                case "DEM":
                    code = 48;
                    break;
                case "EUR":
                    code = 2;
                    break;
                case "FRF":
                    code = 9;
                    break;
                case "GBP":
                    code = 3;
                    break;
                case "GEL":
                    code = 981;
                    break;
                case "JPY":
                    code = 392;
                    break;
                case "RUR":
                    code = 958;
                    break;
                case "SDR":
                    code = 10;
                    break;
                case "USD":
                    code = 1;
                    break;
                default:
                    code = -1;
                    break;
            }

            if (order.TransferID != 0)
            {
                xbs.Transfer transfer = new xbs.Transfer();
                transfer.Id = order.TransferID;
                transfer = XBService.GetTransfer(transfer.Id);
                if (transfer.InstantMoneyTransfer == 1)
                    order.DebitAccount = transfer.DebitAccount;
                if (transfer.TransferGroup == 4)
                    order.DebitAccount = transfer.CreditAccount;
            }

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];


            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName))
                customerName = customer.OrganisationName + " " + order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            else
                customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;

            xbs.Account receiverAccount = XBService.GetTransitCurrencyExchangeOrderSystemAccount(order, xbs.OrderAccountType.CreditAccount, order.ReceiverAccount.Currency);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: order.OPPerson.PersonAddress);
            parameters.Add(key: "customer_debit_account", value: order.DebitAccount.AccountNumber);
            parameters.Add(key: "customer_credit_account", value: receiverAccount.AccountNumber);
            parameters.Add(key: "User", value: user.userID.ToString());
            parameters.Add(key: "purpose", value: order.Description);
            parameters.Add(key: "seria", value: XBService.CreateSerialNumber(code, 3));
            parameters.Add(key: "nn", value: order.OrderNumber);

            parameters.Add(key: "amount_buy", value: order.Amount.ToString());
            parameters.Add(key: "currency_buy", value: order.Currency);
            parameters.Add(key: "kurs_buy", value: order.ConvertationRate.ToString());
            parameters.Add(key: "amount_sell", value: order.AmountInCrossCurrency.ToString());
            parameters.Add(key: "currency_sell", value: receiverAccount.Currency);
            parameters.Add(key: "Kurs_sell", value: order.ConvertationRate1.ToString());

            parameters.Add(key: "Filial_code", value: user.filialCode.ToString());
            parameters.Add(key: "cust_pass", value: order.OPPerson.PersonDocument);
            parameters.Add(key: "cross_kurs", value: order.ConvertationCrossRate.ToString());
            parameters.Add(key: "diff_inAMD", value: (((order.Amount * (order.ConvertationRate / order.ConvertationRate1)) - order.Amount) * order.ConvertationRate1).ToString());
            parameters.Add(key: "customer_number", value: customer.CustomerNumber.ToString());

            ulong reciverCustomerNumber = XBService.GetAccountCustomerNumber(receiverAccount);

            CustomerViewModel reciverCustomer = new CustomerViewModel();
            reciverCustomer.Get(reciverCustomerNumber);
            string creditAccountDescription = "";
            if (order.Receiver != null)
            {
                if (reciverCustomer.CustomerType != 6)
                {
                    creditAccountDescription = order.Receiver + "-ի";
                }
                else
                {
                    creditAccountDescription = order.Receiver + "ի";
                }
            }

            parameters.Add(key: "cred_acc_descr", value: order.Receiver == null ? " " : creditAccountDescription);

            if (order.Id == 0)
            {
                parameters.Add(key: "reportDate", value: DateTime.Now.ToString("dd/MMM/yyyy HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture));

            }
            else
            {
                DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(order.Id);
                parameters.Add(key: "reportDate", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            }

            ReportService.GetCrossConvertation(parameters);
        }

        /// <summary>
        /// Ստուգում է 6մլն-ից ավելի գործարքների սահմանափակումների առկայությունը
        /// </summary>
        /// <param name="order"></param>
        /// <returns></returns>
        public bool CheckForCurrencyExchangeOrderTransactionLimit(xbs.CurrencyExchangeOrder order)
        {
            return XBService.CheckForCurrencyExchangeOrderTransactionLimit(order);
        }

        /// <summary>
        /// Վերադարձնում է օգտագործողի կողմից կատարվող գործարքների գումարի առավելագույն սահմանաչափը
        /// </summary>
        /// <param name="order"></param>
        /// <returns></returns>
        public int GetTransactionLimit()
        {
            return XBService.GetTransactionLimit();
        }

        public JsonResult GetFee(xbs.CurrencyExchangeOrder paymentOrder, int feeType)
        {
            return Json(XBService.GetCurrencyExchangeOrderFee(paymentOrder, feeType), JsonRequestBehavior.AllowGet);
        }

    }
}