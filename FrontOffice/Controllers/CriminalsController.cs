using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;

namespace FrontOffice.Controllers
{
    public class CriminalsController : Controller
    {
       
        public ActionResult CriminalCheckResults()
        {
             return PartialView("CriminalCheckResults");
        }
        
        public JsonResult GetCriminalCheckResults(List<int> logId)
        {
            return Json(ACBAOperationService.GetCriminalListFromLogById(logId), JsonRequestBehavior.AllowGet);
        }
    }
}