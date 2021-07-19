using FrontOffice.Service;
using FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    public class OperDayModeController : Controller
    {
        public System.Web.Mvc.ActionResult Index()
        {
            return View("OperDayMode");
        }
        
        public System.Web.Mvc.ActionResult OperDayModeSave()
        {
            return View("OperDayModeSave");
        }
        
        public System.Web.Mvc.ActionResult OperDayMode()
        {
            return PartialView("OperDayMode");
        }

        public JsonResult SaveOperDayMode(OperDayMode operDayMode)
        {
            return Json(XBService.SaveOperDayMode(operDayMode), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetTypeOf24_7Modes()
        {
            return Json(InfoService.GetTypeOf24_7Modes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOperDayModeHistory(OperDayModeFilter operDayMode)
        {
            operDayMode.StartDate = operDayMode.StartDate.Date;
            operDayMode.EndDate = operDayMode.EndDate.Date;
            
            return Json(XBService.GetOperDayModeHistory(operDayMode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCurrentOperDay24_7_Mode()
        {
            return Json(XBService.GetCurrentOperDay24_7_Mode(), JsonRequestBehavior.AllowGet);
        }
        
    }
}