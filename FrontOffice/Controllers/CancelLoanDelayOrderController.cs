using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class CancelLoanDelayOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveCancelLoanDelayOrder(xbs.CancelDelayOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveCancelLoanDelayOrder(order);
            return Json(result);
        }
        public JsonResult GetCancelLoanDelayOrder(int orderID)
        {
            return Json(XBService.GetCancelLoanDelayOrder(orderID), JsonRequestBehavior.AllowGet);
        }
        public ActionResult CancelLoanDelayOrder()
        {
            return PartialView("CancelLoanDelayOrder");
        }
        public ActionResult CancelLoanDelayOrderDetails()
        {
            return PartialView("CancelLoanDelayOrderDetails");
        }
    }
}