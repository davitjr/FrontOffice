using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbsManagement = FrontOffice.XBManagement;
using System.Web.SessionState; 

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class HBUserController : Controller
    {
        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBUsers()
        {
            return View("HBUsers");
        }
         
        public ActionResult HBUserDetails()
        {
            return View("HBUserDetails");
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public JsonResult GetHBUsers(int hbAppId, xbsManagement.ProductQualityFilter filter)
        {
            return Json(XBManagementService.GetHBUsers(hbAppId, filter), JsonRequestBehavior.AllowGet);
        }
         
        public ActionResult PersonalHBUserOrder()
        {
            return PartialView("PersonalHBUserOrder");
        }
        public JsonResult CheckHBUserNameAvailability(xbsManagement.HBUser user)
        {
            return Json(XBManagementService.CheckHBUserNameAvailability(user), JsonRequestBehavior.AllowGet);
        }
         
        public ActionResult HBUserOrderDetails()
        {
            return PartialView("HBUserOrderDetails");
        }
         
        public JsonResult GetHBAssigneeCustomers(ulong customerNumber)
        {
            List<XBManagement.AssigneeCustomer> assigneeList = XBManagementService.GetHBAssigneeCustomers(customerNumber);
            return Json(assigneeList, JsonRequestBehavior.AllowGet);
        }

        public void PrintOnlinePartialDeactivateRequestLegal(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlinePartialDeactivateRequestLegal(parameters);
        }
        public void PrintOnlineAddTokenRequestLegal(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlineAddTokenRequestLegal(parameters);
        }
        public void PrintOnlineLostTokenRequestLegal(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlineLostTokenRequestLegal(parameters);
        }
        public void PrintOnlineDamagedTokenRequestLegal(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlineDamagedTokenRequestLegal(parameters);
        }
        public void PrintOnlineChangeRightsRequestLegal(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlineChangeRightsRequestLegal(parameters);
        }
        public void PrintOnlineChangeTokenRequestLegal(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlineChangeTokenRequestLegal(parameters);
        }

        public void PrintOnlineLostTokenRequestPhysical(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlineLostTokenRequestPhysical(parameters);
        }
        public void PrintOnlineDamagedTokenRequestPhysical(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlineDamagedTokenRequestPhysical(parameters);
        }
        public void PrintOnlineChangeRightsRequestPhysical(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlineChangeRightsRequestPhysical(parameters);
        }
        public void PrintOnlineChangeTokenRequestPhysical(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlineChangeTokenRequestPhysical(parameters);
        }

        
        public void PrintOnlinePartialDeactivateRequestPhysical(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlinePartialDeactivateRequestPhysical(parameters);
        }
        public void PrintOnlineAddTokenRequestPhysical(string tokenSerial)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "tokenSerial", value: tokenSerial);
            ContractService.GetOnlineAddTokenRequestPhysical(parameters);
        }
        
        public JsonResult GetHBUserLog(string userName)
        {
            List<XBManagement.HBUserLog> hbUserLog = XBManagementService.GetHBUserLog(userName);
            return Json(hbUserLog, JsonRequestBehavior.AllowGet);
        }

        public ActionResult HBUserLog()
        {
            return PartialView("HBUserLog");
        }
        
    }
}