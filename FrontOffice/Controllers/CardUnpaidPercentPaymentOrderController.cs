using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using XBS = FrontOffice.XBS;
using FrontOffice.Models;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CardUnpaidPercentPaymentOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.CardPositiveInterestRepaymentOrderSave)]
        public ActionResult SaveCardUnpaidPercentPaymentOrder(XBS.CardUnpaidPercentPaymentOrder order)
        {
            XBS.ActionResult result = new XBS.ActionResult();
            result = XBService.SaveCardUnpaidPercentPaymentOrder(order);
            return Json(result);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult CardUnpaidPercentPaymentOrder()
        {
            return PartialView("PersonalCardUnpaidPercentPaymentOrder");
        }

        public JsonResult GetCardUnpaidPercentPaymentOrder(long orderID)
        {
            return Json(XBService.GetCardUnpaidPercentPaymentOrder(orderID), JsonRequestBehavior.AllowGet);
        }


        public ActionResult CardUnpaidPercentPaymentOrderDetails()
        {
            return PartialView("CardUnpaidPercentPaymentOrderDetails");
        }
    }
}