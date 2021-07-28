using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using FrontOffice.XBSInfo;
using FrontOffice.Service;
using System.Web.Script.Serialization;
using FrontOffice.ACBAServiceReference;

namespace FrontOffice.Controllers
{
    public class HomeBankingDocumentsController : Controller
    {
        // GET: HBDocument
        public ActionResult Index()
        {
            return View("HBDocuments");
        }

        public ActionResult HBDocuments()
        {
            return PartialView("HBDocuments");
        }


        public ActionResult HBDocumentTransactionError()
        {
            return PartialView("HBDocumentTransactionError");
        }

        public ActionResult HBDocumentConfirmationHistory()
        {
            return PartialView("HBDocumentConfirmationHistory");
        }

        public ActionResult HBDocumentProductAccordance()
        {
            return PartialView("HBDocumentProductAccordance");
        }

        public ActionResult HBDocumentTransactionReject()
        {
            return PartialView("HBDocumentTransactionReject");
        }

        public ActionResult HBDocumentTransactionQualityChanging()
        {
            return PartialView("HBDocumentTransactionQualityChanging");
        }

        public ActionResult HBDocumentArCaBalance()
        {
            return PartialView("HBDocumentArCaBalance");
        }

        public ActionResult HBDocumentTransactionsAutomatedConfirmTime()
        {
            return PartialView("HBDocumentTransactionsAutomatedConfirmTime");
        }

        public ActionResult HBDocumentMessages()
        {
            return PartialView("HBDocumentMessages");
        }

        public ActionResult HBDocumentUnFreezeHistory()
        {
            return PartialView("HBDocumentUnFreezeHistory");
        }

        public ActionResult HBDocumentReestrDetails()
        {
            return PartialView("HBDocumentReestrDetails");
        }

        public ActionResult GoToTransfersList()
        {
            return RedirectToAction("CustomerTransfers", "Transfers");
        }

        public ActionResult HBDocumentsMessagesWithBank()
        {
            return PartialView("HBDocumentsMessagesWithBank");
        }

        public ActionResult HBDocumentSendMessage()
        {
            return PartialView("HBDocumentSendMessage");
        }

        public ActionResult HBDocumentsBypassTransaction()
        {
            return PartialView("HBDocumentsBypassTransaction");
        }

        //Initialization
        public JsonResult GetCurrentOperDay()
        {
            return Json(XBService.GetCurrentOperDay(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetSourceTypes()
        {
            return Json(InfoService.GetHBSourceTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetQualityTypes()
        {
            return Json(InfoService.GetHBQualityTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFilialList()
        {
            return Json(InfoService.GetFilialList(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDocumentTypes()
        {
            return Json(InfoService.GetHBDocumentTypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDocumentSubTypes()
        {
            return Json(InfoService.GetHBDocumentSubtypes(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCurrencyTypes()
        {
            return Json(InfoService.GetCurrencies(), JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult GetHBDocumentsList(FrontOffice.XBS.HBDocumentFilters obj)
        {
            XBS.User user = (XBS.User)Session["HB_User"];
            if (user == null)
            {
                string guid = Utility.GetSessionId();

                user = (XBS.User)Session[guid + "_User"];
                SessionProperties sessionProperties = new SessionProperties();
                
                sessionProperties.UserId = Convert.ToUInt32(user.userID);
                sessionProperties.SourceType = (int)XBS.SourceType.Bank;
                sessionProperties.AdvancedOptions = user.AdvancedOptions;
                sessionProperties.IsNonCustomerService = false;
                sessionProperties.IsCalledFromHB = true;
                Session[guid + "_SessionProperties"] = sessionProperties;


                Session["HB_User"] = user;
            }

            obj.BankCode = user.filialCode;

            return Json(XBService.GetHBDocumentsList(obj), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetHBMessages()
        {
            return Json(XBService.GetHBMessages(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSearchedHBMessages(XBS.HBMessagesSreach obj)
        {
            return Json(XBService.GetSearchedHBMessages(obj), JsonRequestBehavior.AllowGet);
        }


        //functions
        public string PostApproveUnconfirmedOrder(long docId)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            int setNumber = user.userID;

            return XBService.PostApproveUnconfirmedOrder(docId, setNumber);
        }

        public JsonResult GetSearchedHBDocuments(FrontOffice.XBS.HBDocumentFilters obj)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            obj.BankCode = user.filialCode;

            return Json(XBService.GetSearchedHBDocuments(obj), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransactionErrorDetails(int transactionCode)
        {
            return Json(XBService.GetTransactionErrorDetails(transactionCode), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetConfirmationHistoryDetails(int transactionCode)
        {
            return Json(XBService.GetConfirmationHistoryDetails(transactionCode), JsonRequestBehavior.AllowGet);
        }

        public string GetCheckingProductAccordance(int transactionCode)
        {
            return XBService.GetCheckingProductAccordance(transactionCode);
        }
        
        public JsonResult GetProductAccordanceDetails(int transactionCode)
        {
            return Json(XBService.GetProductAccordanceDetails(transactionCode), JsonRequestBehavior.AllowGet);
        }
        public bool SetHBDocumentAutomatConfirmation(FrontOffice.XBS.HBDocumentFilters obj)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            obj.BankCode = user.filialCode;

            return XBService.SetHBDocumentAutomatConfirmationSign(obj);
        }
        public bool GetCardAccountTransactions(FrontOffice.XBS.HBDocumentFilters obj)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            obj.BankCode = user.filialCode;

            return XBService.ExcludeCardAccountTransactions(obj);
        }
        public bool GetOrSetAutomaticExecution(FrontOffice.XBS.HBDocumentFilters obj)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            obj.BankCode = user.filialCode;
                        
            return XBService.SelectOrRemoveFromAutomaticExecution(obj);
        }

        public string GetHBArCaBalancePermission(int transactionCode)
        {
            long accountGroup = 0;
            XBS.User user = (XBS.User)Session["HB_User"];

            accountGroup = user.AccountGroup;

            return XBService.GetHBArCaBalancePermission(transactionCode, accountGroup);
        }

        public JsonResult GetHBArCaBalanceDetails(string cardNumber)
        {
            string accountNumber = XBService.GetHBAccountNumber(cardNumber);

            XBS.Card card = XBService.GetCardWithOutBallance(accountNumber);

            card.CardAccount = new XBS.Account();
            card.CardAccount.AccountNumber = accountNumber;

            XBS.ArcaBalanceResponseData data = XBService.GetArCaBalanceResponseData(card);

            return Json(XBService.GetArCaBalanceResponseData(card), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetHBRejectTypes()
        {
            return Json(InfoService.GetHBRejectTypes(), JsonRequestBehavior.AllowGet);
        }

        public string PostTransactionRejectConfirmation(FrontOffice.XBS.HBDocuments document)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            document.SetNumber = user.userID;

            return XBService.PostTransactionRejectConfirmation(document);
        }

        public string GetCheckedTransactionQualityChangability(int transactionCode)
        {
            return XBService.ChangeTransactionQuality(transactionCode);
        }

        //public bool PostchangedTransactionQuality(FrontOffice.XBS.hb transactionCode)
        //{
        //    return XBService.ChangeTransactionQuality(transactionCode);
        //}

        public string PostChangedAutomatedConfirmTime(List<string> info)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            info.Add(user.userID.ToString());

            return XBService.ChangeAutomatedConfirmTime(info);
        }

        public string GetAutomatedConfirmTime()
        {
            return XBService.GetAutomatedConfirmTime();
        }

        public JsonResult PrintHomeBankingDocumentsReport(FrontOffice.XBS.HBDocumentFilters filters)
        {
            filters.BankCode = 22000;

            string filter = GetFilter(filters);
            DateTime operDaye = XBService.GetCurrentOperDay();

            string day = operDaye.ToString("dd/MM/yyyy");
            string time = string.Format("{0:HH:mm:ss}", DateTime.Now);

            string date = day + ' ' + time;

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("WHERE_CONDITION", filter);
            parameters.Add("OperDay", date);

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTreansactionConfirmationDetails(int docId, long debitAccount)
        {
            return Json(XBService.GetTreansactionConfirmationDetails(docId, debitAccount), JsonRequestBehavior.AllowGet);
        }

        public string ConfirmReestrTransaction(int docId,int bankCode)
        {
            short setNumber = 0;
            XBS.User user = (XBS.User)Session["HB_User"];

            setNumber = user.userID;

            return XBService.ConfirmReestrTransaction(docId, bankCode, setNumber);
        }

        public bool FormulateAllHBDocuments(FrontOffice.XBS.HBDocumentFilters filters)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            filters.SetNumber = user.userID;

            return XBService.FormulateAllHBDocuments(filters);
        }

        public string PostMessageAsRead(int msgId)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            int setNumber = user.userID;

            return XBService.PostMessageAsRead(msgId, setNumber);
        }

        public string PostSentMessageToCustomer(FrontOffice.XBS.HBMessages obj)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            obj.SetNumber = user.userID;

            return XBService.PostSentMessageToCustomer(obj);
        }

        public JsonResult GetMessageUploadedFilesList(int msgId)
        {
            return Json(XBService.GetMessageUploadedFilesList(msgId), JsonRequestBehavior.AllowGet);
        }

        public int GetCancelTransactionDetails(int docId)
        {
            return XBService.GetCancelTransactionDetails(docId);
        }

        public bool GetReestrFromHB(FrontOffice.XBS.HBDocuments order)
        {
            return XBService.GetReestrFromHB(order);
        }

        public string PostBypassHistory(FrontOffice.XBS.HBDocumentBypassTransaction obj)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            obj.SetNumber = user.userID;

            return XBService.PostBypassHistory(obj);
        }


        public void OpenMsgSelectedFile(int fileId)
        {
            FrontOffice.XBS.HBMessageFiles obj = XBService.GetMsgSelectedFile(fileId); 

            ExportFormat exportFormat;
            switch (obj.FileType)
            {
                case ".pdf":
                    exportFormat = ExportFormat.PDF;
                    break;
                case ".doc":
                    exportFormat = ExportFormat.Word;
                    break;
                case "docx":
                    exportFormat = ExportFormat.Word;
                    break;
                case ".xls":
                    exportFormat = ExportFormat.Excel;
                    break;
                case ".xlsx":
                    exportFormat = ExportFormat.Excel;
                    break;
                default:
                    exportFormat = ExportFormat.Image;
                    break;
            }
            ReportService.ShowDocument(obj.FileContent, exportFormat, obj.FileName);
        }

        public JsonResult GetCustomerAccountAndInfoDetails(FrontOffice.XBS.HBDocuments obj)
        {
            return Json(XBService.GetCustomerAccountAndInfoDetails(obj), JsonRequestBehavior.AllowGet);
        }

        public ulong GetDebitAccountCustomerName(long debitAccount)
        {
            XBS.Account account = new XBS.Account();
            account.AccountNumber = debitAccount.ToString();
            return XBService.GetAccountCustomerNumber(account);
        }

        public string GetcheckedArmTransferDetails(long docId)
        {
            return XBService.GetcheckedArmTransferDetails(docId);
        }

        public bool AuthorizeCustomerForHBConfirm(ulong customerNumber)
        {
            bool done = false;
            try
            {
              
                string guid = Utility.GetSessionId();

                XBS.AuthorizedCustomer authorizedCustomer = XBService.AuthorizeCustomer(customerNumber, Session[guid + "_authorizedUserSessionToken"].ToString());

                Session[guid + "_AuthorisedCustomerSessionId"] = authorizedCustomer.SessionID;

                XBS.UserAccessForCustomer userAccessForCustomer = new XBS.UserAccessForCustomer();
                userAccessForCustomer = XBService.GetUserAccessForCustomer(Session[guid + "_authorizedUserSessionToken"].ToString(), Session[guid + "_AuthorisedCustomerSessionId"].ToString());

                Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;

                done = true;
            }
            catch(Exception ex)
            {
                string error = ex.Message;
            }
            return done;

        }

        public bool GetReestrTransactionIsChecked(int docId)
        {
            return XBService.GetReestrTransactionIsChecked(docId);
        }

        public string GetcheckedReestrTransferDetails(int docId)
        {
            return XBService.GetcheckedReestrTransferDetails(docId);
        }

        public void PostReestrPaymentDetails(XBS.ReestrTransferOrder order)
        {
            XBService.PostReestrPaymentDetails(order);
        }

        public void GetCustomerallProductsReport(int productStatus, ulong customerNumber)
        {
            bool done = AuthorizeCustomerForHBConfirm(customerNumber);
            if (done == true)
            {
                customerNumber = XBService.GetAuthorizedCustomerNumber();
                Dictionary<string, string> parameters = new Dictionary<string, string>();
                string guid = Utility.GetSessionId();
                parameters.Add(key: "permission_number", value: ((FrontOffice.XBS.User)(Session[guid + "_User"])).AccountGroup.ToString());
                parameters.Add(key: "Customer_Number", value: customerNumber.ToString());
                parameters.Add(key: "Gorcox", value: productStatus.ToString());

                ContractService.GetCustomerAllProducts(parameters);
            }
        }

        //function
        string GetFilter(FrontOffice.XBS.HBDocumentFilters obj)
        {
            string filter = "";

            if (obj.QualityType != null && obj.QualityType != 0)
            {
                filter = "and h.quality =" + obj.QualityType.ToString();

            }
            else
            {
                filter = "and h.quality<>40 and h.quality>=2";
            }


            if (obj.TransactionCode != null)
            {
                filter += " and h.Doc_ID =" + obj.TransactionCode.ToString();
            }

            if (obj.StartDate != "" && obj.StartDate != null)
            {
                DateTime dt = Convert.ToDateTime(obj.StartDate);
                string startDate = dt.ToString("dd/MMM/yy");

                filter += " and q.change_date >='" + startDate + "'";
            }

            if (obj.EndDate != "" && obj.EndDate != null)
            {
                DateTime dt = Convert.ToDateTime(obj.EndDate);
                string endDate = dt.ToString("dd/MMM/yy");

                filter += " and q.change_date <='" + endDate + "'"; //" and cast(left(q.change_date,11) as date)<='" + endDate + "'";
            }

            if (obj.CustomerNumber != null)
            {
                filter += " and h.customer_number =" + obj.CustomerNumber.ToString();
            }

            if (obj.Amount != null)
            {
                filter += " and h.amount =" + obj.Amount.ToString();
            }

            if (obj.DocumentType != null)
            {
                filter += " and h.document_type=" + obj.DocumentType.ToString();
            }

            if (obj.FilialCode != null)
            {
                filter += " and h.filial =" + obj.FilialCode.ToString();
            }

            if (obj.CurrencyType != "" && obj.CurrencyType != null)
            {
                filter += " and h.currency ='" + obj.CurrencyType + "'"; 
            }

            if (obj.DebitAccount != null)
            {
                filter += " and h.debet_account =" + obj.DebitAccount.ToString();
            }

            if (obj.SourceType != null)
            {
                filter += " and source_type =" + obj.SourceType.ToString();
            }

            if (obj.BankCode != 22000)
            {
                filter += " and h.filial =" + obj.BankCode.ToString();
            }

            return filter;
        }

    }
}
