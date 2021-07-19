using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class PlasticCardSMSServiceOrderController : Controller
    {
        public ActionResult PlasticCardSMSServiceOrder()
        {
            return PartialView("PlasticCardSMSServiceOrder");
        }
        public ActionResult PlasticCardSMSServiceOrderDetails()
        {
            return PartialView("PlasticCardSMSServiceOrderDetails");
        }
        public ActionResult PlasticCardSMSServiceHistory()
        {
            return PartialView("PlasticCardSMSServiceHistory");
        }

        public ActionResult SaveAndApprovePlasticCardSMSServiceOrder(xbs.PlasticCardSMSServiceOrder order)
        {
            xbs.ActionResult result = XBService.SaveAndApprovePlasticCardSMSServiceOrder(order);
            return Json(result);
        }


        public JsonResult GetPlasticCardSMSServiceHistory(ulong cardNumber)
        {
            return Json(XBService.GetPlasticCardSMSServiceHistory(cardNumber), JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetPlasticCardSMSServiceOrder(long orderId)
        {
            return Json(XBService.GetPlasticCardSMSServiceOrder(orderId), JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetPlasticCardSmsServiceActions(string cardNumber)
        {
            return Json(XBService.GetPlasticCardSmsServiceActions(cardNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllTypesOfPlasticCardsSMS()
        {
            return Json(XBService.GetAllTypesOfPlasticCardsSMS(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCardMobilePhone(ulong customerNumber, ulong cardNumber)
        {
            return Json(XBService.GetCardMobilePhones(customerNumber, cardNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCurrentPhone(ulong cardNumber)
        {
            return Json(XBService.GetCurrentPhone(cardNumber), JsonRequestBehavior.AllowGet);
        }
        public JsonResult SMSTypeAndValue(string cardNumber)
        {
            return Json(XBService.SMSTypeAndValue(cardNumber), JsonRequestBehavior.AllowGet);                                  
        }

    }
    
}