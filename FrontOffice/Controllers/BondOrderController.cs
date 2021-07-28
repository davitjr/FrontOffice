using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using Newtonsoft.Json;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class BondOrderController : Controller
    {
        public ActionResult BondOrder()
        {
            return PartialView("BondOrder");

        }

        [ActionAccessFilter(actionType = ActionType.BondOrderSave)]
        public ActionResult SaveBondOrder(xbs.BondOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveBondOrder(order);
            return Json(result);
            
        }


        public ActionResult BondOrderDetails()
        {
            return View("BondOrderDetails");
        }

        public JsonResult GetBondOrder(int orderID)
        {
            return Json(XBService.GetBondOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountsForCouponRepayment()
        {
            List<xbs.Account> accounts = new List<xbs.Account>();

            accounts = XBService.GetAccountsForCouponRepayment();

            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountsForBondRepayment(string currency)
        {
            List<xbs.Account> accounts = new List<xbs.Account>();

            accounts = XBService.GetAccountsForBondRepayment(currency);

            return Json(accounts, JsonRequestBehavior.AllowGet);
        }

        public JsonResult PrintBondCustomerCard(string accountNumber,string accountNumberForBond)
        {
            Dictionary<string, string> obj = new Dictionary<string, string>();
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string guid = Utility.GetSessionId();

            parameters.Add(key: "customer_number", value: customerNumber.ToString());
            parameters.Add(key: "accountNumberForBond", value: accountNumberForBond);
            parameters.Add(key: "accountNumber", value: accountNumber.ToString());
            parameters.Add(key: "identityId", value: customer.IdentityID.ToString());

            if (customer.CustomerType == 6)
            {
                parameters.Add(key: "isIndividual", value: "1");
            }
            else
            {
                parameters.Add(key: "isIndividual", value: "0");
            }

            obj.Add("result", JsonConvert.SerializeObject(parameters));
            obj.Add("customerType", JsonConvert.SerializeObject(customer.CustomerType));

            return Json(obj, JsonRequestBehavior.AllowGet);
        }



        public void GetBondContract(string accountNumberForCoupon, string accountNumberForBond, DateTime contractDate)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "date", value: contractDate.ToString("dd/MMM/yy"));
            parameters.Add(key: "accountNumberForCoupon", value: accountNumberForCoupon);
            parameters.Add(key: "accountNumberForBond", value: accountNumberForBond);



            ContractService.BondContract(parameters);
        }

        

    }
}