using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using acba = FrontOffice.ACBAServiceReference;
using FrontOffice.Models;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class AccountFreezeController : Controller
    {

        public JsonResult GetAccountFreezeHistory(string accountNumber, ushort freezeStatus, ushort reasonId)
        {
            return Json(XBService.GetAccountFreezeHistory(accountNumber, freezeStatus, reasonId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountFreezeDetails(string freezeId)
        {
            return Json(XBService.GetAccountFreezeDetails(freezeId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AccountFreezeHistory()
        {
            return PartialView("AccountFreezeHistory");
        }

        public ActionResult AccountFreezeDetails()
        {
            return PartialView("AccountFreezeDetails");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult AccountFreezeOrder()
        {
            return PartialView("AccountFreezeOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.RequestForAccountFreezeOrderSave)]
        public ActionResult SaveAccountFreezeOrder(xbs.AccountFreezeOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveAccountFreezeOrder(order);
            return Json(result);
        }

    
        public JsonResult GetAccountFreezeOrder(long orderId)
        {
            return Json(XBService.GetAccountFreezeOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AccountFreezeOrderDetails()
        {
            return PartialView("AccountFreezeOrderDetails");
        }


        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult AccountUnfreezeOrder()
        {
            return PartialView("AccountUnfreezeOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.RequestForAccountUnfreezeOrderSave)]
        public ActionResult SaveAccountUnfreezeOrder(xbs.AccountUnfreezeOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveAccountUnFreezeOrder(order);
            return Json(result);
        }


        public JsonResult GetAccountUnfreezeOrder(long orderId)
        {
            return Json(XBService.GetAccountUnfreezeOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AccountUnfreezeOrderDetails()
        {
            return PartialView("AccountUnfreezeOrderDetails");
        }

    }
}