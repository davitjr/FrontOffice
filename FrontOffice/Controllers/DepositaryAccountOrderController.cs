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

    public class DepositaryAccountOrderController : Controller
    {
        public ActionResult DepositaryAccountOrder()
        {
            return PartialView("DepositaryAccountOrder");
        }

        [ActionAccessFilter(actionType = ActionType.DepositaryAccountOrderSave)]
        public ActionResult SaveDepositaryAccountOrder(xbs.DepositaryAccountOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveDepositaryAccountOrder(order);
            return Json(result);

        }

        public JsonResult GetDepositaryAccountOrder(int id)
        {
            return Json(XBService.GetDepositaryAccountOrder(id), JsonRequestBehavior.AllowGet);
        }

        public ActionResult DepositaryAccountOrderDetails()
        {
            return PartialView("DepositaryAccountOrderDetails");
        }

    }
}