using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    public class SecuritiesMarketTradingOrderController : Controller
    {
        // GET: SecuritiesMarketTradingOrder
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult SecuritiesMarketTradingOrder()
        {
            return View("SecuritiesMarketTradingOrder");
        }

        public ActionResult SecuritiesMarketTradingOrderDetailsList()
        {
            return View("SecuritiesMarketTradingOrderDetailsList");
        }
        
        public ActionResult SaveAndApproveSecuritiesMarketTradingOrder(XBS.SecuritiesMarketTradingOrder order)
        {
            return Json(XBService.SaveAndApproveSecuritiesMarketTradingOrder(order), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetSecuritiesMarketTradingOrder(long orderId)
        {
            return Json(XBService.GetSecuritiesMarketTradingOrder(orderId), JsonRequestBehavior.AllowGet);
        }
        
    }
}