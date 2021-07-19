using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;



namespace FrontOffice.Controllers
{
    public class PINRegenerationOrderController : Controller
    {
        public ActionResult PINRegenerationOrder()
        {
            return PartialView("PINRegenerationOrder");
        }

        public ActionResult PINRegenerationOrderDetails()
        {
            return PartialView("PINRegenerationOrderDetails");
        }

        public JsonResult GetCard(ulong productId)
        {
            return Json(XBService.GetCard(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult SavePINRegenerationOrder(xbs.PINRegenerationOrder pinRegenerationOrder)
        {
            pinRegenerationOrder.RegistrationDate = DateTime.Now;
            xbs.ActionResult result = XBService.SavePINRegenerationOrder(pinRegenerationOrder);
            return Json(result);
        }

        public JsonResult GetPINRegenerationOrder(long orderId)
        {
            return Json(XBService.GetPINRegenerationOrder(orderId), JsonRequestBehavior.AllowGet);
        }
    }
}