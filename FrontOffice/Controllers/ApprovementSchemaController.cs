using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbm = FrontOffice.XBManagement;
using FrontOffice.Service;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class ApprovementSchemaController : Controller
    {

        public JsonResult GetApprovementSchema()
        {
            return Json(XBManagementService.GetApprovementSchema(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ApprovementSchema()
        {
            return PartialView("ApprovementSchema");
        }

        public ActionResult ApprovementSchemaDetails()
        {
            return PartialView("ApprovementSchemaDetails");
        }

        public ActionResult SaveApprovementSchemaDetails(xbm.ApprovementSchemaDetails schemaDetails, int schemaId)
        {
            xbm.ActionResult result = new xbm.ActionResult();
            result = XBManagementService.saveApprovementSchemaDetails(schemaDetails, schemaId);
        
            return Json(result);
          
        }

        //public ActionResult RemoveApprovementSchemaDetails(xbm.ApprovementSchemaDetails schemaDetails)
        //{
        //    xbm.ActionResult result = new xbm.ActionResult();
        //    result = XBManagementService.RemoveApprovementSchemaDetails(schemaDetails);
           
        //    return Json(result);
           
        //}


    }
}