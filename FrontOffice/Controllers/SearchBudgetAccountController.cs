using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.Mvc;

namespace FrontOffice.Controllers 
{
    [SessionExpireFilter]
    public class SearchBudgetAccountController : Controller
    {
        public JsonResult GetSearchedBudgetAccounts(xbs.SearchBudgetAccount searchParams)
        {

            if (String.IsNullOrEmpty(searchParams.AccountNumber) && String.IsNullOrEmpty(searchParams.Description) && String.IsNullOrEmpty(searchParams.AccountType) && String.IsNullOrEmpty(searchParams.CustomerType))
            {
                return Json(new List<xbs.SearchBudgetAccount>(), JsonRequestBehavior.AllowGet);
            }
            return Json(XBService.GetSearchedBudgetAccounts(searchParams), JsonRequestBehavior.AllowGet);
        }
    }
}