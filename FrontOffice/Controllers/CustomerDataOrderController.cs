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
    public class CustomerDataOrderController : Controller
    {
        public JsonResult GetCustomerDataOrder(int orderId)
        {

            return Json(XBService.GetCustomerDataOrder(orderId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PersonalCustomerDataOrder()
        {
            return PartialView("PersonalCustomerDataOrder");
        }

        public ActionResult CustomerDataOrderDetails()
        {
            return PartialView("CustomerDataOrderDetails");
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        public ActionResult SaveCustomerDataOrder(xbs.CustomerDataOrder order)
        {
            order.Type = xbs.OrderType.CustomerDataOrder;
            xbs.ActionResult result = XBService.SaveCustomerDataOrder(order);
            return Json(result);//must return error view
        }
    }
}