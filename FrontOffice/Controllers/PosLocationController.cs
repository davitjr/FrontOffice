using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.Web.UI;

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

        public ActionResult PosRates()
        {
            return PartialView("PosRates");
        }

        public ActionResult PosCashbackRates()
        {
            return PartialView("PosCashbackRates");
        }

        public JsonResult GetPosRates(int terminalId)
        {
            return Json(XBService.GetPosRates(terminalId), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPosCashbackRates(int terminalId)
        {
            return Json(XBService.GetPosCashbackRates(terminalId), JsonRequestBehavior.AllowGet);
        }

        public void PrintPosStatement(string accountNumber, string dateFrom, string dateTo, ushort statementType, string exportFormat = "pdf")
        {
            
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            if (XBService.AccountAccessible(accountNumber, currentUser.AccountGroup))
            {
                Dictionary<string, string> parameters = new Dictionary<string, string>();
                parameters.Add(key: "ArmNumber", value: accountNumber);
                parameters.Add(key: "startDate", value: Convert.ToDateTime(dateFrom).ToString("dd/MMM/yy"));
                parameters.Add(key: "endDate", value: Convert.ToDateTime(dateTo).ToString("dd/MMM/yy"));
                parameters.Add(key: "StatmentOption", value: statementType.ToString());
                parameters.Add(key: "filialCode", value: accountNumber.Substring(0, 5));

                ReportService.PosStatement(parameters, ReportService.GetExportFormatEnumeration(exportFormat));
            }
            else
            {
                System.Web.HttpContext.Current.Response.BufferOutput = true;
                System.Web.HttpContext.Current.Response.TrySkipIisCustomErrors = true;
                System.Web.HttpContext.Current.Response.StatusCode = 422;
                System.Web.HttpContext.Current.Response.StatusDescription = Utility.ConvertUnicodeToAnsi("Գործողությունը հասանելի չէ:");
            }
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
    }
}