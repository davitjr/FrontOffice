using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class FTPRateOrderController : Controller
    {
        // GET: Fond
        [AllowAnonymous]
        public ActionResult FTPRates()
        {
            return PartialView("FTPRateChangeOrder");
        }

        public JsonResult GetFTPRateDetails(xbs.FTPRateType rateType)
        {

            XBS.FTPRate rate = new XBS.FTPRate();
            rate = XBService.GetFTPRateDetails(rateType);
            return Json(rate, JsonRequestBehavior.AllowGet);

        }

        public ActionResult SaveFTPRateChangeOrder(xbs.FTPRateOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveFTPRateOrder(order);
            return Json(result);

        }

        public JsonResult GetFTPRateOrder(int orderID)
        {
            return Json(XBService.GetFTPRateOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult FTPRateOrderDetails()
        {
            return View("FTPRateOrderDetails");
        }
    }
}