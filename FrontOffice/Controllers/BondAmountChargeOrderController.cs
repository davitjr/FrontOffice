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
    public class BondAmountChargeOrderController : Controller
    {
        public ActionResult BondAmountChargeOrder()
        {
            return PartialView("BondAmountChargeOrder");
        }
        
        public ActionResult BondAmountChargeOrderDetails()
        {
            return PartialView("BondAmountChargeOrderDetails");
        }

        [ActionAccessFilter(actionType = ActionType.BondAmountChargeOrderSave)]
        public ActionResult SaveBondAmountChargeOrder(xbs.BondAmountChargeOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveBondAmountChargeOrder(order);
            return Json(result);
        }
        
        public JsonResult GetBondAmountChargeOrder(int orderID)
        {
            return Json(XBService.GetBondAmountChargeOrder(orderID), JsonRequestBehavior.AllowGet);
        }

    }
}