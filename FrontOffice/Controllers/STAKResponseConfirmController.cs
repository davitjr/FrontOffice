using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class STAKResponseConfirmController : Controller
    {
        public ActionResult ResponseConfirmForSTAK(string docID)
        {
            xbs.STAKResponseConfirm input = new xbs.STAKResponseConfirm() { TransactionCode = docID };

            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            xbs.ActionResult result = XBService.ResponseConfirmForSTAK(input, authorizedUserSessionToken);

            if (result.ResultCode == xbs.ResultCode.Normal)
            {
                return Json(result); 
                //return Json("JSGHDJSHF", JsonRequestBehavior.AllowGet);

            }
            else
            {
                //return Json(result);
                //xbs.ActionError error = new xbs.ActionError();
                //error.Code = 599;
                //error.Description = "askjdkashjfd";
                //result.Errors = new List<xbs.ActionError>();
                //result.ResultCode = xbs.ResultCode.Failed;
                //result.Errors.Add(error);

                return Json(result);
            }

            //[TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
            //[ActionAccessFilter(actionType = ActionType.FastTransferOrderSave)]



            //return Json(result);
        }


    }
}