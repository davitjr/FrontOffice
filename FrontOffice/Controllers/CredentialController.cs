using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CredentialController : Controller
    {
        // GET: Credential        
        public ActionResult Credentials()
        {
            return PartialView("Credentials");
        }

        // GET: /Credentials/
        public JsonResult GetCredentials(int filter)
        {
            return Json(XBService.GetCredentials((xbs.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }

        // GET: /Accounts for Credential/
        public JsonResult GetAccountsForCredential(int operationType)
        {
            List<XBS.AssigneeOperationAccount> listAccount = new List<XBS.AssigneeOperationAccount>();
            List<xbs.Account> accountList = XBService.GetAccountsForCredential(operationType);            
            foreach(xbs.Account account in accountList)
            {
                xbs.AssigneeOperationAccount oneAccount = new xbs.AssigneeOperationAccount();
                oneAccount.Account = account;
                oneAccount.Checked = false;
                oneAccount.OperationType = operationType;
                listAccount.Add(oneAccount);
            }
            return Json(listAccount, JsonRequestBehavior.AllowGet);
        }

        public void PrintCustomerCredentialApplication(ulong assigneeCustomerNumber, ulong assignId)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid +"_User"]).filialCode.ToString();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "assigneeCustomerNumber", value: assigneeCustomerNumber.ToString());
            parameters.Add(key: "assignID", value: assignId.ToString());
            parameters.Add(key: "bankCode", value: filialCode.ToString());
            parameters.Add(key: "HbDocID", value: GetCredentialDocId(assignId).ToString());

            ContractService.CustomerCredentialApplication(parameters);
        }

        public ActionResult CredentialTerminationOrder()
        {
            return PartialView("CredentialTerminationOrder");
        }

        public ActionResult CredentialDetails()
        {
            return PartialView("CredentialDetails");
        }

        [TransactionPermissionFilter]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveCredentialActivationOrder(XBS.CredentialActivationOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            order.Quality = xbs.OrderQuality.Draft;
            order.RegistrationDate = DateTime.Now.Date;
            result = XBService.SaveCredentialActivationOrder(order);
            return Json(result);
        }

        public JsonResult GetCredentialActivationOrder(long orderId)
        {
            return Json(XBService.GetCredentialActivationOrder(orderId), JsonRequestBehavior.AllowGet);
        }


        public void GetFeeForCredentialActivationOrderDetails(xbs.CredentialActivationOrder paymentOrder, bool isCopy = false)
        {
            ulong customerNumber = 0;
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            xbs.FeeForServiceProvidedOrder order = new xbs.FeeForServiceProvidedOrder();
            order.Currency = paymentOrder.DebitAccount.Currency;
            order.Quality = paymentOrder.Quality;
            order.ServiceType = 215;
            order.DebitAccount = paymentOrder.DebitAccount;
            order.Type = xbs.OrderType.CashFeeForServiceProvided;
            string orderDescription = "";
            customerNumber= XBService.GetAuthorizedCustomerNumber();
            orderDescription = "Լիազորագր-ի համար" + " (" +customerNumber.ToString()+ ")";
            paymentOrder.Description=orderDescription;
            Dictionary <string, string> parameters = new Dictionary<string, string>();
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

            if (paymentOrder.ReceiverAccount == null)
                paymentOrder.ReceiverAccount = XBService.GetFeeForServiceProvidedOrderCreditAccount(order);

            parameters.Add(key: "wd", value: paymentOrder.Description);
            parameters.Add(key: "credit", value: paymentOrder.ReceiverAccount.AccountNumber.ToString()); // paymentOrder.ReceiverAccount.AccountNumber.ToString()
            parameters.Add(key: "reg_Date", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");

            ReportService.GetCashInPaymentOrder(parameters);


        }



        public int GetCredentialDocId(ulong credentialId)
        {
            return XBService.GetCredentialDocId(credentialId);
        }

        
    }
}