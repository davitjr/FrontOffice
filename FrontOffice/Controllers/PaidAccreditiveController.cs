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
    public class PaidAccreditiveController : Controller
    {
        // GET: PaidAccreditive
        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult PaidAccreditives()
        {
            return PartialView("PaidAccreditives");
        }

        public JsonResult GetPaidAccreditives(int filter)
        {
            return Json(XBService.GetPaidAccreditives((XBS.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }

         [ProductDetailsAccesibleFilter]
        public JsonResult GetPaidAccreditive(ulong productId)
        {
            xbs.PaidAccreditive paidAccreditive = XBService.GetPaidAccreditive(productId);
            ViewBag.accountGroup = paidAccreditive.LoanAccount.AccountPermissionGroup;
            return Json(paidAccreditive, JsonRequestBehavior.AllowGet);
        }
        public ActionResult PaidAccreditiveDetails()
        {
            return PartialView("PaidAccreditiveDetails");
        }

    }
}