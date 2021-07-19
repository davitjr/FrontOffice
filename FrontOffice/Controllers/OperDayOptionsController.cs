using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using FrontOffice.ACBAServiceReference;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    
    public class OperDayOptionsController : Controller
    {
        [AllowAnonymous]

        public ActionResult OperDayOptions()
       {
            return View("OperDayOptions");
        }


   
        public ActionResult SaveOperDayOptions(List<xbs.OperDayOptions> operDayOptionss)
        {
            List<xbs.OperDayOptions> x = new List<xbs.OperDayOptions>();
            string guid = Utility.GetSessionId();

            XBS.User user = ((XBS.User)Session[guid + "_User"]);
            short setNumber = user.userID;
            DateTime operDay = XBService.GetCurrentOperDay();
            DateTime regDate = DateTime.Now.Date;

            foreach (var item in operDayOptionss)
            {
                item.NumberOfSet = setNumber;
                item.RegistrationDate = regDate;
                item.OperDay = operDay;
            }
            
            xbs.ActionResult result = new XBS.ActionResult();
            result = XBService.SaveOperDayOptions(operDayOptionss);
            return Json(result);
        }

        public JsonResult GetOperDayOptionsList(xbs.OperDayOptionsFilter filter)
        {
            

            List<xbs.OperDayOptions> operDayOptionss= XBService.GetOperDayOptionsList(filter);
            return Json(operDayOptionss, JsonRequestBehavior.AllowGet);
        }

        public ActionResult OperDayOptionsSave()
        {
            return View("OperDayOptionsSave");
        }
    }
}