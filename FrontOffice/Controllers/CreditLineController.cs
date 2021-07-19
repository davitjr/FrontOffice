using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.Web.UI;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CreditLineController : Controller
    {
        public ActionResult CreditLineDetails()
        {
            return View("CreditLineDetails");
        }


        public JsonResult GetCreditLines(int filter)
        {
            return Json(XBService.GetCreditLines((XBS.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);

        }

        [ProductDetailsAccesibleFilter]
        public JsonResult GetCreditLine(ulong productId)
        {
            XBS.CreditLine creditLine = XBService.GetCreditLine(productId);
            ViewBag.accountGroup = creditLine.LoanAccount.AccountPermissionGroup;
            creditLine.PetTurq = XBService.GetPetTurk((long)productId);
            creditLine.ExchangeRate = XBService.GetCBKursForDate(XBService.GetCurrentOperDay(), creditLine.Currency);
            return Json(creditLine, JsonRequestBehavior.AllowGet);
        }

        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult CreditLines()
        {
            return PartialView("CreditLines");
        }

        public JsonResult GetCreditLineGrafik(XBS.CreditLine creditline)
        {
            return Json(XBService.GetCreditLineGrafik(creditline), JsonRequestBehavior.AllowGet);
        }


        public ActionResult CreditLineGrafik()
        {
            return PartialView("CreditLineGrafik");
        }

        public void GetCreditLineGrafikApplication(string loanFullNumber, DateTime startDate)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customer_number", value: customerNumber.ToString());
            parameters.Add(key: "loan_full_number", value: loanFullNumber);
            parameters.Add(key: "date_of_beginning", value: startDate.Date.ToString("dd/MMM/yy"));
            //parameters.Add(key: "set_date", value: DateTime.Today.Date.ToString("dd/MMM/yy"));
            parameters.Add(key: "Language_id", value: "0");
            //parameters.Add(key: "CustomerName", value: Utility.ConvertAnsiToUnicode(ACBAOperationService.GetCustomerDescription(customerNumber)));

            ReportService.GetCreditLineGrafikApplication(parameters);
        }

        public ActionResult CreditLineTerminationOrderDetails()
        {
            return PartialView("CreditLineTerminationOrderDetails");
        }

        [ActionAccessFilter(actionType = ActionType.CardCreditLineTerminationOrderSave)]
        public JsonResult SaveCreditLineTerminationOrder(ulong productId)
        {
            xbs.CreditLineTerminationOrder order = new xbs.CreditLineTerminationOrder();
            order.ProductId = productId;
            order.Type = xbs.OrderType.CreditLineMature;
            order.RegistrationDate = DateTime.Now.Date;
            order.OperationDate = XBService.GetCurrentOperDay();
            return Json(XBService.SaveCreditLineTerminationOrder(order), JsonRequestBehavior.AllowGet);
        }

        public void GetCreditLineTerminationApplication(string cardNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "cardNumber", value: cardNumber);
            ReportService.GetCreditLineTerminationApplication(parameters);
        }

        public ActionResult ClosedCreditLines()
        {
            return PartialView("ClosedCreditLines");
        }

        public JsonResult GetCardClosedCreditLines(string cardNumber)
        {
            return Json(XBService.GetCardClosedCreditLines(cardNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCreditLineMainContract()
        {
            return Json(XBService.GetCreditLineMainContract(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetCreditLineTerminationOrder(long orderID)
        {
            return Json(XBService.GetCreditLineTerminationOrder(orderID), JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetClosedCreditLine(ulong productId)
        {
            XBS.CreditLine creditLine = XBService.GetClosedCreditLine(productId);
            creditLine.PetTurq = XBService.GetPetTurk((long)productId);
            creditLine.ExchangeRate = XBService.GetCBKursForDate(XBService.GetCurrentOperDay(), creditLine.Currency);
            return Json(creditLine, JsonRequestBehavior.AllowGet);
        }

        public ActionResult DecreaseLoanGrafik()
        {
            return PartialView("DecreaseLoanGrafik");
        }

        public JsonResult GetDecreaseLoanGrafik(XBS.CreditLine creditLine)
        {
            return Json(XBService.GetDecreaseLoanGrafik(creditLine), JsonRequestBehavior.AllowGet);
        }
        public ActionResult CreditLineDebt()
        {
            return PartialView("CreditLineDebt");
        }

        public JsonResult GetCardsCreditLines(int filter)
        {
            return Json(XBService.GetCardsCreditLines((XBS.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);

        }

        public bool IsCreditLineActivateOnApiGate(long orderId)
        {
            return XBService.IsCreditLineActivateOnApiGate(orderId);
        }

        public void GetCreditLineOrderReport(xbs.SearchOrders searchParams)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            parameters.Add(key: "startDate", value: (searchParams.DateFrom == null) ? null : String.Format("{0:dd/MMM/yy}", searchParams.DateFrom));
            parameters.Add(key: "endDate", value: (searchParams.DateTo == null) ? null : String.Format("{0:dd/MMM/yy}", searchParams.DateTo));
            parameters.Add(key: "id", value: searchParams.Id.ToString());
            parameters.Add(key: "quality", value: ((short)searchParams.OrderQuality).ToString());
            parameters.Add(key: "setNumber", value: searchParams.RegisteredUserID.ToString());
            parameters.Add(key: "customerNumber", value: searchParams.CustomerNumber.ToString());
            parameters.Add(key: "operationFilialCode", value: currentUser.filialCode.ToString());
            parameters.Add(key: "documentType", value: ((short)searchParams.Type).ToString());

            if ((short)searchParams.Type == 74)
                ReportService.GetCreditLineOrderReport(parameters);

            else if ((short)searchParams.Type == 21)
                ReportService.GetClosedCreditLineOrderReport(parameters);

            else
                ReportService.GetProlongCreditLineOrderReport(parameters);
        }
    }
}