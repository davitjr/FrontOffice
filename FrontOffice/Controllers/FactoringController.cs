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
    public class FactoringController : Controller
    {
        // GET: Factoring
        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult Factorings()
        {
            return PartialView("Factorings");
        }

        public JsonResult GetFactorings(int filter)
        {
            return Json(XBService.GetFactorings((XBS.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetFactoring(ulong productId)
        {
            return Json(XBService.GetFactoring(productId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult FactoringDetails()
        {
            return PartialView("FactoringDetails");
        }

        public ActionResult FactoringTerminationOrderDetails()
        {
            return PartialView("FactoringTerminationOrderDetails");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public JsonResult SaveFactoringTerminationOrder(ulong productId)
        {
            xbs.FactoringTerminationOrder order = new xbs.FactoringTerminationOrder();
            order.ProductId = productId;
            order.Type = xbs.OrderType.FactoringTermination;
            order.RegistrationDate = DateTime.Now.Date;
            order.OperationDate = XBService.GetCurrentOperDay();
            return Json(XBService.SaveFactoringTerminationOrder(order), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFactoringTerminationOrder(long orderId)
        {
            return Json(XBService.GetFactoringTerminationOrder(orderId),JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountsForOrder(ulong customerNumber)
        {
            return Json(XBService.GetAccountsForOrder((short)xbs.OrderType.FactoringActivation,1,1), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFactoringCustomerCardAndCurrencyAccounts (ulong productId, string currency)
        {
            return Json(XBService.GetFactoringCustomerCardAndCurrencyAccounts(productId, currency), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFactoringCustomerFeeCardAndCurrencyAccounts(ulong productId)
        {
            return Json(XBService.GetFactoringCustomerFeeCardAndCurrencyAccounts(productId), JsonRequestBehavior.AllowGet);
        }
        

    }
}