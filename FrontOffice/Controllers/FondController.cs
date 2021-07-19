using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class FondController : Controller
    {
        // GET: Fond
        [AllowAnonymous]
        public ActionResult Fonds()
        {
            return View("Fonds");
        }

        public ActionResult AllFonds()
        {
            return PartialView("Fonds");
        }

       

        public ActionResult ResourcePayments()
        {
            return PartialView("ResourcePayments");
        }


        public ActionResult FondDetails()
        {
            return View("FondDetails");
        }


        /// <summary>
        /// Վերադարձնում է վաճառված մեկ ֆոնդի մանրամասները
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public JsonResult GetFondByID(int ID)
        {
            return Json(XBService.GetFondByID(ID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFonds(int filter)
        {

            List<XBS.Fond> fonds = new List<XBS.Fond>();
            fonds = XBService.GetFonds((xbs.ProductQualityFilter)filter);
            return Json(fonds, JsonRequestBehavior.AllowGet);

        }

        //public ActionResult PrintFondAccountsList()
        //{
        //    return View("AddNewFond");
        //}

        public void PrintFondAccountsList()
        {
            //  string guid = Utility.GetSessionId();
            //  xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            //  if (XBService.AccountAccessible(card.CardAccount.AccountNumber, currentUser.AccountGroup))
            // {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
           // parameters.Add(key: "fond", value: fond.ID.ToString());
            ReportService.FondAccountsList(parameters, ReportService.GetExportFormatEnumeration("xls"));
            //}
        }
    }
}