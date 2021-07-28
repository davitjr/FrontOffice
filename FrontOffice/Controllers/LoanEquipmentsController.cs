using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using acba = FrontOffice.ACBAServiceReference;
using FrontOffice.Models;
using System.Web.SessionState;


namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class LoanEquipmentsController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("LoanEquipments");
        }

        public ActionResult LoanEquipments()
        {
            return PartialView("LoanEquipments");
        }

        public JsonResult GetSearchedLoanEquipments(xbs.SearchLoanEquipment searchParams)
        {
            
            var jsonResult = Json(XBService.GetSearchedLoanEquipment(searchParams), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
        public JsonResult GetSumsOfEquipmentPrices(xbs.SearchLoanEquipment searchParams)
        {

            var jsonResult = Json(XBService.GetSumsOfEquipmentPrices(searchParams), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
        public JsonResult GetEquipmentDetails(int equipmentID)
        {
            return Json(XBService.GetEquipmentDetails(equipmentID), JsonRequestBehavior.AllowGet);
        }
        public ActionResult LoanEquipmentDetails()
        {
            return PartialView("LoanEquipmentDetails");
        }
        public ActionResult EquipmentClosing()
        {
            return PartialView("EquipmentClosing");
        }
        public JsonResult GetEquipmentClosingReason(int equipmentID)
        {
            return Json(XBService.GetEquipmentClosingReason(equipmentID), JsonRequestBehavior.AllowGet);
        }
        public ActionResult LoanEquipmentClosing(int equipmentID, string closingReason)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            xbs.ActionResult result = XBService.LoanEquipmentClosing(equipmentID, currentUser.userID,Utility.ConvertUnicodeToAnsi(closingReason));
            return Json(result);

            
        }
        public ActionResult ChangeCreditProductMatureRestriction(double appID, int allowMature)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            xbs.ActionResult result = XBService.ChangeCreditProductMatureRestriction(appID, currentUser.userID, allowMature);
            return Json(result);


        }
        public JsonResult SaledEquipmentsReport(double customerNumber, int filialCode, double loanFullNumber, double? equipmentSalePriceFrom, double? equipmentSalePriceTo,DateTime? auctionEndDateFrom, DateTime? auctionEndDateTo, string equipmentDescription, string equipmentAddress, int equipmentQuality, int saleStage)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "filialCode", value: filialCode.ToString());
            parameters.Add(key: "loanFullNumber", value: loanFullNumber.ToString());
            parameters.Add(key: "equipmentSalePriceFrom", value: (equipmentSalePriceFrom == null)? null : equipmentSalePriceFrom.ToString());
            parameters.Add(key: "equipmentSalePriceTo", value: (equipmentSalePriceTo == null) ? null : equipmentSalePriceTo.ToString());
            parameters.Add(key: "auctionEndDateFrom", value: (auctionEndDateFrom == null)? null : String.Format("{0:dd/MMM/yy}", auctionEndDateFrom));
            parameters.Add(key: "auctionEndDateTo", value: (auctionEndDateTo == null) ? null : String.Format("{0:dd/MMM/yy}", auctionEndDateTo));
            parameters.Add(key: "equipmentDescription", value: equipmentDescription);
            parameters.Add(key: "equipmentAddress", value: equipmentAddress);
            parameters.Add(key: "equipmentQuality", value: equipmentQuality.ToString());
            parameters.Add(key: "saleStage", value: saleStage.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

    }
}