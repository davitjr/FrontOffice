using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.ACBAServiceReference;
using statementService = FrontOffice.CardStatementService;
using Srv = FrontOffice.Service;
using xbs = FrontOffice.XBS;


namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CardStatementSessionController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("CardStatementSession");
        }

        public ActionResult CardStatementSessionIndex()
        {
            return PartialView("CardStatementSession");
        }

        public ActionResult AddCardStatementSession()
        {
            return PartialView("AddCardStatementSession");
        }

        public ActionResult CardStatementSessionDetails()
        {
            return PartialView("CardStatementSessionDetails");
        }

        public ActionResult CardStatementSessionHistory()
        {
            return PartialView("CardStatementSessionHistory");
        }

        public ActionResult CardStatementSessionReport()
        {
            return PartialView("CardStatementSessionReport");
        }

        public ActionResult StartCardStatementSession()
        {
            return PartialView("StartCardStatementSession");
        }
        public JsonResult GetCardStatementSessions()
        {
            return Json(Srv.CardStatementService.GetCardStatementSessions(GetStatementType()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CreateCardStatementSession(DateTime startDate, DateTime endDate, int frequency)
        {
            return Json(Srv.CardStatementService.CreateCardStatementSession(startDate, endDate, GetStatementType(), frequency), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCardStatementSession(int sessionID)
        {
            return Json(Srv.CardStatementService.DeleteCardStatementSession(sessionID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStatementSessionQualityTypes()
        {
            return Json(Srv.CardStatementService.GetStatementSessionQualityTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardSessionDetails(int sessionID)
        {
            return Json(Srv.CardStatementService.GetCardSessionDetails(sessionID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSatementHistory(int sessionID)
        {
            return Json(Srv.CardStatementService.GetSatementHistory(sessionID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult StartCardStatementSessionSubscription(int sessionID, int startType, DateTime schedule)
        {

            return Json(Srv.CardStatementService.StartCardStatementSessionSubscription(sessionID, startType, schedule, GetStatementType()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult ChangeStatementSessionStatus(int sessionID)
        {
            return Json(Srv.CardStatementService.ChangeStatementSessionStatus(sessionID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCardStatementSessionSchedule(int sessionID)
        {
            return Json(Srv.CardStatementService.DeleteCardStatementSessionSchedule(sessionID), JsonRequestBehavior.AllowGet);
        }


        public void PrintCardSessionStatements(int sessionID, int statementCreationStatus, int statementSendStatus, DateTime statementStartDate, DateTime statementEndDate, int actionType, string exportFormat = "xls")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "sessionNumber", value: sessionID.ToString());
            parameters.Add(key: "statementCreationStatus", value: statementCreationStatus.ToString());
            parameters.Add(key: "statementSendStatus", value: statementSendStatus.ToString());
            parameters.Add(key: "period", value: statementStartDate.ToString("dd/MM/yy") + "-" + statementEndDate.ToString("dd/MM/yy"));
            parameters.Add(key: "actionType", value: actionType.ToString());

            Srv.ReportService.CardStatementSession(parameters, Srv.ReportService.GetExportFormatEnumeration(exportFormat));
        }

        public void PrintLoanSessionStatements(int sessionID, int statementCreationStatus, int statementSendStatus, DateTime startDate, DateTime endDate, string exportFormat = "xls")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "sessionNumber", value: sessionID.ToString());
            parameters.Add(key: "statementCreationStatus", value: statementCreationStatus.ToString());
            parameters.Add(key: "statementSendStatus", value: statementSendStatus.ToString());
            parameters.Add(key: "startDate", value: startDate.ToString("dd/MMM/yy"));
            parameters.Add(key: "endDate", value: endDate.ToString("dd/MMM/yy"));
            Srv.ReportService.LoanStatementSession(parameters, Srv.ReportService.GetExportFormatEnumeration(exportFormat));
        }

        public int GetStatementType()
        {
            int statementType = 0;
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            SessionProperties sessionProperties = ((SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"]);

            if (sessionProperties.AdvancedOptions["loanStatement"].ToString() == "1")
            {
                statementType = 2;
            }
            else if (sessionProperties.AdvancedOptions["cardStatement"].ToString() == "1")
            {
                statementType = 1;
            }
            else if (sessionProperties.AdvancedOptions["accountStatement"].ToString() == "1")
            {
                statementType = 3;
            }
            return statementType;
        }
    }


}