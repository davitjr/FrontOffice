using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CardlessCashoutOrderController : Controller
    {
        // GET: CardlessCashoutOrder
        public ActionResult CardLessCashOutOrderDetails()
        {
            return View();
        }

        public JsonResult GetCardLessCashOutOrder(long id)
        {
            return Json(XBService.GetCardLessCashOutOrder(id), JsonRequestBehavior.AllowGet);
        }
    }
}