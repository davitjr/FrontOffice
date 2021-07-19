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
    public class SearchInternationalTransferController : Controller
    {
         public JsonResult GetSearchedInternationalTransfers(xbs.SearchInternationalTransfer searchParams)
        {
            
            if (searchParams.DateOfTransfer == DateTime.MinValue && String.IsNullOrEmpty(searchParams.SenderName) && String.IsNullOrEmpty(searchParams.SenderAccNumber) && String.IsNullOrEmpty(searchParams.ReceiverName))
            {
                return Json(new List<xbs.SearchInternationalTransfer>(), JsonRequestBehavior.AllowGet);
            }
            return Json(XBService.GetSearchedInternationalTransfers(searchParams), JsonRequestBehavior.AllowGet);
        }
    }
}