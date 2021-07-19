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
   
    public class CardReOpenOrderController : Controller
    {
       
        public ActionResult CardReOpenOrder()
        {
            return PartialView("CardReOpenOrder");
        }

     
        public ActionResult CardReOpenOrderDetails()
        {
            return PartialView("CardReOpenOrderDetails");
        }

      
        public ActionResult SaveCardReOpenOrder(xbs.CardReOpenOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveCardReOpenOrder(order);

            if (result?.ResultCode != xbs.ResultCode.ValidationError && result?.ResultCode != xbs.ResultCode.Failed)
            {
                Utility.RefreshUserAccessForCustomer();
            }

            return Json(result);
        }

        public JsonResult GetCardReOpenOrder(long orderId)
        {
            return Json(XBService.GetCardReOpenOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardReOpenReason()
        {
            return Json(XBService.GetCardReOpenReason(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult IsCardOpen(string cardNumber)
        {
            return Json(XBService.IsCardOpen(cardNumber), JsonRequestBehavior.AllowGet);
        }



    }
}