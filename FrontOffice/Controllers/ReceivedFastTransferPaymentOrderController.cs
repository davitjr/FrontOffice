using FrontOffice.Service;
using FrontOffice.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class ReceivedFastTransferPaymentOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult ReceivedFastTransferPaymentOrder()
        {
            return PartialView("ReceivedFastTransferPaymentOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.FastTransferOrderSave)]
        public ActionResult SaveReceivedFastTransferPaymentOrder(xbs.ReceivedFastTransferPaymentOrder order, bool confirm = false, byte isCallCenter = 0)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result.Errors = new List<xbs.ActionError>();

            if (!confirm)
            {
                bool IsExisting = XBService.IsExistingTransferByCall(order.SubType, order.Code, 0);
                if (IsExisting)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Գոյություն ունի տվյալ համակարգի նույն հսկիչ համարով փոխանցում";

                    if (order.SubType == 18)
                        result.ResultCode = xbs.ResultCode.Warning;
                    else
                        result.ResultCode = xbs.ResultCode.ValidationError;
                    result.Errors.Add(error);

                    if (order.SubType != 18)
                        return Json(result);

                }
                if (isCallCenter == 1)
                {
                    List<string> documentWarnings = XBService.GetCustomerDocumentWarnings(order.CustomerNumber);
                    if (documentWarnings.Count != 0)
                    {
                        xbs.ActionError error = new xbs.ActionError();
                        error.Code = 599;
                        error.Description = documentWarnings.First();
                        result.ResultCode = xbs.ResultCode.Warning;
                        result.Errors.Add(error);
                    }

                }

                if (result.Errors.Count > 0)
                    return Json(result);
            }
            order.Quality = xbs.OrderQuality.Draft;
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            if (order.SubType == 23)
            {
                if (!String.IsNullOrEmpty(order.BeneficiaryBirthDate))
                {
                    order.BeneficiaryBirthDate = order.BeneficiaryBirthDate.Substring(0, 10).Replace("-", "");
                }
            }

            result = XBService.SaveReceivedFastTransferPaymentOrder(order, authorizedUserSessionToken);


            return Json(result);//must return error view
        }




        public JsonResult GetReceivedFastTransferPaymentOrder(long orderID)
        {
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();
            return Json(XBService.GetReceivedFastTransferPaymentOrder(orderID, authorizedUserSessionToken), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFastTransferAcbaCommisionType(byte transferType, string code)
        {
            return Json(XBService.GetFastTransferAcbaCommisionType(transferType, code), JsonRequestBehavior.AllowGet);
        }


        public ActionResult ReceivedFastTransferPaymentOrderDetails()
        {
            return PartialView("ReceivedFastTransferPaymentOrderDetails");
        }

        public JsonResult GetReceivedFastTransferFeePercent(byte transferType, string code = "", string countryCode = "", double amount = 0, string currency = "", DateTime date = new DateTime())
        {
            return Json(XBService.GetReceivedFastTransferFeePercent(transferType, code, countryCode, amount, currency, date), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ReceivedFastTransferReject()
        {
            return PartialView("ReceivedFastTransferReject");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult ARUSReceivedFastTransferOrder()
        {
            return PartialView("ARUSReceivedFastTransferOrder");
        }

    }
}