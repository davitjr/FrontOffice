using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CashBookController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {

            return View("CashBook");
        }

        public ActionResult CashBook()
        {

            return PartialView("CashBook");
        }


        public JsonResult GetRowTypes()
        {
            return Json(InfoService.GetCashBookRowTypes(), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetOperationTypes(bool forInput)
        {
            List<KeyValuePair<int?, string>> operationTypes = new List<KeyValuePair<int?, string>>();
            if (!forInput)
            {
                operationTypes.Add(new KeyValuePair<int?, string>(null, "Բոլորը"));
            }
            operationTypes.Add(new KeyValuePair<int?, string>(1, "Ելք"));
            operationTypes.Add(new KeyValuePair<int?, string>(2, "Մուտք"));
            return Json(operationTypes, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCashBooks(XBS.SearchCashBook searchParams)
        {
            string guid = Utility.GetSessionId();
            string filialCode = ((XBS.User)Session[guid + "_User"]).filialCode.ToString();

            SessionProperties sessionProperties = ((SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"]);
            if (sessionProperties.AdvancedOptions["isEncashmentDepartment"] == "1")
            {
                searchParams.FillialCode = -1;
            }
            //else
            //{
            //    searchParams.FillialCode = int.Parse(filialCode);
            //}

            return Json(XBService.GetCashBooks(searchParams), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCurrencies()
        {
            List<string> currencies = new List<string>();
            currencies.Add("AMD");
            currencies.Add("GBP");
            currencies.Add("USD");
            currencies.Add("CHF");
            currencies.Add("EUR");
            currencies.Add("GEL");
            currencies.Add("RUR");
            return Json(currencies, JsonRequestBehavior.AllowGet);
        }

        public ActionResult InputCashBook()
        {
            return PartialView("InputCashBook");
        }

        public JsonResult SaveAndApprove(xbs.CashBookOrder order)
        {
            XBS.ActionResult result = new XBS.ActionResult();
            result = XBService.SaveAndApprove(order);
            return Json(result);
        }

        public JsonResult GetCorrespondentSetNumber()
        {
            return Json(XBService.GetCorrespondentSetNumber());
        }
        
        public ActionResult RemoveCashBook(int cashBookID)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.RemoveCashBook(cashBookID);
            return Json(result);
        }

        public JsonResult GetRest(xbs.SearchCashBook searchParams)
        {
            return Json(XBService.GetRest(searchParams), JsonRequestBehavior.AllowGet);
        }

        public void GetCashBookSummary(DateTime date, int userID)
        {
            date = new DateTime(date.Year, date.Month, date.Day);
            string guid = Utility.GetSessionId();
            string filialCode = ((XBS.User)Session[guid + "_User"]).filialCode.ToString();  
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            if (userID == 0)
            {
                userID = ((XBS.User)Session[guid + "_User"]).userID;
            }
            parameters.Add(key: "setNumber", value: userID.ToString());
            parameters.Add(key: "date", value: date.ToString("dd/MMM/yy"));
            parameters.Add(key: "fillialCode", value: filialCode);
            parameters.Add(key: "forInkasacia", value: "0");
            ContractService.GetCashBookSummary(parameters);
        }

        public ActionResult ChangeCashBookStatus(int cashBookID, int newStatus)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.ChangeCashBookStatus(cashBookID, newStatus);
            return Json(result);
        }


        public void CashBookAccountStatementReport(xbs.SearchCashBook cashbook, string payerReciever)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "bankCode", value: cashbook.FillialCode.ToString());

            string guid = Utility.GetSessionId();
            SessionProperties sessionProperties = ((SessionProperties)Session[guid + "_SessionProperties"]);

            if (cashbook.SearchUserID != null && (sessionProperties.AdvancedOptions["isHeadCashBook"].ToString() == "1" || sessionProperties.IsChiefAcc))
            {
                parameters.Add(key: "numberOfSet", value: cashbook.SearchUserID.ToString());
            }
            else
            {
                parameters.Add(key: "numberOfSet", value: cashbook.RegisteredUserID.ToString());
            }

            parameters.Add(key: "currency", value: cashbook.Currency);
            parameters.Add(key: "calculating_date", value: cashbook.RegistrationDate.ToString("dd/MMM/yyyy"));
            if (payerReciever == "1")
            {
                parameters.Add(key: "payerReciever", value: "1");
            }
            ReportService.CashBookAccountStatementReport(parameters);
        }
        public ActionResult CashBookOrder()
        {
            return PartialView("CashBookOrder");
        }
        
        public void GetCashOutPaymentOrderDetails(xbs.CashBookOrder order, bool isCopy = false)
        {
           
            order.CreditAccount= XBService.GetCashBookOperationSystemAccount(order, xbs.OrderAccountType.CreditAccount);
            order.DebitAccount = XBService.GetCashBookOperationSystemAccount(order, xbs.OrderAccountType.DebitAccount);

            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "nom", value: order.OrderNumber);
            parameters.Add(key: "nm", value: order.OPPerson.PersonName);
            parameters.Add(key: "lname", value: order.OPPerson.PersonLastName);
            parameters.Add(key: "cracc", value: order.CreditAccount.AccountNumber.ToString());
            parameters.Add(key: "dbacc", value: order.DebitAccount.AccountNumber.ToString());
            parameters.Add(key: "wrd", value: order.Description);
            parameters.Add(key: "sum", value: order.Amount.ToString());
            parameters.Add(key: "passp", value: order.OPPerson.PersonDocument);
            parameters.Add(key: "curr", value: order.Currency);

            if (!string.IsNullOrEmpty(order.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: order.OPPerson.PersonSocialNumber);
                parameters.Add(key: "Check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: order.OPPerson.PersonSocialNumber);
                parameters.Add(key: "Check", value: "False");
            }

            parameters.Add(key: "kassa", value: order.CreditAccount.AccountNumber.ToString());

            parameters.Add(key: "T_Aneliq", value: "");
            parameters.Add(key: "code", value: "");
            parameters.Add(key: "flag_for_prix_ord", value: "0");
            parameters.Add(key: "reg_Date", value: order.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "f_cashout", value: isCopy ? "92" : "1");

            ReportService.GetCashOutPaymentOrder(parameters);
        }

        public void GetCashInPaymentOrderDetails(xbs.CashBookOrder order, bool isCopy = false)
        {
            
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            if (order.CorrespondentAccountType == 2 || order.CorrespondentAccountType == 3 || order.Type == xbs.OrderType.CashBookSurPlusDeficit)
            {
                order.CreditAccount = XBService.GetCashBookOperationSystemAccount(order, xbs.OrderAccountType.CreditAccount);
            }
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "amount", value: order.Amount.ToString());
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "nom", value: order.OrderNumber);
            parameters.Add(key: "lname", value: order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName);

            if (!string.IsNullOrEmpty(order.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: order.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: order.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "False");
            }

            parameters.Add(key: "wd", value: order.Description);
            parameters.Add(key: "credit", value: order.CreditAccount.AccountNumber.ToString());
            parameters.Add(key: "reg_Date", value: order.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");

            ReportService.GetCashInPaymentOrder(parameters);


        }



        public void GetPaymentOrderDetails(xbs.CashBookOrder order, bool isCopy = false)
        {
            CustomerViewModel customer = new CustomerViewModel();
            //customer.Get(order.OPPerson.CustomerNumber);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "reg_date", value: order.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "document_number", value: order.OrderNumber);
            order.CreditAccount= XBService.GetCashBookOperationSystemAccount(order, xbs.OrderAccountType.CreditAccount);
            string customerName = XBService.GetAccountDescription(order.DebitAccount.AccountNumber);
            string receiver = order.CreditAccount.AccountDescription;

            parameters.Add(key: "deb_acc", value: order.DebitAccount.AccountNumber.Substring(5));
            parameters.Add(key: "deb_bank", value: order.DebitAccount.AccountNumber.Substring(0, 5));
            parameters.Add(key: "tax_code", value: customer.TaxCode);
            parameters.Add(key: "cred_acc", value: order.CreditAccount.AccountNumber.Substring(5));
            parameters.Add(key: "quality", value: "1");
            parameters.Add(key: "soc_card", value: customer.SocCardNumber);
            parameters.Add(key: "credit_bank", value: order.CreditAccount.AccountNumber.Substring(0, 5));
            parameters.Add(key: "amount", value: order.Amount.ToString());
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "descr", value: order.Description);
            parameters.Add(key: "reciever", value: receiver);
            parameters.Add(key: "confirm_date", value: null);
            parameters.Add(key: "police_code", value: "0");
            parameters.Add(key: "for_HB", value: "0");
            parameters.Add(key: "print_soc_card", value: "True");
            parameters.Add(key: "reg_code", value: null);
            parameters.Add(key: "doc_id", value: null);
            parameters.Add(key: "cust_name", value: customerName);
            parameters.Add(key: "is_copy", value: isCopy ? "True" : "False");
            parameters.Add(key: "reciever_tax_code", value: "");
            ReportService.GetPaymentOrder(parameters);

        }

        public JsonResult GetCashBookOrder(long orderId)
        {
            return Json(XBService.GetCashBookOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CashBookOrderDetails()
        {
            return PartialView("CashBookOrderDetails");
        }

        public ActionResult GetCashBookOpperson()
        {
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];

            return RedirectToAction("SetOrderPerson", "Orders", new { customerNumber = user.userCustomerNumber });
        }
        public JsonResult GetCashierLimits(int setNumber)
        {
            return Json(XBService.GetCashierLimits(setNumber), JsonRequestBehavior.AllowGet);
        }

        public ActionResult GenerateCashierCashDefaultLimits(int setNumber, int changeSetNumber)
        {
            XBS.ActionResult result = new XBS.ActionResult();
            result = XBService.GenerateCashierCashDefaultLimits(setNumber,changeSetNumber);
            return Json(result);
        }

        public ActionResult CashierCashLimit()
        {
            return PartialView("CashierCashLimit");
        }

        public ActionResult SaveCashierCashLimits(List<xbs.CashierCashLimit> limit)
        {
            XBS.ActionResult result = new XBS.ActionResult();
            result = XBService.SaveCashierCashLimits(limit);
            return Json(result);
        }

        public int GetCashierFilialCode(int setNumber)
        {
            int filial = 0;
            filial = XBService.GetCashierFilialCode(setNumber);
            return filial;
        }


        public bool  CheckCashierFilialCode (int setNumber)
        {
            string guid = Utility.GetSessionId();
            string filialCode = ((XBS.User)Session[guid + "_User"]).filialCode.ToString();
            
            if(GetCashierFilialCode(setNumber).ToString() == filialCode)
            {
                return true;
            }
            return false;
        }

        public void GetCashBookReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            parameters.Add(key: "date", value: date.ToString("dd/MMM/yyyy"));
            string dateArm = "«" + date.Day + "»  " + Utility.GetDateMonthArm(date) + "ի  " + date.Year + " թ․";
            parameters.Add(key: "dateArm", value: dateArm);
            ReportService.CashBookReport(parameters, ExportFormat.Excel);
        }

        public void GetCashBookTotalReport(DateTime date)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            parameters.Add(key: "date", value: date.ToString("dd/MMM/yyyy"));
            string dateString = "«" + date.Day + "»  " + Utility.GetDateMonthArm(date) + "ի  " + date.Year + " թ․";
            parameters.Add(key: "dateString", value: dateString);
            ReportService.CashBookTotalReport(parameters, ExportFormat.Excel);
        }


		public JsonResult GetCashBookAmount(int cashBookId)
		{
			return Json(XBService.GetCashBookAmount(cashBookId), JsonRequestBehavior.AllowGet);

		}

		public JsonResult HasUnconfirmedOrder(int cashBookId)
		{
			return Json(XBService.HasUnconfirmedOrder(cashBookId), JsonRequestBehavior.AllowGet);

		}

	}
}