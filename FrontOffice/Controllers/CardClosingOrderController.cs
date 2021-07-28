using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using FrontOffice.Service;
using FrontOffice.Models;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CardClosingOrderController : Controller
    {

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.CardClosingOrderSave)]
        public ActionResult SaveCardClosingOrder(xbs.CardClosingOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveCardClosingOrder(order);
            return Json(result);

        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult PersonalCardClosingOrder()
        {
            return PartialView("PersonalCardClosingOrder");
        }

        public JsonResult GetCardClosingOrder(long orderId)
        {
            return Json(XBService.GetCardClosingOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CardClosingOrderDetails()
        {
            return PartialView("CardClosingOrderDetails");
        }

        public JsonResult GetCardClosingWarnings(ulong productId)
        {
            return Json(XBService.GetCardClosingWarnings(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardClosingApplication(string cardNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "cardNumber", value: cardNumber);
            return Json(parameters, JsonRequestBehavior.AllowGet);
        }
    }
}



