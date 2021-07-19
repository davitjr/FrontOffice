using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using   xbMng = FrontOffice.XBManagement;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{

    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class HBActivationOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.HBServiceAtivationOrderSave)]
        public ActionResult SaveHBActivationOrder(xbMng.HBActivationOrder order)
        {

            order.Quality = xbMng.OrderQuality.Draft;
            xbMng.ActionResult result = new xbMng.ActionResult();
            result = XBManagementService.SaveHBActivationOrder(order);

            return Json(result);
        }

        public JsonResult GetHBRequests()
        {
            return Json(XBManagementService.GetHBRequests(), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBActivationOrder()
        {
            return PartialView("HBActivationOrder");
        }


        public JsonResult GetHBActivationOrder(long orderId)
        {
            return Json(XBManagementService.GetHBActivationOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBActivationOrderDetails()
        {
            return PartialView("HBActivationOrderDetails");
        }

        public void PrintOrder(xbMng.HBActivationOrder order)
        {

            xbMng.Account debitAccount = XBManagementService.GetOperationSystemAccount(order, FrontOffice.XBManagement.OrderAccountType.DebitAccount, order.Currency);
            order.DebitAccount = debitAccount;

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid +"_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            DateTime operationDate = XBService.GetCurrentOperDay();

            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "DebetAccount", value: order.DebitAccount.AccountNumber);
            parameters.Add(key: "CreditAccount", value: "0");
            parameters.Add(key: "AmountPaid", value: "1");
            parameters.Add(key: "OrderNum", value: order.OrderNumber);
            parameters.Add(key: "AmountCurrency", value: "AMD");
            parameters.Add(key: "PaymentDate", value: operationDate.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "PrixRasx", value: "7");
            parameters.Add(key: "Wording", value: order.Description);
            parameters.Add(key: "Quantity", value: "1");
            parameters.Add(key: "TransactionNumber", value: "0");
            parameters.Add(key: "RePrint", value: "0");
            //îáÏ»ÝÇ ïñ³Ù³¹ñáõÙ, Ø³ñÛ³Ù Øá³¹»É, 100000180013, ïáÏ»ÝÇ Ñ³Ù³ñÁ `9638274654654654
            ReportService.GetPrixRasxOperations(parameters);
        }
        
        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBActivationRejectionPendingRequests()
        {
            return PartialView("HBActivationRejectionPendingRequests");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBActivationRejectionOrder()
        {
            return PartialView("HBActivationRejectionOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult SaveHBActivationRejectionOrder(xbMng.HBActivationRejectionOrder order)
        {
            order.Quality = xbMng.OrderQuality.Draft;
            xbMng.ActionResult result = new xbMng.ActionResult();
            result = XBManagementService.SaveHBActivationRejectionOrder(order);
            return Json(result);
        }

        public JsonResult GetPhoneBankingRequests()
        {
            return Json(XBManagementService.GetPhoneBankingRequests(), JsonRequestBehavior.AllowGet);
        }
    }
}