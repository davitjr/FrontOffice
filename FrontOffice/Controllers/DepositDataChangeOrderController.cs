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
    public class DepositDataChangeOrderController : Controller
    {

        public ActionResult PersonalDepositDataChangeOrder()
        {
            return PartialView("PersonalDepositDataChangeOrder");
        }

        public ActionResult PersonalDepositDataChangeOrderDetails()
        {
            return PartialView("PersonalDepositDataChangeOrderDetails");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.DepositDataChangeOrderSave)]
        public ActionResult SaveDepositDataChangeOrder(xbs.DepositDataChangeOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveDepositDataChangeOrder(order);
            return Json(result);
        }

        public JsonResult GetDepositDataChangeOrder(long orderId)
        {
            return Json(XBService.GetDepositDataChangeOrder(orderId), JsonRequestBehavior.AllowGet);
        }

    }
}