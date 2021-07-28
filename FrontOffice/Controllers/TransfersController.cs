using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using Newtonsoft.Json;

namespace FrontOffice.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [SessionExpireFilter]
    public class TransfersController : Controller
    {
        // GET: Credential  
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("Transfers");
        }
        public ActionResult CustomerTransfers()
        {
            return PartialView("Transfers");
        }

        public ActionResult AttachmentDocuments()
        {
            return PartialView("TransferAttachments");
        }

        public JsonResult GetTransferAttachmentInfo(long transferID)
        {
            return Json(XBService.GetTransferAttachmentInfo(transferID), JsonRequestBehavior.AllowGet);
        }

        public void GetTransferAttachment(ulong id)
        {
            xbs.OrderAttachment attachment = XBService.GetTransferAttachment(id);
            ExportFormat exportFormat = ReportService.GetExportFormatEnumeration(attachment.FileExtension);
            ReportService.ShowDocument(attachment.Attachment, exportFormat, "OrderAttachment");
        }

        public JsonResult GetTransferList(xbs.TransferFilter filter)
        {
            filter.DateFrom = Convert.ToDateTime(filter.DateFrom).Date;
            filter.DateTo = Convert.ToDateTime(filter.DateTo).Date;

            string guid = Utility.GetSessionId();
            SessionProperties session = (SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"];
            if (session.IsCalledFromHB == true)
            {

                return Json(XBService.GetTransfersForHB(filter), JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(XBService.GetTransfers(filter), JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetCorrespondentBankAccounts(xbs.CorrespondentBankAccount filter)
        {

            return Json(XBService.GetCorrespondentBankAccounts(filter), JsonRequestBehavior.AllowGet);

        }


        public ActionResult TransferDetails()
        {
            return PartialView("TransferDetails");
        }

        public ActionResult TransferApprove()
        {
            return PartialView("TransferApprove");
        }


        public ActionResult TransferReject()
        {
            return PartialView("TransferReject");
        }
        public JsonResult GetTransfer(ulong transferID)
        {
            return Json(XBService.GetTransfer(transferID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetApprovedTransfer(ulong transferID)
        {
            return Json(XBService.GetApprovedTransfer(transferID), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTransferCriminalLogId(ulong transferID)
        {
            return Json(XBService.GetTransferCriminalLogId(transferID), JsonRequestBehavior.AllowGet);
        }


        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult UpdateTransferVerifiedStatus(ulong transferId, int verified)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.UpdateTransferVerifiedStatus(transferId, verified);
            return Json(result);

        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]

        public ActionResult ConfirmTransfer(xbs.Transfer transfer, bool confirm = false)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            if (!confirm)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = xbs.ResultCode.Warning;

                if (transfer.TransferGroup == 3 && transfer.SendOrReceived == 1 && transfer.InstantMoneyTransfer != 1)
                {
                    short isVerified = XBService.IsCustomerSwiftTransferVerified(XBService.GetAuthorizedCustomerNumber(), transfer.ReceiverBankSwift, transfer.ReceiverAccount);
                    if (isVerified != 0 && !confirm)
                    {
                        error.Description = XBService.GetTerm(isVerified, null, xbs.Languages.hy);
                        result.Errors.Add(error);
                    }
                }
                else if (transfer.CreditAccount != null && transfer.SendOrReceived == 0)
                {
                    if (XBService.CheckAccountForDAHK(transfer.CreditAccount.AccountNumber))
                    {
                        error.Description = "Կրեդիտ հաշիվը ԱՐԳԵԼԱՆՔԻ կամ ԲՌՆԱԳԱՆՁՄԱՆ ենթակա է";
                        result.Errors.Add(error);
                    }
                }

                if (result.Errors.Count == 0)
                {
                    error.Description = "Ձևակերպե՞լ փոխանցումը";
                    result.Errors.Add(error);
                }
                return Json(result);
            }

            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            if (ActionAccessFilter.isAccessibleToAction(171))
                result = XBService.ConfirmTransfer(transfer.Id, 1, authorizedUserSessionToken);
            else
                result = XBService.ConfirmTransfer(transfer.Id, 0, authorizedUserSessionToken);
            if (result.Errors != null)
            {
                if (result.Errors.Count != 0)
                {
                    xbs.ActionError error = new xbs.ActionError();

                    error.Code = result.Errors[0].Code;
                    if (error.Code != 0)
                        error.Description = XBService.GetTerm(error.Code, null, xbs.Languages.hy);
                    else
                        error.Description = result.Errors[0].Description;
                    if (result.Errors[0].Params != null)
                        error.Description = error.Description.Replace("{0}", result.Errors[0].Params[0]);
                    result.Errors = new List<xbs.ActionError>();
                    if (result.ResultCode != xbs.ResultCode.NoneAutoConfirm)
                    {
                        result.ResultCode = xbs.ResultCode.ValidationError;
                    }
                    result.Errors.Add(error);

                    return Json(result);
                }
            }
            return Json(result);

        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult DeleteTransfer(ulong transferID, string description, bool confirm = false)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            if (!confirm)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = xbs.ResultCode.Warning;



                if (result.Errors.Count == 0)
                {
                    error.Description = "Հեռացնե՞լ փոխանցումը";
                    result.Errors.Add(error);
                }
                return Json(result);
            }

            result = XBService.DeleteTransfer(transferID, description);

            if (result.Errors != null)
            {
                if (result.Errors.Count != 0)
                {
                    xbs.ActionError error = new xbs.ActionError();

                    error.Code = result.Errors[0].Code;
                    if (error.Code != 0)
                        error.Description = XBService.GetTerm(error.Code, null, xbs.Languages.hy);
                    else
                        error.Description = result.Errors[0].Description;
                    if (result.Errors[0].Params != null)
                        error.Description = error.Description.Replace("{0}", result.Errors[0].Params[0]);
                    result.Errors = new List<xbs.ActionError>();
                    result.ResultCode = xbs.ResultCode.ValidationError;
                    result.Errors.Add(error);

                    return Json(result);
                }
            }
            return Json(result);

        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult ApproveTransfer(xbs.TransferApproveOrder transferApproveOrder, bool confirm = false)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            if (!confirm)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = xbs.ResultCode.Warning;



                if (result.Errors.Count == 0)
                {
                    if (transferApproveOrder.SubType == 1)
                        error.Description = "Հաստատե՞լ փոխանցումը";
                    else
                        error.Description = "Չեղարկե՞լ փոխանցումը";
                    result.Errors.Add(error);
                }
                return Json(result);
            }

            result = XBService.ApproveTransfer(transferApproveOrder);

            //if (result.Errors != null)
            //{
            //    if (result.Errors.Count != 0)
            //    {
            //        xbs.ActionError error = new xbs.ActionError();

            //        error.Code = result.Errors[0].Code;
            //        if (error.Code != 0)
            //            error.Description = XBService.GetTerm(error.Code, null, xbs.Languages.hy);
            //        else
            //            error.Description = result.Errors[0].Description;
            //        if (result.Errors[0].Params != null)
            //            error.Description = error.Description.Replace("{0}", result.Errors[0].Params[0]);
            //        result.Errors = new List<xbs.ActionError>();
            //        result.ResultCode = xbs.ResultCode.ValidationError;
            //        result.Errors.Add(error);

            //        return Json(result);
            //    }
            //}
            return Json(result);

        }




        public JsonResult PrintTransfer(ulong transferID)
        {
            Dictionary<string, string> obj = new Dictionary<string, string>();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            xbs.Transfer transfer = new xbs.Transfer();
            transfer = XBService.GetTransfer(transferID);
            if (transfer.TransferGroup == 3 && transfer.SendOrReceived == 1 && transfer.TransferSystem != 23)
            {

                parameters = PrintInternationalPaymentOrder(transfer);
            }
            else if (transfer.TransferGroup == 1 || transfer.TransferGroup == 4)
            {
                parameters = PrintPaymentOrder(transfer);
            }
            else if (transfer.TransferGroup == 3 && transfer.TransferSystem == 23)
            {
                parameters = PrintStakSwiftTransfer(transfer.Id);
            }
            else if (transfer.TransferGroup == 3 || transfer.TransferSystem == 1)
            {
                parameters = PrintReceivedSwiftTransfer(transfer);
            }

            obj.Add("result", JsonConvert.SerializeObject(parameters));
            obj.Add("transfer", JsonConvert.SerializeObject(transfer));

            return Json(obj, JsonRequestBehavior.AllowGet);
        }

        public Dictionary<string, string> PrintInternationalPaymentOrder(xbs.Transfer transfer)
        {

            string descriptionForPaymentRUR = "";

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "Number", value: transfer.DocumentNumber);
            parameters.Add(key: "TransactionDate", value: transfer.RegistrationDate.ToString("dd/MMM/yy"));
            parameters.Add(key: "ConfirmDate", value: transfer.ConfirmationDate == null ? "" : transfer.ConfirmationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "TransactionTime", value: transfer.RegistrationTime == null ? DateTime.Now.ToString("HH:mm") : transfer.RegistrationTime.Value.ToString("hh':'mm"));
            parameters.Add(key: "FilialCode", value: transfer.FilialCode.ToString());

            parameters.Add(key: "OurBen", value: transfer.DetailsOfCharges);
            parameters.Add(key: "FastSystem", value: transfer.InstantMoneyTransfer.ToString());
            parameters.Add(key: "System", value: transfer.TransferSystemDescription);
            parameters.Add(key: "Swift", value: transfer.TransferSystem.ToString());
            parameters.Add(key: "TransferSystem", value: transfer.TransferSystem.ToString());
            parameters.Add(key: "AcbaTransfer", value: transfer.AcbaTransfer == 1 ? "ACBA_TRANSFER" : "");
            parameters.Add(key: "SenderName", value: transfer.Sender);
            parameters.Add(key: "SenderAddress", value: transfer.SenderAddress);

            parameters.Add(key: "SenderPassport", value: transfer.SenderPassport == null ? "" : transfer.SenderPassport);
            parameters.Add(key: "SenderDateOfBirth", value: transfer.SenderDateOfBirth == null ? "" : transfer.SenderDateOfBirth.Value.ToString("dd/MM/yy"));
            parameters.Add(key: "SenderEmail", value: transfer.SenderEmail == null ? "" : transfer.SenderEmail);
            parameters.Add(key: "SenderTaxCode", value: transfer.SenderCodeOfTax == null ? "" : transfer.SenderCodeOfTax);
            parameters.Add(key: "Amount", value: transfer.Amount.ToString());
            parameters.Add(key: "Currency", value: transfer.Currency);
            parameters.Add(key: "Receiver", value: transfer.Receiver);
            parameters.Add(key: "ReceiverAddInf", value: transfer.ReceiverAddInf);
            parameters.Add(key: "SenderPhone", value: transfer.SenderPhone == null ? "" : transfer.SenderPhone);

            parameters.Add(key: "SenderOtherBankAccount", value: transfer.SenderOtherBankAccount == null ? "" : transfer.SenderOtherBankAccount);
            parameters.Add(key: "PaymentDescription", value: transfer.DescriptionForPayment);
            if (transfer.TransferSystem == 1)
            {
                parameters.Add(key: "ReceiverAccount", value: transfer.ReceiverAccount);
                parameters.Add(key: "INN", value: transfer.INN);
                parameters.Add(key: "ReceiverBankSwift", value: transfer.ReceiverBankSwift);
                parameters.Add(key: "ReceiverAccountBank", value: transfer.ReceiverBank);
                parameters.Add(key: "ReceiverBankAddInf", value: transfer.ReceiverBankAddInf);
                parameters.Add(key: "Bik", value: transfer.BIK);
                parameters.Add(key: "Ks", value: transfer.CorrAccount);
                parameters.Add(key: "Kpp", value: transfer.KPP);
                parameters.Add(key: "IntermidateBankSwift", value: transfer.IntermediaryBankSwift);
                parameters.Add(key: "IntermidateBank", value: transfer.IntermediaryBank);

                parameters.Add(key: "PaymentDescriptionRUR", value: transfer.DescriptionForPaymentRUR1);
                if (transfer.Currency == "RUR")
                {
                    descriptionForPaymentRUR = (transfer.DescriptionForPaymentRUR2 == null ? "" : transfer.DescriptionForPaymentRUR2) + " " + (transfer.DescriptionForPaymentRUR3 == null ? "" : transfer.DescriptionForPaymentRUR3) + " " + (transfer.DescriptionForPaymentRUR4 == null ? "" : transfer.DescriptionForPaymentRUR4) + " " + (transfer.DescriptionForPaymentRUR5 == null ? "" : transfer.DescriptionForPaymentRUR5);
                    if (transfer.DescriptionForPaymentRUR5 == "с НДС")
                    {
                        descriptionForPaymentRUR = descriptionForPaymentRUR + " " + transfer.DescriptionForPaymentRUR6 + " RUB";
                    }
                    parameters.Add(key: "PaymentDescriptionRUROther", value: descriptionForPaymentRUR);

                }


                if (transfer.AmountInDebCurrency != 0)
                    parameters.Add(key: "AmountInDebetCurrency", value: transfer.AmountInDebCurrency.ToString() + " " + transfer.DebitAccount.Currency);
            }
            else
            {
                parameters.Add(key: "PaymentDescriptionAddInf", value: ", transfer control number:" + transfer.Code);
                parameters.Add(key: "ReceiverPassport", value: transfer.ReceiverPassport);
            }
            parameters.Add(key: "DebetAccount", value: transfer.DebitAccount.AccountNumber);
            if (transfer.MT == "103")
                parameters.Add(key: "MT", value: transfer.DebitAccount.AccountNumber + " " + transfer.DebitAccount.Currency);
            else
                parameters.Add(key: "MT", value: transfer.TransferDocumentCredAccount);

            parameters.Add(key: "Commission", value: transfer.AmountForPayment.ToString());
            parameters.Add(key: "FileName", value: "InternationalTransferApplicationForm");

            return parameters;
        }

        public Dictionary<string, string> PrintPaymentOrder(xbs.Transfer transfer)
        {


            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];

            parameters.Add(key: "reg_date", value: transfer.RegistrationDate.ToString("dd/MMM/yyyy"));

            parameters.Add(key: "document_number", value: transfer.DocumentNumber);

            if (Convert.ToUInt64(transfer.SenderAccount) > 400000000000000)
            {
                parameters.Add(key: "deb_acc", value: transfer.SenderAccount);
                parameters.Add(key: "deb_bank", value: transfer.FilialCode.ToString());
            }
            else
            {
                parameters.Add(key: "deb_acc", value: transfer.SenderAccount.Substring(5));
                parameters.Add(key: "deb_bank", value: ((int)(Convert.ToUInt64(transfer.SenderAccount) / 10000000000)).ToString());
            }

            if (transfer.Debtor != null)
            {

                parameters.Add(key: "debtor_Name", value: transfer.Debtor);
            }
            if (!string.IsNullOrEmpty(transfer.DebtorDocumentNumber))
                if (transfer.DebtorTypeCode == 10 || transfer.DebtorTypeCode == 20)
                    parameters.Add(key: "debtor_soccard", value: transfer.DebtorDocumentNumber);
                else
                    parameters.Add(key: "debtor_code_of_tax", value: transfer.DebtorDocumentNumber);


            string customerName = transfer.Sender;
            if (!String.IsNullOrEmpty(transfer.SenderPassport))
                customerName = customerName + ", Անձնագիր " + transfer.SenderPassport;

            parameters.Add(key: "cust_name", value: customerName);
            parameters.Add(key: "tax_code", value: transfer.SenderCodeOfTax != null ? transfer.SenderCodeOfTax : "");
            parameters.Add(key: "amount", value: transfer.Amount.ToString());
            parameters.Add(key: "currency", value: transfer.CreditAccount.Currency != "AMD" ? transfer.CreditAccount.Currency : transfer.DebitAccount.Currency);

            string description = transfer.Description;
            if (transfer.TransferGroup == 1)
            {
                string credAcc = (String.IsNullOrEmpty(transfer.ReceiverBank) ? transfer.ReceiverAccount : (transfer.ReceiverBank != transfer.ReceiverAccount.Substring(0, 5) ? transfer.ReceiverAccount : transfer.ReceiverAccount.Substring(5))).ToString();
                if (!String.IsNullOrEmpty(transfer.AddInf))
                    credAcc = credAcc + " " + transfer.AddInf;
                parameters.Add(key: "reciever", value: transfer.Receiver);
                parameters.Add(key: "credit_bank", value: transfer.ReceiverBank);
                parameters.Add(key: "cred_acc", value: credAcc);
                if (!String.IsNullOrEmpty(transfer.Debtor))
                    description = description + ", " + transfer.Debtor;
                if (!String.IsNullOrEmpty(transfer.DebtorDocument))
                    description = description + " " + transfer.DebtorDocument;

            }
            else
            {


                parameters.Add(key: "reciever", value: transfer.CreditAccount.AccountDescription);
                parameters.Add(key: "credit_bank", value: transfer.CreditAccount.AccountNumber.Substring(0, 5));
                parameters.Add(key: "cred_acc", value: transfer.CreditAccount.AccountNumber.Substring(6));

            }

            if (!String.IsNullOrEmpty(transfer.CreditCode))
            {
                description += ", " + transfer.CreditCode + ", " + transfer.Borrower + ", " + transfer.MatureTypeDescription;

            }
            parameters.Add(key: "descr", value: description);
            if (transfer.LTACode != 0)
                parameters.Add(key: "reg_code", value: transfer.LTACode.ToString());
            else
                parameters.Add(key: "reg_code", value: "");

            parameters.Add(key: "police_code", value: transfer.PoliceResponseDetailsID.ToString());
            parameters.Add(key: "is_copy", value: "False");

            parameters.Add(key: "quality", value: "0");
            parameters.Add(key: "for_HB", value: "0");
            parameters.Add(key: "doc_id", value: "0");

            if (transfer.ConfirmationDate != null)
                parameters.Add(key: "confirm_date", value: transfer.ConfirmationDate.Value.ToString("dd/MMM/yyyy"));

            parameters.Add(key: "print_soc_card", value: "False");
            parameters.Add(key: "commission", value: transfer.AmountForPayment.ToString());
            parameters.Add(key: "set_number", value: user.userID.ToString());
            parameters.Add(key: "TransactionTime", value: transfer.RegistrationTime.Value.ToString("hh':'mm"));


            return parameters;

        }


        public Dictionary<string, string> PrintReceivedSwiftTransfer(xbs.Transfer transfer)
        {


            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string wherecond = "T.unic_number=" + transfer.UnicNumber.ToString() + " and T.registration_date='" + transfer.RegistrationDate.ToString("dd/MMM/yyyy") + "' ";

            parameters.Add(key: "wherecond", value: wherecond);
            parameters.Add(key: "archive", value: "0");


            return parameters;

        }

        public JsonResult PrintPaidTransfers(DateTime? startDate, DateTime? endDate, byte transferSystem, string filial)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));

            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "transferSystem", value: transferSystem.ToString());

            if (currentUser.filialCode == 22000)
            {
                if (filial == null)
                    parameters.Add(key: "allFilials", value: "1");
                else
                    parameters.Add(key: "allFilials", value: "0");
            }
            else
            {
                parameters.Add(key: "allFilials", value: "0");
            }
            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult PrintBankMailTransfers(DateTime? startDate, DateTime? endDate, string transferGroup,
       string transferType, int confirmationSetNumber, byte session, int amount, string receiverName, byte confirmStatus, int mainFilial)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            if (mainFilial != 0)
            {
                parameters.Add(key: "mainFilial", value: mainFilial.ToString());
            }
            else
            {
                parameters.Add(key: "mainFilial", value: currentUser.filialCode.ToString());
            }
            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));

            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "transferGroup", value: transferGroup.ToString());
            parameters.Add(key: "transferType", value: transferType.ToString());
            parameters.Add(key: "confirmationSetNumber", value: confirmationSetNumber.ToString());
            parameters.Add(key: "session", value: session.ToString());
            parameters.Add(key: "amount", value: amount.ToString());
            parameters.Add(key: "receiverName", value: receiverName.ToString());
            parameters.Add(key: "confirmStatus", value: confirmStatus.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);

        }

        public ActionResult TransferDelete()
        {
            return PartialView("TransferDelete");
        }

        public ActionResult TransferHistory()
        {
            return PartialView("TransferHistory");
        }

        public Dictionary<string, string> PrintStakSwiftTransfer(ulong tranferId)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "transferId", value: tranferId.ToString());
            parameters.Add(key: "archive", value: "0");

            return parameters;
        }

    }
}