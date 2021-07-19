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
    public class CardAccountRemovalOrderController : Controller
    {
        // GET: CardAccountRemovalOrder
        public ActionResult CardAccountRemovalOrder()
        {
            return PartialView("CardAccountRemovalOrder");
        }

        public ActionResult SaveCardAccountRemovalOrder(xbs.CardAccountRemovalOrder cardAccountRemovalOrder)
        {
            cardAccountRemovalOrder.RegistrationDate = DateTime.Now;
            xbs.ActionResult result = XBService.SaveCardAccountRemovalOrder(cardAccountRemovalOrder);
            return Json(result);
        }

        public ActionResult CardAccountRemovalOrderDetails()
        {
            return PartialView("CardAccountRemovalOrderDetails");
        }


        public JsonResult GetCardAccountRemovalOrder(long orderID)
        {
            xbs.CardAccountRemovalOrder plasticCardRemovalOrder = new xbs.CardAccountRemovalOrder();
            plasticCardRemovalOrder = XBService.GetCardAccountRemovalOrder(orderID);
            plasticCardRemovalOrder.Card.CreditLine = null;
            plasticCardRemovalOrder.Card.Overdraft = null;
            return Json(plasticCardRemovalOrder, JsonRequestBehavior.AllowGet);
        }
    }
}