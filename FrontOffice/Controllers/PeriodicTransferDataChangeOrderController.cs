using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class PeriodicTransferDataChangeOrderController : Controller
    {
        public JsonResult SavePeriodicTransferDataChangeOrder(XBS.PeriodicTransferDataChangeOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            return Json(XBService.SavePeriodicDataChangeOrder(order));
        }
        public ActionResult PeriodicTransferDataChangeOrder()
        {
            return PartialView("PeriodicTransferDataChangeOrder");
        }
        public JsonResult GetPeriodicDataChangeOrder(int orderId)
        {
            return Json(XBService.GetPeriodicDataChangeOrder(orderId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PeriodicTransferDataChangeOrderDetails()
        {
            return PartialView("PeriodicTransferDataChangeOrderDetails");
        }
    }
}

