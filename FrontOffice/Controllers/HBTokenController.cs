using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbsManagement = FrontOffice.XBManagement;
using xbs = FrontOffice.XBS;
using System.Web.SessionState; 

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class HBTokenController : Controller
    {
        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult GetHBTokens(int HBUserID, xbsManagement.ProductQualityFilter filter)
        {
            return Json(XBManagementService.GetHBTokens(HBUserID,  filter), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PersonalHBTokenOrder()
        {
            return PartialView("PersonalHBTokenOrder");
        }

        public JsonResult GetHBTokenNumbers(xbsManagement.HBTokenTypes tokenType)
        {
            return Json(XBManagementService.GetHBTokenNumbers(tokenType), JsonRequestBehavior.AllowGet);
        }
        public JsonResult CancelTokenNumberReservation(xbsManagement.HBToken token)
        {
            return Json(XBManagementService.CancelTokenNumberReservation(token), JsonRequestBehavior.AllowGet);
        }

        public Double GetTokenServiceFee(DateTime opDate, xbsManagement.HBTokenTypes tokenType, xbsManagement.HBTokenSubType tokenSubType)
        {
            return XBManagementService.GetTokenServiceFee(opDate,xbsManagement.HBServiceFeeRequestTypes.NewToken , tokenType, tokenSubType);
        }

        public Double GetEntryDataPermissionServiceFee()
        {
            return XBManagementService.GetEntryDataPermissionServiceFee(xbsManagement.HBServiceFeeRequestTypes.AllowDataEntryPermission);
        }
        public String GetHBTokenGID(int hbuserID, xbsManagement.HBTokenTypes tokenType)
        {
            return XBManagementService.GetHBTokenGID(hbuserID, tokenType);
        }

        public ActionResult HBRegistrationCodeResendOrder()
        {
            return PartialView("HBRegistrationCodeResendOrder");
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult SaveHBRegistrationCodeResendOrder(xbsManagement.HBRegistrationCodeResendOrder order)
        {
            XBManagement.ActionResult result = XBManagementService.SaveHBRegistrationCodeResendOrder(order);
            return Json(result);
        }
    }
}