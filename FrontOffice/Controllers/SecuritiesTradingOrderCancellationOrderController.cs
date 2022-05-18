using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    public class SecuritiesTradingOrderCancellationOrderController : Controller
    {
        // GET: SecuritiesTradingOrderCancellationOrder
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetSecuritiesTradingOrderCancellationOrder(long id)
        {
            return Json(XBService.GetSecuritiesTradingOrderCancellationOrder(id), JsonRequestBehavior.AllowGet);
        }

    }
}