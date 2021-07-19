using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;


namespace FrontOffice.Controllers
{
    public class UtilityOptionsController : Controller
    {
        // GET: UtilityOptions
        //public ActionResult Index()
        //{
        //    return View();
        //}


        public ActionResult UtilityOptions()
        {
            return PartialView("UtilityOptions");
        }

        public ActionResult UtilityOptionsSave()
        {
            return View("UtilityOptionsSave");
        }

        public JsonResult GetUtilityOptions(xbs.UtilityOptionsFilter filter)
        {
            List<xbs.UtilityOptions> utilityOptions = XBService.GetUtilityOptions(filter);
            return Json(utilityOptions, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUtiltyForChange()
        {
            List<xbs.UtilityOptions> listForChange = XBService.GetUtiltyForChange();
            return Json(listForChange, JsonRequestBehavior.AllowGet);
        }
        public ActionResult SaveUtilityOptions(List<xbs.UtilityOptions> list)
        {
            xbs.ActionResult result = new XBS.ActionResult();

            string guid = Utility.GetSessionId();

            XBS.User user = ((XBS.User)Session[guid + "_User"]);
            short setNumber = user.userID;


            foreach (var item in list)
            {
                item.NumberOfSet = setNumber;
            }

            result = XBService.SaveUtilityConfigurationsAndHistory(list);
            return Json(result);
        }

        public ActionResult SaveAllUtilityConfigurationsAndHistory(List<xbs.UtilityOptions> list, int a)
        {
            xbs.ActionResult result = new XBS.ActionResult();

            string guid = Utility.GetSessionId();

            XBS.User user = ((XBS.User)Session[guid + "_User"]);
            short setNumber = user.userID;


            foreach (var item in list)
            {
                item.NumberOfSet = setNumber;
            }

            result = XBService.SaveAllUtilityConfigurationsAndHistory(list, a);
            return Json(result);
        }

        public JsonResult GetExistsNotSentAndSettledRows(List<xbs.UtilityOptions> list)
        {

            Dictionary<int, bool> keyValues = new Dictionary<int, bool>();

            foreach (var item in list)
            {
                keyValues.Add(item.TypeID, item.IsEnabled);
            }

            List<string> listString = XBService.GetExistsNotSentAndSettledRows(keyValues);
            return Json(listString, JsonRequestBehavior.AllowGet);
        }



    }
}