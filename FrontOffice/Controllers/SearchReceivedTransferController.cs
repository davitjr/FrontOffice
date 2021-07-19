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
    public class SearchReceivedTransferController : Controller
    {
         public JsonResult GetSearchedReceivedTransfers(xbs.SearchReceivedTransfer searchParams)
        {
            
            if (searchParams.TransferType == 0 )
            {
                return Json(new List<xbs.SearchReceivedTransfer>(), JsonRequestBehavior.AllowGet);
            }
            return Json(XBService.GetSearchedReceivedTransfers(searchParams), JsonRequestBehavior.AllowGet);
        }
    }
}