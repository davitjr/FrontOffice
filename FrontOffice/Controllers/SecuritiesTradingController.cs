using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    public class SecuritiesTradingController : Controller
    {
        public ActionResult Index()
        {
            return View("SecuritiesTrading");
        }

        public ActionResult SecuritiesTrading()
        {
            return View("SecuritiesTrading");
        }

        public ActionResult SecuritiesTradingOrderDetails()
        {
            return View("SecuritiesTradingOrderDetails");
        }

        public ActionResult RejectSecuritiesTradingOrderCancellationOrderView()
        {
            return View("RejectSecuritiesTradingOrderCancellationOrder");
        }

        public ActionResult RejectSecuritiesTradingOrderView()
        {
            return View("RejectSecuritiesTradingOrder");
        }


        public ActionResult GetSentSecuritiesTradingOrders(FrontOffice.XBS.SecuritiesTradingFilter filter)
        {

            if (filter.StartDate == default(DateTime))
                filter.StartDate = DateTime.Now;

            if (filter.EndDate == default(DateTime))
                filter.EndDate = DateTime.Now;

            return Json(XBService.GetSentSecuritiesTradingOrders(filter), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSecuritiesTradingLenght()
        {
            return Json(XBService.GetSecuritiesTradingLenght(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetSentSecuritiesTradingOrder(FrontOffice.XBS.OrderType type, long orderId)
        {
            switch (type)
            {
                case XBS.OrderType.SecuritiesBuyOrder:
                case XBS.OrderType.SecuritiesSellOrder:
                    return Json(XBService.GetSecuritiesTradingOrderById(orderId), JsonRequestBehavior.AllowGet);
                    break;
                case XBS.OrderType.SecuritiesTradingOrderCancellationOrder:
                    return Json(XBService.GetSecuritiesTradingOrderCancellationOrder(orderId), JsonRequestBehavior.AllowGet);
                    break;
                default:
                    return Json(new object(), JsonRequestBehavior.AllowGet);
                break;
            }
        }

        public ActionResult ConfirmSecuritiesTradingOrderCancellationOrder(FrontOffice.XBS.SecuritiesTradingOrderCancellationOrder order)
        {
            return Json(XBService.ConfirmSecuritiesTradingOrderCancellationOrder(order), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ConfirmSecuritiesTradingOrder(FrontOffice.XBS.SecuritiesTradingOrder order)
        {
            return Json(XBService.ConfirmSecuritiesTradingOrder(order), JsonRequestBehavior.AllowGet);
        }

        public ActionResult RejectSecuritiesTradingOrderCancellationOrder(FrontOffice.XBS.SecuritiesTradingOrderCancellationOrder order)
        {
            return Json(XBService.RejectSecuritiesTradingOrderCancellationOrder(order), JsonRequestBehavior.AllowGet);
        }

        public ActionResult RejectSecuritiesTradingOrder(FrontOffice.XBS.SecuritiesTradingOrder order)
        {
            return Json(XBService.RejectSecuritiesTradingOrder(order), JsonRequestBehavior.AllowGet);
        }

        public void UpdateSecuritiesTradingOrderDeposited(ulong docId) => XBService.UpdateSecuritiesTradingOrderDeposited(docId);

        public async Task<JsonResult>  GetStockMarketTickers()
        {
            Dictionary<string, string> response = new Dictionary<string, string>();
            Newtonsoft.Json.Linq.JArray data =  await AMXService.GetListedInstrumentsAsync();
            foreach (var item in data)
            {
                response.Add(item["ticker"].ToString(), item["ticker"].ToString());
            }
            response = response.OrderBy(x => x.Key).ToDictionary(x => x.Key, x => x.Value);
            return Json(response, JsonRequestBehavior.AllowGet);
        }

    }
}