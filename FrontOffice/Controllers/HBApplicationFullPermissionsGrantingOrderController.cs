using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbsManagement = FrontOffice.XBManagement;
using System.Web.SessionState;


namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
    public class HBApplicationFullPermissionsGrantingOrderController : Controller
    {
        public ActionResult SaveHBApplicationFullPermissionsGrantingOrder(xbsManagement.HBApplicationFullPermissionsGrantingOrder order)
        {

            xbsManagement.ActionResult result = new xbsManagement.ActionResult();
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            short customerQuality = ACBAOperationService.GetCustomerQuality(customerNumber);

            if (customerQuality != 1)
            {
                xbsManagement.ActionError error = new xbsManagement.ActionError();
                error.Code = 599;
                error.Description = "Ուշադրություն! Լիարժեք հասանելիություններ ստանալու համար Օգտագործողը պետք է ունենա «Հաճախորդ» կարգավիճակ։";
                result.Errors = new List<xbsManagement.ActionError>();
                result.Errors.Add(error);
                result.ResultCode = xbsManagement.ResultCode.ValidationError;
                return Json(result);

            }

            result = XBManagementService.SaveAndApproveHBApplicationFullPermissionsGrantingOrder(order);
            return Json(result);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBApplicationFullPermissionsGrantingOrder()
        {
            return PartialView("HBApplicationFullPermissionsGrantingOrder");
        }




        public JsonResult GetHBApplicationFullPermissionsGrantingOrder(long orderId)
        {
            return Json(XBManagementService.GetHBApplicationFullPermissionsGrantingOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBApplicationFullPermissionsGrantingOrderDetails()
        {
            return PartialView("HBApplicationFullPermissionsGrantingOrderDetails");
        }

    }

}