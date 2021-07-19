using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using System.Net;
using System.IO;
using System.Text;
using acba = FrontOffice.ACBAServiceReference;
using System.Net.Http;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using Newtonsoft.Json;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CreditHereAndNowController : Controller
    {
        [AllowAnonymous]
        // GET: CreditHereAndNow
        public ActionResult Index()
        {
            return View("CreditHereAndNow");  
        }
        public JsonResult GetSearchedCreditsHereAndNow(xbs.SearchCreditHereAndNow searchParams)
        {
            return Json(XBService.GetCreditsHereAndNow(searchParams), JsonRequestBehavior.AllowGet);
        }


        public JsonResult SaveCreditHereAndNowActivationPreOrder(xbs.CreditHereAndNowActivationOrders creditHereAndNowActivationOrders) 
        {
            return Json(XBService.SaveCreditHereAndNowActivationPreOrder(creditHereAndNowActivationOrders), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CreditHereAndNowActivationOrders()
        {
            return View("CreditHereAndNowActivationOrders");
        }
        public ActionResult CreditsHereAndNow()
        {
            return PartialView("CreditsHereAndNow");
        }

        public JsonResult ApproveCreditHereAndNowActivationPreOrder(int preOrderID)
        {
            return Json(XBService.ApproveCreditHereAndNowActivationPreOrder(preOrderID), JsonRequestBehavior.AllowGet);
        }
        
        public void initUSerBySessionToken(string authorizedUserSessionToken, ref xbs.AuthorizedUser authorizedUser, ref xbs.User user)
        {

            XBService.initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);
            if (!authorizedUser.isAutorized)
                user = null;
        }
        public JsonResult ResetIncompletePreOrderDetailQuality()
        {
            return Json(XBService.ResetIncompletePreOrderDetailQuality(), JsonRequestBehavior.AllowGet);
        }
        public int GetIncompletePreOrdersCount()
        {
            return XBService.GetIncompletePreOrdersCount();
        }

    }
}