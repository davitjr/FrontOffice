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
    public class LoanMonitoringConclusionController : Controller
    {
        public ActionResult LoanMonitorings()
        {
            return PartialView("LoanMonitorings");
        }

        public ActionResult AddLoanMonitoring()
        {
            return PartialView("AddLoanMonitoring");
        }
        public ActionResult LoanMonitoringFactors()
        {
            return PartialView("LoanMonitoringFactors");
        }

        public ActionResult LoanMonitoringConclusionDetails()
        {
            return PartialView("LoanMonitoringConclusionDetails");
        }

        public ActionResult SaveLoanMonitoringConclusion(xbs.LoanMonitoringConclusion monitoring)
        {
            xbs.User user = (XBS.User)Session[Utility.GetSessionId() + "_User"];
            xbs.ActionResult result = new xbs.ActionResult();
            if (user.AdvancedOptions["canAddLoanMonitoringConclusion"] == "0")
            {
                result.ResultCode = xbs.ResultCode.ValidationError;
                result.Errors = new List<xbs.ActionError> { new XBS.ActionError() { Description = "Դուք չեք կարող ավելացնել մոնիթորինգի եզրակացություն" } };
            }
            else
            {
                if (monitoring.Status == 1)
                {
                    if (!monitoring.IsConclusionChanger)
                    {
                        result.ResultCode = xbs.ResultCode.ValidationError;
                        result.Errors = new List<xbs.ActionError> { new XBS.ActionError() { Description = "Դուք չեք կարող խմբագրել տվյալ մոնիթորինգի եզրակացությունը" } };
                    }
                }

            }

            if (XBService.HasPropertyProvision((ulong)monitoring.LoanProductId) && !IsLawDivision())
            {
                if (monitoring.ProvisionCostConclusion==0 || monitoring.ProvisionCoverCoefficient==0 || monitoring.ProvisionQualityConclusion==null)
                {
                    result.ResultCode = xbs.ResultCode.ValidationError;
                    result.Errors = new List<xbs.ActionError> { new XBS.ActionError() { Description = "Անհրաժեշտ է լրացնել գրավի տվյալները:" } };
                }
            }

            if (result.ResultCode != xbs.ResultCode.ValidationError)
            {
                result = XBService.SaveLoanMonitoringConclusion(monitoring);
            }

            return Json(result);
        }

        public ActionResult ApproveLoanMonitoringConclusion(xbs.LoanMonitoringConclusion monitoring)
        {
            xbs.User user = (XBS.User)Session[Utility.GetSessionId() + "_User"];
            xbs.ActionResult result = new xbs.ActionResult();
            if (user.AdvancedOptions["canAddLoanMonitoringConclusion"] == "0")
            {
                result.ResultCode = xbs.ResultCode.ValidationError;
                result.Errors = new List<xbs.ActionError> { new XBS.ActionError() { Description = "Դուք չեք կարող ավելացնել մոնիթորինգի եզրակացություն" } };
            }
            else
            {
                if (monitoring.Status == 1)
                {
                    if (!monitoring.IsConclusionChanger)
                    {
                        result.ResultCode = xbs.ResultCode.ValidationError;
                        result.Errors = new List<xbs.ActionError> { new XBS.ActionError() { Description = "Դուք չեք կարող խմբագրել տվյալ մոնիթորինգի եզրակացությունը" } };
                    }
                }

            }
            if (XBService.HasPropertyProvision((ulong)monitoring.LoanProductId) && !IsLawDivision())
            {
                if (monitoring.ProvisionCostConclusion == 0 || monitoring.ProvisionCoverCoefficient == 0 || monitoring.ProvisionQualityConclusion == null)
                {
                    result.ResultCode = xbs.ResultCode.ValidationError;
                    result.Errors = new List<xbs.ActionError> { new XBS.ActionError() { Description = "Անհրաժեշտ է լրացնել գրավի տվյալները:" } };
                }
            }


            if (result.ResultCode != xbs.ResultCode.ValidationError)
            {
                result = XBService.SaveLoanMonitoringConclusion(monitoring);
            }

            if (result.ResultCode == xbs.ResultCode.Normal)
            {
                result = XBService.ApproveLoanMonitoringConclusion(result.Id);
            }

            return Json(result);
        }

        public ActionResult DeleteLoanMonitoringConclusion(xbs.LoanMonitoringConclusion monitoring)
        {
            xbs.User user = (XBS.User)Session[Utility.GetSessionId() + "_User"];
            xbs.ActionResult result = new xbs.ActionResult();
            if (user.AdvancedOptions["canDeleteLoanMonitoringConclusion"] == "0" || !monitoring.IsConclusionChanger)
            {
                result.ResultCode = xbs.ResultCode.ValidationError;
                result.Errors = new List<xbs.ActionError> { new XBS.ActionError() { Description = "Դուք չեք կարող հեռացնել մոնիթորինգի եզրակացություն" } };
            }


            if (result.ResultCode != xbs.ResultCode.ValidationError)
                result = XBService.DeleteLoanMonitoringConclusion(monitoring.MonitoringId);

            return Json(result);
        }

        public JsonResult GetLoanMonitorings(long productId)
        {
            List<xbs.LoanMonitoringConclusion> conclusions = XBService.GetLoanMonitoringConclusions(productId);
            conclusions.FindAll(x => x.Status == 1).ToList().ForEach(x => x.IsConclusionChanger = x.ConclusionChangerUsers.Contains((((XBS.User)Session[Utility.GetSessionId() + "_User"]).userID)));
            return Json(conclusions, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanMonitoringConclusion(long monitoringId, long productId)
        {
            xbs.LoanMonitoringConclusion conclusion = XBService.GetLoanMonitoringConclusion(monitoringId, productId);

            conclusion.IsConclusionChanger = conclusion.ConclusionChangerUsers.Contains((((XBS.User)Session[Utility.GetSessionId() + "_User"]).userID));
            return Json(conclusion, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLinkedLoans(long productId)
        {
            return Json(XBService.GetLinkedLoans(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProvisionCoverCoefficient(long productId)
        {
            return Json(XBService.GetProvisionCoverCoefficient(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanMonitoringType()
        {
            return Json(XBService.GetLoanMonitoringType(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult HasPropertyProvision(ulong productId)
        {
            return Json(XBService.HasPropertyProvision(productId));
        }

        public bool IsLawDivision()
        {
            bool result = false;
            xbs.User user = (XBS.User)Session[Utility.GetSessionId() + "_User"];

            List<int> departments = new List<int> { 107, 112, 114, 183, 184, 205 };

            if (departments.Contains(user.DepartmentId))
            {
                result = true;
            }

            return result;
        }



    }


}
