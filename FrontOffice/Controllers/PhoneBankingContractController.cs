using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbsManagement = FrontOffice.XBManagement;
using System.Web.SessionState;
using xbs = FrontOffice.XBS;
using System.Web.UI;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class PhoneBankingContractController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult PhoneBankingContract()
        {
            return PartialView("PhoneBankingContract");
        }

        //Get: Phone Banking Contract
        //[ProductDetailsAccesibleFilter]
        public JsonResult GetPhoneBankingContract()
        {
            XBManagement.PhoneBankingContract phoneBankingContract = XBManagementService.GetPhoneBankingContract();
            return Json(phoneBankingContract, JsonRequestBehavior.AllowGet);
        }

        public ActionResult PhoneBankingContractOrder()
        {
            return PartialView("PhoneBankingContractOrder");
        }

        public ActionResult PhoneBankingContractQuestionAnswer()
        {
            return PartialView("PhoneBankingContractQuestionAnswer");
        }

        public ActionResult PhoneBankingContractDetails()
        {
            return PartialView("PhoneBankingContractDetails");
        }

      

        public void GetPhoneBankingContractPDF()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            XBManagement.PhoneBankingContract phoneBankingContract = XBManagementService.GetPhoneBankingContract();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "contractNumber", value: phoneBankingContract.ContractNumber.ToString());
            parameters.Add(key: "contractDate", value: Convert.ToDateTime(phoneBankingContract.ContractDate).ToString("dd/MMM/yy"));

            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "contractFilial", value: currentUser.filialCode.ToString());

            int i = 1;

            foreach(XBManagement.PhoneBankingContractQuestionAnswer qa in phoneBankingContract.QuestionAnswers)
            {
                parameters.Add(key: "question_" + i.ToString(), value: qa.QuestionDescription);
                parameters.Add(key: "answer_" + i.ToString(), value: qa.Answer);
                i = i + 1;
            }

            ContractService.GetPhoneBankingContract(parameters);
        }

        public void GetPhoneBankingContractClosingPDF()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
        
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
          
            ContractService.GetPhoneBankingContractClosing(parameters);
        }

        public ActionResult PhoneBankingContractOrderDetails()
        {
            return PartialView("PhoneBankingContractOrderDetails");
        }
        public JsonResult SavePBActivationOrder(xbsManagement.PhoneBankingContractActivationOrder order)
        {
            order.Quality = xbsManagement.OrderQuality.Draft;
            xbsManagement.ActionResult result = new xbsManagement.ActionResult();
            result = XBManagementService.SaveAndApprovePhoneBankingContractActivationOrder(order);

            return Json(result);
        }
        public ActionResult PhoneBankingContractActivationOrder()
        {
            return PartialView("PhoneBankingContractActivationOrder");
        }

        public ActionResult GetPhoneBankingContractPendingRequests()
        {
            return PartialView("PhoneBankingContractPendingRequests");
        }
    }
}