using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class ClaimController : Controller
    {
        public JsonResult GetProductClaims(ulong productId,short productType)
        {
            return Json(XBService.GetProductClaims(productId,productType));
        }

        public JsonResult GetClaimEvents(int claimNumber)
        {
            return Json(XBService.GetClaimEvents(claimNumber));
        }

        public JsonResult GetTax(int claimNumber, int eventNumber)
        {
            return Json(XBService.GetTax(claimNumber, eventNumber));
        }

        public JsonResult GetProblemLoanCalculationsDetail(int claimNumber, int eventNumber)
        {
            return Json(XBService.GetProblemLoanCalculationsDetail(claimNumber, eventNumber));
        }

        public ActionResult ChangeProblemLoanTaxQuality(ulong taxAppId)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            result = XBService.ChangeProblemLoanTaxQuality(taxAppId);

            if (result.Errors != null)
            {
                if (result.Errors.Count != 0)
                {
                    xbs.ActionError error = new xbs.ActionError();

                    error.Code = result.Errors[0].Code;
                    if (error.Code != 0)
                        error.Description = XBService.GetTerm(error.Code, null, xbs.Languages.hy);
                    else
                        error.Description = result.Errors[0].Description;
                    if (result.Errors[0].Params != null)
                        error.Description = error.Description.Replace("{0}", result.Errors[0].Params[0]);
                    result.Errors = new List<xbs.ActionError>();
                    result.ResultCode = xbs.ResultCode.ValidationError;
                    result.Errors.Add(error);

                    return Json(result);
                }
            }
            return Json(result);
        }

    }
}