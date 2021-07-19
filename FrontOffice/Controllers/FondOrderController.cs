using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class FondOrderController : Controller
    {
        public ActionResult FondOrder()
        {
            return PartialView("FondOrder");

        }

        public ActionResult FondChangeOrder()
        {
            return PartialView("FondChangeOrder");

        }
        public ActionResult FondOrderDetails()
        {
            return View("FondOrderDetails");
        }
        public JsonResult GetFondOrder(int orderID)
        {
            return Json(XBService.GetFondOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveFondOrder(xbs.FondOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveFondOrder(order);
            return Json(result);

        }

        public ActionResult SaveFondChangeOrder(xbs.FondOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveFondOrder(order);
            return Json(result);

        }
    }
}