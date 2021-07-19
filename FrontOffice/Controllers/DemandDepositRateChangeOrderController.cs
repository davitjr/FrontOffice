using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using XBSInfo = FrontOffice.XBSInfo;
using FrontOffice.Service;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class DemandDepositRateChangeOrderController : Controller
    {

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        //[ActionAccessFilter(actionType = ActionType.DemandDepositRateChangeOrderSave)]
        public ActionResult SaveDemandDepositRateChangeOrder(xbs.DemandDepositRateChangeOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveDemandDepositRateChangeOrder(order);
            return Json(result);
        }

        public JsonResult GetDemandDepositRateChangeOrder(int orderID)
        {
            return Json(XBService.GetDemandDepositRateChangeOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PersonalDemandDepositRateChangeOrder()
        {
            return PartialView("PersonalDemandDepositRateChangeOrder");
        }

        public ActionResult DemandDepositRateChangeOrderDetails()
        {
            return PartialView("DemandDepositRateChangeOrderDetails");
        }

        public JsonResult GetDemandDepositRateTariffDocument()
        {
            return Json(InfoService.GetDemandDepositRateTariffDocument(), JsonRequestBehavior.AllowGet);
        }

    }
}