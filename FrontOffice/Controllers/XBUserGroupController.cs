using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbm = FrontOffice.XBManagement;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class XBUserGroupController : Controller
    {
        public ActionResult SaveXBUserGroup(xbm.XBUserGroup group)
        {
            xbm.ActionResult result = new xbm.ActionResult();
            result = XBManagementService.SaveXBUserGroup(group);
            if (result.ResultCode == xbm.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);
        }

       
        public ActionResult XBUserGroup()
        {
            return PartialView("XBUserGroup");
        }

        public ActionResult XBUserGroups()
        {
            return PartialView("XBUserGroups");
        }

        public ActionResult XBUserGroupRemove()
        {
            return PartialView("XBUserGroupRemove");
        }

        public JsonResult GetXBUserGroups()
        {
            return Json(XBManagementService.GetXBUserGroups(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult RemoveXBUserGroup(xbm.XBUserGroup group)
        {
            xbm.ActionResult result = new xbm.ActionResult();
            result = XBManagementService.RemoveXBUserGroup(group);
            if (result.ResultCode == xbm.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);
        }


        public ActionResult XBUsersSet()
        {
            return PartialView("XBUsersSet");
        }

      
    }
}