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
    public class CardStatusChangeOrderController : Controller
    {
        // GET: CardStatusChangeOrder
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.CardStatusChangeOrderSave)]
        public ActionResult SaveCardStatusChangeOrder(xbs.CardStatusChangeOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveCardStatusChangeOrder(order);
            return Json(result);

        }
        public JsonResult GetCardStatusChangeOrder(int orderID)
        {

            return Json(XBService.GetCardStatusChangeOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PersonalCardStatusChangeOrder()
        {
            return PartialView("PersonalCardStatusChangeOrder");
        }
        public ActionResult PersonalCardStatusChangeOrderDetails()
        {
            return PartialView("PersonalCardStatusChangeOrderDetails");
        }
    }
}