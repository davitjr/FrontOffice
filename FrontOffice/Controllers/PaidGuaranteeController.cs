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
    public class PaidGuaranteeController : Controller
    {
        // GET: PaidGuarantee
        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult PaidGuarantees()
        {
            return PartialView("PaidGuarantees");
        }

        public JsonResult GetPaidGuarantees(int filter)
        {
            return Json(XBService.GetPaidGuarantees((XBS.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }
        [ProductDetailsAccesibleFilter]
        public JsonResult GetPaidGuarantee(ulong productId)
        {
            xbs.PaidGuarantee paidGuarantee = XBService.GetPaidGuarantee(productId);
            ViewBag.accountGroup = paidGuarantee.LoanAccount.AccountPermissionGroup;
            return Json(paidGuarantee, JsonRequestBehavior.AllowGet);
        }
        public ActionResult PaidGuaranteeDetails()
        {
            return PartialView("PaidGuaranteeDetails");
        }

    }
}