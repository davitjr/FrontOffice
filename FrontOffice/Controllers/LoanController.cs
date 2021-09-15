using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.Web.UI;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Configuration;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class LoanController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache")]
        // GET: Loan 
        public ActionResult Loans()
        {
            return PartialView("Loans");
        }

        // GET: /Loans/

        public JsonResult GetLoans(int filter)
        {
            return Json(XBService.GetLoans((XBS.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LoanDetails()
        {
            return View("LoanDetails");
        }

        // GET: /Loan/
        [ProductDetailsAccesibleFilter]
        public JsonResult GetLoan(ulong productId)
        {
            XBS.Loan loan = XBService.GetLoan(productId);
            ViewBag.accountGroup = loan.LoanAccount.AccountPermissionGroup;
            loan.PetTurq = XBService.GetPetTurk((long)productId);
            loan.ExchangeRate = XBService.GetCBKursForDate(XBService.GetCurrentOperDay(), loan.Currency);
            return Json(loan, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetLoanGrafik(XBS.Loan loan)
        {
            return Json(XBService.GetLoanGrafik(loan), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetLoanInceptiveGrafik(XBS.Loan loan)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            return Json(XBService.GetLoanInceptiveGrafik(loan, customerNumber), JsonRequestBehavior.AllowGet);
        }
        public ActionResult LoanGrafik()
        {
            return PartialView("LoanGrafik");
        }
        public ActionResult LoanInceptiveGrafik()
        {
            return PartialView("LoanInceptiveGrafik");
        }
        public JsonResult GetCBKursForDate(string date, string currency)
        {
            return Json(XBService.GetCBKursForDate(Convert.ToDateTime(date), currency), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanGrafikApplication(string loanFullNumber, DateTime startDate)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "loanFullNumber", value: loanFullNumber);
            parameters.Add(key: "dateOfBeginning", value: startDate.Date.ToString("dd/MMM/yy"));
            parameters.Add(key: "calculationStartDate", value: XBService.GetCurrentOperDay().Date.ToString("dd/MMM/yy"));
            parameters.Add(key: "Language_id", value: "0");

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }


        //OLD VERSION
        public JsonResult PrintLoanStatement(string accountNumber, string dateFrom, string dateTo)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "account", value: accountNumber);
            parameters.Add(key: "start_date", value: Convert.ToDateTime(dateFrom).ToString("dd/MMM/yy"));
            parameters.Add(key: "end_date", value: Convert.ToDateTime(dateTo).ToString("dd/MMM/yy"));
            parameters.Add(key: "filial_code", value: currentUser.filialCode.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }


        public JsonResult PrintLoanStatementNew(string accountNumber, string dateFrom, string dateTo, ulong productId, ushort lang, string exportFormat = "pdf")
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "account", value: accountNumber);
            parameters.Add(key: "start_date", value: Convert.ToDateTime(dateFrom).ToString("dd/MMM/yy"));
            parameters.Add(key: "end_date", value: Convert.ToDateTime(dateTo).ToString("dd/MMM/yy"));
            parameters.Add(key: "filial_code", value: currentUser.filialCode.ToString());
            parameters.Add(key: "lang_id", value: lang.ToString());
            parameters.Add(key: "Product_id", value: productId.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public ActionResult LoanStatement()
        {
            return PartialView("LoanStatement");
        }

        public ActionResult LoanDebts()
        {
            return PartialView("LoanDebts");
        }

        public ActionResult LoanJudgment()
        {
            return PartialView("LoanJudgment");
        }

        public ActionResult Provisions()
        {
            return PartialView("Provisions");
        }

        public JsonResult GetLoanMainContract(ulong productId)
        {
            return Json(XBService.GetLoanMainContract(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LoanMainContract()
        {
            return PartialView("LoanMainContract");
        }


        public JsonResult GetProductOtherFees(ulong productId)
        {
            return Json(XBService.GetProductOtherFees(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ProductOtherFees()
        {
            return PartialView("ProductOtherFees");
        }

        public JsonResult GetLoanProductProlongations(ulong productId)
        {
            return Json(XBService.GetLoanProductProlongations(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LoanProductProlongations()
        {
            return PartialView("LoanProductProlongations");
        }

        public JsonResult GetLoanNextRepayment(XBS.Loan loan)
        {
            return Json(XBService.GetLoanNextRepayment(loan), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LoanTaxDetails()
        {
            return View("LoanTaxDetails");
        }


        public JsonResult GetGoodsDetails(ulong productId)
        {
            return Json(XBService.GetGoodsDetails(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GoodsDetails()
        {
            return View("GoodsDetails");
        }

        public ActionResult LoanRepaymentFromCard()
        {
            return PartialView("LoanRepaymentFromCard");
        }


        public ActionResult LoanRepaymentFromCardDataChangeForm()
        {
            return PartialView("LoanRepaymentFromCardDataChange");
        }

        public JsonResult PrintNotMaturedLoans()
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            parameters.Add(key: "filialCode", value: "0");
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public ActionResult LoanInterestRateChangeHistory()
        {
            return PartialView("LoanInterestRateChangeHistory");
        }
        public ActionResult CreditCodeAccountDetails()
        {
            return PartialView("CreditCodeAccountDetails");
        }
        public JsonResult GetProductAccountFromCreditCode(string creditCode, ushort productType, ushort accountType)
        {
            return Json(XBService.GetProductAccountFromCreditCode(creditCode, productType, accountType), JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        public ActionResult LoanDetailsForCurrentCustomerB(ulong productId, int productType)
        {
            string guid = Utility.GetSessionId();

            ulong customerNumber = XBService.AuthorizeCustomerByLoanApp(productId);

            xbs.AuthorizedCustomer authorizedCustomer = XBService.AuthorizeCustomer(customerNumber, Session[guid + "_authorizedUserSessionToken"].ToString());

            Session[guid + "_AuthorisedCustomerSessionId"] = authorizedCustomer.SessionID;

            xbs.UserAccessForCustomer userAccessForCustomer = new xbs.UserAccessForCustomer();
            userAccessForCustomer = XBService.GetUserAccessForCustomer(Session[guid + "_authorizedUserSessionToken"].ToString(), Session[guid + "_AuthorisedCustomerSessionId"].ToString());

            Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;

            ViewBag.guid = guid;
            ViewBag.AuthorisedCustomerSessionId = Session[guid + "_AuthorisedCustomerSessionId"];

            switch (productType)
            {
                case 6:
                    return View("~/Views/Guarantee/GuaranteeDetails.cshtml");
                case 7:
                    return View("~/Views/Accreditive/AccreditiveDetails.cshtml");
                case 2:
                case 3:
                case 4:
                case 5:
                    return View("~/Views/CreditLine/CreditLineDetails.cshtml");
                case 51:
                case 52:
                case 54:
                case 58:
                case 111:
                    return View("~/Views/Loan/LoanDetails.cshtml");
                default:
                    return View("~/Views/Loan/LoanDetails.cshtml");
            }

        }
        public ActionResult LoanDetailsForCurrentCustomer(ulong id)
        {
            string guid = Utility.GetSessionId();

            ulong customerNumber = XBService.AuthorizeCustomerByLoanApp(id);

            xbs.AuthorizedCustomer authorizedCustomer = XBService.AuthorizeCustomer(customerNumber, Session[guid + "_authorizedUserSessionToken"].ToString());

            Session[guid + "_AuthorisedCustomerSessionId"] = authorizedCustomer.SessionID;

            xbs.UserAccessForCustomer userAccessForCustomer = new xbs.UserAccessForCustomer();
            userAccessForCustomer = XBService.GetUserAccessForCustomer(Session[guid + "_authorizedUserSessionToken"].ToString(), Session[guid + "_AuthorisedCustomerSessionId"].ToString());

            Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;

            ViewBag.guid = guid;
            ViewBag.AuthorisedCustomerSessionId = Session[guid + "_AuthorisedCustomerSessionId"];


            return View("LoanDetails");
        }

        public ActionResult ResetEarlyRepaymentFee()
        {
            return PartialView("ResetEarlyRepaymentFee");
        }

        public void PostResetEarlyRepaymentFee(ulong productId, string description, bool recovery)
        {
            XBService.PostResetEarlyRepaymentFee(productId, description, recovery);
        }

        public bool GetResetEarlyRepaymentFeePermission(ulong productId)
        {
            return XBService.GetResetEarlyRepaymentFeePermission(productId);
        }

        public ActionResult SendLoanDigitalContract(ulong productId)
        {
            var customerNumber = XBService.GetAuthorizedCustomerNumber();
            var result = Service.LADigitalContractService.SendLoanContract(productId, customerNumber);
            return Json(result);

        }
        public JsonResult GetLoanDigitalContractStatus(ulong productId)
        {
            return Json(Service.LADigitalContractService.GetLoanDigitalContractStatus(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanRepaymentDelayDetails(ulong productId)
        {
            return Json(XBService.GetLoanRepaymentDelayDetails(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanInterestRateChangeHistoryDetails(ulong productId)
        {
            return Json(XBService.GetLoanInterestRateChangeHistoryDetails(productId), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetLoanInterestRateConcessionDetails(ulong productId)
        {
            return Json(XBService.GetLoanInterestRateConcessionDetails(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTypeOfLoanDelete()
        {
            return Json(InfoService.GetTypeOfLoanDelete(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LoanDeleteReason()
        {
            return PartialView("LoanDeleteReason");
        }

        public ActionResult SaveAndApproveLoanDeleteOrder(xbs.DeleteLoanOrder deleteLoanOrder)
        {
            var result = XBService.SaveAndApproveLoanDeleteOrder(deleteLoanOrder);
            return Json(result);
        }

        public JsonResult GetLoanDeleteOrderDetails(uint orderId)
        {
            return Json(XBService.GetLoanDeleteOrderDetails(orderId));

        }

        public void PrintHypotecLoanStatement(string accountNumber, string dateFrom, string dateTo, ulong productId)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "account", value: accountNumber);
            parameters.Add(key: "start_date", value: Convert.ToDateTime(dateFrom).ToString("dd/MMM/yy"));
            parameters.Add(key: "end_date", value: Convert.ToDateTime(dateTo).ToString("dd/MMM/yy"));
            parameters.Add(key: "filial_code", value: currentUser.filialCode.ToString());
            parameters.Add(key: "applicationId", value: productId.ToString());

            ReportService.PrintHypotecLoanStatement(parameters, ReportService.GetExportFormatEnumeration("pdf"));
        }

        public ActionResult GetLoanRepaymentFromCardDataChangeHistory(ulong appId)
        {
            var result = XBService.GetLoanRepaymentFromCardDataChangeHistory(appId);
            return Json(result);
        }

        public ActionResult SaveLoanRepaymentFromCardDataChange(int actionName, ulong appid, string changeReasonAdd, DateTime? EndDate)
        {
            string guid = Utility.GetSessionId();
            FrontOffice.XBS.User user = (FrontOffice.XBS.User)Session[guid + "_User"];
            int setNumber = user.userID;

            XBS.LoanRepaymentFromCardDataChange loanRepaymentFromCardDataChangeFilters = new XBS.LoanRepaymentFromCardDataChange
            {
                AppId = appid,
                Description = changeReasonAdd,
                Action = actionName,
                SetNumber = setNumber,
                EndDate = EndDate,
                StartDate = DateTime.Now
            };
            var result = XBService.SaveLoanRepaymentFromCardDataChange(loanRepaymentFromCardDataChangeFilters);
            return Json(result);
        }


    }
}