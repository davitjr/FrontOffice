using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using System.Web.SessionState;
using System.Web.UI;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class PeriodicTransferController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache" )]
        // GET: PeriodicTransfer
        public ActionResult PeriodicTransfers()
        {
            return PartialView("PeriodicTransfers");
        }

        public ActionResult PeriodicTransferDetails()
        {
            return View("PeriodicTransferDetails");
        }

        // GET: /Periodic Transfers/
        public JsonResult GetPeriodicTransfers(int filter)
        {
            var jsonResult = Json(XBService.GetPeriodicTransfers((XBS.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public JsonResult GetPeriodicTransfer(ulong productId)
        {
            return Json(XBService.GetPeriodicTransfer(productId), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetTransfersHistory(long ProductId, DateTime dateFrom, DateTime dateTo)
        {
            return Json(XBService.GetTransfersHistory(ProductId, dateFrom, dateTo), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PeriodicTransfersHistory()
        {
            return PartialView("PeriodicTransfersHistory");
        }

        public JsonResult GetPeriodicTransferDetails(ulong productId)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "app_ID", value: productId.ToString());
            parameters.Add(key: "edit", value: "false");

            return Json(parameters, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetPeriodicSWIFTStatementTransferDetails(ulong productId)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "app_ID", value: productId.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPeriodicTransferClosingDetails(ulong productId)
        {
            string guid = Utility.GetSessionId();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "app_ID", value: productId.ToString());
            parameters.Add(key: "filialcode", value: ((XBS.User)Session[guid+"_User"]).filialCode.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.PeriodicTransferSuspensionOrderSave)]
        public JsonResult SavePeriodicTerminationOrder(XBS.PeriodicTerminationOrder order)
        {
            return Json(XBService.SavePeriodicTerminationOrder(order));
        }

        public JsonResult GetPeriodicTerminationOrder(long orderId)
        {
            return Json(XBService.GetPeriodicTerminationOrder(orderId));
        }

        public ActionResult PeriodicTerminationOrderDetails()
        {
            return PartialView("PeriodicTerminationOrderDetails");
        }

        public ActionResult PersonalPeriodicTerminationOrder()
        {
            return PartialView("PersonalPeriodicTerminationOrder");
        }


    }
}