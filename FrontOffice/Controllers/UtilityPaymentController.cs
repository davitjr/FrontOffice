using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using xbsInfo = FrontOffice.XBSInfo;
using FrontOffice.Models;
namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class UtilityPaymentController : Controller
    {
        public ActionResult UtilityPaymentTypes()
        {
            return PartialView("~/Views/UtilityPayments/ChooseUtilityPayment.cshtml");
        }

        public ActionResult UtilityPaymentSearch()
        {
            return PartialView("~/Views/UtilityPayments/SearchUtilityPayments.cshtml");
        }

        public ActionResult UtilityPaymentOrder()
        {
            return PartialView("~/Views/UtilityPayments/UtilityPaymentOrder.cshtml");
        }


        public ActionResult PaidInThisMonth()
        {
            return PartialView("~/Views/UtilityPayments/PaidInThisMonth.cshtml");
        }

        public ActionResult ENAPayments()
        {
            return PartialView("~/Views/UtilityPayments/ENAPayments.cshtml");
        }

        public JsonResult FindUtilityPayments(xbs.SearchCommunal searchCommunal)
        {

            string validationResult = ValidateSearchData(searchCommunal);

            if (validationResult == "")
            {
                return Json(XBService.FindUtilityPayments(searchCommunal), JsonRequestBehavior.AllowGet);
            }
            else
            {
                xbs.ActionResult result = new xbs.ActionResult();
                result.ResultCode = xbs.ResultCode.ValidationError;
                result.Errors = new List<xbs.ActionError>();

                xbs.ActionError actionError = new xbs.ActionError();
                actionError.Description = validationResult;

                result.Errors.Add(actionError);

                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetUtilityPaymentDetails(short communalType, string abonentNumber, short checkType, string branchCode, short abonentType)
        {
            return Json(XBService.GetUtilityPaymentDetails(communalType, abonentNumber, checkType, branchCode, abonentType), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.UtilityPaymentOrderSave)]
        public ActionResult SavePaymentOrder(xbs.UtilityPaymentOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            //order.Type = xbs.OrderType.CommunalPayment;
            order.SubType = 1;
            order.Currency = "AMD";
            xbs.ActionResult result = XBService.SaveUtilityPaymentOrder(order);

            if (result.ResultCode == xbs.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);//must return error view
        }

        public string ValidateSearchData(xbs.SearchCommunal searchCommunal)
        {

            string errorDescription = "";

            if ((searchCommunal.CommunalType == xbs.CommunalTypes.ArmenTel || searchCommunal.CommunalType == xbs.CommunalTypes.VivaCell || searchCommunal.CommunalType == xbs.CommunalTypes.Orange) && searchCommunal.PhoneNumber.Length != 8)
            {
                errorDescription = "Հեռախոսահամարի երկարությունը պետք է լինի 8 նիշ:";

            }
            else if (searchCommunal.CommunalType == xbs.CommunalTypes.UCom && (searchCommunal.AbonentNumber.Length < 7 || searchCommunal.AbonentNumber.Length > 8))
            {
                errorDescription = "Պայմանագրի համարի երկարությունը պետք է լինի 7 կամ 8 նիշ:";
            }
            else if (searchCommunal.CommunalType == xbs.CommunalTypes.COWater)
            {
                if (string.IsNullOrEmpty(searchCommunal.Branch))
                {
                    errorDescription = "Ընտրեք մասնաճյուղը:";

                }
                else if (string.IsNullOrEmpty(searchCommunal.AbonentNumber) && string.IsNullOrEmpty(searchCommunal.Name))
                {
                    errorDescription = "Լրացրեք ջրօգտ.կոդը կամ Անուն Ազգանունը:";

                }


            }
            return errorDescription;
        }

        public string GetUtilityTypeDescription(short utilityType)
        {
            return InfoService.GetUtilityPaymentTypes().FindLast(m => m.Key == utilityType).Value;
        }

        public string GetUtilitySearchDescription(short utilityType)
        {
            string paymentDescription = string.Empty;
            switch (utilityType)
            {
                case 3:
                case 4:
                case 5:
                case 6:
                    {
                        paymentDescription = paymentDescription + Environment.NewLine + "Հեռախոսահամար XXXXX... (առանց կոդ)";
                    }
                    break;
                case 7:
                    {
                        paymentDescription = "Հեռախոսահամար 99XXXXXX (8 նիշ)";
                    }
                    break;
                case 8:
                    {
                        paymentDescription = "Հեռախոսահամար 93XXXXXX (8 նիշ)";
                    }
                    break;
                case 10:
                    {
                        paymentDescription = "Հեռախոսահամար 95XXXXXX (8 նիշ)";
                    }
                    break;
                case 11:
                    {
                        paymentDescription = "Պայմանագրի համար XXXXXXX_ (7 կամ 8 նիշ)";
                    }
                    break;
                case 17:
                    {
                        paymentDescription = "Պայմանագրի համար XXXXXXXX  (8 նիշ)";
                    }
                    break;
                default:
                    break;
            }
            // if (utilityType >= 3 && utilityType <= 6)
            // {
            //     paymentDescription = paymentDescription + Environment.NewLine + "Հեռախոսահամար XXXXX... (առանց կոդ)";
            // }
            //else if (utilityType == 8)
            // {
            //     paymentDescription = "Հեռախոսահամար 93XXXXXX (8 նիշ)";
            // }
            // else if (utilityType == 10)
            // {
            //     paymentDescription = "Հեռախոսահամար 95XXXXXX (8 նիշ)";
            // }
            // else if (utilityType == 7)
            // {
            //     paymentDescription = "Հեռախոսահամար 99XXXXXX (8 նիշ)";
            // }
            // else if (utilityType == 17)
            // {
            //     paymentDescription = "Պայմանագրի համար 00XXXXXX կամ 11XXXXXX կամ 13XXXXXX  (8 նիշ)";
            // }
            // else if (utilityType == 11)
            // {
            //     paymentDescription = "Պայմանագրի համար XXXXXXX_ (7 կամ 8 նիշ)";
            // }

            return paymentDescription;
        }

        public ActionResult UtilityPaymentDetails()
        {
            return PartialView("~/Views/UtilityPayments/UtilityPaymentDetails.cshtml");
        }
        public JsonResult GetUtilityPaymentOrder(int orderID)
        {
            return Json(XBService.GetUtilityPaymentOrder(orderID), JsonRequestBehavior.AllowGet);
        }
        public ActionResult UtilityPaymentOrderDetails()
        {
            return PartialView("~/Views/UtilityPayments/UtilityPaymentOrderDetails.cshtml");
        }

        public JsonResult GetUtilitySearchBranches(xbsInfo.CommunalTypes communalType)
        {
            return Json(InfoService.GetCommunalBranchList(communalType), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUtilityPaymentReport(xbs.UtilityPaymentOrder paymentOrder, bool isCopy)
        {
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();
            List<KeyValuePair<string, string>> parameters = new List<KeyValuePair<string, string>>();
            string customerDescription = "";
            CustomerMainDataViewModel customer = new CustomerMainDataViewModel();

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            if (customerNumber != 0)
            {

                customer.Get(customerNumber);
            }

            if (paymentOrder.OPPerson != null && (paymentOrder.Type == xbs.OrderType.CashCommunalPayment || customer != null && customer.CustomerType == 6))
                customerDescription = paymentOrder.OPPerson.PersonLastName + " " + paymentOrder.OPPerson.PersonName;
            else
            {
                customerDescription = customer.CustomerDescription;
            }

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];

            parameters = XBService.GetCommunalReportParameters((short)paymentOrder.CommunalType, (short)paymentOrder.AbonentType, paymentOrder.Code, paymentOrder.Branch);

            paymentOrder.Description = Utility.ConvertUnicodeToAnsi(paymentOrder.Description);
            customerDescription = Utility.ConvertUnicodeToAnsi(customerDescription);

            if (paymentOrder.CommunalType == xbs.CommunalTypes.ENA)
            {
                reportParameters = PrintEnaReport(paymentOrder, parameters, user, customerNumber, customerDescription, isCopy);
            }
            else if (paymentOrder.CommunalType == xbs.CommunalTypes.UCom)
            {
                reportParameters = PrintUComReport(paymentOrder, parameters, user, customerNumber, customerDescription, isCopy);
            }
            else if (paymentOrder.CommunalType == xbs.CommunalTypes.YerWater || paymentOrder.CommunalType == xbs.CommunalTypes.ArmWater)
            {
                reportParameters = PrintWaterReport(paymentOrder, parameters, user, customerNumber, customerDescription, isCopy);
            }
            else if (paymentOrder.CommunalType == xbs.CommunalTypes.VivaCell)
            {
                parameters = XBService.GetCommunalReportParameters((short)paymentOrder.CommunalType, (short)paymentOrder.AbonentType, paymentOrder.Code, paymentOrder.Branch);

                if (!(parameters == null || parameters.Count == 0))
                {
                    reportParameters = PrintVivaCellReport(paymentOrder, parameters, user, customerDescription, isCopy);
                }
            }
            else if (paymentOrder.CommunalType == xbs.CommunalTypes.ArmenTel || paymentOrder.CommunalType == xbs.CommunalTypes.BeelineInternet)
            {
                reportParameters = PrintArmenTelReport(paymentOrder, parameters, user, customerNumber, customerDescription, isCopy);
            }
            else if (paymentOrder.CommunalType == xbs.CommunalTypes.Orange)
            {
                parameters = XBService.GetCommunalReportParameters((short)paymentOrder.CommunalType, (short)paymentOrder.AbonentType, paymentOrder.Code, paymentOrder.Branch);
                reportParameters = PrintOrangeReport(paymentOrder, parameters, user, customerDescription, isCopy);
            }
            else if (paymentOrder.CommunalType == xbs.CommunalTypes.Gas)
            {
                reportParameters = PrintGasReport(paymentOrder, parameters, user, customerDescription, isCopy);
            }
            else if (paymentOrder.CommunalType == xbs.CommunalTypes.Trash)
            {
                reportParameters = PrintTrashReport(paymentOrder, parameters, user, customerDescription, isCopy);
            }
            else if (paymentOrder.CommunalType == xbs.CommunalTypes.COWater)
            {
                reportParameters = PrintWaterCoPaymentReport(paymentOrder, parameters, user, customerDescription, isCopy);
            }
            return Json(reportParameters, JsonRequestBehavior.AllowGet);
        }

        public Dictionary<string, string> PrintEnaReport(xbs.UtilityPaymentOrder paymentOrder, List<KeyValuePair<string, string>> parameters, xbs.User user, ulong customerNumber, string customerDescription, bool isCopy)
        {
            byte operationType = 0;
            if (paymentOrder.Type == xbs.OrderType.CashCommunalPayment)
            {
                operationType = 1;
            }
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();
            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "OrderNum", value: paymentOrder.OrderNumber);
            reportParameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber.ToString());
            reportParameters.Add(key: "CreditAccount", value: "0");
            reportParameters.Add(key: "PhoneNumber", value: "");
            reportParameters.Add(key: "AmountDebt", value: "0");
            reportParameters.Add(key: "AmountPaid", value: paymentOrder.Amount.ToString());
            reportParameters.Add(key: "PayerName", value: customerDescription);
            reportParameters.Add(key: "PaymentDescription", value: paymentOrder.Description);
            reportParameters.Add(key: "PaymentDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            reportParameters.Add(key: "RePrint", value: isCopy ? "1" : "0");
            reportParameters.Add(key: "Cash", value: operationType.ToString());
            reportParameters.Add(key: "Branch", value: paymentOrder.Branch);
            reportParameters.Add(key: "F_J", value: (paymentOrder.AbonentType == 1 ? "F" : "J"));
            reportParameters.Add(key: "UniqueNumber", value: paymentOrder.Code);
            reportParameters.Add(key: "Customer_Number", value: customerNumber.ToString());
            reportParameters.Add(key: "code", value: paymentOrder.Code);
            reportParameters.Add(key: "DocID", value: paymentOrder.Id.ToString());
            foreach (KeyValuePair<string, string> oneParameter in parameters)
            {
                reportParameters.Add(key: oneParameter.Key, value: oneParameter.Value);
            }
            return reportParameters;
        }

        public Dictionary<string, string> PrintVivaCellReport(xbs.UtilityPaymentOrder paymentOrder, List<KeyValuePair<string, string>> parameters, xbs.User user, string customerDescription, bool isCopy)
        {
            byte operationType = 0;
            if (paymentOrder.Type == xbs.OrderType.CashCommunalPayment)
            {
                operationType = 1;
            }
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();
            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "OrderNum", value: paymentOrder.OrderNumber);
            reportParameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber.ToString());
            reportParameters.Add(key: "CreditAccount", value: "0");
            reportParameters.Add(key: "PhoneNumber", value: paymentOrder.Code);
            reportParameters.Add(key: "AmountPaid", value: paymentOrder.Amount.ToString());
            reportParameters.Add(key: "AmountCurrency", value: "AMD");
            reportParameters.Add(key: "PayerName", value: customerDescription);
            reportParameters.Add(key: "PaymentDescription", value: paymentOrder.Description);
            reportParameters.Add(key: "PaymentDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            reportParameters.Add(key: "PaymentTime", value: DateTime.Now.ToString("HH:mm:ss"));
            reportParameters.Add(key: "RePrint", value: isCopy ? "1" : "0");
            reportParameters.Add(key: "Cash", value: operationType.ToString());
            reportParameters.Add(key: "TransactionNumber", value: "0");

            foreach (KeyValuePair<string, string> oneParameter in parameters)
            {
                reportParameters.Add(key: oneParameter.Key, value: oneParameter.Value);
            }

            return reportParameters;

        }

        public Dictionary<string, string> PrintArmenTelReport(xbs.UtilityPaymentOrder paymentOrder, List<KeyValuePair<string, string>> parameters, xbs.User user, ulong customerNumber, string customerDescription, bool isCopy)
        {
            byte operationType = 0;
            if (paymentOrder.Type == xbs.OrderType.CashCommunalPayment)
            {
                operationType = 1;
            }
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();
            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "OrderNum", value: paymentOrder.OrderNumber);
            reportParameters.Add(key: "id", value: "0");
            reportParameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber.ToString());
            reportParameters.Add(key: "CreditAccount", value: "0");
            reportParameters.Add(key: "PhoneNumber", value: paymentOrder.Code);
            reportParameters.Add(key: "AmountDebt", value: ((paymentOrder.Debt > 0 || paymentOrder.Debt == null) ? 0 : paymentOrder.Debt).ToString());
            reportParameters.Add(key: "AmountPaid", value: paymentOrder.Amount.ToString());
            reportParameters.Add(key: "AmountCurrency", value: "AMD");
            reportParameters.Add(key: "AbonentName", value: "");
            reportParameters.Add(key: "PayerName", value: customerDescription);
            reportParameters.Add(key: "PaymentDescription", value: paymentOrder.Description);
            reportParameters.Add(key: "PaymentDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            reportParameters.Add(key: "PaymentTime", value: DateTime.Now.ToString("HH:mm:ss"));
            reportParameters.Add(key: "RePrint", value: isCopy ? "1" : "0");
            reportParameters.Add(key: "Cash", value: operationType.ToString());
            reportParameters.Add(key: "Customer_Number", value: customerNumber.ToString());
            reportParameters.Add(key: "TransactionNumber", value: "0");

            return reportParameters;
        }

        public Dictionary<string, string> PrintUComReport(xbs.UtilityPaymentOrder paymentOrder, List<KeyValuePair<string, string>> parameters, xbs.User user, ulong customerNumber, string customerDescription, bool isCopy)
        {
            byte operationType = 0;
            if (paymentOrder.Type == xbs.OrderType.CashCommunalPayment)
            {
                operationType = 1;
            }
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();
            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "OrderNum", value: paymentOrder.OrderNumber);
            reportParameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber.ToString());
            reportParameters.Add(key: "CreditAccount", value: "0");
            reportParameters.Add(key: "AbonentNumber", value: paymentOrder.Code);
            reportParameters.Add(key: "AmountPaid", value: paymentOrder.Amount.ToString());
            reportParameters.Add(key: "AmountCurrency", value: "AMD");
            reportParameters.Add(key: "PayerName", value: customerDescription);
            reportParameters.Add(key: "PaymentDescription", value: paymentOrder.Description);
            reportParameters.Add(key: "PaymentDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            reportParameters.Add(key: "PaymentTime", value: DateTime.Now.ToString("HH:mm:ss"));
            reportParameters.Add(key: "RePrint", value: isCopy ? "1" : "0");
            reportParameters.Add(key: "Cash", value: operationType.ToString());
            foreach (KeyValuePair<string, string> oneParameter in parameters)
            {
                reportParameters.Add(key: oneParameter.Key, value: oneParameter.Value);
            }
            return reportParameters;
        }

        public Dictionary<string, string> PrintWaterReport(xbs.UtilityPaymentOrder paymentOrder, List<KeyValuePair<string, string>> parameters, xbs.User user, ulong customerNumber, string customerDescription, bool isCopy)
        {
            byte operationType = 0;
            if (paymentOrder.Type == xbs.OrderType.CashCommunalPayment)
            {
                operationType = 1;
            }
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();
            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "UniqueNumber", value: "0");
            reportParameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber.ToString());
            reportParameters.Add(key: "CreditAccount", value: "0");
            reportParameters.Add(key: "AmountDebt", value: "0");
            reportParameters.Add(key: "AmountPaid", value: paymentOrder.Amount.ToString());
            reportParameters.Add(key: "AbonentName", value: "");
            reportParameters.Add(key: "PayerName", value: customerDescription);
            reportParameters.Add(key: "PaymentDescription", value: paymentOrder.Description);
            reportParameters.Add(key: "PaymentDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            reportParameters.Add(key: "RePrint", value: isCopy ? "1" : "0");
            reportParameters.Add(key: "Cash", value: operationType.ToString());
            reportParameters.Add(key: "SubNumber", value: paymentOrder.Code.Trim());
            reportParameters.Add(key: "TransactionNumber", value: "0");
            reportParameters.Add(key: "OrderNumber", value: paymentOrder.OrderNumber);
            reportParameters.Add(key: (paymentOrder.CommunalType == xbs.CommunalTypes.YerWater) ? "ErJurBranch" : "ArmWaterBranch", value: paymentOrder.Branch.ToString());

            if (paymentOrder.CommunalType == xbs.CommunalTypes.YerWater)
            {
                reportParameters.Add(key: "F_J", value: (paymentOrder.AbonentType == 1 ? "F" : "J"));
            }

            return reportParameters;

        }

        public Dictionary<string, string> PrintOrangeReport(xbs.UtilityPaymentOrder paymentOrder, List<KeyValuePair<string, string>> parameters, xbs.User user, string customerDescription, bool isCopy)
        {
            byte operationType = 0;
            if (paymentOrder.Type == xbs.OrderType.CashCommunalPayment)
            {
                operationType = 1;
            }
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();
            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "OrderNum", value: paymentOrder.OrderNumber);
            reportParameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber.ToString());
            reportParameters.Add(key: "CreditAccount", value: "0");
            reportParameters.Add(key: "PhoneNumber", value: paymentOrder.Code);
            reportParameters.Add(key: "AmountDebt", value: "0");
            reportParameters.Add(key: "AmountPaid", value: paymentOrder.Amount.ToString());
            reportParameters.Add(key: "AmountCurrency", value: "AMD");
            reportParameters.Add(key: "PayerName", value: customerDescription);
            reportParameters.Add(key: "PaymentDescription", value: paymentOrder.Description);
            reportParameters.Add(key: "PaymentDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            reportParameters.Add(key: "PaymentTime", value: (!isCopy) ? DateTime.Now.ToString("HH:mm:ss") : paymentOrder.PaymentTime.ToString("HH:mm:ss"));
            reportParameters.Add(key: "RePrint", value: isCopy ? "1" : "0");
            reportParameters.Add(key: "Cash", value: operationType.ToString());
            reportParameters.Add(key: "TransactionNumber", value: "0");

            foreach (KeyValuePair<string, string> oneParameter in parameters)
            {
                reportParameters.Add(key: oneParameter.Key, value: oneParameter.Value);
            }

            return reportParameters;

        }

        public Dictionary<string, string> PrintGasReport(xbs.UtilityPaymentOrder paymentOrder, List<KeyValuePair<string, string>> parameters, xbs.User user, string customerDescription, bool isCopy)
        {
            byte operationType = 0;
            if (paymentOrder.Type == xbs.OrderType.CashCommunalPayment)
            {
                operationType = 1;
            }
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();

            if (paymentOrder.AbonentType == 1)
            {
                if (paymentOrder.OrderId != 0)
                    reportParameters.Add(key: "doc_id", value: paymentOrder.OrderId.ToString());
                else
                    reportParameters = XBService.SerchGasPromForReport(paymentOrder.Code, paymentOrder.Branch);
            }

            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "OrderNum", value: paymentOrder.OrderNumber);
            reportParameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber.ToString());
            reportParameters.Add(key: "CreditAccount", value: "0");

            reportParameters.Add(key: "AmountCurrency", value: "AMD");
            reportParameters.Add(key: "PayerName", value: customerDescription);
            reportParameters.Add(key: "PaymentDescription", value: paymentOrder.Description);
            reportParameters.Add(key: "PaymentDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            reportParameters.Add(key: "RePrint", value: isCopy ? "1" : "0");
            reportParameters.Add(key: "Cash", value: operationType.ToString());
            reportParameters.Add(key: "TransactionNumber", value: "0");
            reportParameters.Add(key: "PaymentUniqueNumber", value: "0");
            reportParameters.Add(key: "F_J", value: paymentOrder.AbonentType == 1 ? "F" : "J");

            reportParameters.Add(key: "AmountPaidForGas", value: paymentOrder.Amount.ToString());
            reportParameters.Add(key: "AmountPaidForService", value: paymentOrder.ServiceAmount.ToString());
            reportParameters.Add(key: "TexCod", value: paymentOrder.Branch);
            reportParameters.Add(key: "Cod", value: paymentOrder.Code);

            return reportParameters;

        }

        public string GetUtilityPaymentDescription(xbs.UtilityPaymentOrder paymentOrder)
        {
            return XBService.GetCommunalPaymentDescription((short)paymentOrder.CommunalType, (short)paymentOrder.AbonentType, paymentOrder.Code, paymentOrder.CommunalType == xbs.CommunalTypes.COWater ? paymentOrder.AbonentFilialCode.ToString() : paymentOrder.Branch, paymentOrder.PaymentType);
        }


        public JsonResult GetCommunalsByPhoneNumber(xbs.SearchCommunal searchCommunal)
        {
            List<xbs.Communal> communals = new List<xbs.Communal>();
            string validationResult = ValidateSearchData(searchCommunal);

            if (validationResult == "")
            {

                searchCommunal.CommunalType = xbs.CommunalTypes.ENA;
                communals.AddRange(XBService.FindUtilityPayments(searchCommunal));

                searchCommunal.CommunalType = xbs.CommunalTypes.Gas;
                communals.AddRange(XBService.FindUtilityPayments(searchCommunal));

                searchCommunal.CommunalType = xbs.CommunalTypes.YerWater;
                communals.AddRange(XBService.FindUtilityPayments(searchCommunal));

                searchCommunal.CommunalType = xbs.CommunalTypes.ArmWater;
                communals.AddRange(XBService.FindUtilityPayments(searchCommunal));

                searchCommunal.CommunalType = xbs.CommunalTypes.ArmenTel;

                searchCommunal.AbonentNumber = searchCommunal.PhoneNumber;
                if (searchCommunal.PhoneNumber.Length <= 6)
                {
                    searchCommunal.AbonentNumber = "10" + searchCommunal.AbonentNumber;
                    searchCommunal.PhoneNumber = "10" + searchCommunal.PhoneNumber;
                }

                communals.AddRange(XBService.FindUtilityPayments(searchCommunal));

                return Json(communals, JsonRequestBehavior.AllowGet);
            }
            else
            {
                xbs.ActionResult result = new xbs.ActionResult();
                result.ResultCode = xbs.ResultCode.ValidationError;
                result.Errors = new List<xbs.ActionError>();

                xbs.ActionError actionError = new xbs.ActionError();
                actionError.Description = validationResult;

                result.Errors.Add(actionError);

                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }




        public JsonResult GetPhonePayments(xbs.SearchCommunal searchCommunal)
        {
            List<xbs.Communal> communals = new List<xbs.Communal>();
            string validationResult = ValidateSearchData(searchCommunal);

            if (validationResult == "")
            {

                searchCommunal.CommunalType = xbs.CommunalTypes.ArmenTel;
                communals.AddRange(XBService.FindUtilityPayments(searchCommunal));

                searchCommunal.CommunalType = xbs.CommunalTypes.VivaCell;
                communals.AddRange(XBService.FindUtilityPayments(searchCommunal));

                searchCommunal.CommunalType = xbs.CommunalTypes.Orange;
                communals.AddRange(XBService.FindUtilityPayments(searchCommunal));


                return Json(communals, JsonRequestBehavior.AllowGet);
            }
            else
            {
                xbs.ActionResult result = new xbs.ActionResult();
                result.ResultCode = xbs.ResultCode.ValidationError;
                result.Errors = new List<xbs.ActionError>();

                xbs.ActionError actionError = new xbs.ActionError();
                actionError.Description = validationResult;

                result.Errors.Add(actionError);

                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }




        public Dictionary<string, string> PrintTrashReport(xbs.UtilityPaymentOrder paymentOrder, List<KeyValuePair<string, string>> parameters, xbs.User user, string customerDescription, bool isCopy)
        {
            byte operationType = 0;
            if (paymentOrder.Type == xbs.OrderType.CashCommunalPayment)
            {
                operationType = 1;
            }

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();
            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "OrderNum", value: paymentOrder.OrderNumber);

            if (operationType == 1)
                paymentOrder.DebitAccount = XBService.GetOperationSystemAccount(paymentOrder, xbs.OrderAccountType.DebitAccount, paymentOrder.DebitAccount.Currency);
            reportParameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber.ToString());

            paymentOrder.ReceiverAccount = XBService.GetOperationSystemAccount(paymentOrder, xbs.OrderAccountType.CreditAccount, "AMD", 0, paymentOrder.Branch);
            reportParameters.Add(key: "CreditAccount", value: paymentOrder.ReceiverAccount.AccountNumber.ToString());
            reportParameters.Add(key: "AmountDebt", value: "0");
            reportParameters.Add(key: "AmountPaid", value: paymentOrder.Amount.ToString());
            reportParameters.Add(key: "RePrint", value: isCopy ? "1" : "0");
            reportParameters.Add(key: "Cash", value: operationType.ToString());
            reportParameters.Add(key: "TransactionNumber", value: "0");
            reportParameters.Add(key: "PaymentDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));

            reportParameters.Add(key: "PayerName", value: customerDescription);

            reportParameters.Add(key: "code", value: paymentOrder.Code);
            reportParameters.Add(key: "UniqueNumber", value: paymentOrder.Code);
            reportParameters.Add(key: "QaxCod", value: paymentOrder.Branch);
            reportParameters.Add(key: "PaymentDescription", value: paymentOrder.Description);
            reportParameters.Add(key: "Customer_Number", value: customerNumber.ToString());


            return reportParameters;

        }



        public JsonResult GetWaterCoDetails()
        {
            return Json(InfoService.GetWaterCoDetails(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetWaterCoDebtDates(string code)
        {
            return Json(InfoService.GetWaterCoDebtDates(Convert.ToUInt16(code)), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetWaterCoBranches(ushort filialCode)
        {
            return Json(InfoService.GetWaterCoBranches(filialCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReestrWaterCoBranches(ushort filialCode)
        {
            return Json(InfoService.GetReestrWaterCoBranches(filialCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetWaterCoCitys(string code)
        {
            return Json(InfoService.GetWaterCoCitys(Convert.ToUInt16(code)), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCOWaterOrderAmount(string abonentNumber, string branchCode, ushort paymentType)
        {
            return Json(XBService.GetCOWaterOrderAmount(abonentNumber, branchCode, paymentType), JsonRequestBehavior.AllowGet);
        }


        public Dictionary<string, string> PrintWaterCoPaymentReport(xbs.UtilityPaymentOrder paymentOrder, List<KeyValuePair<string, string>> parameters, xbs.User user, string customerDescription, bool isCopy)
        {
            byte operationType = 0;
            if (paymentOrder.Type == xbs.OrderType.CashCommunalPayment)
            {
                operationType = 1;
                paymentOrder.DebitAccount = XBService.GetOperationSystemAccount(paymentOrder, xbs.OrderAccountType.DebitAccount, paymentOrder.DebitAccount.Currency);
            }
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();

            string COWaterBranchID = InfoService.GetCOWaterBranchID(paymentOrder.Branch, paymentOrder.AbonentFilialCode.ToString());

            paymentOrder.ReceiverAccount = XBService.GetOperationSystemAccount(paymentOrder, xbs.OrderAccountType.CreditAccount, "AMD", paymentOrder.AbonentFilialCode, COWaterBranchID);

            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "OrderNum", value: paymentOrder.OrderNumber);
            reportParameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber.ToString());
            reportParameters.Add(key: "CreditAccount", value: paymentOrder.ReceiverAccount.AccountNumber);
            reportParameters.Add(key: "AmountCurrency", value: "AMD");
            reportParameters.Add(key: "PayerName", value: customerDescription);
            reportParameters.Add(key: "PaymentDescription", value: paymentOrder.Description);
            reportParameters.Add(key: "PaymentDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yyyy"));
            reportParameters.Add(key: "AmountPaid", value: paymentOrder.Amount.ToString());

            reportParameters.Add(key: "Selected_WaterCo_ID", value: COWaterBranchID);
            reportParameters.Add(key: "reestrString", value: null);
            reportParameters.Add(key: "PaymentType", value: paymentOrder.PaymentType == 1 ? "0" : "1");
            reportParameters.Add(key: "IsCash", value: operationType == 1 ? "True" : "False");
            reportParameters.Add(key: "IsReestr", value: "False");
            reportParameters.Add(key: "AbonentNumber", value: paymentOrder.Code);
            reportParameters.Add(key: "AbonentName", value: "");

            return reportParameters;

        }



        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveReestrUtilityPaymentOrder(xbs.ReestrUtilityPaymentOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            order.SubType = 1;
            order.Currency = "AMD";
            xbs.ActionResult result = XBService.SaveReestrUtilityPaymentOrder(order);
            return Json(result);

        }


        public ActionResult ReestrUtilityPaymentOrderDetails()
        {
            return PartialView("~/Views/UtilityPayments/ReestrUtilityPaymentOrderDetails.cshtml");
        }

        public ActionResult UtilityReestrDetails()
        {
            return PartialView("~/Views/UtilityPayments/UtilityReestrDetails.cshtml");
        }

        public JsonResult GetReestrUtilityPaymentOrder(long orderID)
        {
            return Json(XBService.GetReestrUtilityPaymentOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult ConvertReestrDataToUnicode(List<xbs.COWaterReestrDetails> reestrDetails)
        {
            foreach (xbs.COWaterReestrDetails reestrDetail in reestrDetails)
            {
                reestrDetail.City = Utility.ConvertAnsiToUnicode(reestrDetail.City);
                reestrDetail.FullName = Utility.ConvertAnsiToUnicode(reestrDetail.FullName);
            }

            return Json(reestrDetails, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveCustomerCommunalCard(xbs.CustomerCommunalCard customerCommunalCard)
        {
            return Json(XBService.SaveCustomerCommunalCard(customerCommunalCard), JsonRequestBehavior.AllowGet);
        }
        public JsonResult ChangeCustomerCommunalCardQuality(xbs.CustomerCommunalCard customerCommunalCard)
        {
            return Json(XBService.ChangeCustomerCommunalCardQuality(customerCommunalCard), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCommunalsByCustomerCommunalCards()
        {
            List<xbs.Communal> communals = new List<xbs.Communal>();
            List<xbs.CustomerCommunalCard> communalCards = XBService.GetCustomerCommunalCards();

            foreach (xbs.CustomerCommunalCard communalCard in communalCards)
            {
                List<xbs.Communal> searchCommunals = new List<xbs.Communal>();
                xbs.SearchCommunal searchCommunal = new XBS.SearchCommunal();
                searchCommunal.CommunalType = (xbs.CommunalTypes)communalCard.CommunalType;
                if (searchCommunal.CommunalType == (xbs.CommunalTypes.ArmenTel))
                {
                    searchCommunal.PhoneNumber = communalCard.AbonentNumber;
                }

                if (searchCommunal.CommunalType == (xbs.CommunalTypes.Trash))
                {
                    searchCommunal.FindByEqualAbonentNumberAndBranch = true;
                }

                searchCommunal.AbonentNumber = communalCard.AbonentNumber;
                searchCommunal.Branch = communalCard.BranchCode;
                searchCommunal.AbonentType = (short)communalCard.AbonentType;
                searchCommunals = XBService.FindUtilityPayments(searchCommunal, false);

                if(searchCommunal.CommunalType == xbs.CommunalTypes.YerWater)
                {
                    searchCommunals.RemoveAll(m => m.AbonentNumber != searchCommunal.AbonentNumber);
                }

                searchCommunals.ForEach(m => m.CommunalAbonentType = searchCommunal.AbonentType);
                communals.AddRange(searchCommunals);

            }


            return Json(communals, JsonRequestBehavior.AllowGet);

        }



        public JsonResult GetComunalAmountPaidThisMonth(string code, short comunalType, short abonentType, DateTime DebtListDate = default(DateTime), string texCode = "", int waterCoPaymentType = -1)
        {
            return Json(XBService.GetComunalAmountPaidThisMonth(code, comunalType, abonentType, DebtListDate, texCode, waterCoPaymentType), JsonRequestBehavior.AllowGet);
        }


        public JsonResult PrintWaterCoPaymentReportREESTR_4Copies(xbs.ReestrUtilityPaymentOrder order, bool isCopy)
        {


            string customerDescription = "";
            CustomerMainDataViewModel customer = new CustomerMainDataViewModel();

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            if (customerNumber != 0)
            {

                customer.Get(customerNumber);
            }

            if (order.OPPerson != null)
                customerDescription = order.OPPerson.PersonLastName + " " + order.OPPerson.PersonName;
            else
            {
                customerDescription = customer.CustomerDescription;
            }
            customerDescription = Utility.ConvertUnicodeToAnsi(customerDescription);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();
            string COWaterBranchID = InfoService.GetCOWaterBranchID(order.Branch, order.AbonentFilialCode.ToString());
            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "Selected_WaterCo_ID", value: COWaterBranchID);
            reportParameters.Add(key: "PaymentType", value: order.PaymentType == 1 ? "0" : "1");
            string reestrString = "";
            foreach (xbs.COWaterReestrDetails item in order.COWaterReestrDetails)
            {
                reestrString = reestrString + item.OrderNumber + "&" + order.OperationDate.Value.ToString("dd/MMM/yy") + "&" + customerDescription +
                    "&" + order.Branch + "&" + item.WaterPayment.ToString() + "&" + item.MembershipFee.ToString() + "&" + item.AbonentNumber + "&" + order.AbonentFilialCode.ToString() + "#";
            }

            reportParameters.Add(key: "reestrString", value: reestrString);

            return Json(reportParameters, JsonRequestBehavior.AllowGet);

        }

        public JsonResult PrintWaterCoPaymentReport_2Copies(xbs.ReestrUtilityPaymentOrder order, bool isCopy)
        {

            string customerDescription = "";
            CustomerMainDataViewModel customer = new CustomerMainDataViewModel();

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            if (customerNumber != 0)
            {

                customer.Get(customerNumber);
            }

            if (order.OPPerson != null)
                customerDescription = order.OPPerson.PersonLastName + " " + order.OPPerson.PersonName;
            else
            {
                customerDescription = customer.CustomerDescription;
            }
            customerDescription = Utility.ConvertUnicodeToAnsi(customerDescription);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            byte operationType = 0;
            if (order.Type == xbs.OrderType.CashCommunalPayment)
            {
                operationType = 1;
                order.DebitAccount = XBService.GetOperationSystemAccount(order, xbs.OrderAccountType.DebitAccount, order.DebitAccount.Currency);
            }
            Dictionary<string, string> reportParameters = new Dictionary<string, string>();

            string COWaterBranchID = InfoService.GetCOWaterBranchID(order.Branch, order.AbonentFilialCode.ToString());



            reportParameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            reportParameters.Add(key: "OrderNum", value: "0");
            reportParameters.Add(key: "DebetAccount", value: "0");
            reportParameters.Add(key: "CreditAccount", value: "0");
            reportParameters.Add(key: "AmountCurrency", value: "AMD");
            reportParameters.Add(key: "PayerName", value: "");
            reportParameters.Add(key: "PaymentDescription", value: "");
            reportParameters.Add(key: "PaymentDate", value: null);
            reportParameters.Add(key: "AmountPaid", value: "0");

            string reestrString = "";
            foreach (xbs.COWaterReestrDetails item in order.COWaterReestrDetails)
            {
                reestrString = reestrString + item.OrderNumber + "&" + order.OperationDate.Value.ToString("dd/MMM/yy") + "&" + customerDescription +
                    "&" + order.Branch + "&" + item.WaterPayment.ToString() + "&" + item.MembershipFee.ToString() + "&" + item.AbonentNumber + "&" + order.AbonentFilialCode.ToString() + "#";
            }

            reportParameters.Add(key: "reestrString", value: reestrString);


            reportParameters.Add(key: "Selected_WaterCo_ID", value: COWaterBranchID);

            reportParameters.Add(key: "PaymentType", value: order.PaymentType == 1 ? "0" : "1");
            reportParameters.Add(key: "IsCash", value: "False");
            reportParameters.Add(key: "IsReestr", value: "True");
            reportParameters.Add(key: "AbonentNumber", value: "");
            reportParameters.Add(key: "AbonentName", value: "");

            return Json(reportParameters, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetENAPayments(string abonentNumber, string branch)
        {
            return Json(XBService.GetENAPayments(abonentNumber, branch), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetENAPaymentDates(string abonentNumber, string branch)
        {
            return Json(XBService.GetENAPaymentDates(abonentNumber, branch), JsonRequestBehavior.AllowGet);
        }
    }
}