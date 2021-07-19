using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using FrontOffice.Service;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class InterestMarginOrderController : Controller
    {
        // GET: InerestMargin
        [AllowAnonymous]
        public ActionResult InterestMargin()
        {
            return PartialView("InterestMarginChangeOrder");
        }

        public JsonResult GetInterestMarginDetails(xbs.InterestMarginType marginType)
        {
            XBS.InterestMargin margin = new XBS.InterestMargin();
            margin = XBService.GetInterestMarginDetails(marginType);
            return Json(margin, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInterestMarginDetailsByDate(xbs.InterestMarginType marginType, DateTime marginDate)
        {
            XBS.InterestMargin margin = new XBS.InterestMargin();
            margin = XBService.GetInterestMarginDetailsByDate(marginType, marginDate);
            return Json(margin, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveInterestMarginChangeOrder(xbs.InterestMarginOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveInterestMarginOrder(order);
            return Json(result);
        }

        public JsonResult GetInterestMarginOrder(int orderID)
        {
            return Json(XBService.GetInterestMarginOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult InterestMarginOrderDetails()
        {
            return View("InterestMarginOrderDetails");
        }
    }
}