using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using XBS = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class MRDataChangeOrderController : Controller
    {
        public JsonResult PostMRDataChangeOrder(XBS.MRDataChangeOrder order)
        {
            return Json(XBService.SaveAndApproveMRDataChangeOrder(order), JsonRequestBehavior.AllowGet);
        }

    }
}