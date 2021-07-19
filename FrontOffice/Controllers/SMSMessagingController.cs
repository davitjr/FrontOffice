using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.ACBAServiceReference;
using FrontOffice.SMSMessagingService;
using Srv = FrontOffice.Service;

namespace FrontOffice.Controllers
{
    public class SMSMessagingController : Controller
    {
        // GET: SMSMessaging
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("SMSMessaging");
        }

        public ActionResult AddSMSMessagingSession()
        {
            return View("AddSMSMessagingSession");
        }


        public JsonResult SaveMessages(SMSMessagingSession messagingSession)
        {
            return Json(Srv.SMSMessagingService.SaveMessagingSession(messagingSession));
        }

        public JsonResult GetSMSMessagingSessions(SearchSMSMessagingSession searchParams)
        {
            return Json(Srv.SMSMessagingService.GetSMSMessagingSessions(searchParams), JsonRequestBehavior.AllowGet);
        }

        public JsonResult ChangeSMSMessagingSessionStatus(uint id, byte newStatus)
        {
            return Json(Srv.SMSMessagingService.ChangeSMSMessagingSessionStatus(id, newStatus));
        }

        public JsonResult DeleteMessagingSession(uint id)
        {
            return Json(Srv.SMSMessagingService.DeleteMessagingSession(id));
        }

        public void SMSMessagingReport(uint id)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "sessionId", value: id.ToString());
            parameters.Add(key: "user_ID", value: "0");
            Srv.ReportService.SMSMessagingReport(parameters);
        }
    }
}