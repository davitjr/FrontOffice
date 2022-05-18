using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    public class LeasingOutPutReportsController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("Reports");
        }

        public ActionResult Reports()
        {
            return PartialView("Reports");
        }

        public JsonResult GetEconomicSectorGroupReport(DateTime startDate, DateTime endDate)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("dtStart", startDate.ToString("dd/MMM/yyyy"));
            parameters.Add("dtEnd", endDate.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPortfolioByTypeOfEquipmentReport(DateTime startDate, DateTime endDate)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("dtStart", startDate.ToString("dd/MMM/yyyy"));
            parameters.Add("dtEnd", endDate.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetByGeographicRegionsReport(DateTime startDate, DateTime endDate)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("d1", startDate.ToString("dd/MMM/yyyy"));
            parameters.Add("d2", endDate.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPortfolioByExpertsReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("dt", date.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAverageReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("dt", date.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetByKFWReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("RepDate", date.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetReachSurveyTableReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("RepDate", date.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBySubsidReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("date", date.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanRepaymentScheduleReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("rpt_date", date.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetByFundsReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("CalcDate", date.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetGGFSoutheastReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("RepDate", date.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReviseLeasingsReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("dt", date.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEFSEAggregateReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add("RepDate", date.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }


    }
}