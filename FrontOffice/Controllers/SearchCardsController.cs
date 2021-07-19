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
    public class SearchCardsController : Controller
    {
        public JsonResult GetSearchedCards(xbs.SearchCards searchParams)
        {
            if (searchParams.customerNumber == null || searchParams.customerNumber.Length != 12)
            {
                searchParams.customerNumber = "";
            }

            if (searchParams.cardNumber == null || searchParams.cardNumber.Length>16)
            {
                searchParams.cardNumber = "";
            }

            if (searchParams.customerNumber == "" && searchParams.cardNumber == "")
            {
                return Json(new List<xbs.SearchCardResult>(), JsonRequestBehavior.AllowGet);
            }
            
            return Json(XBService.GetSearchedCards(searchParams), JsonRequestBehavior.AllowGet);
        }
    }
}