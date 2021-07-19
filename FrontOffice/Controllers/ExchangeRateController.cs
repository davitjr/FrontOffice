using System;
using System.Web.Mvc;
using FrontOffice.Service;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{

    [SessionState(SessionStateBehavior.ReadOnly)]
    [SessionExpireFilter]
    public class ExchangeRateController : Controller
    {
        // GET: ExchangeRate
        public ActionResult ExchangeRates()
        {
            return PartialView("ExchangeRates");
        }

        public ActionResult ExchangeRatesHistory()
        {
            return PartialView("ExchangeRatesHistory");
        }
        public ActionResult CrossExchangeRatesHistory()
        {
            return PartialView("CrossExchangeRatesHistory");
        }

        public JsonResult GetExchangeRates()
        {
            return Json(XBService.GetExchangeRates(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetExchangeRatesHistory(int filialCode, string currency, DateTime startDate)
        {
            return Json(XBService.GetExchangeRatesHistory(filialCode, currency, startDate), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCrossExchangeRatesHistory( DateTime startDate)
        {
            return Json(XBService.GetCrossExchangeRatesHistory(startDate), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCBExchangeRatesHistory(string currency, DateTime startDate)
        {
            return Json(XBService.GetCBExchangeRatesHistory(currency, startDate), JsonRequestBehavior.AllowGet);
        }
    }
}