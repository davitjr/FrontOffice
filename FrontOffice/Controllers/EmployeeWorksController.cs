using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ews= FrontOffice.EmployeeWorksManagementService;
using System.Web.SessionState;
using srv= FrontOffice.Service;


namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class EmployeeWorksController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("EmployeeWorks");
        }


        public ActionResult EmployeeWorks()
        {
            return PartialView("EmployeeWorks");
        }


        public JsonResult SaveEmployeeWork(ews.EmployeeWork work)
        {

            work.CustomerIdentityId = srv.ACBAOperationService.GetIdentityId(work.CustomerNumber);
            return Json(srv.EmployeeWorksManagementService.SaveEmployeeWork(work),JsonRequestBehavior.AllowGet);
        }

        public ActionResult NewEmployeeWork()
        {
            return PartialView("NewEmployeeWork");
        }

        public JsonResult GetTypeOfEmployeeWorks()
        {
            return Json(srv.EmployeeWorksManagementService.GetTypeOfEmployeeWorks(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTypeOfEmployeeWorkImportances()
        {
            return Json(srv.EmployeeWorksManagementService.GetTypeOfEmployeeWorkImportances(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTypeOfEmployeeWorkQualities()
        {
            return Json(srv.EmployeeWorksManagementService.GetTypeOfEmployeeWorkQualities(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTypeOfEmployeeWorkDescriptions()
        {
            return Json(srv.EmployeeWorksManagementService.GetTypeOfEmployeeWorkDescriptions(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult SearchEmployeesWorks(ews.SearchEmployeeWork searchParams)
        {
            if(searchParams.CustomerNumber != 0)
                searchParams.CustomerIdentityId = srv.ACBAOperationService.GetIdentityId(searchParams.CustomerNumber);
            return Json(srv.EmployeeWorksManagementService.SearchEmployeesWorks(searchParams), JsonRequestBehavior.AllowGet);
        }


        public ActionResult EmployeeWorkDetails()
        {
            return PartialView("EmployeeWorkDetails");
        }

        public JsonResult GetEmployeeWork(ulong id)
        {
            return Json(srv.EmployeeWorksManagementService.GetEmployeeWork(id), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ChangeWorkDetails()
        {
            return PartialView("ChangeWorkDetails");
        }

        
    }
}