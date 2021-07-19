using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using XBS = FrontOffice.XBS;
using FrontOffice.Models;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class ChangeBranchOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.CardPositiveInterestRepaymentOrderSave)]
        public ActionResult SaveChangeBranchOrder(XBS.ChangeBranchOrder order)
        {
            XBS.ActionResult result = new XBS.ActionResult();
            result = XBService.SaveChangeBranchOrder(order);
            return Json(result);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult ChangeBranchOrder()
        {
            return PartialView("PersonalChangeBranchOrder");
        }

        public JsonResult GetChangeBranchOrder(long orderID)
        {
            return Json(XBService.GetChangeBranchOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getCurrentBranch(long cardNumber)
        {
            return Json(XBService.GetFilialCode(cardNumber), JsonRequestBehavior.AllowGet);
        }


        public ActionResult ChangeBranchOrderDetails()
        {
            return PartialView("ChangeBranchOrderDetails");
        }
    }
}