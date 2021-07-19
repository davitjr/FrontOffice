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
    public class SearchSwiftCodesController : Controller
    {
        public JsonResult GetSearchedSwiftCodes(xbs.SearchSwiftCodes searchParams)
        {
            if (searchParams.SwiftCode == null)
            {
                searchParams.SwiftCode = "";
            }

            if (searchParams.City == null)
            {
                searchParams.City = "";
            }

            if (searchParams.BankName == null)
            {
                searchParams.BankName = "";
            }

            if (searchParams.SwiftCode == "" && searchParams.City == "" && searchParams.BankName == "")
            {
                return Json(new List<xbs.SearchSwiftCodes>(), JsonRequestBehavior.AllowGet);
            }
            return Json(XBService.GetSearchedSwiftCodes(searchParams), JsonRequestBehavior.AllowGet);
        }
    }
}