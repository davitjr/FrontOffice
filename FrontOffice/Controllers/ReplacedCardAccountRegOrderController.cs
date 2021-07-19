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
    public class ReplacedCardAccountRegOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult ReplacedCardAccountRegOrder()
        {
            return PartialView("ReplacedCardAccountRegOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult ReplacedCardAccountRegOrderDetails()
        {
            return PartialView("ReplacedCardAccountRegOrderDetails");
        }

        public ActionResult SaveReplacedCardAccountRegOrder(xbs.ReplacedCardAccountRegOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveReplacedCardAccountRegOrder(order);
            return Json(result);
        }

        public JsonResult GetReplacedCardAccountRegOrder(long orderId)
        {
            return Json(XBService.GetReplacedCardAccountRegOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCard(ulong productId)
        {
            return Json(XBService.GetCard(productId), JsonRequestBehavior.AllowGet);
        }
    }
}