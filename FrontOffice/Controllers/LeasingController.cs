using FrontOffice.Service;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class LeasingController : Controller
    {
        public JsonResult GetLeasingCustomers(string searchParams)
        {
            xbs.SearchLeasingCustomer searchLeasingCustomer = JsonConvert.DeserializeObject<xbs.SearchLeasingCustomer>(searchParams);
            return Json(XBService.GetSearchedLeasingCustomers(searchLeasingCustomer), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerLoans(string searchParams)
        {
            xbs.SearchLeasingLoan searchLeasingLoan = JsonConvert.DeserializeObject<xbs.SearchLeasingLoan>(searchParams);
            return Json(XBService.GetSearchedLeasingLoans(searchLeasingLoan), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingDetailedInformation(long loanFullNumber, DateTime dateOfBeginning)
        {
            return Json(XBService.GetLeasingDetailedInformation(loanFullNumber, dateOfBeginning), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetLeasingInsuranceInformation(long loanFullNumber, DateTime dateOfBeginning)
        {
            return Json(XBService.GetLeasingInsuranceInformation(loanFullNumber, dateOfBeginning), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingOperDay()
        {
            return Json(XBService.GetLeasingOperDay(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LeasingDetails()
        {
            return PartialView("LeasingDetails");
        }

        public ActionResult LeasingDetailedInformation()
        {
            return PartialView("LeasingDetailedInformation");
        }
        public ActionResult LeasingInsuranceDetails()
        {
            return PartialView("LeasingInsuranceDetails");
        }

        public JsonResult PrintLeasingSchedules(long loanFullNumber, DateTime dateOfBeginning, string exportFormat = "pdf")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "loan_full_number", value: loanFullNumber.ToString());
            parameters.Add(key: "date_of_beginning", value: Convert.ToDateTime(dateOfBeginning).ToString("dd/MMM/yy"));
            return Json(parameters, JsonRequestBehavior.AllowGet);
        }
        public JsonResult PrintLeasingSchedulesSubsid(long loanFullNumber, DateTime dateOfBeginning, string exportFormat = "pdf")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "loan_full_number", value: loanFullNumber.ToString());
            parameters.Add(key: "date_of_beginning", value: Convert.ToDateTime(dateOfBeginning).ToString("dd/MMM/yy"));
            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPartlyMatureAmount(string contractNumber)
        {
            return Json(XBService.GetPartlyMatureAmount(contractNumber), JsonRequestBehavior.AllowGet);
        }
    }
}