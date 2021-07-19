using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class PensionApplicationOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SavePensionApplicationOrder(xbs.PensionApplicationOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SavePensionApplicationOrder(order);

            return Json(result);

        }


        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SavePensionApplicationTerminationOrder(xbs.PensionApplicationTerminationOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SavePensionApplicationTerminationOrder(order);

            return Json(result);

        }

        public ActionResult PensionApplicationOrder()
        {
            return PartialView("PensionApplicationOrder");
        }

        public ActionResult PensionApplicationTerminationOrder()
        {
            return PartialView("PensionApplicationTerminationOrder");
        }


        public ActionResult PensionApplicationOrderDetails()
        {
            return PartialView("PensionApplicationOrderDetails");
        }

        public ActionResult PensionApplicationTerminationOrderDetails()
        {
            return PartialView("PensionApplicationTerminationOrderDetails");
        }


        public JsonResult GetPensionApplicationTerminationOrder(long orderID)
        {
            xbs.PensionApplicationTerminationOrder order = new xbs.PensionApplicationTerminationOrder();
            order = XBService.GetPensionApplicationTerminationOrder(orderID);
            return Json(order, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPensionApplicationOrder(long orderID)
        {
            xbs.PensionApplicationOrder order = new xbs.PensionApplicationOrder();
            order = XBService.GetPensionApplicationOrder(orderID);
            return Json(order, JsonRequestBehavior.AllowGet);
        }
    }
}