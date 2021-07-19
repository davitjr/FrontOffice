using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class LoanProductOrderController : Controller
    {

        [TransactionPermissionFilterAttribute]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        [SMSAuthorizationFilter] 
        public ActionResult SaveLoanProductOrder(xbs.LoanProductOrder order,bool confirm=false)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            if (order.Currency != order.ProvisionCurrency && !confirm && order.Type!=xbs.OrderType.FastOverdraftApplication)
            {

                xbs.ActionError error = new xbs.ActionError();

                error.Code = 599;
                error.Description = "Դրամական միջոցների գրավի արժույթը չի համապատասխանում վարկի արժույթին:";
                result.Errors = new List<xbs.ActionError>();
                result.Errors.Add(error);
                result.ResultCode = xbs.ResultCode.Warning;
                return Json(result);

            }
            result = XBService.SaveLoanProductOrder(order);
            return Json(result);
        }


        [TransactionPermissionFilterAttribute]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveLoanApplicationOrder(xbs.LoanProductOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveLoanProductOrder(order);
            return Json(result);
        }


        public ActionResult PersonalLoanProductOrder()
        {
            return PartialView("PersonalLoanProductOrder");
        }

        public JsonResult GetLoanOrder(long orderId)
        {
            return Json(XBService.GetLoanOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCreditLineOrder(long orderId)
        {
            return Json(XBService.GetCreditLineOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LoanOrderDetails()
        {
            return PartialView("LoanOrderDetails");
        }

        public ActionResult CreditLineOrderDetails()
        {
            return PartialView("CreditLineOrderDetails");
        }

        public JsonResult GetCustomerAvailableAmount(string currency)
        {
            return Json(XBService.GetCustomerAvailableAmount(currency));
        }

        public double GetProvisionAmount(double amount,string loanCurrency,string provisionCurrency)
        {
            double provisionAmount = 0;
            double kursForLoan = XBService.GetCBKursForDate(DateTime.Today.Date, loanCurrency);
            double kursForProvision = XBService.GetCBKursForDate(DateTime.Today.Date, provisionCurrency);

            double percent = 0;

            percent = XBService.GetDepositLoanAndProvisionCoefficent(loanCurrency, provisionCurrency);
            provisionAmount = amount / percent * kursForLoan / kursForProvision;
            return Math.Round(provisionAmount,0);
        }

        public double GetLoanProductInterestRate(xbs.LoanProductOrder order,string cardNumber="0")
        {
            return XBService.GetLoanProductInterestRate(order, cardNumber);
        }

        public JsonResult GetDisputeResolutions()
        {
            return Json(InfoService.GetDisputeResolutions());
        }


        public JsonResult GetFastOverdraftApplicationEndDate(xbs.LoanProductOrder order)
        {
            DateTime endDate = InfoService.GetFastOverdrafEndDate(order.StartDate);
            return Json(endDate,JsonRequestBehavior.AllowGet);

        }


        public JsonResult GetCommunicationTypes()
        {
            return Json(InfoService.GetCommunicationTypes());
        }


        public ActionResult FastOverdraftApplication()
        {
            return PartialView("FastOverdraftApplication");
        }


        public JsonResult FastOverdraftValidations(string cardNumber)
        {
            return Json(XBService.FastOverdraftValidations(cardNumber));
        }


        public double GetCreditLineProvisionAmount(double amount, string loanCurrency, string provisionCurrency,bool mandatoryPayment,int creditLineType)
        {
            double provisionAmount = 0;
            double kursForLoan = XBService.GetCBKursForDate(DateTime.Today.Date, loanCurrency);
            double kursForProvision = XBService.GetCBKursForDate(DateTime.Today.Date, provisionCurrency);

            double percent = 0;

            percent = XBService.GetDepositLoanCreditLineAndProfisionCoefficent(loanCurrency, provisionCurrency, mandatoryPayment, creditLineType);
            provisionAmount = amount / percent * kursForLoan / kursForProvision;
            return Math.Round(provisionAmount, 0);
        }


        public JsonResult  GetStatementFixedReceivingType(string cardNumber)
        {
            return Json(XBService.GetStatementFixedReceivingType(cardNumber));
        }

    }
}
