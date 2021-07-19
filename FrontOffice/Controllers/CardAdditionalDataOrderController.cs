using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    public class CardAdditionalDataOrderController : Controller
    {
        public ActionResult CardAdditionalDataOrder()
        {
            return PartialView("CardAdditionalDataOrder");
        }

        public ActionResult CardAdditionalDataList()
        {
            return PartialView("CardAdditionalDataList");
        }

        public ActionResult CardAdditionalDataOrderDetails()
        {
            return PartialView("CardAdditionalDataOrderDetails");
        }

        public JsonResult GetCardAdditionalDataOrderDetails(long orderID)
        {
            return Json(XBService.GetCardAdditionalDataOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerPlasticCardsForAdditionalData(bool IsClosed)
        {
            return Json(XBService.GetCustomerPlasticCardsForAdditionalData(IsClosed), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardAdditionalDatas(string cardnumber, string expirydate)
        {
            return Json(XBService.GetCardAdditionalDatas(cardnumber, expirydate), JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveCardAdditionalDataOrder(XBS.CardAdditionalDataOrder order)
        {
            XBS.ActionResult result = XBService.SaveCardAdditionalDataOrder(order);
            return Json(result);
        }
    }
}