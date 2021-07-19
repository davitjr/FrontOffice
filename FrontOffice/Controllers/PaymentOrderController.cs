using FrontOffice.Models;
using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using FrontOffice;
using System.Web.SessionState;
using Newtonsoft.Json;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class PaymentOrderController : Controller
    {

        public JsonResult GetAccountsForOrder(short orderType, byte orderSubType, byte accountType)
        {
            return Json(XBService.GetAccountsForOrder(orderType, orderSubType, accountType), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerAccountsForOrder(ulong customerNumber, short orderType, byte orderSubType, byte accountType)
        {
            return Json(XBService.GetCustomerAccountsForOrder(customerNumber, orderType, orderSubType, accountType), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SavePaymentOrder(xbs.PaymentOrder order, bool confirm = false)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();
            if (order.Type == xbs.OrderType.CashConvertation && order.DebitAccount.Currency == order.ReceiverAccount.Currency)
            {

                xbs.ActionError error = new xbs.ActionError();

                error.Code = 599;
                error.Description = "Ընտրված արժույթները նույնն են";
                result.Errors = new List<xbs.ActionError>();
                result.Errors.Add(error);
                result.ResultCode = xbs.ResultCode.ValidationError;
                return Json(result);

            }

            if ((order.Type == xbs.OrderType.CashCredit || order.Type == xbs.OrderType.CashCreditConvertation) && XBService.CheckCustomerCashOuts(order.DebitAccount.Currency, order.Amount) && !confirm)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                error.Description = "Հաճախորդի կանխիկ ելքագրումները գերազանցում են 6,000,000.00 դրամ սահմանաչափը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = xbs.ResultCode.Warning;
                result.Errors.Add(error);
                return Json(result);
            }
            else if (order.Type == xbs.OrderType.CashDebit && !confirm)
            {
                List<xbs.CustomerDebts> debts = new List<xbs.CustomerDebts>();
                result.Errors = new List<xbs.ActionError>();
                debts = XBService.GetCustomerDebts(XBService.GetAuthorizedCustomerNumber());
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
                if (CheckForTransactionLimit(order))
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
            else if (order.Type == xbs.OrderType.RATransfer && order.SubType == 3 && !confirm)
            {
                if (CheckForTransactionLimit(order))
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
            result = XBService.SavePaymentOrder(order);
            return Json(result);
        }


        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveBudgetPaymentOrder(xbs.BudgetPaymentOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveBudgetPaymentOrder(order);
            return Json(result);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveReestrTransferOrder(xbs.ReestrTransferOrder order, bool confirm = false)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();
            if (!confirm)
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
                if (result.Errors.Count > 0)
                    return Json(result);
            }
            result = XBService.SaveReestrTransferOrder(order);
            return Json(result);
        }


        //+[CustomerActionAccessFilter(actionType = ActionType.PersonalPaymentOrderOpen)]
        public ActionResult PersonalPaymentOrder()
        {
            return PartialView("PersonalPaymentOrder");
        }

        public ActionResult ReestrDetails()
        {
            return PartialView("ReestrDetails");
        }

        public bool ManuallyRateChangingAccess(double amount, string currency, string currencyConvertation, xbs.SourceType sourceType)
        {
            return XBService.ManuallyRateChangingAccess(amount, currency, currencyConvertation, sourceType);
        }

        public int GetPoliceResponseDetailsIDWithoutRequest(string violationID, DateTime violationDate)
        {
            return XBService.GetPoliceResponseDetailsIDWithoutRequest(violationID, violationDate);
        }

        public ActionResult TransferArmPaymentOrder()
        {
            return PartialView("TransferArmPaymentOrder");
        }

        public JsonResult GetBank(int code)
        {
            return Json(InfoService.GetBank(code), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPaymentOrder(long orderID)
        {
            xbs.PaymentOrder order = new xbs.PaymentOrder();
            order = XBService.GetPaymentOrder(orderID);
            return Json(order, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCurrencyExchangeOrder(long orderID)
        {
            xbs.CurrencyExchangeOrder currencyExchangeOrder = new xbs.CurrencyExchangeOrder();
            currencyExchangeOrder = XBService.GetCurrencyExchangeOrder(orderID);
            return Json(currencyExchangeOrder, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReestrTransferOrder(long orderID)
        {
            xbs.ReestrTransferOrder order = new xbs.ReestrTransferOrder();
            order = XBService.GetReestrTransferOrder(orderID);
            return Json(order, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetBudgetPaymentOrder(long orderID)
        {
            return Json(XBService.GetBudgetPaymentOrder(orderID), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PaymentOrderDetails()
        {
            return PartialView("PaymentOrderDetails");
        }
        public ActionResult TransferArmPaymentOrderDetails()
        {
            return PartialView("TransferArmPaymentOrderDetails");
        }
        public JsonResult GetFee(xbs.PaymentOrder paymentOrder, int feeType)
        {
            return Json(XBService.GetPaymentOrderFee(paymentOrder, feeType), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCardFee(xbs.PaymentOrder paymentOrder)
        {
            return Json(XBService.GetCardFee(paymentOrder), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSyntheticStatuses()
        {
            return Json(InfoService.GetSyntheticStatuses(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult BudgetPaymentOrder()
        {
            return PartialView("BudgetPaymentOrder");
        }

        public ActionResult BudgetPaymentOrderDetails()
        {
            return PartialView("BudgetPaymentOrderDetails");
        }

        public void GetPaymentOrderDetails(xbs.PaymentOrder paymentOrder, bool isCopy = false)
        {
            ulong customerNumber = 0;

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            if (paymentOrder.Type == XBS.OrderType.InterBankTransferCash)
            {
                paymentOrder.DebitAccount = XBService.GetOperationSystemAccount(paymentOrder, xbs.OrderAccountType.DebitAccount, paymentOrder.Currency);
            }

            if (paymentOrder.Type == XBS.OrderType.InterBankTransferCash || paymentOrder.Type == XBS.OrderType.InterBankTransferNonCash)
            {
                paymentOrder.ReceiverAccount = XBService.GetOperationSystemAccount(paymentOrder, xbs.OrderAccountType.CreditAccount, paymentOrder.Currency);
            }

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "reg_date", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "document_number", value: paymentOrder.OrderNumber);

            if (!isCopy && paymentOrder.Type == xbs.OrderType.CashForRATransfer)
            {
                xbs.Account debitAccount = XBService.GetOperationSystemAccount(paymentOrder, xbs.OrderAccountType.DebitAccount, paymentOrder.DebitAccount.Currency);
                paymentOrder.DebitAccount = debitAccount;
            }

            CustomerMainDataViewModel receiverCustomer = new CustomerMainDataViewModel();
            ulong receiverCustomerNmber = XBService.GetAccountCustomerNumber(paymentOrder.ReceiverAccount);
            if (receiverCustomerNmber != 0)
                receiverCustomer.Get(receiverCustomerNmber);

            string customerName = "";
            string guid = Utility.GetSessionId();
            SessionProperties sessionProperties = (SessionProperties)Session[guid + "_SessionProperties"];
            xbs.User user = (xbs.User)Session[guid + "_User"];
            if (sessionProperties.IsNonCustomerService == true)
            {
                if (paymentOrder.OPPerson != null) customerName = paymentOrder.OPPerson.PersonName + " " + paymentOrder.OPPerson.PersonLastName;
            }
            else if (String.IsNullOrEmpty(customer.OrganisationName))
            {
                if (paymentOrder.Type == xbs.OrderType.CashForRATransfer || paymentOrder.Type == xbs.OrderType.InterBankTransferCash)
                {
                    customerName = customer.FirstName + " " + customer.LastName;
                }
                else if (paymentOrder.TransferID == 0)
                {
                    customerName = XBService.GetAccountDescription(paymentOrder.DebitAccount.AccountNumber);
                }
                else
                {
                    customerName = paymentOrder.DebitAccount.AccountDescription;
                }
            }
            else
            {
                customerName = customer.OrganisationName;
            }

            if (paymentOrder.TransferID != 0 && paymentOrder.Type == xbs.OrderType.TransitNonCashOut)
                paymentOrder.Receiver = XBService.GetAccountDescription(paymentOrder.ReceiverAccount.AccountNumber);

            string description = paymentOrder.Description;
            if (paymentOrder.CreditorDescription != null)
            {
                description += ", " + paymentOrder.CreditorDescription;
                parameters.Add(key: "debtor_Name", value: paymentOrder.CreditorDescription);
            }
            if (paymentOrder.CreditorDocumentNumber != null)
                if (paymentOrder.CreditorDocumentType == 1)
                {
                    description += ", ՀԾՀ " + paymentOrder.CreditorDocumentNumber;
                    parameters.Add(key: "debtor_soccard", value: paymentOrder.CreditorDocumentNumber);

                }
                else if (paymentOrder.CreditorDocumentType == 2)
                {
                    description += ", Պարտատիրոջ ՀԾՀ չստանալու մասին տեղեկանքի համար " + paymentOrder.CreditorDocumentNumber;
                    parameters.Add(key: "debtor_soccard", value: paymentOrder.CreditorDocumentNumber);
                }
                else if (paymentOrder.CreditorDocumentType == 3)
                    description += ", Անձնագիր " + paymentOrder.CreditorDocumentNumber;
                else if (paymentOrder.CreditorDocumentType == 4)
                {
                    description += ", ՀՎՀՀ " + paymentOrder.CreditorDocumentNumber;
                    parameters.Add(key: "debtor_code_of_tax", value: paymentOrder.CreditorDocumentNumber);
                }
            if (paymentOrder.CreditorDeathDocument != null)
                description += ", Մահվան վկայական " + paymentOrder.CreditorDeathDocument;


            if (!String.IsNullOrEmpty(paymentOrder.CreditCode))
            {
                description += ", " + paymentOrder.CreditCode + ", " + paymentOrder.Borrower + ", " + paymentOrder.MatureTypeDescription;

            }
            parameters.Add(key: "deb_acc", value: paymentOrder.DebitAccount.AccountNumber.Substring(5));
            parameters.Add(key: "deb_bank", value: paymentOrder.DebitAccount.AccountNumber.Substring(0, 5));

            if (customer.CustomerType !=6)
                  parameters.Add(key: "tax_code", value: customer.TaxCode);
            parameters.Add(key: "cred_acc", value: paymentOrder.ReceiverAccount.AccountNumber.Substring(5));

            parameters.Add(key: "quality", value: "1");
            parameters.Add(key: "soc_card", value: customer.SocCardNumber);
            parameters.Add(key: "credit_bank", value: paymentOrder.ReceiverAccount.AccountNumber.Substring(0, 5));
            parameters.Add(key: "amount", value: paymentOrder.Amount.ToString());
            parameters.Add(key: "currency", value: paymentOrder.Currency);
            parameters.Add(key: "descr", value: description);
            parameters.Add(key: "reciever", value: (paymentOrder.SubType == 3 || paymentOrder.SubType == 4) ? (String.IsNullOrEmpty(customer.OrganisationName) ? XBService.GetAccountDescription(paymentOrder.ReceiverAccount.AccountNumber) : customer.OrganisationName) : paymentOrder.Receiver);
            parameters.Add(key: "confirm_date", value: null);
            parameters.Add(key: "police_code", value: "0");
            parameters.Add(key: "for_HB", value: "0");
            parameters.Add(key: "print_soc_card", value: paymentOrder.TransferID == 0 ? "True" : "False");
            parameters.Add(key: "reg_code", value: null); 
            parameters.Add(key: "doc_id", value: null);
            parameters.Add(key: "cust_name", value: customerName);
            parameters.Add(key: "is_copy", value: isCopy ? "True" : "False");
            parameters.Add(key: "reciever_tax_code", value: receiverCustomer.CustomerType == 6 ? receiverCustomer.SocialNumber : receiverCustomer.TaxCode);

            if (paymentOrder.Fees!=null)
            {
                if (paymentOrder.Fees.Exists(m => m.Type ==20 || m.Type == 5))
                {
                    double transferFee = paymentOrder.Fees.Find(m => m.Type == 20 || m.Type == 5).Amount;
                    parameters.Add(key: "commission", value: transferFee.ToString());
                }
            }
            parameters.Add(key: "set_number", value: user.userID.ToString());
            parameters.Add(key: "TransactionTime", value:  paymentOrder.RegistrationTime != null ? paymentOrder.RegistrationTime : DateTime.Now.ToString("HH:mm"));


            ReportService.GetPaymentOrder(parameters);

        }



        public void GetBudgetPaymentOrderDetails(xbs.BudgetPaymentOrder paymentOrder, bool isCopy = false)
        {
            ulong customerNumber = 0;

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "reg_date", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "document_number", value: paymentOrder.OrderNumber);


            if (!isCopy && paymentOrder.Type == xbs.OrderType.CashForRATransfer)
            {
                xbs.Account debitAccount = XBService.GetOperationSystemAccount(paymentOrder, xbs.OrderAccountType.DebitAccount, paymentOrder.DebitAccount.Currency);
                paymentOrder.DebitAccount = debitAccount;
            }

            string socCard = "";
            string customerName = "";
            string guid = Utility.GetSessionId();
            SessionProperties sessionProperties = (SessionProperties)Session[guid + "_SessionProperties"];
            xbs.User user = (xbs.User)Session[guid + "_User"];
            if (sessionProperties.IsNonCustomerService == true)
            {
                if (paymentOrder.OPPerson != null) customerName = paymentOrder.OPPerson.PersonName + " " + paymentOrder.OPPerson.PersonLastName;
                socCard = paymentOrder.OPPerson.PersonSocialNumber;
            }
            else if (String.IsNullOrEmpty(customer.OrganisationName))
            {
                customerName = customer.FirstName + " " + customer.LastName;
                socCard = customer.SocCardNumber;
            }
            else
            {
                customerName = customer.OrganisationName;
                socCard = paymentOrder.OPPerson != null ? paymentOrder.OPPerson.PersonSocialNumber : "";
            }


            string description = paymentOrder.Description;
            if (paymentOrder.CreditorDescription != null)
            {
                description += ", " + paymentOrder.CreditorDescription;
                parameters.Add(key: "debtor_Name", value: paymentOrder.CreditorDescription);
            }
            if (paymentOrder.CreditorDocumentNumber != null)
                if (paymentOrder.CreditorDocumentType == 1)
                {
                    description += ", ՀԾՀ " + paymentOrder.CreditorDocumentNumber;
                    parameters.Add(key: "debtor_soccard", value: paymentOrder.CreditorDocumentNumber);

                }
                else if (paymentOrder.CreditorDocumentType == 2)
                {
                    description += ", Պարտատիրոջ ՀԾՀ չստանալու մասին տեղեկանքի համար " + paymentOrder.CreditorDocumentNumber;
                    parameters.Add(key: "debtor_soccard", value: paymentOrder.CreditorDocumentNumber);
                }
                else if (paymentOrder.CreditorDocumentType == 3)
                    description += ", Անձնագիր " + paymentOrder.CreditorDocumentNumber;
                else if (paymentOrder.CreditorDocumentType == 4)
                {
                    description += ", ՀՎՀՀ " + paymentOrder.CreditorDocumentNumber;
                    parameters.Add(key: "debtor_code_of_tax", value: paymentOrder.CreditorDocumentNumber);
                }

           
            if (paymentOrder.CreditorDeathDocument != null)
                description += ", Մահվան վկայական " + paymentOrder.CreditorDeathDocument;


            if (!String.IsNullOrEmpty(paymentOrder.ViolationID))
                description += ", որոշում " + paymentOrder.ViolationID;
            if (paymentOrder.ViolationDate.HasValue)
                description += " " + paymentOrder.ViolationDate.Value.ToString("dd/MM/yy");


            parameters.Add(key: "deb_acc", value: paymentOrder.DebitAccount.AccountNumber.Substring(5));
            parameters.Add(key: "deb_bank", value: paymentOrder.DebitAccount.AccountNumber.Substring(0, 5));
            if (paymentOrder.ReceiverAccount.AccountNumber == "900008000490" || customer.CustomerType != 6)
                parameters.Add(key: "tax_code", value: customer.TaxCode);
            parameters.Add(key: "cred_acc", value: paymentOrder.ReceiverAccount != null ? paymentOrder.ReceiverAccount.AccountNumber + (paymentOrder.PoliceCode != 0 ? paymentOrder.PoliceCode.ToString() : "") : "");

            parameters.Add(key: "quality", value: "1");
            parameters.Add(key: "soc_card", value: socCard);
            parameters.Add(key: "credit_bank", value: "10300");
            parameters.Add(key: "amount", value: paymentOrder.Amount.ToString());
            parameters.Add(key: "currency", value: paymentOrder.Currency);
            parameters.Add(key: "descr", value: description);
            parameters.Add(key: "reciever", value: paymentOrder.Receiver);
            parameters.Add(key: "confirm_date", value: null);
            parameters.Add(key: "police_code", value: paymentOrder.PoliceResponseDetailsId.ToString());
            parameters.Add(key: "for_HB", value: "0");
            parameters.Add(key: "print_soc_card", value: string.IsNullOrEmpty(socCard) ? "False" : "True");
            parameters.Add(key: "reg_code", value: paymentOrder.LTACode.ToString());
            parameters.Add(key: "doc_id", value: null);
            parameters.Add(key: "cust_name", value: customerName);
            parameters.Add(key: "is_copy", value: isCopy ? "True" : "False");
            parameters.Add(key: "reciever_tax_code", value: "");
            if (paymentOrder.Fees != null)
            {
                if (paymentOrder.Fees.Exists(m => m.Type == 20 || m.Type == 5))
                {
                    double transferFee = paymentOrder.Fees.Find(m => m.Type == 20 || m.Type == 5).Amount;
                    parameters.Add(key: "commission", value: transferFee.ToString());
                }
            }
            parameters.Add(key: "set_number", value: user.userID.ToString());
            parameters.Add(key: "TransactionTime", value: paymentOrder.RegistrationTime != null ? paymentOrder.RegistrationTime : DateTime.Now.ToString("HH:mm"));

            ReportService.GetPaymentOrder(parameters);

        }





        public JsonResult GetReceiverAccountWarnings(string accountNumber)
        {
            return Json(XBService.GetReceiverAccountWarnings(accountNumber), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PaymentAccount()
        {
            return PartialView("PaymentAccount");
        }

        public ActionResult PaymentAttachment()
        {
            return PartialView("PaymentAttachment");
        }


        public void PrintCashBigAmountReport(xbs.PaymentOrder order, string inOut)
        {
            ulong customerNumber;

            if (order.OPPerson != null && order.OPPerson.CustomerNumber != 0)
            {
                customerNumber = order.OPPerson.CustomerNumber;
            }
            else
            {
                customerNumber = XBService.GetAuthorizedCustomerNumber();
            }
            if (!string.IsNullOrEmpty(inOut) && customerNumber != 0)
            {
                CustomerMainDataViewModel customer = new CustomerMainDataViewModel();
                customer.Get(customerNumber);
                Dictionary<string, string> reportParameters = new Dictionary<string, string>();
                reportParameters.Add(key: "date", value: order.OperationDate.Value.ToString("dd/MMM/yyyy"));
                reportParameters.Add(key: "Customer_Info", value: Utility.ConvertUnicodeToAnsi(customer.CustomerDescription) + "ë");
                reportParameters.Add(key: "in", value: (inOut == "in" || inOut == "in_out") ? "1" : "0");
                reportParameters.Add(key: "out", value: (inOut == "out" || inOut == "in_out") ? "1" : "0");

                ReportService.CashBigAmountReport(reportParameters);
            }
        }
        public JsonResult IsBigAmountForPaymentOrder(xbs.PaymentOrder paymentOrder)
        {
            return Json(XBService.IsBigAmountForPaymentOrder(paymentOrder), JsonRequestBehavior.AllowGet);
        }


        public void GetCashInPaymentOrderDetails(xbs.PaymentOrder paymentOrder, bool isCopy = false)
        {

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string cashInFeeAccountNumber = "0";
            double cashInFeeAmount = 0;
            if (paymentOrder.Fees != null && paymentOrder.Fees.Count > 0)
            {

                foreach (var oneFeeItem in paymentOrder.Fees)
                {
                    if (oneFeeItem.Type == 28)
                    {
                        paymentOrder.Type = xbs.OrderType.CashDebit;
                        xbs.Account feeAccount = XBService.GetOperationSystemAccountForFee(paymentOrder, oneFeeItem.Type);
                        cashInFeeAccountNumber = feeAccount.AccountNumber;
                        cashInFeeAmount = oneFeeItem.Amount;
                    }
                }

            }


            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "amount", value: paymentOrder.Amount.ToString());
            parameters.Add(key: "currency", value: paymentOrder.Currency);
            parameters.Add(key: "nom", value: paymentOrder.OrderNumber);
            parameters.Add(key: "lname", value: paymentOrder.OPPerson.PersonName + " " + paymentOrder.OPPerson.PersonLastName);


           

            if (!string.IsNullOrEmpty(paymentOrder.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "False");
            }

            parameters.Add(key: "wd", value: paymentOrder.Description);
            parameters.Add(key: "credit", value: paymentOrder.ReceiverAccount.AccountNumber);
            parameters.Add(key: "reg_Date", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");

            parameters.Add(key: "commissionAmount", value: cashInFeeAmount.ToString());
            parameters.Add(key: "commissionAccount", value: cashInFeeAccountNumber);

            ReportService.GetCashInPaymentOrder(parameters);


        }

        public void GetCashOutPaymentOrderDetails(xbs.PaymentOrder paymentOrder, bool isCopy = false)
        {


            if (paymentOrder.ReceiverAccount != null && paymentOrder.ReceiverAccount.Status == 7)
            {
                paymentOrder.ReceiverAccount = paymentOrder.ReceiverAccount;
            }
            else if (!isCopy)
            {
                xbs.Account creditAccount = XBService.GetOperationSystemAccount(paymentOrder, xbs.OrderAccountType.CreditAccount, paymentOrder.DebitAccount.Currency);
                paymentOrder.ReceiverAccount = creditAccount;
            }
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "nom", value: paymentOrder.OrderNumber);
            parameters.Add(key: "nm", value: paymentOrder.OPPerson.PersonName);
            parameters.Add(key: "lname", value: paymentOrder.OPPerson.PersonLastName);
            parameters.Add(key: "cracc", value: paymentOrder.ReceiverAccount.AccountNumber);
            parameters.Add(key: "dbacc", value: paymentOrder.DebitAccount.AccountNumber);
            parameters.Add(key: "wrd", value: paymentOrder.Description);
            parameters.Add(key: "sum", value: paymentOrder.Amount.ToString());
            parameters.Add(key: "passp", value: paymentOrder.OPPerson.PersonDocument);
            parameters.Add(key: "curr", value: paymentOrder.Currency);

            if (!string.IsNullOrEmpty(paymentOrder.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "Check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "Check", value: "False");
            }

            parameters.Add(key: "kassa", value: paymentOrder.ReceiverAccount.AccountNumber);

            parameters.Add(key: "T_Aneliq", value: "");
            parameters.Add(key: "code", value: "");
            if (paymentOrder.TransferID == 0)
                parameters.Add(key: "flag_for_prix_ord", value: "0");
            else
                parameters.Add(key: "flag_for_prix_ord", value: "10");
            parameters.Add(key: "reg_Date", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "f_cashout", value: isCopy ? "92" : "1");

            ReportService.GetCashOutPaymentOrder(parameters);
        }

        public string GetPaymentOrderDescription(xbs.PaymentOrder paymentOrder)
        {
            return XBService.GetPaymentOrderDescription(paymentOrder);
        }

        public ActionResult OrderDescription()
        {
            return PartialView("OrderDescription");
        }

        public ActionResult AccountsSelectDirective()
        {
            return PartialView("AccountsSelectDirective");
        }

        public ActionResult CurrenciesSelectDirective()
        {
            return PartialView("CurrenciesSelectDirective");
        }

        public JsonResult IsTransferFromBusinessmanToOwnerAccount(string debitAccountNumber, string creditAccountNumber)
        {
            return Json(XBService.IsTransferFromBusinessmanToOwnerAccount(debitAccountNumber, creditAccountNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOperationSystemAccountForFee(xbs.PaymentOrder orderForFee, short feeType)
        {
            xbs.Account account = XBService.GetOperationSystemAccountForFee(orderForFee, feeType);
            return Json(account.AccountNumber, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSpesialPriceMessage(string accountNumber, short additionID)
        {
            return Json(XBService.GetSpesialPriceMessage(accountNumber, additionID), JsonRequestBehavior.AllowGet);
        }


        public void GetCashInByReestrAmounts(xbs.ReestrTransferOrder paymentOrder, bool isCopy = false)
        {

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string amountStr = "";

            foreach (xbs.ReestrTransferAdditionalDetails detail in paymentOrder.ReestrTransferAdditionalDetails)
            {
                amountStr += detail.Amount + "|" + detail.Description + "#";
            }
            amountStr = amountStr.Substring(0, amountStr.Length - 1);
            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "reg_Date", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "nom", value: paymentOrder.OrderNumber);
            parameters.Add(key: "lname", value: paymentOrder.OPPerson.PersonName + " " + paymentOrder.OPPerson.PersonLastName);
            parameters.Add(key: "currency", value: paymentOrder.Currency);
            parameters.Add(key: "credit", value: paymentOrder.ReceiverAccount.AccountNumber);
            if (!string.IsNullOrEmpty(paymentOrder.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "False");
            }
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");
            parameters.Add(key: "amount", value: amountStr);

            ReportService.GetCashInByReestrAmounts(parameters);


        }

        public void GetCashInByReestr(xbs.ReestrTransferOrder paymentOrder, bool isCopy = false)
        {

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string amountStr = "";

            foreach (xbs.ReestrTransferAdditionalDetails detail in paymentOrder.ReestrTransferAdditionalDetails)
            {
                amountStr += detail.Amount + "|" + detail.Description + "#";
            }
            amountStr = amountStr.Substring(0, amountStr.Length - 1);
            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "reg_Date", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "nom", value: paymentOrder.OrderNumber);
            parameters.Add(key: "lname", value: paymentOrder.OPPerson.PersonName + " " + paymentOrder.OPPerson.PersonLastName);
            parameters.Add(key: "currency", value: paymentOrder.Currency);
            parameters.Add(key: "credit", value: paymentOrder.ReceiverAccount.AccountNumber);
            if (!string.IsNullOrEmpty(paymentOrder.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "False");
            }
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");
            parameters.Add(key: "amount", value: amountStr);

            ReportService.GetCashInByReestr(parameters);


        }
        public void GetCashInByReestrNote(xbs.ReestrTransferOrder paymentOrder, bool isCopy = false)
        {

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string amountStr = "";

            foreach (xbs.ReestrTransferAdditionalDetails detail in paymentOrder.ReestrTransferAdditionalDetails)
            {
                amountStr += detail.Amount + "|" + detail.Description + "#";
            }
            amountStr = amountStr.Substring(0, amountStr.Length - 1);
            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "reg_Date", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "nom", value: paymentOrder.OrderNumber);
            parameters.Add(key: "lname", value: paymentOrder.OPPerson.PersonName + " " + paymentOrder.OPPerson.PersonLastName);
            parameters.Add(key: "currency", value: paymentOrder.Currency);
            parameters.Add(key: "credit", value: paymentOrder.ReceiverAccount.AccountNumber);
            if (!string.IsNullOrEmpty(paymentOrder.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "False");
            }
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");
            parameters.Add(key: "amount", value: amountStr);

            ReportService.GetCashInByReestrNote(parameters);


        }
        public ActionResult GetCurNominalForm()
        {
            return PartialView("CurNominalForm");
        }


        public JsonResult ConvertReestrDataToUnicode(List<xbs.ReestrTransferAdditionalDetails> reestrDetails)
        {
            foreach (xbs.ReestrTransferAdditionalDetails reestrDetail in reestrDetails)
            {
                reestrDetail.Description = Utility.ConvertAnsiToUnicode(reestrDetail.Description);
            }

            return Json(reestrDetails, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RuleForFillingExcel()
        {
            return PartialView("RuleForFillingExcel");
        }

        public JsonResult CheckReestrTransferAdditionalDetails(List<xbs.ReestrTransferAdditionalDetails> details)
        {
            if (details != null && details.Count > 0)
            {
                details.ForEach(m =>
                {
                    xbs.Card card = XBService.GetCardWithOutBallance(m.CreditAccount.AccountNumber);
                    if (card?.ClosingDate != null)
                    {
                        m.CardClosed = true;
                        m.WarningDescription = "Քարտը փակ է։";
                    }
                    else
                    {
                        m.CardClosed = false;
                    }
                    ulong customerNumber = XBService.GetAccountCustomerNumber(m.CreditAccount);
                    if (XBService.IsDAHKAvailability(customerNumber))
                    {
                        m.CardHasDAHK = true;
                        m.WarningDescription += " Հաճախորդը ունի ԴԱՀԿ արգելանք։";
                    }
                    else
                    {
                        m.CardHasDAHK = false;
                    }
                });
            }

            return Json(details, JsonRequestBehavior.AllowGet);
        }


        public ActionResult ReasonForOutTransfer()
        {
            return PartialView("ReasonForOutTransfer");
        }

        public JsonResult GetCardWithOutBallance(string accountNumber)
        {
            return Json(XBService.GetCardWithOutBallance(accountNumber), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Ստուգում է՝ արդյոք տվյալ ժամին փոխանցումը ենթակա է շտապ պայմանով կատարման, թե ոչ
        /// </summary>
        /// <returns></returns>
        public bool IsUrgentTime()
        {
            bool flag = false;
            TimeSpan start = new TimeSpan(14, 30, 0); 
            TimeSpan end = new TimeSpan(15, 30, 0); 
            TimeSpan now = DateTime.Now.TimeOfDay;

            if ((now >= start) && (now <= end))
            {
                flag = true;
            }

            return flag;
        }

        /// <summary>
        /// Ստուգում է 6մլն-ից ավելի գործարքների սահմանափակումների առկայությունը
        /// </summary>
        /// <param name="order"></param>
        /// <returns></returns>
        public bool CheckForTransactionLimit(xbs.PaymentOrder order)
        {
            return XBService.CheckForTransactionLimit(order);
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

        //HB
        public JsonResult CheckHBReestrTransferAdditionalDetails(int orderId, List<xbs.ReestrTransferAdditionalDetails> details)
        {
            details = XBService.CheckHBReestrTransferAdditionalDetails(orderId, details);

            for (int i = 0; i < details.Count; i++)
            {
                details[i].WarningDescription = details[i].HBCheckResult;
                if (details[i].HbDAHKCheckResult)
                {
                    details[i].CardHasDAHK = true;
                }
                else
                {
                    if (details[i].HBCheckResult != "OKBankMail" && details[i].HBCheckResult != "OK")
                    {
                        details[i].CardClosed = true;
                    }
                    else
                    {
                        details[i].CardHasDAHK = false;
                        details[i].CardClosed = false;
                    }
                }
            }

            return Json(details, JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult GetTransactionIsChecked(long orderId, List<XBS.ReestrTransferAdditionalDetails> details)
        {
            details = XBService.GetTransactionIsChecked(orderId, details);

            for (int i = 0; i < details.Count; i++)
            {
                details[i].WarningDescription = details[i].HBCheckResult;
                if (details[i].HbDAHKCheckResult)
                {
                    details[i].CardHasDAHK = true;
                }
                else
                {
                    if (details[i].HBCheckResult != "OKBankMail" && details[i].HBCheckResult != "OK")
                    {
                        details[i].CardClosed = true;
                    }
                    else
                    {
                        details[i].CardHasDAHK = false;
                        details[i].CardClosed = false;
                    }
                }
            }

            return Json(details, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// ՀԲ-ի 1 տեսակի փոխանցման ԴԱՀԿ արգելադրման նպատակի պահպանում
        /// </summary>
        public void PostDAHKPaymentType(long orderId, int paymentType)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            int setNumber = user.userID;

            XBService.PostDAHKPaymentType(orderId, paymentType, setNumber);
        }

        public JsonResult GetSintAccounts(string accountNumber)
        {
            return Json(XBService.GetSintAccounts(accountNumber), JsonRequestBehavior.AllowGet);
        }

        public bool IsDebetExportAndImportCreditLine(double debAccountNumber)
        {
            return XBService.IsDebetExportAndImportCreditLine(debAccountNumber);
        }
    }
}