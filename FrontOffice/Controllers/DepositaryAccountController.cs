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

    public class DepositaryAccountController : Controller
    {
        public ActionResult DepositaryAccount()
        {
            return PartialView("DepositaryAccount");
        }


        /// <summary>
        /// Վերադարձնում է պարտատոմսերի արժեթղթերի հաշվի պատուհանը
        /// </summary>
        /// <returns></returns>
        public ActionResult DepositaryAccountDetails()
        {
            return View("DepositaryAccountDetails");
        }


        public JsonResult GetDepositaryAccountById(int id)
        {
            return Json(XBService.GetDepositaryAccountById(id), JsonRequestBehavior.AllowGet);

        }
    }
}