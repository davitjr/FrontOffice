using FrontOffice.Service;
using FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CreditCommitmentForgivenessOrderController : Controller
    {
        [AllowAnonymous]
        public System.Web.Mvc.ActionResult Index()
        {
            return View("CreditCommitmentForgivenessOrder");
        }

        [AllowAnonymous]
        public System.Web.Mvc.ActionResult CreditCommitmentForgivenessOrder()
        {
            return View("CreditCommitmentForgivenessOrder");
        }

        [AllowAnonymous]
        public System.Web.Mvc.ActionResult CreditCommitmentForgivenessOrderDetails()
        {
            return View("CreditCommitmentForgivenessOrderDetails");
        }

        public JsonResult GetForgivableLoanCommitment(string productId, string loanType, CreditCommitmentForgivenessOrder creditCommitmentForgiveness)
        {
            creditCommitmentForgiveness.AppId = Convert.ToUInt64(productId);
            creditCommitmentForgiveness.LoanType = Convert.ToInt32(loanType);
            return Json(XBService.GetForgivableLoanCommitment(creditCommitmentForgiveness), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCreditCommitmentForgiveness(int orderID)
        {
            return Json(XBService.GetCreditCommitmentForgiveness(orderID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveForgivableLoanCommitment(CreditCommitmentForgivenessOrder creditCommitmentForgiveness)
        {

            return Json(XBService.SaveForgivableLoanCommitment(creditCommitmentForgiveness), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTaxForForgiveness(double? capital, string RebetType, string currency)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            return Json(XBService.GetTaxForForgiveness(customerNumber, capital, RebetType, currency));
        }


    }
}