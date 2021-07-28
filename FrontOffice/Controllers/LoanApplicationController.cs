using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class LoanApplicationController : Controller
    {
        // GET: LoanApplications
        public ActionResult LoanApplications()
        {
            return PartialView("LoanApplications");
        }

        // GET: /LoanApplications/
        public JsonResult GetLoanApplications()
        {
            return Json(XBService.GetLoanApplications(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanApplication(ulong productId)
        {
            xbs.LoanApplication loanApplication = XBService.GetLoanApplication(productId);
            return Json(loanApplication, JsonRequestBehavior.AllowGet);
        }

        // Get: Loan Application Details
        public ActionResult LoanApplicationDetails()
        {
            return PartialView("LoanApplicationDetails");
        }

        public JsonResult GetLoanApplicationFicoScoreResults(ulong productId,DateTime requestDate)
        {
            return Json(XBService.GetLoanApplicationFicoScoreResults(productId, requestDate), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanApplicationByDocId(long docId)
        {
            xbs.LoanApplication loanApplication = XBService.GetLoanApplicationByDocId(docId);
            return Json(loanApplication, JsonRequestBehavior.AllowGet);
        }


        public ActionResult LoanApplicationOrderDetails()
        {
            return PartialView("LoanApplicationOrderDetails");
        }

        public ActionResult FicoScoreDetails()
        {
            return PartialView("FicoScoreDetails");
        }

        public ActionResult LoanApplicationTerminationOrder()
        {
            return PartialView("LoanApplicationTerminationOrder");
        }

        public ActionResult LoanApplication()
        {
            return PartialView("LoanApplication");
        }

        public ActionResult CreditLineApplication()
        {
            return PartialView("CreditLineApplication");
        }

        public JsonResult RedirectLoanManagementSystem()
        {
            string customerNumber = XBService.GetAuthorizedCustomerNumber().ToString();
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();
            string authorisedCustomerSessionId = System.Web.HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"].ToString();
            return Json(new { redirectUrl = ConfigurationManager.AppSettings["LoanManagementSystemURL"] + ConfigurationManager.AppSettings["LoanManagementSystemSharePoint"], authorizedUserSessionToken = authorizedUserSessionToken, customerNumber = customerNumber, authorisedCustomerSessionId = authorisedCustomerSessionId });
        }

        public JsonResult RedirectLoanManagementSystemAcraMonitoring()
        {
            string customerNumber = XBService.GetAuthorizedCustomerNumber().ToString();
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();
            string authorisedCustomerSessionId = System.Web.HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"].ToString();
            return Json(new { redirectUrl = ConfigurationManager.AppSettings["LoanManagementSystemURL"] + ConfigurationManager.AppSettings["LoanManagementSystemAcraMonitoringSharepoint"], authorizedUserSessionToken = authorizedUserSessionToken, customerNumber = customerNumber, authorisedCustomerSessionId = authorisedCustomerSessionId });
        }
        


    }
}