using FrontOffice.Models;
using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.Configuration;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class ProvisionController : Controller
    {

        public JsonResult GetProductProvisions(ulong productId)
        {
            return Json(XBService.GetProductProvisions(productId), JsonRequestBehavior.AllowGet);
        }


        public ActionResult ProvisionDetails()
        {
            return PartialView("ProvisionDetails");
        }

        public JsonResult GetProvisionOwners(ulong productId)
        {
            return Json(XBService.GetProvisionOwners(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ProvisionOwners()
        {
            return PartialView("ProvisionOwners");
        }

        public ActionResult ProvisionLoans()
        {
            return PartialView("ProvisionLoans");
        }

        public JsonResult GetCustomerProvisions(string currency, ushort type=0,ushort quality=1)
        {
            return Json(XBService. GetCustomerProvisions(currency,type,quality), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProvisionLoans(ulong provisionId)
        {
            return Json(XBService.GetProvisionLoans(provisionId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCurrencies()
        {
            return Json(InfoService.GetCurrencies(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ProvisionLoanNotificationConfigurations()
        {
            return PartialView("ProvisionLoanNotificationConfigurations");
        }

        public ActionResult ProvisionLoanStatement()
        {
            return PartialView("ProvisionLoanStatement");
        }

        [HttpPost]
        public JsonResult RedirectLoanManagementSystemCollateral()
        {
            string customerNumber = XBService.GetAuthorizedCustomerNumber().ToString();
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();
            string authorisedCustomerSessionId = System.Web.HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"].ToString();
            return Json(new { redirectUrl = ConfigurationManager.AppSettings["LoanManagementSystemCollateralURL"] + ConfigurationManager.AppSettings["LoanManagementSystemCollateralSharePoint"], authorizedUserSessionToken = authorizedUserSessionToken, customerNumber = customerNumber, authorisedCustomerSessionId = authorisedCustomerSessionId });
        }

        [HttpPost]
        public JsonResult RedirectLoanManagementSystemLeasingCollateral()
        {
            string customerNumber = XBService.GetAuthorizedCustomerNumber().ToString();
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();
            string authorisedCustomerSessionId = System.Web.HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"].ToString();
            return Json(new { redirectUrl = ConfigurationManager.AppSettings["LoanManagementSystemCollateralURL"] + ConfigurationManager.AppSettings["LoanManagementSystemLeasingCollateralSharePoint"], authorizedUserSessionToken = authorizedUserSessionToken, customerNumber = customerNumber, authorisedCustomerSessionId = authorisedCustomerSessionId});
        }
    }
}