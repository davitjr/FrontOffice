using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using Newtonsoft.Json;
using System.Threading.Tasks;
using FrontOffice.ACBAServiceReference;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class BondOrderController : Controller
    {

        public ActionResult BondOrder()
        {
            return PartialView("BondOrder");

        }

        [ActionAccessFilter(actionType = ActionType.BondOrderSave)]
        public ActionResult SaveBondOrder(xbs.BondOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveBondOrder(order);
            return Json(result);

        }


        public ActionResult BondOrderDetails()
        {
            return View("BondOrderDetails");
        }

        public JsonResult GetBondOrder(int orderID)
        {
            return Json(XBService.GetBondOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> CheckAndGetDepositaryAccount(SearchForSecuritiesTypes searchForSecuritiesType = SearchForSecuritiesTypes.GetOnlyOne)
        {
            return Json(await DepositaryService.CheckAndGetDepositaryAccount(searchForSecuritiesType), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountsForCouponRepayment()
        {
            List<xbs.Account> accounts = new List<xbs.Account>();

            accounts = XBService.GetAccountsForCouponRepayment();

            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountsForBondRepayment(string currency)
        {
            List<xbs.Account> accounts = new List<xbs.Account>();

            accounts = XBService.GetAccountsForBondRepayment(currency);

            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public JsonResult PrintBondCustomerCard(string accountNumber, string accountNumberForBond)
        {
            Dictionary<string, string> obj = new Dictionary<string, string>();
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string guid = Utility.GetSessionId();

            parameters.Add(key: "customer_number", value: customerNumber.ToString());
            parameters.Add(key: "accountNumberForBond", value: accountNumberForBond);
            parameters.Add(key: "accountNumber", value: accountNumber.ToString());
            parameters.Add(key: "identityId", value: customer.IdentityID.ToString());

            if (customer.CustomerType == 6)
            {
                parameters.Add(key: "isIndividual", value: "1");
            }
            else
            {
                parameters.Add(key: "isIndividual", value: "0");
            }

            obj.Add("result", JsonConvert.SerializeObject(parameters));
            obj.Add("customerType", JsonConvert.SerializeObject(customer.CustomerType));

            return Json(obj, JsonRequestBehavior.AllowGet);
        }



        public void GetBondContract(string accountNumberForCoupon, string accountNumberForBond, DateTime contractDate)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "date", value: contractDate.ToString("dd/MMM/yy"));
            parameters.Add(key: "accountNumberForCoupon", value: accountNumberForCoupon);
            parameters.Add(key: "accountNumberForBond", value: accountNumberForBond);
            parameters.Add(key: "getBondAccountCurrency", value: "False");

            ContractService.BondContract(parameters);
        }

        public ActionResult StockOrder()
        {
            return PartialView("StockOrder");
        }

        public JsonResult GetBondOrderIssueSeria(int bondIssueId)
        {
            return Json(XBService.GetBondOrderIssueSeria(bondIssueId), JsonRequestBehavior.AllowGet);
        }

        public void GetStockPurchaseApplication(int bondId, ulong customerNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            parameters.Add(key: "BondId", value: bondId.ToString());
            parameters.Add(key: "RegistrationAddress", value: customer.RegistrationAddress);
            parameters.Add(key: "Residence", value: DepositaryService.GetCustomerTypeAndResidence(customerNumber).isResident == true? "Ռեզիդենտ" : "Ոչ ռեզիդենտ");
            parameters.Add(key: "Fullname", value: Utility.ConvertAnsiToUnicode(customer.FirstNameNonUnicode + " " + customer.LastNameNonUnicode));

            if (customer.CustomerType == 6)
            {
                parameters.Add(key: "ContractInvestorFullname", value: customer.FirstName + " " + customer.LastName);
                parameters.Add(key: "ResidenceAddress", value: customer.Address);
                parameters.Add(key: "PassportInfo", value: customer.DocumentNumber + ", " + customer.DocumentGivenBy + ", " + customer.DocumentGivenDate);
                ContractService.StockAcquisitionApplicationForPhysicals(parameters);
            }
            else
            {
                List<CustomerDocument> docs = ACBAOperationService.GetCustomerDocuments(customerNumber, 1);
                foreach(CustomerDocument doc in docs)
                {
                    if(doc.documentType.key == 108)
                    {
                        parameters.Add(key: "StateRegisterInfo", value: doc.documentNumber + ", " + doc.givenDate.Value.ToString("dd/MM/yyyy"));
                    }
                }
                parameters.Add(key: "ContractInvestorDecription", value: customer.OrganisationName);
                parameters.Add(key: "TaxpayerIdentificationNumber", value: customer.TaxCode);
                ContractService.StockAcquisitionApplicationForLegals(parameters);
            }
        }

        public async Task<JsonResult> CheckAndSaveDepositoryAccount(xbs.BondOrder bondOrder)
        {
            xbs.ActionResult result = new xbs.ActionResult() { ResultCode = xbs.ResultCode.Normal, Errors = new List<xbs.ActionError>() };
            DepositoryAccountSaveModel depositoryAccountSaveModel = new DepositoryAccountSaveModel
            {
                order = DepositaryService.SetDepositoryAccountOrder(bondOrder),
                fromBondOrder = true
            };

            result = await DepositaryService.SaveDepositaryAccountOrderWithAccountCheck(depositoryAccountSaveModel);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountsForStock()
        {
            List<xbs.Account> accounts = new List<xbs.Account>();

            accounts = XBService.GetAccountsForStock();

            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBuyKursForDate(string currency)
        {
            return Json(XBService.GetBuyKursForDate(currency), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetConvertationDetails(xbs.CurrencyExchangeOrder order)
        {
            ulong customerNumber = 0;
            int code = -1;
            string currency = "";
            byte operationType = 0;
            string doc = string.Empty;

            if (order.DebitAccount.Currency != "AMD")
            {
                currency = order.DebitAccount.Currency;
            }

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

            order.CustomerNumber = customerNumber;
            order.Description = "Արտարժույթի գնում, " + currency + " (" + customerNumber.ToString() + ")";

            CustomerViewModel customer = new CustomerViewModel();
            CustomerViewModel customerDirector = new CustomerViewModel();
            customer.Get(customerNumber);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];


            string customerName = "";
            if (!String.IsNullOrEmpty(customer.OrganisationName))
            {
                customerDirector.Get(customer.OrganisationDirector.Key);
                doc = customerDirector.DocumentNumber + ", " + customerDirector.DocumentGivenBy + ", " + customerDirector.DocumentGivenDate;
                customerName = customer.OrganisationName + " " + customerDirector.FirstName + " " + customerDirector.LastName;
            }
            else
            {
                doc = customer.DocumentNumber + ", " + customer.DocumentGivenBy + ", " + customer.DocumentGivenDate;
                customerName = customer.FirstName + " " + customer.LastName;
                    //order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            }

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "Customer_Info", value: customerName);
            parameters.Add(key: "Customer_address", value: !String.IsNullOrEmpty(customer.OrganisationName) ? ( customerDirector.Address != null ? customerDirector.Address : "") : customer.Address);
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
            parameters.Add(key: "cust_pass", value: doc);
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

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPaymentOrderDetails(xbs.PaymentOrder paymentOrder, bool isCopy = false)
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
               customerName = customer.FirstName + " " + customer.LastName;
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

            if (customer.CustomerType != 6)
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


            return Json(parameters, JsonRequestBehavior.AllowGet);

        }



    }
}