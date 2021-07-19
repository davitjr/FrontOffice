using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using FrontOffice.Service;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class PreOrderController : Controller
    {
        [AllowAnonymous]
        public JsonResult GetSearchedPreOrderDetails(xbs.SearchPreOrderDetails param)
        {
            return Json(XBService.GetSearchedPreOrderDetails(param), JsonRequestBehavior.AllowGet);
        } 
        public ActionResult PreOrderDetailsHistory()
        {
            return PartialView("PreOrderDetails");
        }
    }
}