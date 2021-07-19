using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CashOrderController : Controller
    {
        public JsonResult GetCashOrder(int orderId)
        {

            return Json(XBService.GetCashOrder(orderId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PersonalCashOrder()
        {
            return PartialView("PersonalCashOrder");
        }
        public ActionResult CashOrderDetails()
        {
            return PartialView("CashOrderDetails");
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveCashOrder(xbs.CashOrder order)
        {

            order.Type = xbs.OrderType.CashOrder;

            xbs.ActionResult result = XBService.SaveCashOrder(order);

            if (result.ResultCode == xbs.ResultCode.Normal)
                return Json(result);

            return Json(result);//must return error view
        }

    }
}