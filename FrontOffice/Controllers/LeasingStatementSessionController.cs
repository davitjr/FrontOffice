using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.ACBAServiceReference;
using statementService = FrontOffice.CardStatementService;
using Service = FrontOffice.Service;
using xbs = FrontOffice.XBS;
using FrontOffice.Service;

namespace FrontOffice.Controllers
{
    public class LeasingStatementSessionController : Controller
    {
        // GET: LeasingStatementSession
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("LeasingStatementSession");
        }

        public ActionResult LeasingStatementSessionIndex()
        {
            return PartialView("LeasingStatementSession");
        }

        public ActionResult AddLeasingStatementSession()
        {
            return PartialView("AddLeasingStatementSession");
        }

        public ActionResult LeasingStatementSessionDetails()
        {
            return PartialView("LeasingStatementSessionDetails");
        }

        public ActionResult LeasingStatementSessionHistory()
        {
            return PartialView("LeasingStatementSessionHistory");
        }

        public ActionResult LeasingStatementSessionReport()
        {
            return PartialView("LeasingStatementSessionReport");
        }

        public ActionResult StartLeasingStatementSession()
        {
            return PartialView("StartLeasingStatementSession");
        }
        public JsonResult GetLeasingStatementSessions()
        {
            return Json(Service.LeasingStatementService.GetLeasingStatementSessions(GetStatementType()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CreateLeasingStatementSession(DateTime startDate, DateTime endDate)
        {
            return Json(Service.LeasingStatementService.CreateLeasingStatementSession(startDate, endDate, GetStatementType()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteLeasingStatementSession(int sessionID)
        {
            return Json(Service.LeasingStatementService.DeleteLeasingStatementSession(sessionID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStatementSessionQualityTypes()
        {
            return Json(Service.LeasingStatementService.GetStatementSessionQualityTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingSessionDetails(int sessionID)
        {
            return Json(Service.LeasingStatementService.GetLeasingSessionDetails(sessionID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSatementHistory(int sessionID)
        {
            return Json(Service.LeasingStatementService.GetSatementHistory(sessionID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult StartLeasingStatementSessionSubscription(int sessionID, int startType, DateTime schedule)
        {

            return Json(Service.LeasingStatementService.StartLeasingStatementSessionSubscription(sessionID, startType, schedule, GetStatementType()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult ChangeStatementSessionStatus(int sessionID)
        {
            return Json(Service.LeasingStatementService.ChangeStatementSessionStatus(sessionID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteLeasingStatementSessionSchedule(int sessionID)
        {
            return Json(Service.LeasingStatementService.DeleteLeasingStatementSessionSchedule(sessionID), JsonRequestBehavior.AllowGet);
        }


        public JsonResult RunStatementSessionSubscription(int sessionID)
        {
            return Json(Service.LeasingStatementService.RunStatementSessionSubscription(sessionID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult PrintLeasingSessionStatements(int sessionID, int statementCreationStatus, int statementSendStatus, DateTime statementStartDate, DateTime statementEndDate, string exportFormat = "xls")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "sessionNumber", value: sessionID.ToString());
            parameters.Add(key: "statementCreationStatus", value: statementCreationStatus.ToString());
            parameters.Add(key: "statementSendStatus", value: statementSendStatus.ToString());
            parameters.Add(key: "period", value: statementStartDate.ToString("dd/MM/yy") + "-" + statementEndDate.ToString("dd/MM/yy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public void PrintLeasingCustomersWithoutEmailReport(string exportFormat = "xls")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            Service.ReportService.PrintLeasingCustomersWithoutEmailReport(parameters, Service.ReportService.GetExportFormatEnumeration(exportFormat));
        }

        public JsonResult PrintLeasingCustomersWithoutEmailForStatementReport(int sessionID, DateTime statementEndDate, string exportFormat = "xls")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "sessionNumber", value: sessionID.ToString());
            parameters.Add(key: "statementEndDate", value: statementEndDate.ToString("dd/MMM/yyyy"));

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetLeasingOperDay()
        {
            return Json(XBService.GetLeasingOperDayForStatements(), JsonRequestBehavior.AllowGet);
        }

        public int GetStatementType()
        {
            int statementType = 0;
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            SessionProperties sessionProperties = ((SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"]);
            if (sessionProperties.AdvancedOptions["leasingInsuranceStatement"].ToString() == "1")
            {
                statementType = 101;
            }
            else if (sessionProperties.AdvancedOptions["leasingLoanStatement"].ToString() == "1")
            {
                statementType = 100;
            }
            return statementType;
        }
    }
}