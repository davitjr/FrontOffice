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
    public class DepositCaseController : Controller
    {
        public JsonResult GetDepositCases(int filter)
        {

            List<XBS.DepositCase> cases = new List<xbs.DepositCase>();
            cases = XBService.GetDepositCases((xbs.ProductQualityFilter)filter);
            Dictionary<string, string> filialList = InfoService.GetFilialList();
            if (cases.Count > 0)
            {
                for (int i = 0; i < cases.Count; i++)
                {
                    cases[i].FilialName = filialList[cases[i].FilialCode.ToString()];
                }
            }
            return Json(cases, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDepositCase(ulong productId)
        {
            xbs.DepositCase depositCase = XBService.GetDepositCase(productId);
            if (depositCase.JointCustomers != null && depositCase.JointCustomers.Count > 0)
            {
                List<XBS.KeyValuePairOfunsignedLongstring> JointCustomers = new List<xbs.KeyValuePairOfunsignedLongstring>();

                foreach (XBS.KeyValuePairOfunsignedLongstring customer in depositCase.JointCustomers)
                {
                    string CustomerDescription = ACBAOperationService.GetCustomerDescription(customer.key);
                    xbs.KeyValuePairOfunsignedLongstring Customer=new xbs.KeyValuePairOfunsignedLongstring();
                    Customer.key=customer.key;
                    Customer.value=Utility.ConvertAnsiToUnicode( CustomerDescription);
                    JointCustomers.Add(Customer);
                }
                depositCase.JointCustomers = new List<xbs.KeyValuePairOfunsignedLongstring>();
                depositCase.JointCustomers.AddRange(JointCustomers);
            }
            if (depositCase.ServicingSetNumber != 0)
            {
                depositCase.ServicingUserDescrition =Utility.ConvertAnsiToUnicode( ACBAOperationService.GetCasherDescription(depositCase.ServicingSetNumber));
            }
            return Json(depositCase, JsonRequestBehavior.AllowGet);
        }

        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult DepositCases()
        {
            return PartialView("DepositCases");
        }
        public ActionResult DepositCaseDetails()
        {
            return PartialView("DepositCaseDetail");
        }


        

       
    }
}