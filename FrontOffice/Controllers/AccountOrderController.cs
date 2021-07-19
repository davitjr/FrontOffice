using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;


namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class AccountOrderController : Controller
    {
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveAccountOrder(xbs.AccountOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            List<ulong> listAllCustomers = new List<ulong>();
            listAllCustomers.Add(customerNumber);

            if (order.JointCustomers != null)
            {
                listAllCustomers.AddRange(order.JointCustomers.Select(x => x.key).ToList());
            }

            bool hasBankrupt = false;

            foreach (var item in listAllCustomers)
            {
                hasBankrupt = ACBAOperationService.HasCustomerBankruptBlockage(item);
                if (hasBankrupt)
                    break;
            }

            if (hasBankrupt && order.RestrictionGroup !=1)
            {

                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                error.Description = "Հաճախորդը սնանկ է";
                result.Errors = new List<xbs.ActionError>();
                result.Errors.Add(error);
                result.ResultCode =  xbs.ResultCode.ValidationError;
                return Json(result);
            }

            result = XBService.SaveAccountOrder(order);


            if (result?.ResultCode != xbs.ResultCode.ValidationError && result?.ResultCode != xbs.ResultCode.Failed)
            {
                Utility.RefreshUserAccessForCustomer();
            }

            return Json(result);
        }

        public ActionResult PersonalAccountOrder()
        {
            return PartialView("PersonalAccountOrder");
        }

        public JsonResult GetAccountOrder(long orderId)
        {
            return Json(XBService.GetAccountOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PersonalAccountOrderDetails()
        {
            return PartialView("PersonalAccountOrderDetails");
        }

        public ActionResult PersonalAccountReOpenOrder()
        {
            return PartialView("PersonalAccountReOpenOrder");
        }

        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.CurrentAccountReopenOrderSave)]
        public ActionResult SaveAccountReOpenOrder(xbs.AccountReOpenOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveAccountReOpenOrder(order);
            return Json(result);
        }

        public ActionResult PersonalAccountReOpenOrderDetails()
        {
            return PartialView("PersonalAccountReOpenOrderDetails");
        }

        public JsonResult GetAccountReOpenOrder(long orderId)
        {
            return Json(XBService.GetAccountReOpenOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountOpenWarnings()
        {
            return Json(XBService.GetAccountOpenWarnings(), JsonRequestBehavior.AllowGet);
        }

        public void PrintAccountReOpenApplication(string accountNumber)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid + "_User"]).filialCode.ToString();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "armNumber", value: "(" + accountNumber.ToString() + ")");
            parameters.Add(key: "filialCode", value: filialCode.ToString());

            ContractService.GetAccountReOpenApplication(parameters);
        }

        public void GetAccountReOpenOrderDetails(xbs.AccountReOpenOrder order, bool isCopy = false)
        {
           
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
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
            parameters.Add(key: "credit", value: "0"); // paymentOrder.ReceiverAccount.AccountNumber.ToString()
            parameters.Add(key: "reg_Date", value: order.OperationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");

            ReportService.GetCashInPaymentOrder(parameters);


        }

        public JsonResult GetOperationSystemAccountForFee(xbs.AccountReOpenOrder orderForFee, short feeType)
        {
            xbs.Account account = XBService.GetOperationSystemAccountForFee(orderForFee, feeType);
            return Json(account.AccountNumber, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetAccountReopenFee(short customerType)
        {
            double feeAmount = XBService.GetAccountReopenFee(customerType);
            return Json(feeAmount, JsonRequestBehavior.AllowGet);

        }


    }
}