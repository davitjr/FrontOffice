using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class LeasingCustomerClassificationController : Controller
    {
        // GET: LeasingCustomerClassification
        public ActionResult Index()
        {
            return View("LeasingCustomerClassification");
        }

        public ActionResult AddConnectionGroundsForNotClassifyingWithCustomer()
        {
            return PartialView("AddConnectionGroundsForNotClassifyingWithCustomer");
        }

        public ActionResult AddCustomerSubjectiveClassificationGrounds()
        {
            return PartialView("AddCustomerSubjectiveClassificationGrounds");
        }

        public ActionResult SubjectiveClassificationDetails()
        {
            return PartialView("SubjectiveClassificationDetails");
        }

        public ActionResult GetConnectionGroundsForClassifyingWithCustomerDetails()
        {
            return PartialView("GetConnectionGroundsForClassifyingWithCustomerDetails");
        }

        public ActionResult NotClassifyingWithCustomerDetails()
        {
            return PartialView("NotClassifyingWithCustomerDetails");
        }

        public ActionResult DeleteConnectionGroundsForNotClassifyingWithCustomer()
        {
            return PartialView("DeleteConnectionGroundsForNotClassifyingWithCustomer");
        }

        public ActionResult AddConnectionGroundsForClassifyingWithCustomer()
        {
            return PartialView("AddConnectionGroundsForClassifyingWithCustomer");
        }

        public ActionResult CloseConnectionGroundsForClassifyingWithCustomer()
        {
            return PartialView("CloseConnectionGroundsForClassifyingWithCustomer");
        }

        public ActionResult CustomerClassificationHistoryDetails()
        {
            return PartialView("CustomerClassificationHistoryDetails");
        }

        public ActionResult LeasingCustomerConnection()
        {
            return PartialView("LeasingCustomerConnection");
        }

        public ActionResult AddGroundsForNotClassifyingCustomerLoan()
        {
            return PartialView("AddGroundsForNotClassifyingCustomerLoan");
        }
        public ActionResult GetGroundsForNotClassifyingCustomerLoanDetails()
        {
            return PartialView("GetGroundsForNotClassifyingCustomerLoanDetails");
        }

        public ActionResult CloseGroundsForNotClassifyingCustomerLoan()
        {
            return PartialView("CloseGroundsForNotClassifyingCustomerLoan");
        }

        public ActionResult EditCustomerSubjectiveClassificationGrounds()
        {
            return PartialView("EditCustomerSubjectiveClassificationGrounds");
        }

        //--------------
        //public JsonResult GetUserPermission()
        //{
        //    CoreBanking.CoreBankService.User user = null;
        //    GetUser(ref user);
        //    Permission permission = new Permission(user);
        //    return Json(permission.GetUserPermissions(), JsonRequestBehavior.AllowGet);
        //}

        public JsonResult GetLeasingCustomerInfo(long customerNumber)
        {
            return Json(XBService.GetLeasingCustomerInfo(customerNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingReasonTypes(short classificationType)
        {
            return Json(XBService.GetLeasingReasonTypes(classificationType), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingRiskDaysCountAndName(byte riskClassCode)
        {
            return Json(XBService.GetLeasingRiskDaysCountAndName(riskClassCode), JsonRequestBehavior.AllowGet);
        }


        // Ավելացնում է հաճախորդ (հաճախորդի սուբյեկտիվ դասակարգման հիմքեր աղյուսակում)
        public ActionResult AddLeasingCustomerSubjectiveClassificationGrounds(xbs.LeasingCustomerClassification obj)
        {

            xbs.ActionResult result = new xbs.ActionResult();

            if (obj.LeasingCustomerNumber == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Հաճախորդի համարը նշված չէ:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (Convert.ToInt32(obj.ClassificationReason) == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Ընտրեք դասակարգման հիմքը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (string.IsNullOrEmpty(obj.RiskClassName))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք դասը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if ((Convert.ToInt32(obj.ClassificationReason) == 4 || Convert.ToInt32(obj.ClassificationReason) == 9) && string.IsNullOrEmpty(obj.AdditionalDescription))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք լրացուցիչ նկարագրությունը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else
            {
                result = XBService.AddLeasingCustomerSubjectiveClassificationGrounds(obj);
            }


            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingCustomerSubjectiveClassificationGroundsByID(int Id)
        {
            return Json(XBService.GetLeasingCustomerSubjectiveClassificationGroundsByID(Id), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CloseLeasingCustomerSubjectiveClassificationGrounds(int Id)
        {
            return Json(XBService.CloseLeasingCustomerSubjectiveClassificationGrounds(Id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingCustomerSubjectiveClassificationGrounds(long customerNumber, byte isActive)
        {
            bool active = false;
            if (isActive == 1)
            {
                active = true;
            }
            return Json(XBService.GetLeasingCustomerSubjectiveClassificationGrounds(customerNumber, active), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingConnectionGroundsForNotClassifyingWithCustomer(long customerNumber, byte isActive)
        {
            return Json(XBService.GetLeasingConnectionGroundsForNotClassifyingWithCustomer(customerNumber, isActive), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingInterconnectedPersonNumber(long customerNumber)
        {
            return Json(XBService.GetLeasingInterconnectedPersonNumber(customerNumber), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AddLeasingConnectionGroundsForNotClassifyingWithCustomer(xbs.LeasingCustomerClassification obj)
        {

            xbs.ActionResult result = new xbs.ActionResult();

            if (obj.LeasingCustomerNumber == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Հաճախորդի համարը նշված չէ:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (string.IsNullOrEmpty(obj.ReportNumber))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք զեկուցագրի համարը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (obj.ReportDate == default(DateTime))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք զեկուցագրի ամսաթիվը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (obj.LinkedCustomerNumber == obj.LeasingCustomerNumber)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Ընրվել է դասակարգվող հաճախորդը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else
            {
                result = XBService.AddLeasingConnectionGroundsForNotClassifyingWithCustomer(obj);
            }


            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingConnectionGroundsForNotClassifyingWithCustomerByID(int id)
        {
            return Json(XBService.GetLeasingConnectionGroundsForNotClassifyingWithCustomerByID(id), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CloseLeasingConnectionGroundsForNotClassifyingWithCustomer(string docNumber, DateTime docDate, int deletedId)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.CloseLeasingConnectionGroundsForNotClassifyingWithCustomer(docNumber, docDate, deletedId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingConnectionGroundsForClassifyingWithCustomer(long customerNumber, byte isActive)
        {
            return Json(XBService.GetLeasingConnectionGroundsForClassifyingWithCustomer(customerNumber, isActive), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddLeasingConnectionGroundsForClassifyingWithCustomer(xbs.LeasingCustomerClassification obj)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            if (obj.LeasingCustomerNumber == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Հաճախորդի համարը նշված չէ:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (string.IsNullOrEmpty(obj.ReportNumber))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք զեկուցագրի համարը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (obj.ReportDate == default(DateTime))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք զեկուցագրի ամսաթիվը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (obj.LinkedCustomerNumber == obj.LeasingCustomerNumber)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Ընրվել է դասակարգվող հաճախորդը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else
            {
                byte newData = 1;
                result = XBService.AddOrCloseLeasingConnectionGroundsForClassifyingWithCustomer(obj, newData);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CloseLeasingConnectionGroundsForClassifyingWithCustomer(xbs.LeasingCustomerClassification obj, byte isClos)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            if (obj.LeasingCustomerNumber == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Հաճախորդի համարը նշված չէ:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (string.IsNullOrEmpty(obj.ReportNumber))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք զեկուցագրի համարը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (obj.ReportDate == default(DateTime))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք զեկուցագրի ամսաթիվը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (obj.LinkedCustomerNumber == obj.LeasingCustomerNumber)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Ընրվել է դասակարգվող հաճախորդը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (isClos == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Կարգավիճակը փակված է:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else
            {
                byte closeData = 2;
                result = XBService.AddOrCloseLeasingConnectionGroundsForClassifyingWithCustomer(obj, closeData);
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetLeasingConnectionGroundsForClassifyingWithCustomerByID(int id, long customerNumber)
        {
            return Json(XBService.GetLeasingConnectionGroundsForClassifyingWithCustomerByID(id, customerNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingCustomerClassificationHistoryByID(int id, long loanFullNumber, int lpNumber)
        {
            return Json(XBService.GetLeasingCustomerClassificationHistoryByID(id, loanFullNumber, lpNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult LeasingCustomerConnectionResult(int CustomerNumberN1, int CustomerNumberN2)
        {
            return Json(XBService.LeasingCustomerConnectionResult(CustomerNumberN1, CustomerNumberN2), JsonRequestBehavior.AllowGet);
        }

        public JsonResult PrintLeasingCustomerConnectionData(long selectedCustomerNumberN1, long customerN2)
        {

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "customer_number", value: selectedCustomerNumberN1.ToString());
            parameters.Add(key: "lp_customer_number", value: customerN2.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }
        //public ActionResult CloseConnectionGroundsForClassifyingWithCustomer(long custNamber, long interconnectedPerson3, string repNumber3, DateTime date3, int id, byte isClos)
        //{
        //    xbs.ActionResult result = new xbs.ActionResult();

        //    if (custNamber == 0)
        //    {
        //        xbs.ActionError error = new xbs.ActionError();
        //        error.Description = "Հաճախորդի համարը նշված չէ:";
        //        result.Errors = new List<xbs.ActionError>();
        //        result.ResultCode = XBS.ResultCode.ValidationError;
        //        result.Errors.Add(error);
        //    }
        //    else if (string.IsNullOrEmpty(repNumber3))
        //    {
        //        xbs.ActionError error = new xbs.ActionError();
        //        error.Description = "Մուտքագրեք զեկուցագրի համարը:";
        //        result.Errors = new List<xbs.ActionError>();
        //        result.ResultCode = XBS.ResultCode.ValidationError;
        //        result.Errors.Add(error);
        //    }
        //    else if (date3 == default(DateTime))
        //    {
        //        xbs.ActionError error = new xbs.ActionError();
        //        error.Description = "Մուտքագրեք զեկուցագրի ամսաթիվը:";
        //        result.Errors = new List<xbs.ActionError>();
        //        result.ResultCode = XBS.ResultCode.ValidationError;
        //        result.Errors.Add(error);
        //    }
        //    else if (interconnectedPerson3 == custNamber)
        //    {
        //        xbs.ActionError error = new xbs.ActionError();
        //        error.Description = "Ընրվել է դասակարգվող հաճախորդը:";
        //        result.Errors = new List<xbs.ActionError>();
        //        result.ResultCode = XBS.ResultCode.ValidationError;
        //        result.Errors.Add(error);
        //    }
        //    else if (isClos == 0)
        //    {
        //        xbs.ActionError error = new xbs.ActionError();
        //        error.Description = "Կարգավիճակը փակված է:";
        //        result.Errors = new List<xbs.ActionError>();
        //        result.ResultCode = XBS.ResultCode.ValidationError;
        //        result.Errors.Add(error);
        //    }
        //    else
        //    {
        //        byte closeData = 2;
        //        result = XBService.AddOrCloseConnectionGroundsForClassifyingWithCustomer(custNamber, interconnectedPerson3, repNumber3, date3, closeData, id);
        //    }

        //    return Json(result, JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult CloseGroundsForNotClassifyingCustomerLoan(long appId, int id, string docNumber, DateTime docDate)
        //{
        //    xbs.ActionResult result = new xbs.ActionResult();


        //    if (string.IsNullOrEmpty(docNumber))
        //    {
        //        xbs.ActionError error = new xbs.ActionError();
        //        error.Description = "Մուտքագրեք զեկուցագրի համարը:";
        //        result.Errors = new List<xbs.ActionError>();
        //        result.ResultCode = XBS.ResultCode.ValidationError;
        //        result.Errors.Add(error);
        //    }
        //    else if (docDate == default(DateTime))
        //    {
        //        xbs.ActionError error = new xbs.ActionError();
        //        error.Description = "Մուտքագրեք զեկուցագրի ամսաթիվը:";
        //        result.Errors = new List<xbs.ActionError>();
        //        result.ResultCode = XBS.ResultCode.ValidationError;
        //        result.Errors.Add(error);
        //    }
        //    else if (id == 0)
        //    {
        //        xbs.ActionError error = new xbs.ActionError();
        //        error.Description = "Ընտրեք տողը";
        //        result.Errors = new List<xbs.ActionError>();
        //        result.ResultCode = XBS.ResultCode.ValidationError;
        //        result.Errors.Add(error);
        //    }
        //    else
        //    {
        //        result = XBService.CloseLeasingGroundsForNotClassifyingCustomerLoan(appId, id, docNumber, docDate);
        //    }
        //    return Json(result, JsonRequestBehavior.AllowGet);
        //}

        public JsonResult GetLeasingCustomerClassificationHistory(int leasingCustomerNumber, DateTime date)
        {
            return Json(XBService.GetLeasingCustomerClassificationHistory(leasingCustomerNumber, date), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingGroundsForNotClassifyingCustomerLoan(int leasingCustomerNumber, byte isActive)
        {
            return Json(XBService.GetLeasingGroundsForNotClassifyingCustomerLoan(leasingCustomerNumber, isActive), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingLoanInfo(int leasingCustNamber)
        {
            return Json(XBService.GetLeasingLoanInfo(leasingCustNamber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddLeasingGroundsForNotClassifyingCustomerLoan(xbs.LeasingCustomerClassification obj)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            if (obj.LeasingCustomerNumber == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Հաճախորդի համարը նշված չէ:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (obj.AppId == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Տվյալ տեսակի պրոդուկտի համար զեկուցագրի մուտքագրում չի թույլատրվում:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (string.IsNullOrEmpty(obj.ReportNumber))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք զեկուցագրի համարը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (obj.ReportDate == default(DateTime))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք զեկուցագրի ամսաթիվը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (string.IsNullOrEmpty(obj.AdditionalDescription))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք լրացուցիչ նկարագրությունը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else
            {
                result = XBService.AddLeasingGroundsForNotClassifyingCustomerLoan(obj);
            }
            return Json(result, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetLeasingGroundsForNotClassifyingCustomerLoanByID(int id)
        {
            return Json(XBService.GetLeasingGroundsForNotClassifyingCustomerLoanByID(id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CloseLeasingGroundsForNotClassifyingCustomerLoan(long appId, int id, string docNumber, DateTime docDate)
        {
            xbs.ActionResult result = new xbs.ActionResult();


            if (string.IsNullOrEmpty(docNumber))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք զեկուցագրի համարը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (docDate == default(DateTime))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք զեկուցագրի ամսաթիվը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (id == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Ընտրեք տողը";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else
            {
                result = XBService.CloseLeasingGroundsForNotClassifyingCustomerLoan(appId, id, docNumber, docDate);
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        // Խմբագրում է հաճախորդ (հաճախորդի սուբյեկտիվ դասակարգման հիմքեր աղյուսակում)

        public ActionResult EditLeasingCustomerSubjectiveClassificationGrounds(xbs.LeasingCustomerClassification obj)
        {

            xbs.ActionResult result = new xbs.ActionResult();

            if (obj.LeasingCustomerNumber == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Հաճախորդի համարը նշված չէ:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (Convert.ToInt32(obj.ClassificationReason) == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Ընտրեք դասակարգման հիմքը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if (Convert.ToInt32(obj.RiskClassName) == 0)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք դասը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else if ((Convert.ToInt32(obj.ClassificationReason) == 4 || Convert.ToInt32(obj.ClassificationReason) == 9) && string.IsNullOrEmpty(obj.AdditionalDescription))
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Description = "Մուտքագրեք լրացուցիչ նկարագրությունը:";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = XBS.ResultCode.ValidationError;
                result.Errors.Add(error);
            }
            else
            {
                result = XBService.EditLeasingCustomerSubjectiveClassificationGrounds(obj);
            }


            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingSubjectiveClassificationGroundsByIDForEdit(int Id)
        {
            return Json(XBService.GetLeasingSubjectiveClassificationGroundsByIDForEdit(Id), JsonRequestBehavior.AllowGet);
        }

        public void PrintOneMoreTimeClassifiedCustomersReport()
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            ReportService.PrintOneMoreTimeClassifiedCustomersReport(parameters);
        }

        public void PrintCustomersWithOpenBaseReport()
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            ReportService.PrintLeasingCustomersWithOpenBaseReport(parameters);
        }

        public void PrintClassificationBaseChangedCustomersReport()
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            ReportService.PrintLeasingClassificationBaseChangedCustomersReport(parameters);
        }
    }
}