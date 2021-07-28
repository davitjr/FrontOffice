using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using FrontOffice.Models;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [SessionExpireFilter]
    public class TransitPaymentOrderController : Controller
    {
        public JsonResult GetTransitPaymentOrder(int orderId)
        {
            return Json(XBService.GetTransitPaymentOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult PersonalTransitPaymentOrder()
        {
            return PartialView("PersonalTransitPaymentOrder");
        }
        public ActionResult TransitPaymentOrderDetails()
        {
            return PartialView("TransitPaymentOrderDetails");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.TransferToTransitAccountOrderSave)]
        public ActionResult SaveTransitPaymentOrder(xbs.TransitPaymentOrder order)
        {
            xbs.ActionResult result = XBService.SaveTransitPaymentOrder(order);

            if (result.ResultCode == xbs.ResultCode.Normal)
                return Json(result);

            return Json(result);//must return error view
        }

        public JsonResult GetCashInPaymentOrderDetails(xbs.TransitPaymentOrder order, bool isCopy = false)
        {
          
            order.Type = xbs.OrderType.TransitPaymentOrder;

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)System.Web.HttpContext.Current.Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();


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

            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "amount", value: order.Amount.ToString());
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "nom", value: order.OrderNumber);
            parameters.Add(key: "lname", value: order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName);


            if (!string.IsNullOrEmpty(order.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: order.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: order.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "False");
            }

            parameters.Add(key: "wd", value: order.Description);

            xbs.Account receiverAccount = new xbs.Account();
            if (isCopy && order.TransitAccountType == xbs.TransitAccountTypes.ForMatureByCreditCode)
            {
                receiverAccount = order.TransitAccount;
            }
            else
            {
                receiverAccount = XBService.GetOperationSystemAccount(order, xbs.OrderAccountType.CreditAccount, order.Currency, 0, "", 0, order.CustomerType);
            }
            parameters.Add(key: "credit", value: receiverAccount.AccountNumber);
            parameters.Add(key: "reg_Date", value: order.OperationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");

            parameters.Add(key: "commissionAmount", value: cashInFeeAmount.ToString());
            parameters.Add(key: "commissionAccount", value: cashInFeeAccountNumber);

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCashInPaymentOrderDetailsForRATransfer(xbs.PaymentOrder order, xbs.TransitPaymentOrder transitPaymentOrder, bool isCopy = false)
        {
           
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            parameters.Add(key: "cust_name", value: transitPaymentOrder.OPPerson != null ? transitPaymentOrder.OPPerson.PersonLastName + " " + transitPaymentOrder.OPPerson.PersonName : " ");
            parameters.Add(key: "reg_date", value: order.OperationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "document_number", value: order.OrderNumber);

            xbs.Account debitAccountForRAtransfer = XBService.GetOperationSystemAccount(order, xbs.OrderAccountType.DebitAccount, order.Currency);

            transitPaymentOrder.Type = xbs.OrderType.TransitPaymentOrder;
            xbs.Account debitAccountForTransitOrder = new xbs.Account();

            if (transitPaymentOrder.DebitAccount != null && transitPaymentOrder.DebitAccount.Status == 7)

                debitAccountForTransitOrder = transitPaymentOrder.DebitAccount;
            else
                debitAccountForTransitOrder = XBService.GetOperationSystemAccount(transitPaymentOrder, xbs.OrderAccountType.DebitAccount, order.Currency);


            parameters.Add(key: "deb_acc", value: debitAccountForRAtransfer.AccountNumber.Substring(5));
            parameters.Add(key: "tax_code", value: "0");

            string creditAccount = "0";

            if (order.ReceiverAccount != null)
            {
                if (order.ReceiverAccount.AccountNumber.Length >= 5)
                {
                    creditAccount = order.ReceiverAccount.AccountNumber.Substring(5);
                }
            }

            parameters.Add(key: "cred_acc", value: creditAccount);
            parameters.Add(key: "deb_bank", value: debitAccountForRAtransfer.AccountNumber.Substring(0, 5));
            parameters.Add(key: "soc_card", value: !string.IsNullOrEmpty(order.OPPerson.PersonSocialNumber) ? order.OPPerson.PersonSocialNumber : "");
            string creditBankCode = "0";
            if (order.ReceiverAccount != null)
            {
                if (order.ReceiverAccount.AccountNumber.Length >= 5)
                {
                    creditBankCode = order.ReceiverAccount.AccountNumber.Substring(0, 5);
                }
                else
                {
                    creditBankCode = order.ReceiverAccount.AccountNumber;
                }
            }
            string description = order.Description != "" ? order.Description : " ";
            if (!String.IsNullOrEmpty(order.CreditCode))
            {
                description += ", " + order.CreditCode + ", " + order.Borrower + ", " + order.MatureTypeDescription;

            }
            parameters.Add(key: "credit_bank", value: creditBankCode);
            parameters.Add(key: "amount", value: order.Amount > 0.01 ? order.Amount.ToString() : "0");
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "descr", value: description);
            parameters.Add(key: "reciever", value: !String.IsNullOrEmpty(order.Receiver) ? order.Receiver : " ");
            parameters.Add(key: "police_code", value: "0");
            parameters.Add(key: "print_soc_card", value: string.IsNullOrEmpty(order.OPPerson.PersonSocialNumber) ? "False" : "True");
            parameters.Add(key: "reg_code", value: "");
            parameters.Add(key: "is_copy", value: isCopy ? "True" : "False");
            parameters.Add(key: "reciever_tax_code", value: "");
            parameters.Add(key: "transfer_receipt_number", value: transitPaymentOrder.OrderNumber);
            parameters.Add(key: "transfer_receipt_cred_acc", value: debitAccountForRAtransfer.AccountNumber);
            parameters.Add(key: "transfer_receipt_deb_acc", value: debitAccountForTransitOrder.AccountNumber);
            parameters.Add(key: "transfer_receipt_acc", value: creditBankCode + creditAccount);

            parameters.Add(key: "last_name", value: transitPaymentOrder.OPPerson != null ? transitPaymentOrder.OPPerson.PersonLastName + " " + transitPaymentOrder.OPPerson.PersonName : " ");
            parameters.Add(key: "bank_code", value: debitAccountForTransitOrder.AccountNumber.Substring(0, 5));

            double price = 0;
            if (order.Fees != null && order.Fees.Count > 0)
            {
                foreach (xbs.OrderFee fee in order.Fees)
                {
                    price += fee.Amount;
                }
            }
            if (order.Fees!=null)
            {
                if (order.Fees.Exists(m => m.Type == 7 || m.Type == 5))
                {
                    double transferFee = order.Fees.Find(m => m.Type == 20 || m.Type == 5).Amount;
                    parameters.Add(key: "commission", value: transferFee.ToString());
                }
            }
            parameters.Add(key: "set_number", value: user.userID.ToString());
            parameters.Add(key: "TransactionTime", value: order.RegistrationTime != null ? order.RegistrationTime  : DateTime.Now.ToString("HH:mm"));
            parameters.Add(key: "price", value: price.ToString());
            parameters.Add(key: "total_amount", value: transitPaymentOrder.Amount.ToString());
            parameters.Add(key: "deb_cred_currency", value: transitPaymentOrder.Currency);
            parameters.Add(key: "wd", value: transitPaymentOrder.Description);

            //parameters.Add(key: "police_code", value: order.PoliceResponseDetailsId.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCashInPaymentOrderDetailsForBudgetTransfer(xbs.BudgetPaymentOrder order, xbs.TransitPaymentOrder transitPaymentOrder, bool isCopy = false)
        {
            ulong customerNumber = 0;

            string socCard = "";
            string customerName = "";
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);


            SessionProperties sessionProperties = (SessionProperties)Session[guid + "_SessionProperties"];

            if (sessionProperties.IsNonCustomerService == true)
            {
                if (order.OPPerson != null) customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
                socCard = order.OPPerson != null ? order.OPPerson.PersonSocialNumber : "";
            }
            else if (String.IsNullOrEmpty(customer.OrganisationName))
            {
                customerName = customer.FirstName + " " + customer.LastName;
                socCard = customer.SocCardNumber;
            }
            else
            {
                customerName = customer.OrganisationName;
                socCard = order.OPPerson != null ? order.OPPerson.PersonSocialNumber : "";
            }

            string description = order.Description;
            if (order.CreditorDescription != null)
            {
                description += ", " + order.CreditorDescription;
                parameters.Add(key: "debtor_Name", value: order.CreditorDescription);
            }
            if (order.CreditorDocumentNumber != null)
                if (order.CreditorDocumentType == 1)
                {
                    description += ", ՀԾՀ " + order.CreditorDocumentNumber;
                    parameters.Add(key: "debtor_soccard", value: order.CreditorDocumentNumber);

                }
                else if (order.CreditorDocumentType == 2)
                {
                    description += ", Պարտատիրոջ ՀԾՀ չստանալու մասին տեղեկանքի համար " + order.CreditorDocumentNumber;
                    parameters.Add(key: "debtor_soccard", value: order.CreditorDocumentNumber);
                }
                else if (order.CreditorDocumentType == 3)
                    description += ", Անձնագիր " + order.CreditorDocumentNumber;
                else if (order.CreditorDocumentType == 4)
                {
                    description += ", ՀՎՀՀ " + order.CreditorDocumentNumber;
                    parameters.Add(key: "debtor_code_of_tax", value: order.CreditorDocumentNumber);
                }
            if (order.CreditorDeathDocument != null)
                description += ", Մահվան վկայական " + order.CreditorDeathDocument;


            if (!String.IsNullOrEmpty(order.ViolationID))
                description += ", որոշում " + order.ViolationID;
            if (order.ViolationDate.HasValue)
                description += " " + order.ViolationDate.Value.ToString("dd/MM/yy");

            parameters.Add(key: "cust_name", value: customerName);
            parameters.Add(key: "reg_date", value: order.OperationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "document_number", value: order.OrderNumber);

            xbs.Account debitAccountForRAtransfer = XBService.GetOperationSystemAccount(order, xbs.OrderAccountType.DebitAccount, order.Currency);

            transitPaymentOrder.Type = xbs.OrderType.TransitPaymentOrder;

            xbs.Account debitAccountForTransitOrder = new xbs.Account();

            if (transitPaymentOrder.DebitAccount != null && transitPaymentOrder.DebitAccount.Status == 7)

                debitAccountForTransitOrder = transitPaymentOrder.DebitAccount;
            else
                debitAccountForTransitOrder = XBService.GetOperationSystemAccount(transitPaymentOrder, xbs.OrderAccountType.DebitAccount, order.Currency);

            parameters.Add(key: "deb_acc", value: debitAccountForRAtransfer.AccountNumber.Substring(5));
            parameters.Add(key: "tax_code", value: !string.IsNullOrEmpty(customer.TaxCode) ? customer.TaxCode : "");

            parameters.Add(key: "cred_acc", value: order.ReceiverAccount != null ? order.ReceiverAccount.AccountNumber + (order.PoliceCode != 0 ? order.PoliceCode.ToString() : "") : "");
            parameters.Add(key: "deb_bank", value: debitAccountForRAtransfer.AccountNumber.Substring(0, 5));
            parameters.Add(key: "soc_card", value: socCard);
            parameters.Add(key: "credit_bank", value: "10300");
            parameters.Add(key: "amount", value: order.Amount > 0.01 ? order.Amount.ToString() : "0");
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "descr", value: description);
            parameters.Add(key: "reciever", value: !String.IsNullOrEmpty(order.Receiver) ? order.Receiver : " ");
            parameters.Add(key: "police_code", value: order.PoliceResponseDetailsId.ToString());
            parameters.Add(key: "print_soc_card", value: string.IsNullOrEmpty(socCard) ? "False" : "True");
            parameters.Add(key: "reg_code", value: order.LTACode != 0 ? order.LTACode.ToString() : "");
            parameters.Add(key: "is_copy", value: isCopy ? "True" : "False");
            parameters.Add(key: "reciever_tax_code", value: "");
            parameters.Add(key: "transfer_receipt_number", value: transitPaymentOrder.OrderNumber);
            parameters.Add(key: "transfer_receipt_cred_acc", value: debitAccountForRAtransfer.AccountNumber);
            parameters.Add(key: "transfer_receipt_deb_acc", value: debitAccountForTransitOrder.AccountNumber);
            parameters.Add(key: "transfer_receipt_acc", value: order.ReceiverAccount != null ? order.ReceiverAccount.AccountNumber + (order.PoliceCode != 0 ? order.PoliceCode.ToString() : "") : "");

            parameters.Add(key: "last_name", value: transitPaymentOrder.OPPerson != null ? transitPaymentOrder.OPPerson.PersonLastName + " " + transitPaymentOrder.OPPerson.PersonName : " ");
            parameters.Add(key: "bank_code", value: debitAccountForTransitOrder.AccountNumber.Substring(0, 5));

            double price = 0;
            if (order.Fees != null && order.Fees.Count > 0)
            {
                foreach (xbs.OrderFee fee in order.Fees)
                {
                    price += fee.Amount;
                }
            }

            parameters.Add(key: "price", value: price.ToString());
            parameters.Add(key: "total_amount", value: transitPaymentOrder.Amount.ToString());
            parameters.Add(key: "deb_cred_currency", value: transitPaymentOrder.Currency);
            parameters.Add(key: "wd", value: transitPaymentOrder.Description);
            if (order.Fees != null)
            {
                if (order.Fees.Exists(m => m.Type == 20 || m.Type == 5))
                {
                    double transferFee = order.Fees.Find(m => m.Type == 20 || m.Type == 5).Amount;
                    parameters.Add(key: "commission", value: transferFee.ToString());
                }
            }
            parameters.Add(key: "set_number", value: user.userID.ToString());
            parameters.Add(key: "TransactionTime", value: order.RegistrationTime != null ? order.RegistrationTime : DateTime.Now.ToString("HH:mm"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFee(xbs.TransitPaymentOrder transitPaymentOrder, int feeType)
        {

            return Json(XBService.GetTransitPaymentOrderFee(transitPaymentOrder, feeType), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOperationSystemAccountForFee(xbs.TransitPaymentOrder orderForFee, short feeType)
        {
            xbs.Account account = XBService.GetOperationSystemAccountForFee(orderForFee, feeType);
            return Json(account.AccountNumber, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetCashInPaymentOrderDetailsForMatureOrder(xbs.TransitPaymentOrder order, xbs.MatureOrder matureOrder, bool isCopy = false)
        {
           
            order.Type = xbs.OrderType.TransitPaymentOrder;

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)System.Web.HttpContext.Current.Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();

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

            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "amount", value: order.Amount.ToString());
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "nom", value: order.OrderNumber);
            parameters.Add(key: "lname", value: order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName);

            if (!string.IsNullOrEmpty(order.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: order.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: order.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "False");
            }

            parameters.Add(key: "wd", value: order.Description);

            ushort accountType = 0;
            if ((order.Currency == "AMD" && matureOrder.ProductCurrency == "AMD") || (order.Currency != "AMD" && matureOrder.ProductCurrency != "AMD"))
            {
                accountType = 224;
            }
            else if (order.Currency == "AMD" && matureOrder.ProductCurrency != "AMD")
            {
                accountType = 279;
            }

            xbs.Account receiverAccount = XBService.GetProductAccount(matureOrder.ProductId, 18, accountType);
            parameters.Add(key: "credit", value: receiverAccount.AccountNumber.ToString());
            parameters.Add(key: "reg_Date", value: order.OperationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");

            parameters.Add(key: "commissionAmount", value: cashInFeeAmount.ToString());
            parameters.Add(key: "commissionAccount", value: cashInFeeAccountNumber);

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPaymentOrderDetails(xbs.TransitPaymentOrder order, xbs.MatureOrder matureOrder, bool isCopy = false)
        {
            ulong customerNumber = 0;

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);
           
            ushort accountType = 0;
            if ((order.Currency == "AMD" && matureOrder.ProductCurrency == "AMD") || (order.Currency != "AMD" && matureOrder.ProductCurrency != "AMD"))
            {
                accountType = 224;
            }
            else if (order.Currency == "AMD" && matureOrder.ProductCurrency != "AMD")
            {
                accountType = 279;
            }

            xbs.Account receiverAccount = XBService.GetProductAccount(matureOrder.ProductId, 18, accountType);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "reg_date", value: order.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "document_number", value: order.OrderNumber);

            CustomerMainDataViewModel receiverCustomer = new CustomerMainDataViewModel();
            ulong receiverCustomerNmber = XBService.GetAccountCustomerNumber(receiverAccount);
            if (receiverCustomerNmber != 0)
                receiverCustomer.Get(receiverCustomerNmber);

            string customerName = "";
            string guid = Utility.GetSessionId();
            SessionProperties sessionProperties = (SessionProperties)Session[guid + "_SessionProperties"];

            if (String.IsNullOrEmpty(customer.OrganisationName))
            {
                customerName = XBService.GetAccountDescription(order.DebitAccount.AccountNumber);
            }
            else
            {
                customerName = customer.OrganisationName;
            }


  
            
            parameters.Add(key: "deb_acc", value: order.DebitAccount.AccountNumber.Substring(5));
            parameters.Add(key: "deb_bank", value: order.DebitAccount.AccountNumber.Substring(0, 5));


            parameters.Add(key: "tax_code", value: customer.TaxCode);
            parameters.Add(key: "cred_acc", value: receiverAccount.AccountNumber.Substring(5));

            parameters.Add(key: "quality", value: "1");
            parameters.Add(key: "soc_card", value: customer.SocCardNumber);
            parameters.Add(key: "credit_bank", value: receiverAccount.AccountNumber.Substring(0, 5));
            parameters.Add(key: "amount", value: order.Amount.ToString());
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "descr", value: order.Description);
            parameters.Add(key: "reciever", value: receiverAccount.AccountDescription);
            parameters.Add(key: "confirm_date", value: null);
            parameters.Add(key: "police_code", value: "0");
            parameters.Add(key: "for_HB", value: "0");
            parameters.Add(key: "print_soc_card", value: "True");
            parameters.Add(key: "reg_code", value: null);
            parameters.Add(key: "doc_id", value: null);
            parameters.Add(key: "cust_name", value: customerName);
            parameters.Add(key: "is_copy", value: isCopy ? "True" : "False");
            parameters.Add(key: "reciever_tax_code", value: receiverCustomer.CustomerType == 6 ? receiverCustomer.SocialNumber : receiverCustomer.TaxCode);

            return Json(parameters, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetPaymentOrderDetailsForBond(xbs.TransitPaymentOrder order, xbs.BondAmountChargeOrder bondOrder, bool isCopy = false)
        {
            xbs.Account receiverAccount = XBService.GetOperationSystemAccount(order, xbs.OrderAccountType.CreditAccount, order.Currency);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "reg_date", value: order.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "document_number", value: order.OrderNumber);


            parameters.Add(key: "deb_acc", value: order.DebitAccount.AccountNumber.Substring(5));
            parameters.Add(key: "deb_bank", value: order.DebitAccount.AccountNumber.Substring(0, 5));


            parameters.Add(key: "tax_code", value: "0");
            parameters.Add(key: "cred_acc", value: receiverAccount.AccountNumber.Substring(5));

            parameters.Add(key: "soc_card", value: !string.IsNullOrEmpty(order.OPPerson.PersonSocialNumber) ? order.OPPerson.PersonSocialNumber : "");
            parameters.Add(key: "credit_bank", value: receiverAccount.AccountNumber.Substring(0, 5));
            parameters.Add(key: "amount", value: order.Amount.ToString());
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "descr", value: order.Description);
            parameters.Add(key: "reciever", value: receiverAccount.AccountDescription);
            parameters.Add(key: "confirm_date", value: null);
            parameters.Add(key: "police_code", value: "0");
            parameters.Add(key: "for_HB", value: "0");
            parameters.Add(key: "print_soc_card", value: "True");
            parameters.Add(key: "reg_code", value: null);
            parameters.Add(key: "doc_id", value: null);
            parameters.Add(key: "cust_name", value: order.OPPerson != null ? order.OPPerson.PersonLastName + " " + order.OPPerson.PersonName : " ");
            parameters.Add(key: "is_copy", value: isCopy ? "True" : "False");
            parameters.Add(key: "reciever_tax_code", value:  "");



            return Json(parameters, JsonRequestBehavior.AllowGet);

        }


    }
}