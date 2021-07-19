using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class AccountDataChangeOrderController : Controller
    {

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.RequestForAccountDataChangeOrderSave)]
        public ActionResult SaveAccountDataChangeOrder(xbs.AccountDataChangeOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveAccountDataChangeOrder(order);
            return Json(result);
        }
                
        public ActionResult AccountDataChangeOrderDetails()
        {
            return PartialView("AccountDataChangeOrderDetails");
        }

        public JsonResult GetAccountDataChangeOrder(long orderId)
        {
            return Json(XBService.GetAccountDataChangeOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetAccountAdditionsTypes()
        {
            return Json(XBService.GetAccountAdditionsTypes(), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult AccountDataChangeOrder()
        {
            return PartialView("AccountDataChangeOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.AccountAdditionalDataRemovableOrderSave)]
        public ActionResult SaveAccountAdditionalDataRemovableOrder(xbs.AccountAdditionalDataRemovableOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveAccountAdditionalDataRemovableOrder(order);
            return Json(result);
        }
    }
}