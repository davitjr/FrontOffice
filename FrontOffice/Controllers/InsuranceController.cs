using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.Web.UI;

namespace FrontOffice.Controllers
{

    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class InsuranceController : Controller
    {
        public JsonResult GetInsurances(int filter)
        {
            return Json(XBService.GetInsurances((xbs.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPaidInsurance(ulong loanProductId)
        {
            return Json(XBService.GetPaidInsurance(loanProductId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInsurance(ulong productId)
        {
            xbs.Insurance insurance = XBService.GetInsurance(productId);
            return Json(insurance, JsonRequestBehavior.AllowGet);
        }


        public ActionResult InsuranceDetails()
        {
            return PartialView("InsuranceDetails");
        }

        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult Insurances()
        {
            return PartialView("Insurances");
        }

        public void DeleteInsurance(long insuranceid)
        {
            XBService.DeleteInsurance(insuranceid);
        }

        public bool HasPermissionForDelete()
        {
            short setNumber = 0;
            int groupID = 0;
            int positionID = 0;
            bool showdelete = false;
            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)Session[guid + "_User"];
            setNumber = user.userID;

            return XBService.HasPermissionForDelete(setNumber);

        }
    }
}