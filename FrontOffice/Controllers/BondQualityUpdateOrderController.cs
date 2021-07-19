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
    public class BondQualityUpdateOrderController : Controller
    {
        public ActionResult BondQualityUpdateOrder()
        {
            return PartialView("BondQualityUpdateOrder");
        }


        public ActionResult BondQualityUpdateOrderDetails()
        {
            return PartialView("BondQualityUpdateOrderDetails");
        }

        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveBondQualityUpdateOrder(xbs.BondQualityUpdateOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveBondQualityUpdateOrder(order);
            return Json(result);

        }


        public JsonResult GetBondQualityUpdateOrder(int orderID)
        {
            return Json(XBService.GetBondQualityUpdateOrder(orderID), JsonRequestBehavior.AllowGet);
        }

    }
}