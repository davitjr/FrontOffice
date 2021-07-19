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
    public class PaidFactoringController : Controller
    {
        // GET: PaidFactoring
        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult PaidFactorings()
        {
            return PartialView("PaidFactorings");
        }

        public JsonResult GetPaidFactorings(int filter)
        {
            return Json(XBService.GetPaidFactorings((XBS.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPaidFactoring(ulong productId)
        {
            xbs.PaidFactoring paidFactoring = XBService.GetPaidFactoring(productId);
            ViewBag.accountGroup = paidFactoring.LoanAccount.AccountPermissionGroup;
            return Json(paidFactoring, JsonRequestBehavior.AllowGet);
        }
        public ActionResult PaidFactoringDetails()
        {
            return PartialView("PaidFactoringDetails");
        }

    }
}