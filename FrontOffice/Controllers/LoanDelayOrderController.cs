using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{

    public class LoanDelayOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveLoanDelayOrder(xbs.LoanDelayOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveLoanDelayOrder(order);
            return Json(result);
        }
        public JsonResult GetLoanDelayOrder(int orderID)
        {

            return Json(XBService.GetLoanDelayOrder(orderID), JsonRequestBehavior.AllowGet);
        }
   
        public ActionResult LoanDelayOrder()
        {
            return PartialView("LoanDelayOrder");
        }
        public ActionResult LoanDelayOrderDetails()
        {
            return PartialView("LoanDelayOrderDetails");
        }
    }
}