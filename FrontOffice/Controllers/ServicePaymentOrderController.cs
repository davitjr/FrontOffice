using FrontOffice.Models;
using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class ServicePaymentOrderController : Controller
    {

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveServicePaymentOrder(xbs.ServicePaymentOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveServicePaymentOrder(order);
            return Json(result);

        }

        public JsonResult initDebitAccount(xbs.ServicePaymentOrder order)
        {
            xbs.Account debitAccount = XBService.GetOperationSystemAccount(order, xbs.OrderAccountType.DebitAccount, "AMD");
            return Json(XBService.GetAcccountAvailableBalance(debitAccount.AccountNumber), JsonRequestBehavior.AllowGet);
        }
    }
}