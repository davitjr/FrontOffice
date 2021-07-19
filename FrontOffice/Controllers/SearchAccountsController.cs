using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;


namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class SearchAccountsController : Controller 
    {
        public JsonResult GetSearchedAccounts(xbs.SearchAccounts searchParams)
        {        
            return Json(XBService.GetSearchedAccounts(searchParams), JsonRequestBehavior.AllowGet);
        }

    }
}