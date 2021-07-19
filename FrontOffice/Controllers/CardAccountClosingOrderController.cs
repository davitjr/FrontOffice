using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    public class CardAccountClosingOrderController : Controller
    {
        // GET: CardAccountClosingOrder
        public ActionResult CardAccountClosingOrder()
        {
            return View();
        }

        public ActionResult saveCardAccountClosingOrder(XBS.CardAccountClosingOrder order)
        {
            XBS.ActionResult result = XBService.SaveCardAccountClosingOrder(order);
            return Json(result);
        }

        public ActionResult CardAccountClosingOrderDetails()
        {
            return PartialView("CardAccountClosingOrderDetails");
        }

        public JsonResult GetCardAccountClosingOrder(long orderID)
        {
            return Json(XBService.GetCardAccountClosingOrder(orderID), JsonRequestBehavior.AllowGet);
        }
        public void GetCardAccountClosingApplication(ulong productID)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "app_id", value: productID.ToString());
            ReportService.GetCardAccountClosingApplication(parameters);
        }
    }
}