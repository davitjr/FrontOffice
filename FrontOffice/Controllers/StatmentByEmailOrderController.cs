using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs=FrontOffice.XBS;
namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class StatmentByEmailOrderController : Controller
    {
        public JsonResult GetStatmentByEmailOrder(int orderId)
        {

            return Json(XBService.GetStatmentByEmailOrder(orderId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PersonalStatmentByEmailOrder()
        {
            return PartialView("PersonalStatmentByEmailOrder");
        }
        public ActionResult Errors()
        {
            return PartialView("Errors");
        }
        public ActionResult StatmentByEmailOrderDetails()
        {
            return PartialView("StatmentByEmailOrderDetails");
        }


        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.ElectronicRequestOnProvisionOfStatements)]
        public ActionResult SaveStatmentByEmailOrder(xbs.StatmentByEmailOrder order)
        {
            order.Type = xbs.OrderType.StatmentByEmailOrder;
            xbs.ActionResult result = XBService.SaveStatmentByEmailOrder(order);
            return Json(result);
        }
    }
}