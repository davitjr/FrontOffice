using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs=FrontOffice.XBS;
using System.Web.SessionState;
using System.Web.UI;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class AccreditiveController : Controller
    {
        // GET: Accreditive
        [OutputCache(CacheProfile = "AppViewCache")]
        public ActionResult Accreditives()
        {
            return PartialView("Accreditives");
        }

        public JsonResult GetAccreditives(int filter)
        {
            return Json(XBService.GetAccreditives((XBS.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }

        [ProductDetailsAccesibleFilter]
        public JsonResult GetAccreditive(ulong productId)
        {
            xbs.Accreditive accreditive = XBService.GetAccreditive(productId);
            ViewBag.accountGroup = accreditive.ConnectAccount.AccountPermissionGroup;
            return Json(accreditive, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AccreditiveDetails()
        {
            return PartialView("AccreditiveDetails");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public JsonResult SaveAccreditiveTerminationOrder(ulong productId)
        {
            xbs.LoanProductTerminationOrder order = new xbs.LoanProductTerminationOrder();
            order.ProductId = productId;
            order.Type = xbs.OrderType.AccreditiveTerminationOrder;
            order.RegistrationDate = DateTime.Now.Date;
            order.OperationDate = XBService.GetCurrentOperDay();
            return Json(XBService.SaveLoanProductTerminationOrder(order), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccreditiveTerminationOrder(long orderId)
        {
            return Json(XBService.GetLoanProductTerminationOrder(orderId), JsonRequestBehavior.AllowGet);
        }

    }
}