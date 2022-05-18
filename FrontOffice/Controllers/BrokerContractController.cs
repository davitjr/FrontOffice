using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using FrontOffice.Models;
using System.Threading.Tasks;
using FrontOffice.XBSInfo;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class BrokerContractController : Controller
    {
        public ActionResult BrokerContract()
        {
            return PartialView("BrokerContract");
        }
        public ActionResult BrokerContractOrder()
        {
            return PartialView("BrokerContractOrder");
        }

        public async Task<JsonResult> SaveAndApproveBrokerContractOrder(xbs.BrokerContractOrder order)
        {
            if(order.StockToolIds == null)
            {
                order.StockToolIds = new List<int>();
            }
            return Json(XBService.SaveAndApproveBrokerContractOrder(order), JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GenerateBrokerContractNumber()
        {
            return Json(await InfoService.GenerateBrokerContractNumberAsync(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetBrokerContractProduct()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            return Json(XBService.GetBrokerContractProduct(customerNumber), JsonRequestBehavior.AllowGet);
        }

        public async Task<JsonResult> GetBrokerContractSurvey()
        {
            BrokerContractSurvey brokerContract = await InfoService.GetBrokerContractSurveyAsync();

            return Json(brokerContract, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBrokerContractQuestionnaireDetails(string contractId)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "contractId", value: contractId);

            return Json(parameters, JsonRequestBehavior.AllowGet);

        }

        public void StockBrokerContract(string contractNumber, DateTime contractDate)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            parameters.Add(key: "ContractNumber", value: contractNumber);
            parameters.Add(key: "ContractDate", value: contractDate.ToString());
            parameters.Add(key: "CustomerNumber", value: customerNumber.ToString());

            ContractService.StockBrokerContract(parameters);
        }

        public void StocksInvestmentRisksDescription()
        {
            ContractService.StocksInvestmentRisksDescription();
        }

        public void InterestPolicyContract()
        {
            ContractService.InterestPolicyContract();
        }
    }
}