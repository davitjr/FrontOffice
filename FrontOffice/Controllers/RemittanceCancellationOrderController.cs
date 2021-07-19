using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using FrontOffice.ACBAServiceReference;
using System.Globalization;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class RemittanceCancellationOrderController : Controller
    {
        public ActionResult RemittanceCancellationOrder()
        {
            return PartialView("RemittanceCancellationOrder");
        }

        public ActionResult RemittanceCancellationOrderDetails()
        {
            return View("RemittanceCancellationOrderDetails");
        }

        public ActionResult SaveRemittanceCancellationOrder(xbs.RemittanceCancellationOrder order)
        {
            order.Type = xbs.OrderType.RemittanceCancellationOrder;
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveRemittanceCancellationOrder(order, authorizedUserSessionToken);
            return Json(result);

        }

        public ActionResult ApproveRemittanceCancellationOrder(long orderId)
        {
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.ApproveRemittanceCancellationOrder(orderId, authorizedUserSessionToken);
            return Json(result);
        }

        public JsonResult GetRemittanceCancellationOrder(long orderId)
        {
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            xbs.RemittanceCancellationOrder order = XBService.GetRemittanceCancellationOrder(orderId, authorizedUserSessionToken);
            return Json(order, JsonRequestBehavior.AllowGet);
        }

        public void GetRemittanceSendCancellationApplication(xbs.RemittanceCancellationOrder order)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            xbs.Transfer transfer = new xbs.Transfer();
            transfer = XBService.GetTransfer(order.Transfer.Id);
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            //Ստացողի բջջ. համար, ուղարկողի երկիր
            parameters = XBService.GetRemittanceContractDetails(Convert.ToUInt64(transfer.AddTableUnicNumber), authorizedUserSessionToken);
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "senderFullName", value: Utility.ConvertAnsiToUnicode(transfer.Sender));
            parameters.Add(key: "sendDate", value: transfer.ConfirmationDate != null ? ((DateTime)transfer.ConfirmationDate).ToString("dd/MM/yyyy") : "");
            parameters.Add(key: "URN", value: transfer.Code);
            parameters.Add(key: "amount", value: transfer.Amount.ToString());
            parameters.Add(key: "currency", value: transfer.Currency);


            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            Cashier cashier = ACBAOperationService.GetCashier((uint)currentUser.userID);
            parameters.Add(key: "setUserFullName", value: Utility.ConvertAnsiToUnicode(cashier.firstName + " " + cashier.lastName));

            parameters.Add(key: "sendDateHour", value: transfer.ConfirmationTime != null ? ((TimeSpan)transfer.ConfirmationTime).ToString(@"hh\:mm") : "");

            parameters.Add(key: "source", value: transfer.TransferSystemDescription); //համակարգ
            parameters.Add(key: "receiver", value: transfer.Receiver); //Ստացող
            parameters.Add(key: "recipientCountry", value: transfer.CountryName); //Ստացողի երկիր
            parameters.Add(key: "cancellationReason", value: order.CancellationReversalCodeName); //Չեղարկման կամ վերադարձի պատճառը
            parameters.Add(key: "returnableAmountAndCurrency", value: order.PrincipalAmount + " " + transfer.Currency); //Վերադարձվող գումարը, արժույթը
            parameters.Add(key: "returnableCommissionAndCurrency", value: order.AMDFee + " " + "AMD"); //Վերադարձվող միջնորդավճարը, արժույթը

            parameters.Add(key: "code", value: transfer.Code);

            ContractService.RemittanceSendCancellationApplication(parameters);
        }
    }
}