using FrontOffice.Models;
using FrontOffice.Service;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using System.Web.UI;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class TaxRefundController : Controller
    {

        public ActionResult TaxRefundAgreements()
        {
            return PartialView("TaxRefundAgreements");
        }
        public ActionResult TaxRefundAgreementHistory()
        {
            return PartialView("TaxRefundAgreementHistory");
        }

        public JsonResult GetLoanBorrowers(ulong productId) => Json(XBService.GetLoanBorrowers(productId), JsonRequestBehavior.AllowGet);

        public ActionResult SaveTaxRefundAgreementDetails(ulong customerNumber, ulong productId, byte agreementExistence)
        {
            string guid = Utility.GetSessionId();
            FrontOffice.XBS.User user = (FrontOffice.XBS.User)Session[guid + "_User"];
            int setNumber = user.userID;

            var result = XBService.SaveTaxRefundAgreementDetails(customerNumber, productId, agreementExistence, setNumber);
            return Json(result);
        }

        public JsonResult GetTaxRefundAgreementHistory(int agreementId)
            => Json(XBService.GetTaxRefundAgreementHistory(agreementId), JsonRequestBehavior.AllowGet);

        public async Task<JsonResult> SendTaxRefundRequest(TaxRefundRequestParameters requestParams)
            => Json(await TaxRefundService.SendRequests(requestParams), JsonRequestBehavior.AllowGet);

    }
}