using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class Card3DSecureServiceOrderController : Controller
    {
        public ActionResult PersonalCard3DSecureServiceOrder()
        {
            return PartialView("PersonalCard3DSecureServiceOrder");
        }
        public ActionResult Card3DSecureServiceDetails()
        {
            return PartialView("Card3DSecureServiceDetails");
        }

        public ActionResult SaveCard3DSecureServiceOrder(xbs.Card3DSecureServiceOrder order)
        {
            xbs.ActionResult result = XBService.SaveCard3DSecureServiceOrder(order);
            return Json(result);
        }
        public ActionResult GetCard3DSecureServiceHistory(ulong productId)                 
        {
            List< xbs.Card3DSecureService > history = XBService.GetCard3DSecureServiceHistory(productId);
            return Json(history);
        }
    }
}