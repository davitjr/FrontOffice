using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbsManagement = FrontOffice.XBManagement;
using System.Web.SessionState;
using System.Configuration;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)] 
    public class HBServletRequestOrderController : Controller
    {
        public ActionResult SaveHBServletTokenUnBlockOrder(xbsManagement.HBServletRequestOrder order)
        {

            xbsManagement.ActionResult result = new xbsManagement.ActionResult()
            {
                Errors = new List<xbsManagement.ActionError>()
            }; 
            order.ServletAction = xbsManagement.HBServletAction.UnlockToken;
            ulong  customerNumber = XBService.GetAuthorizedCustomerNumber();
            byte customerType = ACBAOperationService.GetCustomerType(customerNumber);
            if (customerType != 6  ||  order.HBtoken.HBUser.IsCas == true)
            {
                result = XBManagementService.SaveAndApproveHBServletRequestOrder(order);
            }
            else
            {
                result.ResultCode = xbsManagement.ResultCode.ValidationError;
                result.Errors.Add(new xbsManagement.ActionError() { Description = "Ֆիզիկական անձանց հնարավոր չէ կատարել ապաբլոկավորում, տրամադրեք ACBA DIGITAL-ի նոր տոկեն" });
            }
           return Json(result);
        }
        public ActionResult SaveHBServletUserUnlockOrder(xbsManagement.HBServletRequestOrder order)
        {

            xbsManagement.ActionResult result = new xbsManagement.ActionResult();
            order.ServletAction = xbsManagement.HBServletAction.UnlockUser;       
            result = XBManagementService.SaveAndApproveHBServletRequestOrder(order);
            if (result.ResultCode == xbsManagement.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult SaveHBServletTokenActivationOrder(xbsManagement.HBServletRequestOrder order)
         {

            xbsManagement.ActionResult result = new xbsManagement.ActionResult();
            order.ServletAction = xbsManagement.HBServletAction.ActivateToken;
            result = XBManagementService.SaveAndApproveHBServletRequestOrder(order);
            if (result.ResultCode == xbsManagement.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult SaveHBServletTokenDeactivationOrder(xbsManagement.HBServletRequestOrder order)
        {

            xbsManagement.ActionResult result = new xbsManagement.ActionResult();
            order.ServletAction = xbsManagement.HBServletAction.DeactivateToken;
            result = XBManagementService.SaveAndApproveHBServletRequestOrder(order);
            if (result.ResultCode == xbsManagement.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult SaveHBServletUserDeactivationOrder(xbsManagement.HBServletRequestOrder order)
        {

            xbsManagement.ActionResult result = new xbsManagement.ActionResult();
            order.ServletAction = xbsManagement.HBServletAction.DeactivateUser;
            result = XBManagementService.SaveAndApproveHBServletRequestOrder(order);
            if (result.ResultCode == xbsManagement.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);
        }
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult PersonalHBTokenUnBlockOrder()
        {
            return PartialView("PersonalHBTokenUnBlockOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.HBTokenPINCodeShow)]
        public ActionResult PersonalHBServletOrder()
        {
            return PartialView("PersonalHBServletOrder");
        }

        public JsonResult GetHBServletRequestOrder(long orderId)
        { 
            return Json(XBManagementService.GetHBServletRequestOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBServletRequestOrderDetails()
        {
            return PartialView("HBServletRequestOrderDetails");
        }

        /// <summary>
        /// Տոկենի PIN  կոդի ցուցադրում
        /// </summary>
        /// <param name="order"></param>
        /// <returns></returns> 
        //[ActionAccessFilter(actionType = ActionType.HBTokenPINCodeShow)]
        public ActionResult SaveHBServletShowPINCode(xbsManagement.HBServletRequestOrder order)
        {
            xbsManagement.ActionResult result = new xbsManagement.ActionResult();
            order.ServletAction = xbsManagement.HBServletAction.ShowPINCode;
            result = XBManagementService.SaveAndApproveHBServletRequestOrder(order);
            if (result.ResultCode == xbsManagement.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);
        }
        /// <summary>
        /// Գաղտնաբառի զրոյացում և ուղարկում էլեկտրոնային հասցեին
        /// </summary>
        /// <param name="order"></param>
        /// <returns></returns> 
        public ActionResult SaveHBUserPasswordResetManually(xbsManagement.HBServletRequestOrder order)
        {

            xbsManagement.ActionResult result = new xbsManagement.ActionResult();
            order.ServletAction = xbsManagement.HBServletAction.ResetUserPasswordManually;
            result = XBManagementService.SaveAndApproveHBServletRequestOrder(order);
            if (result.ResultCode == xbsManagement.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);
        }

       public ActionResult MigrateOldUserToCas(int userId)
        {
            XBS.ActionResult result = new XBS.ActionResult();
            if (!bool.Parse(ConfigurationManager.AppSettings["EnabledOldMobileCompatibility"]))
            {
                result = XBService.MigrateOldUserToCas(userId);
            }
            return Json(result);
        }
    }

}