using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.Web.UI;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class PensionApplicationController : Controller
    {


        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult PensionApplications()
        {
            return PartialView("PensionApplications");
        }

        public JsonResult GetPensionApplicationHistory(int filter)
        {
            List<xbs.PensionApplication> list = new List<xbs.PensionApplication>();
            list = XBService.GetPensionApplicationHistory((xbs.ProductQualityFilter)filter);
            foreach (xbs.PensionApplication pensionApplication in list)
            {
                pensionApplication.UserDescription =Utility.ConvertAnsiToUnicode( ACBAOperationService.GetCasherDescription(pensionApplication.SetNumber));
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public void AccountNoticeForm(string accountNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "accountNumber", value: accountNumber.ToString());
            ContractService.AccountNoticeForm(parameters);
        }

        public void PensionCloseApplication(string accountNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            parameters.Add(key: "accountNumber", value: accountNumber.ToString());
            parameters.Add(key: "filialCode", value: user.filialCode.ToString());

            ContractService.PensionCloseApplication(parameters);
        }

        public void PensionAgreement()
        {
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            ulong customerNumber = 0;
            customerNumber = XBService.GetAuthorizedCustomerNumber();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "filialCode", value: user.filialCode.ToString());

            ContractService.PensionAgreement(parameters);
        }

        public void PensionCloseApplicationContract(string contractId)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            ulong customerNumber = 0;
            customerNumber = XBService.GetAuthorizedCustomerNumber();
            short chiefType;
            if (user.filialCode == 22000)
                chiefType = 4;
            else
                chiefType = 5;
            parameters.Add(key: "customer_number", value: customerNumber.ToString());
            parameters.Add(key: "filialcode", value: user.filialCode.ToString());
            parameters.Add(key: "unique_number", value: contractId);
            parameters.Add(key: "chief_type", value: chiefType.ToString());

            ReportService.PensionCloseApplicationContract(parameters);
        }
    }
}