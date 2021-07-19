using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class OverdueController : Controller
    {
        public JsonResult GetOverdueDetails()
        {
            return Json(XBService.GetOverdueDetails(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult OverdueDetails()
        {
            return PartialView("OverdueDetails");
        }
        public JsonResult GetCurrentProductOverdueDetails(long productId)
        {
            return Json(XBService.GetCurrentProductOverdueDetails(productId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult LoanOverdueUpdate()
        {
            return PartialView("LoanOverdueUpdate");
        }
        public void GenerateLoanOverdueUpdate(long productId, string startDateStr, DateTime? endDate, string updateReason)
        {
            string guid = Utility.GetSessionId();
            XBS.User user = ((XBS.User)Session[guid + "_User"]);
            short setNumber = user.userID;
            DateTime startDate = new DateTime(Convert.ToInt32(startDateStr.Substring(6, 4)), Convert.ToInt32(startDateStr.Substring(3, 2)), Convert.ToInt32(startDateStr.Substring(0, 2)));
            if (startDate > endDate)
            {
                return;
            }
            XBService.GenerateLoanOverdueUpdate(productId, startDate, endDate, updateReason, setNumber);
        }
    }
}