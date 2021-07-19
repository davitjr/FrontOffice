using System;
using System.Collections.Generic;
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
    public class DepositController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache" )]
        // GET: Deposits
        public ActionResult Deposits()
        {
            return PartialView("Deposits");
        }

        // GET: /Deposits/
        public JsonResult GetDeposits(int filter)
        {
            //return Json(XBService.GetDeposits((xbs.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);

            return new JsonResult()
            {
                Data = XBService.GetDeposits((xbs.ProductQualityFilter)filter),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue
            };
        }

        // Get: Deposit
        [ProductDetailsAccesibleFilter]
        public JsonResult GetDeposit(ulong productId)
        {
            xbs.Deposit deposit = XBService.GetDeposit(productId);
            ViewBag.accountGroup = deposit.DepositAccount.AccountPermissionGroup;
            return Json(deposit, JsonRequestBehavior.AllowGet);
        }

        // Get: Deposit Details
        public ActionResult DepositDetails()
        {
            return View("DepositDetails");
        }

        public ActionResult TerminateDepositDetails()
        {
            return PartialView("TerminateDepositdetails");
        }

        public ActionResult TerminateDepositView()
        {
            return PartialView("TerminateDepositView");
        }


        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.DepositTerminationOrderSave )]
        public JsonResult SaveTerminateDepositOrder(xbs.DepositTerminationOrder deposit)
        {
            
            return Json(XBService.SaveTerminateDepositOrder(deposit), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDepositRepayments(ulong productId)
        {
            return Json(XBService.GetDepositRepayments(productId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult DepositRepayment()
        {
            return PartialView("DepositRepayment");
        }

        public JsonResult GetJointCustomers(ulong productId)
        {
            return Json(XBService.GetDepositJointCustomers(productId), JsonRequestBehavior.AllowGet);
        }

        public void DepositRepaymentsGrafik(string productId)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "app_id", value: productId);
            ReportService.DepositRepaymentsGrafik(parameters);
        }

        public void DepositCloseApplication(string depositNumber)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid +"_User"]).filialCode.ToString();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "depositNumber", value: depositNumber);
            parameters.Add(key: "filialCode", value: filialCode);
            ContractService.DepositCloseApplication(parameters);
        }

        public void GetDepositContract(string depositNumber)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid +"_User"]).filialCode.ToString();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "depositNumber", value: depositNumber);
            parameters.Add(key: "filialCode", value: filialCode);
            parameters.Add(key: "HbDocID", value: "0");

            ContractService.GetDepositContract(parameters);
        }

        public JsonResult GetDepositSource(ulong productId)
        {
            return Json(XBService.GetDepositSource(productId), JsonRequestBehavior.AllowGet);
        }

        public void PrintDepositStatement(long productId, string accountNumber, ushort lang, string dateFrom, string dateTo, ushort averageRest, ushort currencyRegulation, ushort payerData, ushort additionalInformationByCB, ushort includingExchangeRate, string exportFormat = "pdf")
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "product_id", value: productId.ToString());
            parameters.Add(key: "account_gl", value: accountNumber);
            parameters.Add(key: "start_date", value: Convert.ToDateTime(dateFrom).ToString("dd/MMM/yy"));
            parameters.Add(key: "end_date", value: Convert.ToDateTime(dateTo).ToString("dd/MMM/yy"));
            parameters.Add(key: "lang_id", value: lang.ToString());
            parameters.Add(key: "set_number", value: currentUser.userID.ToString());
            parameters.Add(key: "payerData", value: payerData.ToString());
            parameters.Add(key: "additionalInformationByCB", value: additionalInformationByCB.ToString());
            parameters.Add(key: "filial_code", value: currentUser.filialCode.ToString());
            parameters.Add(key: "averageRest", value: averageRest.ToString());
            parameters.Add(key: "currencyRegulation", value: currencyRegulation.ToString());
            parameters.Add(key: "includingExchangeRate", value: includingExchangeRate.ToString());
            ReportService.DepositStatement(parameters, ReportService.GetExportFormatEnumeration(exportFormat));
        }

        public void DepositRepaymentsDetailedGrafik(string productId, ExportFormat exportFormat = ExportFormat.PDF)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "app_id", value: productId);
            ReportService.DepositRepaymentsDetailedGrafik(parameters, exportFormat);
        }
        

    }
}