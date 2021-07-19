using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.Web.UI;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class GuaranteeController : Controller
    {
        // GET: Guarantee
        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult Guarantees()
        {
            return PartialView("Guarantees");
        }

        public JsonResult GetGuarantees(int filter)
        {
            return Json(XBService.GetGuarantees((XBS.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }

        [ProductDetailsAccesibleFilter]
        public JsonResult GetGuarantee(ulong productId)
        {
            xbs.Guarantee guarantee = XBService.GetGuarantee(productId);
            ViewBag.accountGroup = guarantee.ConnectAccount.AccountPermissionGroup;
            return Json(guarantee, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GuaranteeDetails()
        {
            return PartialView("GuaranteeDetails");
        }

        public JsonResult GetGivenGuaranteeReductions(ulong productId)
        {
            return Json(XBService.GetGivenGuaranteeReductions(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GivenGuaranteeReductions()
        {
            return PartialView("GivenGuaranteeReductions");
        }

        public ActionResult GuaranteeTerminationOrderDetails()
        {
            return PartialView("GuaranteeTerminationOrderDetails");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public JsonResult SaveGuaranteeTerminationOrder(ulong productId)
        {
            xbs.LoanProductTerminationOrder order = new xbs.LoanProductTerminationOrder();
            order.ProductId = productId;
            order.Type = xbs.OrderType.GuaranteeTermination;
            order.RegistrationDate = DateTime.Now.Date;
            order.OperationDate = XBService.GetCurrentOperDay();
            return Json(XBService.SaveLoanProductTerminationOrder(order), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetGuaranteeTerminationOrder(long orderId)
        {
            return Json(XBService.GetLoanProductTerminationOrder(orderId), JsonRequestBehavior.AllowGet);
        }


    }
}