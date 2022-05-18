using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;


namespace FrontOffice.Controllers
{
    public class CardNotRenewOrderController : Controller
    {
        public ActionResult CardNotRenewOrder()
        {
            return PartialView("CardNotRenewOrder");
        }

        public ActionResult CardNotRenewOrderDetails()
        {
            return PartialView("CardNotRenewOrderDetails");
        }
        public ActionResult SaveCardNotRenewOrder(xbs.CardNotRenewOrder cardNotRenewOrder)
        {
            cardNotRenewOrder.RegistrationDate = DateTime.Now;
            xbs.ActionResult result = XBService.SaveCardNotRenewOrder(cardNotRenewOrder);
            return Json(result);
        }
        public JsonResult GetCardNotRenewOrder(long orderId)
        {
            return Json(XBService.GetCardNotRenewOrder(orderId), JsonRequestBehavior.AllowGet);
        }
    }
}