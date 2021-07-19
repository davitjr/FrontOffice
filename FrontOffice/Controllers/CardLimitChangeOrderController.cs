using FrontOffice.Models;
using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;


namespace FrontOffice.Controllers
{
    public class CardLimitChangeOrderController : Controller
    {
        public ActionResult CardLimitChangeOrder()
        {
            return PartialView("CardLimitChangeOrder");
        }

        public ActionResult CardLimitChangeOrderDetails()
        {
            return PartialView("CardLimitChangeOrderDetails");
        }

        public JsonResult GetCardLimitChangeOrderActionTypes()
        {
            Dictionary<string, string> result = InfoService.GetCardLimitChangeOrderActionTypes();
            return Json(result);
        }

        [ActionAccessFilter(actionType = ActionType.CardLimitChangeOrderSave)]
        public JsonResult SaveCardLimitChangeOrder(xbs.CardLimitChangeOrder order)
        {
            xbs.ActionResult result = XBService.SaveCardLimitChangeOrder(order); ;
            return Json(result);
        }

        public JsonResult GetCardLimits(long productId)
        {
            Dictionary<string, string> result = XBService.GetCardLimits(productId);
            return Json(result);
        }

        public JsonResult GetCardLimitChangeOrder(long selectedOrder)
        {
            return Json(XBService.GetCardLimitChangeOrder(selectedOrder), JsonRequestBehavior.AllowGet);
        }
    }
}