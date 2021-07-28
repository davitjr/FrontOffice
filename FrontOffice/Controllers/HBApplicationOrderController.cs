using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbsManagement = FrontOffice.XBManagement;
using System.Web.SessionState;
using System.Web.UI;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    //[CustomerProductsAccessFilter(productCode = xbs.ProductType.HBApplication)]
    public class HBApplicationOrderController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult HBApplication()
        {
            return PartialView("HBApplication");
        }

         
        public JsonResult GetHBApplication()
        {
            XBManagement.HBApplication hbApp = XBManagementService.GetHBApplication();
            return Json(hbApp, JsonRequestBehavior.AllowGet);
        }


        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)] 
        public JsonResult GetHBApplicationShablon()
        {
            XBManagement.HBApplication hbApp = XBManagementService.GetHBApplicationShablon();
            return Json(hbApp, JsonRequestBehavior.AllowGet);
        }
         
        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBApplicationDetails()
        {
            return View("HBApplicationDetails");
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult PersonalHBApplicationOrder()
        {
            return PartialView("PersonalHBApplicationOrder");
        } 

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBApplicationOrder()
        {
            return PartialView("HBApplicationOrder");
        }
         
        public JsonResult GetHBApplicationOrder(long orderId)
        {
            return Json(XBManagementService.GetHBApplicationOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBApplicationOrderDetails()
        {
            return PartialView("HBApplicationOrderDetails");
        }

         
        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult SaveHBApplicationOrder(XBManagement.HBApplicationOrder order, List<xbsManagement.HBUser> users, List<xbsManagement.HBToken> tokens)
        {
            if (users!=null &&  users.Count > 0)
            {
                users = users.GroupBy(u => new { u.ID }).Select(u => u.First()).ToList();
            }
            if (tokens!=null && tokens.Count > 0)
            {
                tokens = tokens.GroupBy(t => new { t.ID }).Select(t => t.First()).ToList();
            }
            order.HBApplicationUpdate = new XBManagement.HBApplicationUpdate();
            order.HBApplicationUpdate.AddedItems = new List<object>();
            order.HBApplicationUpdate.DeactivatedItems = new List<object>();
            order.HBApplicationUpdate.UpdatedItems = new List<object>();

            if (users != null)
            {
                users.ForEach(m =>
                {
                    switch (m.Action)
                    {
                        case 1: { order.HBApplicationUpdate.AddedItems.Add(m); break; };
                        case 2: { order.HBApplicationUpdate.UpdatedItems.Add(m); break; };
                        case 3: { order.HBApplicationUpdate.DeactivatedItems.Add(m); break; };
                    }
                });
            }
            if (tokens != null)
            {
                tokens.ForEach(m =>
                {
                    switch (m.Action)
                    {
                        case 1: { order.HBApplicationUpdate.AddedItems.Add(m); break; };
                        case 2: { order.HBApplicationUpdate.UpdatedItems.Add(m); break; };
                        case 3: { order.HBApplicationUpdate.DeactivatedItems.Add(m); break; };
                    }
                });
            }
            XBManagement.ActionResult result = XBManagementService.SaveHBApplicationOrder(order);
            return  Json(result);
        }

         
        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult HBApplicationRestoreOrder()
        {
            return PartialView("HBApplicationRestoreOrder");
        } 

         
        public void PrintOnlineRequestLegal()
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            ContractService.GetOnlineRequestLegal(parameters);
        }
         
        public void PrintOnlineDeactivateTokenRequestPhysical()
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            ContractService.GetOnlineDeactivateTokenRequestPhysical(parameters);
        }
         
        public void PrintOnlineDeactivateRequestLegal()
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            ContractService.GetOnlineDeactivateRequestLegal(parameters);
        }
         
        public void PrintOnlineContractPhysical(int filialCode,string contractNumber,DateTime contractDate, string confirmationPerson)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "CustomerNumber", value: customerNumber.ToString());
            parameters.Add(key: "FilialCode", value: filialCode.ToString());
            parameters.Add(key: "ContractNumber", value: contractNumber);
            parameters.Add(key: "ContractDate", value: contractDate.ToString("dd/MMM/yy"));
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);

            ContractService.GetOnlineContractPhysical(parameters);
        }
         
        public void PrintOnlineContractLegal(int filialCode, string confirmationPerson)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "CustomerNumber", value: customerNumber.ToString());
            parameters.Add(key: "FilialCode", value: filialCode.ToString());
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);
            ContractService.GetOnlineContractLegal(parameters);
        }

        public void PrintOnlineAgreementPhysical(int filialCode, string confirmationPerson)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "CustomerNumber", value: customerNumber.ToString());
            parameters.Add(key: "FilialCode", value: filialCode.ToString());
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);
            ContractService.GetOnlineAgreementPhysical(parameters);
        }

        public void PrintOnlineAgreementLegal(int filialCode, string confirmationPerson)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "CustomerNumber", value: customerNumber.ToString());
            parameters.Add(key: "FilialCode", value: filialCode.ToString());
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);
            ContractService.GetOnlineAgreementLegal(parameters);
        }
    }
}