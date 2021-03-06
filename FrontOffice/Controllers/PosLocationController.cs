using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.Web.UI;
using FrontOffice.Models;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    //[CustomerProductsAccessFilter(productCode = xbs.ProductType.Card)]
    public class PosLocationController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache")]
        public ActionResult CustomerPosLocations()
        {
            return PartialView("CustomerPosLocations");
        }
        public JsonResult GetCustomerPosLocations(int filter)
        {
            return Json(XBService.GetCustomerPosLocations((xbs.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPosLocation(int posLocationId)
        {

            return Json(XBService.GetPosLocation(posLocationId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PosLocationDetails()
        {
            return PartialView("PosLocationDetails");
        }
        public ActionResult PrintPosDocuments()
        {
            return PartialView("PrintPosDocuments");
        }

        public ActionResult SendPosDocuments()
        {
            return PartialView("SendPosDocuments");
        }

        public ActionResult PosRates()
        {
            return PartialView("PosRates");
        }

        public ActionResult PosCashbackRates()
        {
            return PartialView("PosCashbackRates");
        }

        //Davit Pos
        public ActionResult NewPosApplication()
        {
            return PartialView("NewPosApplication");
        }
        //Davit Pos
        public ActionResult NewPosApplicationOrderDetails()
        {
            return PartialView("NewPosApplicationOrderDetails");
        }

        //Davit Pos
        public ActionResult NewPosTerminalApplication()
        {
            return PartialView("NewPosTerminalApplication");
        }

        
        public JsonResult GetPosRates(int terminalId)
        {
            return Json(XBService.GetPosRates(terminalId), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPosCashbackRates(int terminalId)
        {
            return Json(XBService.GetPosCashbackRates(terminalId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult PrintPosStatement(string accountNumber, string dateFrom, string dateTo, ushort statementType, string exportFormat = "pdf")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            if (XBService.AccountAccessible(accountNumber, currentUser.AccountGroup))
            {
                parameters.Add(key: "ArmNumber", value: accountNumber);
                parameters.Add(key: "startDate", value: Convert.ToDateTime(dateFrom).ToString("dd/MMM/yy"));
                parameters.Add(key: "endDate", value: Convert.ToDateTime(dateTo).ToString("dd/MMM/yy"));
                parameters.Add(key: "StatmentOption", value: statementType.ToString());
                parameters.Add(key: "filialCode", value: accountNumber.Substring(0, 5));

            }
            else
            {
                System.Web.HttpContext.Current.Response.BufferOutput = true;
                System.Web.HttpContext.Current.Response.TrySkipIisCustomErrors = true;
                System.Web.HttpContext.Current.Response.StatusCode = 422;
                System.Web.HttpContext.Current.Response.StatusDescription = Utility.ConvertUnicodeToAnsi("Գործողությունը հասանելի չէ:");
            }

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public void PrintPosContract(int id, int contractType, string contractNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "code", value: id.ToString());
            parameters.Add(key: "contractType", value: contractType.ToString());
            parameters.Add(key: "contractNumber", value: contractNumber);
            parameters.Add(key: "contractDate", value: XBService.GetCurrentOperDay().ToString("dd/MMM/yy"));

            ContractService.CardServiceContract(parameters);
        }

        public void PrintInternetContract(int id, int contractType, string contractNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "code", value: id.ToString());
            parameters.Add(key: "contractType", value: contractType.ToString());
            parameters.Add(key: "contractNumber", value: contractNumber);
            parameters.Add(key: "contractDate", value: XBService.GetCurrentOperDay().ToString("dd/MMM/yy"));

            ContractService.InternetCardServiceDocument(parameters);
        }

        public void PrintAgreementWithNoCard(int id, string contractNumber, string agreementNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "code", value: id.ToString());
            parameters.Add(key: "agreementNumber", value: agreementNumber);
            parameters.Add(key: "agreementDate", value: XBService.GetCurrentOperDay().ToString("dd/MMM/yy"));
            parameters.Add(key: "contractNumber", value: contractNumber);
            parameters.Add(key: "contractDate", value: XBService.GetCurrentOperDay().ToString("dd/MMM/yy"));

            ContractService.CardPaymentAgreementWithNoCard(parameters);
        }

        public void PrintWithoutCardPaymentContract(int id, string contractNumber, string agreementNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "code", value: id.ToString());
            parameters.Add(key: "agreementNumber", value: agreementNumber);
            parameters.Add(key: "agreementDate", value: XBService.GetCurrentOperDay().ToString("dd/MMM/yy"));
            parameters.Add(key: "contractNumber", value: contractNumber);
            parameters.Add(key: "contractDate", value: XBService.GetCurrentOperDay().ToString("dd/MMM/yy"));

            ContractService.WithoutCardPaymentContract(parameters);
        }

        public void PrintPosActsPDF(int id, int actType, string contractNumber, string actNumber, string merchantId)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "code", value: id.ToString());
            parameters.Add(key: "actType", value: actType.ToString());
            parameters.Add(key: "actDate", value: XBService.GetCurrentOperDay().ToString("dd/MMM/yy"));
            parameters.Add(key: "actNumber", value: actNumber);
            parameters.Add(key: "contractNumber", value: contractNumber);
            parameters.Add(key: "contractDate", value: XBService.GetCurrentOperDay().ToString("dd/MMM/yy"));
            parameters.Add(key: "merchantID", value: merchantId);

            ContractService.TradeServiceCentersAcceptanceDischargeAct(parameters);
        }

        public void PrintPosActs(int id, int actType, string merchantId)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "code", value: id.ToString());
            parameters.Add(key: "contractID", value: actType.ToString());
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "merchantID", value: merchantId);
            parameters.Add(key: "Date", value: XBService.GetCurrentOperDay().ToString("dd/MMM/yy"));

            ContractService.PosContract(parameters);
        }

        public ActionResult SendPosContracts(int id, int[] attachmentTypes, string merchantID, string code, string contractNumber, string agreementNumber, string actNumber, bool includeAll)
        {
            string operDay = XBService.GetCurrentOperDay().ToString("dd/MMM/yy");
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("merchantID", merchantID);
            parameters.Add("code", code);
            parameters.Add("contractNumber", contractNumber);
            parameters.Add("agreementNumber", agreementNumber);
            parameters.Add("actNumber", actNumber);
            parameters.Add("actDate", operDay);
            parameters.Add("contractDate", operDay);
            parameters.Add("agreementDate", operDay);

            FrontOffice.eSignServiceReference.ActionResult result = eSignService.SendDigitalContract((ulong)id, customerNumber, attachmentTypes, parameters, XBService.GetCurrentOperDay(), includeAll);
            return Json(result);
        }

        public ActionResult GetSentDigitalContracts()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            List<FrontOffice.eSignServiceReference.SentDigitalContract> sentDigitalContracts = eSignService.GetSentDigitalContracts(customerNumber);
            return Json(sentDigitalContracts);
        }

        public ActionResult GetSignedDigitalContracts()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            List<FrontOffice.eSignServiceReference.SignedDigitalContract> signedDigitalContracts = eSignService.GetSignedDigitalContracts(customerNumber);
            return Json(signedDigitalContracts);
        }

        public ActionResult CancelDigitalContract(Guid digitalContractId)
        {
            FrontOffice.eSignServiceReference.ActionResult result = eSignService.CancelDigitalContract(digitalContractId);
            return Json(result);
        }

        public ActionResult SignedInPaperDigitalContract(Guid digitalContractId)
        {
            FrontOffice.eSignServiceReference.ActionResult result = eSignService.SignedInPaperDigitalContract(digitalContractId);
            return Json(result);
        }

        public void GetSignedDocument(string fileId, string fileName)
        {

            byte[] result = eSignService.GetSignedDocument(fileId, fileName);
            ReportService.ShowDocument(result, ExportFormat.PDF, fileName);
        }

        //Davit Pos
        public ActionResult NewPosLocationOrder(XBS.NewPosLocationOrder newPosLocationModel)
        {
            newPosLocationModel.Quality = xbs.OrderQuality.Draft;
            XBS.ActionResult result = XBService.SaveAndApproveNewPosLocationOrder(newPosLocationModel);

            return Json(result); 
        }
        //Davit Pos
        public ActionResult GetNewPosApplicationOrderDetails(long orderId)
        {
            return Json(XBService.NewPosApplicationOrderDetails(orderId), JsonRequestBehavior.AllowGet);
        }
        //Davit Pos
        public ActionResult GetPosTerminalActivitySphere()
        {
            return Json(XBService.GetPosTerminalActivitySphere(), JsonRequestBehavior.AllowGet);
        }
        //Davit Pos
        public ActionResult NewPosTerminalOrder(XBS.NewPosLocationOrder newPosLocationModel)
        {
            newPosLocationModel.Quality = xbs.OrderQuality.Draft;
            XBS.ActionResult result = XBService.SaveAndApproveNewPosLocationOrder(newPosLocationModel);

            return Json(result);
        }

    }
}