using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using FrontOffice.Service;
using FrontOffice;
using FrontOffice.Models;
using Newtonsoft.Json;
using System.Web.Script.Serialization;

namespace LoanManagementSystem.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CustomerArrestsInfoController : Controller
    {
        [AllowAnonymous]
        public ActionResult CustomerInfo()
        {
            return PartialView("CustomerInfo");
        }
        public ActionResult Index()
        {
            return PartialView("CustomerInfo");
        }

        public ActionResult AddRemoveLoanBan()
        {
            return PartialView("AddRemoveLoanBan");
        }

        public string GetArrestTypesList()
        {
            return XBService.GetArrestTypesList();
        }

        public string GetArrestsReasonTypes()
        {
            return XBService.GetArrestsReasonTypesList();
        }

        public string PostAddedCustomerArrestInfo(FrontOffice.XBS.CustomerArrestInfo obj)
        {
           return XBService.PostNewAddedLoanArrest(obj);
        }

        public string PostRemovedLoanArrest(FrontOffice.XBS.CustomerArrestInfo obj)
        {
           return XBService.RemoveCustomerArrestInfo(obj);
        }

        public string GetCustomerArrestsInfo(ulong customerNumber)
        {
            return XBService.GetCustomerArrestsInfo(customerNumber);
        }

        public string GetCustomerInfos(ulong customerNumber)
        {
            CustomerInfosForArrests customer = new CustomerInfosForArrests();
            
            customer.CustomerNumber =  XBService.GetCustomerNumberForArrests();

            customer.FullName = ACBAOperationService.GetCustomerDescription(customer.CustomerNumber);

            string json = new JavaScriptSerializer().Serialize(customer);

            return json;
        }

        public string GetOperday()
        {
            DateTime dt = XBService.GetCurrentOperDay();

            return dt.ToString("dd/MM/yyyy");
        }

        public string GetSetNumberInfo()
        {
            FrontOffice.XBS.UserInfoForArrests obj = new FrontOffice.XBS.UserInfoForArrests();
            string guid = Utility.GetSessionId();
            FrontOffice.XBS.User user = (FrontOffice.XBS.User)Session[guid + "_User"];

            obj.SetNumber = user.userID;

            return XBService.GetSetNumberInfo(obj);
        }

        public int CheckCustomerFilial(ulong customerNumber)
        {
            int result = 0;

            int fillial = XBService.GetCustomerfillialCode(customerNumber);
            string guid = Utility.GetSessionId();
            FrontOffice.XBS.User user = (FrontOffice.XBS.User)Session[guid + "_User"];
            
            if (fillial != user.filialCode)
            {
                result = fillial;
            }

            return result;
        }
    }
}
