using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.IO;
using System.Xml.Serialization;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net;
using FrontOffice.XBS;
using ActionResult = System.Web.Mvc.ActionResult;
using FrontOffice.XBManagement;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]

    public class DepositaryAccountOrderController : Controller
    {
        public ActionResult DepositaryAccountOrder()
        {
            return PartialView("DepositaryAccountOrder");
        }

        public ActionResult DepositaryNewAccountOrder()
        {
            return PartialView("DepositaryNewAccountOrder");
        }

        [ActionAccessFilter(actionType = ActionType.DepositaryAccountOrderSave)]
        public async Task<ActionResult> SaveDepositaryAccountOrder(xbs.DepositaryAccountOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult() { ResultCode = xbs.ResultCode.Normal, Errors = new List<xbs.ActionError>() };
            DepositoryAccountSaveModel depositoryAccountSaveModel = new DepositoryAccountSaveModel
            {
                order = order,
                fromBondOrder = false
            };

            result = await DepositaryService.SaveDepositaryAccountOrderWithAccountCheck(depositoryAccountSaveModel);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDepositaryAccountOrder(int id)
        {
            return Json(XBService.GetDepositaryAccountOrder(id), JsonRequestBehavior.AllowGet);
        }

        public ActionResult DepositaryAccountOrderDetails()
        {
            return PartialView("DepositaryAccountOrderDetails");
        }

    }
}