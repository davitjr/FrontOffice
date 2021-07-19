using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.Configuration;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class ReferenceOrderController : Controller
    {
        public JsonResult GetReferenceOrder(int orderId)
        {

            return Json(XBService.GetReferenceOrder(orderId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PersonalReferenceOrder()
        {
            return PartialView("PersonalReferenceOrder");
        }
        public ActionResult ReferenceOrderDetails()
        {
            return PartialView("ReferenceOrderDetails");
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.RequestForReferenceOrderSave)]
        public ActionResult SaveReferenceOrder(xbs.ReferenceOrder reference)
        {
            reference.Type = xbs.OrderType.ReferenceOrder;
            xbs.ActionResult result = XBService.SaveReferenceOrder(reference);
            return Json(result);
        }
        public JsonResult GetFeeAccounts()
        {
            return Json(XBService.GetCurrentAccounts(xbs.ProductQualityFilter.Opened), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOrderServiceFee(xbs.OrderType type, int urgent)
        {
            return Json(XBService.GetOrderServiceFee(type, urgent));
        }

        public JsonResult GetAllAccounts()
        {
            return Json(XBService.GetReferenceOrderAccounts(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetReceiveDate(ushort urgent)
        {
            DateTime receiveDate;
            if (urgent == 1)
            {
                receiveDate = XBService.GetCurrentOperDay();
            }
            else
            {
                receiveDate = XBService.GetCurrentOperDay();
                receiveDate = receiveDate.AddDays(1);
                while (InfoService.IsWorkingDay(receiveDate) != true)
                {
                    receiveDate = receiveDate.AddDays(1);
                }
            }

            return Json(receiveDate, JsonRequestBehavior.AllowGet);
        }

        public void ReferenceApplication(xbs.ReferenceOrder reference)
        {
            string referenceTypes = String.Empty;
            foreach (ushort refType in reference.ReferenceTypes)
            {
                referenceTypes += refType + ", ";
            }

            if (referenceTypes.Length > 0 && referenceTypes[referenceTypes.Length - 2].Equals(','))
            {
                referenceTypes = referenceTypes.Remove(referenceTypes.Length - 2, 1);
            }

            string currentAccounts = String.Empty;

            if (reference.Accounts != null)
            {
                foreach (xbs.Account account in reference.Accounts)
                {
                    if (account.AccountType == 10)
                    {
                        currentAccounts += account.AccountNumber + " " + account.Currency + ", ";
                    }
                }
            }
            if (currentAccounts.Length > 0 && currentAccounts[currentAccounts.Length - 2].Equals(','))
            {
                currentAccounts = currentAccounts.Remove(currentAccounts.Length - 2, 1);
            }

            string cardNumbers = String.Empty;
            if (reference.Accounts != null)
            {
                foreach (xbs.Account account in reference.Accounts)
                {
                    if (account.AccountType == 11)
                    {
                        cardNumbers += account.AccountDescription.Split(' ')[0] + " " + account.Currency + ", ";
                    }
                }
            }
            if (cardNumbers.Length > 0 && cardNumbers[cardNumbers.Length - 2].Equals(','))
            {
                cardNumbers = cardNumbers.Remove(cardNumbers.Length - 2, 1);
            }

            string depositAccounts = String.Empty;
            if (reference.Accounts != null)
            {
                foreach (xbs.Account account in reference.Accounts)
                {
                    if (account.AccountType == 13)
                    {
                        depositAccounts += account.AccountNumber + " " + account.Currency + ", ";
                    }
                }
            }
            if (depositAccounts.Length > 0 && depositAccounts[depositAccounts.Length - 2].Equals(','))
            {
                depositAccounts = depositAccounts.Remove(depositAccounts.Length - 2, 1);
            }
            if (reference.ReferenceFor == null)
                reference.ReferenceFor = String.Empty;

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "CustomerNumber", value: XBService.GetAuthorizedCustomerNumber().ToString());
            parameters.Add(key: "FilialCode", value: reference.ReferenceFilial.ToString());
            parameters.Add(key: "ReferenceLanguageID", value: reference.ReferenceLanguage.ToString());
            parameters.Add(key: "RegistrationDate", value: reference.RegistrationDate.ToString("dd/MMM/yy"));

            parameters.Add(key: "referenceReceiptOrder", value: ((int)reference.ReferenceReceiptType).ToString());

            if ((int)reference.ReferenceReceiptType == 3)
            {
                parameters.Add(key: "passportDetails", value: reference.PassportDetails.ToString());
                parameters.Add(key: "phoneNumber", value: reference.PhoneNumber.ToString());
                parameters.Add(key: "fullDeliveryAddress", value: reference.FullDeliveryAddress.ToString());
            }


            if (reference.ReferenceTypes.Contains(3) && reference.DateFrom != null && reference.DateTo != null)
            {
                parameters.Add(key: "startDate", value: ((DateTime)reference.DateFrom).ToString("dd/MM/yyyy"));
                parameters.Add(key: "endDate", value: ((DateTime)reference.DateTo).ToString("dd/MM/yyyy"));
            }
            parameters.Add(key: "referenceTypeIdCondintion", value: referenceTypes);
            parameters.Add(key: "CurrentAccounts", value: currentAccounts);
            parameters.Add(key: "PaymentCardAccounts", value: cardNumbers); //փոխանցվում է քարտի համարը
            parameters.Add(key: "DepositeAccounts", value: depositAccounts);
            parameters.Add(key: "OtherTypeDescription", value: reference.OtherTypeDescription == null ? String.Empty : Utility.ConvertUnicodeToAnsi(reference.OtherTypeDescription));
            parameters.Add(key: "OtherRequisites", value: reference.OtherRequisites == null ? String.Empty : Utility.ConvertUnicodeToAnsi(reference.OtherRequisites));
            parameters.Add(key: "SubmitPlace", value: reference.ReferenceEmbasy == 27 ? Utility.ConvertUnicodeToAnsi("Այլ` " + reference.ReferenceFor) : Utility.ConvertUnicodeToAnsi(InfoService.GetEmbassyList(reference.ReferenceTypes)[reference.ReferenceEmbasy.ToString()]));

            ContractService.ReferenceApplication(parameters);
        }

        public JsonResult GetOrderServiceFeeByIndex(int indexID)
        {
            return Json(XBService.GetOrderServiceFeeByIndex(indexID));
        }

    }
}