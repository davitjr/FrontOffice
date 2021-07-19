using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class VehicleViolationController : Controller
    {
        public ActionResult VehicleViolations()
        {
            return PartialView("_VehicleViolations");
        }

        public JsonResult GetVehicleViolationById(string violationId)
        {

            List<xbs.VehicleViolationResponse> responses = new List<xbs.VehicleViolationResponse>();
            responses = XBService.GetVehicleViolationById(violationId);
            return Json(responses, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetVehicleViolationByPsnVehNum(string psn, string vehNum)
        {
            List<xbs.VehicleViolationResponse> responses = new List<xbs.VehicleViolationResponse>();
            responses = XBService.GetVehicleViolationByPsnVehNum(psn,vehNum);
            return Json(responses, JsonRequestBehavior.AllowGet);
        }
    }
}