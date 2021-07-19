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
    public class RemittanceAmendmentOrderController : Controller
    {
        public ActionResult RemittanceAmendmentOrder()
        {
            return PartialView("RemittanceAmendmentOrder");
        }

        public ActionResult RemittanceAmendmentOrderDetails()
        {
            return View("RemittanceAmendmentOrderDetails");
        }

        public ActionResult SaveRemittanceAmendmentOrder(xbs.RemittanceAmendmentOrder order)
        {
            order.Type = xbs.OrderType.RemittanceAmendmentOrder;
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveRemittanceAmendmentOrder(order, authorizedUserSessionToken);
            return Json(result);
        }

        public JsonResult GetRemittanceAmendmentOrder(long orderId)
        {
            xbs.RemittanceAmendmentOrder order = XBService.GetRemittanceAmendmentOrder(orderId);
            return Json(order, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ApproveRemittanceAmendmentOrder(long orderId)
        {
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.ApproveRemittanceAmendmentOrder(orderId, authorizedUserSessionToken);
            return Json(result);
        }

        public void GetRemittanceAmendmentApplication(xbs.RemittanceAmendmentOrder order, string recipient)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            xbs.Transfer transfer = new xbs.Transfer();
            transfer = XBService.GetTransfer(order.Transfer.Id);
            int transfersCount = XBService.GetRemittanceAmendmentCount(order.Transfer.Id);
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            //Ստացողի բջջ. համար, ուղարկողի երկիր
            parameters = XBService.GetRemittanceContractDetails(Convert.ToUInt64(transfer.AddTableUnicNumber), authorizedUserSessionToken);
            parameters.Remove("countryName");
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "senderFullName", value: Utility.ConvertAnsiToUnicode(transfer.Sender));
            parameters.Add(key: "sendDate", value: transfer.ConfirmationDate != null ? String.Format(CultureInfo.InvariantCulture, "{0:dd/MM/yyyy}", (DateTime)transfer.ConfirmationDate) : "");
            parameters.Add(key: "URN", value: transfer.Code);
            parameters.Add(key: "amount", value: transfer.Amount.ToString());
            parameters.Add(key: "currency", value: transfer.Currency);

            parameters.Add(key: "beforeBeneLastName", value: order.BeforeBeneLastName);
            parameters.Add(key: "beforeBeneFirstName", value: order.BeforeBeneFirstName);
            parameters.Add(key: "beforeBeneMiddleName", value: order.BeforeBeneMiddleName);
            parameters.Add(key: "beneficiaryLastName", value: order.BeneficiaryLastName);
            parameters.Add(key: "beneficiaryFirstName", value: order.BeneficiaryFirstName);
            parameters.Add(key: "beneficiaryMiddleName", value: order.BeneficiaryMiddleName);


            parameters.Add(key: "beforeNATBeneficiaryLastName", value: order.BeforeNATBeneficiaryLastName);
            parameters.Add(key: "beforeNATBeneficiaryFirstName", value: order.BeforeNATBeneficiaryFirstName);
            parameters.Add(key: "beforeNATBeneficiaryMiddleName", value: order.BeforeNATBeneficiaryMiddleName);
            parameters.Add(key: "nATBeneficiaryLastName", value: order.NATBeneficiaryLastName);
            parameters.Add(key: "nATBeneficiaryFirstName", value: order.NATBeneficiaryFirstName);
            parameters.Add(key: "nATBeneficiaryMiddleName", value: order.NATBeneficiaryMiddleName);


            parameters.Add(key: "sendDateHour", value: transfer.ConfirmationTime != null ? ((TimeSpan)transfer.ConfirmationTime).ToString(@"hh\:mm") : "");
            parameters.Add(key: "recipientCountry", value: transfer.CountryName); //Ստացողի երկիր
            parameters.Add(key: "recipient", value: recipient); //Փոփոխման  պատճառը
            parameters.Add(key: "recipientCount", value: transfersCount.ToString()); //Փոփոխությունների քանակը
            parameters.Add(key: "source", value: transfer.TransferSystemDescription); //համակարգ


            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            Cashier cashier = ACBAOperationService.GetCashier((uint)currentUser.userID);
            parameters.Add(key: "setUserFullName", value: Utility.ConvertAnsiToUnicode(cashier.firstName + " " + cashier.lastName));


            ContractService.RemittanceAmendmentApplication(parameters);
        }
    
    }
}