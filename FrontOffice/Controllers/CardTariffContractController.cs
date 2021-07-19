using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.Web.UI;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CardTariffContractController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult CustomerCardTariffContracts()
        {
            return PartialView("CustomerCardTariffContracts");
        }

        public JsonResult GetCustomerCardTariffContracts(int filter)
        {
            return Json(XBService.GetCustomerCardTariffContracts((xbs.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Ստանում է քարտի աշխատանքային ծրագիրը
        /// </summary>
        /// <returns></returns>
        public ActionResult CardTariffContractDetails()
        {
            return PartialView("CardTariffContractDetails");
        }

        public JsonResult GetCardTariffContract(long tariffID)
        {
            return Json(XBService.GetCardTariffContract(tariffID),JsonRequestBehavior.AllowGet);
        }
        public ActionResult CardTariffs()
        {
            return PartialView("CardTariffs");
        }

        public JsonResult GetCardTariffContractActiveCardsCount(int tariffID)
        {
            return Json(XBService.GetCardTariffContractActiveCardsCount(tariffID), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCardTariffContracts(int filter, ulong customerNumber)
        {
            return Json(XBService.GetCardTariffContracts((xbs.ProductQualityFilter)filter, customerNumber), JsonRequestBehavior.AllowGet);
        }
        public ActionResult CardTariffContracts()
        {
            return PartialView("CardTariffContracts");
        }



        public void PrintCardTarifContract(int tarifID)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            parameters.Add(key: "relatedOfficeNumber", value: tarifID.ToString());

            ReportService.PrintSalPaymentReport(parameters, ExportFormat.Excel);
        }


    }
}