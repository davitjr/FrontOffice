using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using acbaRef = FrontOffice.ACBAServiceReference;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class PrintDocumentsController : Controller
    {
        // GET: Documents List
        public ActionResult GetDocumentsList()
        {
            return View("DocumentsList");
        }

        public void GetCustomerSignature()
        {
            
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber); 
       
            Dictionary<string, string> parameters = new Dictionary<string, string>();            
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            ContractService.GetCustomerSignature(parameters,customer.CustomerType);
        }

        public void PrintCustomerKYC()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string guid = Utility.GetSessionId();

            string filialCode = ((xbs.User)Session[guid+"_User"]).filialCode.ToString();
            parameters.Add(key: "filialcode", value: filialCode);

            string userId = ((xbs.User)Session[guid+"_User"]).userID.ToString();
            parameters.Add(key: "UserID", value: userId);

            parameters.Add(key: "customer_number", value: customerNumber.ToString());
            parameters.Add(key: "identityId", value: customer.IdentityID.ToString());

            if (customer.CustomerType == 6)
            {
                parameters.Add(key: "isIndividual", value: "1");
            }
            else
            {
                parameters.Add(key: "isIndividual", value: "0");
            }

            ReportService.CustomerKYC(parameters, customer.CustomerType);
        }

        public void PrintCustomerAllProducts(int productStatus)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            parameters.Add(key: "permission_number", value: ((FrontOffice.XBS.User)(Session[guid+"_User"])).AccountGroup.ToString());
            parameters.Add(key: "Customer_Number", value: customerNumber.ToString());
            parameters.Add(key: "Gorcox", value: productStatus.ToString());

            ContractService.GetCustomerAllProducts(parameters);
        }

        public void PrintCustomerDocuments()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            ContractService.GetCustomerDocuments(parameters);
        }

        public void PrintUnderageCustomerAgreement()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            ContractService.GetUnderageCustomerAgreement(parameters);
        }


        public JsonResult GetListOfCustomerDeposits()
        {
            //Rep_ListOfCustomerDeposits
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            parameters.Add(key: "permission_number", value: ((FrontOffice.XBS.User)(Session[guid + "_User"])).AccountGroup.ToString());
            parameters.Add(key: "customer_number", value: customerNumber.ToString());


            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public void GetCustomerMergeApplicationAgreement(int filialCodeChange)
        {
           
            string guid = Utility.GetSessionId();
            int filialCode = Convert.ToInt32(((XBS.User)Session[guid + "_User"]).filialCode.ToString());
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "filialCode", value: filialCode.ToString());
            parameters.Add(key: "filialCodeChange", value: filialCodeChange.ToString());

            ContractService.GetCustomerMergeApplication(parameters);
        }

        public ActionResult CustomerMergeApplicationform()
        {
            return PartialView("CustomerMergeApplicationForm");
        }

        public JsonResult GetSentSMSMessages()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            ulong identityId = FrontOffice.Service.ACBAOperationService.GetIdentityId(customerNumber);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "identityId", value: identityId.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }


    }
}