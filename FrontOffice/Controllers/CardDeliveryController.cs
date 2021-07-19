using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CardDeliveryController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("CardDelivery");
        }

        public ActionResult CardDelivery()
        {
            return View("CardDelivery");
        }

        public ActionResult DownloadOrderXMLs(DateTime dateFrom, DateTime dateTo)
        {
            XBS.ActionResult result = new XBS.ActionResult();
            result = XBService.DownloadOrderXMLs(dateFrom, dateTo);
            return Json(result);

        }


    }
}