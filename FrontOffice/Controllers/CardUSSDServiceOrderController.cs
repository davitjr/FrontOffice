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
    public class CardUSSDServiceOrderController : Controller
    {

        // GET: CardStatusChangeOrder
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        
        public ActionResult SaveAndApproveCardUSSDServiceOrder(xbs.CardUSSDServiceOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveAndApproveCardUSSDServiceOrder(order);
            return Json(result);

        }

        public ActionResult CardUSSDServiceOrder()
        {
            return PartialView("CardUSSDServiceOrder");
        }

        public ActionResult CardCardUSSDServiceOrderDetails()
        {
            return PartialView("CardUSSDServiceOrderDetails");
        }

        public ActionResult CardUSSDServiceHistory()
        {
            return PartialView("CardUSSDServiceHistory");
        }
        public string GetCardMobilePhone(ulong productID)
        {
            return XBService.GetCardMobilePhone(productID);
        }

        public JsonResult GetCardUSSDServiceOrder(int orderID)
        {

            return Json(XBService.GetCardUSSDServiceOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetCardUSSDServiceHistory(ulong productId)
        {
            List<xbs.CardUSSDServiceHistory> history = XBService.GetCardUSSDServiceHistory(productId);
            return Json(history);
        }


    }
}
