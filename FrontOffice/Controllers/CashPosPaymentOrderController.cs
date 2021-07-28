using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CashPosPaymentOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult CashPosPaymentOrder()
        {
            return PartialView("CashPosPaymentOrder");
        }
        public ActionResult CashPosPaymentOrderDetails()
        {
            return PartialView("CashPosPaymentOrderDetails");
        }
        public JsonResult GetFee(xbs.CashPosPaymentOrder cashPosPaymentOrder, int feeType)
        {
            
            return Json(XBService.GetCashPosPaymentOrderFee(cashPosPaymentOrder, feeType), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveCashPosPaymentOrder(xbs.CashPosPaymentOrder order)
        {
            order.Type = xbs.OrderType.CashPosPayment;
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveCashPosPaymentOrder(order);

            return Json(result);
        }

        public JsonResult GetCashPosPaymentOrder(long orderID)
        {

            xbs.CashPosPaymentOrder order = new xbs.CashPosPaymentOrder();
            order = XBService.GetCashPosPaymentOrder(orderID);
            return Json(order, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCashPosPaymentOrderDetails(xbs.CashPosPaymentOrder cashPosPaymentOrder, bool isCopy = false)
        {
           

            if (!isCopy)
            {
                xbs.Account creditAccount = XBService.GetOperationSystemAccount(cashPosPaymentOrder, xbs.OrderAccountType.CreditAccount, cashPosPaymentOrder.Currency);
                cashPosPaymentOrder.CreditAccount = creditAccount;
                xbs.Account debitAccount = XBService.GetOperationSystemAccount(cashPosPaymentOrder, xbs.OrderAccountType.DebitAccount, cashPosPaymentOrder.Currency);
                cashPosPaymentOrder.PosAccount = debitAccount;
            }

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)System.Web.HttpContext.Current.Session[guid +"_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "nom", value: cashPosPaymentOrder.OrderNumber);
            parameters.Add(key: "nm", value: cashPosPaymentOrder.OPPerson.PersonName);
            parameters.Add(key: "lname", value: cashPosPaymentOrder.OPPerson.PersonLastName);
            parameters.Add(key: "cracc", value: cashPosPaymentOrder.CreditAccount.AccountNumber);
            parameters.Add(key: "dbacc", value: cashPosPaymentOrder.PosAccount.AccountNumber);
            parameters.Add(key: "wrd", value: cashPosPaymentOrder.Description);
            parameters.Add(key: "sum", value: cashPosPaymentOrder.Amount.ToString());
            parameters.Add(key: "passp", value: cashPosPaymentOrder.OPPerson.PersonDocument);
            parameters.Add(key: "curr", value: cashPosPaymentOrder.Currency);

            if (!string.IsNullOrEmpty(cashPosPaymentOrder.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: cashPosPaymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "Check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: cashPosPaymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "Check", value: "False");
            }

            parameters.Add(key: "kassa", value: cashPosPaymentOrder.CreditAccount.AccountNumber);

            parameters.Add(key: "T_Aneliq", value: "");
            parameters.Add(key: "code", value: "");
            parameters.Add(key: "flag_for_prix_ord", value: "0");
            parameters.Add(key: "reg_Date", value: cashPosPaymentOrder.OperationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "f_cashout", value: isCopy ? "92" : "1");

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult IsOurCard(string cardNumber)
        {
            return Json(XBService.IsOurCard(cardNumber), JsonRequestBehavior.AllowGet);
            
        }

        public JsonResult GetOperationSystemAccountForFee(xbs.CashPosPaymentOrder orderForFee,short feeType)
        {
            xbs.Account account = XBService.GetOperationSystemAccountForFee(orderForFee,feeType);
            return Json(account.AccountNumber, JsonRequestBehavior.AllowGet);

        }
    }
}