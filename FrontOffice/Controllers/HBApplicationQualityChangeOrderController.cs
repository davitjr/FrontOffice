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
    public class HBApplicationQualityChangeOrderController : Controller
    {
        public ActionResult SaveHBApplicationQualityChangeOrder(xbsManagement.HBApplicationQualityChangeOrder order)
        { 
          
            xbsManagement.ActionResult result = new xbsManagement.ActionResult();
            result = XBManagementService.SaveAndApproveHBApplicationQualityChangeOrder(order);
            if (result.ResultCode == xbsManagement.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult PersonalHBApplicationQualityChangeOrder()                                        
        {
            return PartialView("PersonalHBApplicationQualityChangeOrder");
        }


      

        public JsonResult GetHBApplicationQualityChangeOrder(long orderId)
        {
            return Json(XBManagementService.GetHBApplicationQualityChangeOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBApplicationQualityChangeOrderDetails()
        {
            return PartialView("HBApplicationQualityChangeOrderDetails");
        }

    }

}