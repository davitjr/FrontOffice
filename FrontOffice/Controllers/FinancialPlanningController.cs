using System;
using System.Web;
using System.Web.Mvc;
using srv = FrontOffice.Service;
using FrontOffice.CustomBinders;
using ps = FrontOffice.FinancialPlanningService;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class FinancialPlanningController : Controller
    {
        [AllowAnonymous]
        // GET: FinancialPlanning
        public ActionResult Index()
        {
            return View("FinancialPlanning");
        }

        public ActionResult AddFinancialPlanning()
        {
            return View("AddFinancialPlanning"); 
        }

        [HttpPost]  
        public JsonResult Save([ModelBinder(typeof(PlanningIndicatorDetailsBinder))] ps.Document document, HttpPostedFileBase file)
        {
            int lenght = (int)file.InputStream.Length;
            document.DocumentData = new byte[lenght];
            file.InputStream.Read(document.DocumentData, 0, lenght);
            return Json(srv.FinancialPlanningService.Save(document));
        }

        public JsonResult GetPlanningTypes()
        {
            return Json(srv.FinancialPlanningService.GetPlanningTypes());
        }
        public JsonResult GetFinancialPlanningTypes()
        {
            return Json(srv.FinancialPlanningService.GetFinancialPlanningTypes());
        }

        public JsonResult GetFinancialPlanning(ps.Document document, DateTime year, int filialCode,int? setNumber)
        {
            return Json(srv.FinancialPlanningService.GetFinancialPlanning(document, year, filialCode, setNumber));
        }
    }
}