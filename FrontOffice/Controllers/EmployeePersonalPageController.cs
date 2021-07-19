using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using srv = FrontOffice.Service;


namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class EmployeePersonalPageController : Controller
    {
        public ActionResult DocumentSignatureSetting()
        {
            return PartialView("DocumentSignatureSetting");
        }


        public ActionResult SaveBranchDocumentSignatureSetting(xbs.DocumentSignatureSetting setting)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            result = srv.XBService.SaveBranchDocumentSignatureSetting(setting);

            return Json(result);
        }

        public JsonResult GetBranchDocumentSignatureSetting()
        {
            return Json(srv.XBService.GetBranchDocumentSignatureSetting(), JsonRequestBehavior.AllowGet);
        }

    }
}