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
    public class SwiftCopyOrderController : Controller
    {
        public JsonResult GetSwiftCopyOrder(int orderId)
        {

            return Json(XBService.GetSwiftCopyOrder(orderId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PersonalSwiftCopyOrder()
        {
            return PartialView("PersonalSwiftCopyOrder");
        }
        public ActionResult SwiftCopyOrderDetails()
        {
            return PartialView("SwiftCopyOrderDetails");
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.RequestOnReceiptOfSWIFTMessageCopyOrderSave)]
        public ActionResult SaveSwiftCopyOrder(xbs.SwiftCopyOrder order)
        {
            order.Type = xbs.OrderType.SwiftCopyOrder;
            xbs.ActionResult result = XBService.SaveSwiftCopyOrder(order);
            return Json(result);
        }
    }
}