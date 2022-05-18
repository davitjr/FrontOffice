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

        [OutputCache(CacheProfile = "AppViewCache")]
        // GET: Leasings 
        public ActionResult Leasings()
        {
            return PartialView("Leasings");
        }
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

        public JsonResult GetLeasings()
        {            
            return Json(XBService.GetLeasings(), JsonRequestBehavior.AllowGet);            
        }

        public JsonResult GetLeasing(ulong productId)
        {
            return Json(XBService.GetLeasing(productId), JsonRequestBehavior.AllowGet);
        }
        public ActionResult LeasingMainDetails()
        {
            return PartialView("LeasingMainDetails");
        }

        public JsonResult GetLeasingGrafikApplication(string loanFullNumber, DateTime startDate)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "loanFullNumber", value: loanFullNumber);
            parameters.Add(key: "dateOfBeginning", value: startDate.Date.ToString("dd/MMM/yy"));
            parameters.Add(key: "calculationStartDate", value: XBService.GetCurrentOperDay().Date.ToString("dd/MMM/yy"));
            parameters.Add(key: "Language_id", value: "0");

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingGrafik(ulong productId, byte firstReschedule = 0)
        {
            return Json(XBService.GetLeasingGrafik(productId, firstReschedule), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LeasingGrafik()
        {
            return PartialView("LeasingGrafik");
        }

        public ActionResult LeasingGrafikFirst()
        {
            return PartialView("LeasingGrafikFirst");
        }

        public ActionResult LeasingOverdueDetails()
        {
            return PartialView("LeasingOverdueDetails");
        }

        public JsonResult GetLeasingOverdueDetails(ulong productId)
        {
            return Json(XBService.GetLeasingOverdueDetails(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult LeasingPaymentOrder()
        {
            return PartialView("LeasingPaymentOrder");
        }

        public ActionResult LeasingTransitPaymentOrder()
        {
            return PartialView("LeasingTransitPaymentOrder");
        }

        public JsonResult GetManagerCustomerNumber(ulong customerNumber)
        {
            return Json(XBService.GetManagerCustomerNumber(customerNumber), JsonRequestBehavior.AllowGet);
        }
    }
}