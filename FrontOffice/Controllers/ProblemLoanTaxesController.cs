using FrontOffice.Service;
using FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class ProblemLoanTaxesController : Controller
    {
        [AllowAnonymous]
        public System.Web.Mvc.ActionResult Index()
        {
            return View("ProblemLoanTaxes");
        }

        public System.Web.Mvc.ActionResult ProblemLoanTaxes()
        {
            return View("ProblemLoanTaxes");
        }

        public System.Web.Mvc.ActionResult ProblemLoanTaxesDetails()
        {
            return View("ProblemLoanTaxesDetails");
        }

        public JsonResult GetProblemLoanTaxesLenght()
        {
            return Json(XBService.GetProblemLoanTaxesLenght(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SearchProblemLoanTax(ProblemLoanTaxFilter problemLoanTaxFilter, bool Cache)
        {
            if (problemLoanTaxFilter.TaxRegistrationStartDate != null)
            {
                problemLoanTaxFilter.TaxRegistrationStartDate = problemLoanTaxFilter.TaxRegistrationStartDate.Date;
            }

            if (problemLoanTaxFilter.TaxRegistrationEndDate != null)
            {
                problemLoanTaxFilter.TaxRegistrationEndDate = problemLoanTaxFilter.TaxRegistrationEndDate.Date;
            }

            return Json(XBService.SearchProblemLoanTax(problemLoanTaxFilter, Cache), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProblemLoanTaxDetails(long AppId)
        {
            return Json(XBService.GetProblemLoanTaxDetails(AppId), JsonRequestBehavior.AllowGet);
        }

    }
}