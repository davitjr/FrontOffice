using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class PlasticCardRemovalOrderController : Controller
    {
        // GET: PlasticCardRemovalOrder
        public ActionResult PlasticCardRemovalOrder()
        {
            return View("PlasticCardRemovalOrder");
        }

        public ActionResult SavePlasticCardRemovalOrder(xbs.PlasticCardRemovalOrder plasticCardRemovalOrder)
        {
            xbs.ActionResult result = XBService.SavePlasticCardRemovalOrder(plasticCardRemovalOrder);
            return Json(result);
        }

        public JsonResult GetPlasticCardRemovalOrder(long orderID)
        {
            xbs.PlasticCardRemovalOrder plasticCardRemovalOrder = new xbs.PlasticCardRemovalOrder();
            plasticCardRemovalOrder = XBService.GetPlasticCardRemovalOrder(orderID);
            plasticCardRemovalOrder.Card.CreditLine = null;
            plasticCardRemovalOrder.Card.Overdraft = null;
            return Json(plasticCardRemovalOrder, JsonRequestBehavior.AllowGet);
        }

        public ActionResult PlasticCardRemovalOrderDetails()
        {
            return View("PlasticCardRemovalOrderDetails");
        }

        public JsonResult GetCardRemovalReasons()
        {
            return Json(InfoService.GetCardRemovalReasons(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerPlasticCards()
        {
            return Json(XBService.GetCustomerPlasticCards());
        }

        public JsonResult CheckPlasticCardRemovalOrder(xbs.PlasticCardRemovalOrder order)
        {
            return Json(XBService.CheckPlasticCardRemovalOrder(order), JsonRequestBehavior.AllowGet);
        }
    }
}