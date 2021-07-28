using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class InternationalPaymentOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult InternationalPaymentOrder()
        {
            return PartialView("InternationalPaymentOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveInternationalPaymentOrder(xbs.InternationalPaymentOrder order, bool confirm = false)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            short isVerified = XBService.IsCustomerSwiftTransferVerified(XBService.GetAuthorizedCustomerNumber(), order.ReceiverBankSwift, order.ReceiverAccount.AccountNumber);
            if (isVerified != 0 && !confirm)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                //                      error.Description =  @"Հաճախորդն առաջին անգամ է կատարում տվյալ հաշվի համարին և/կամ բանկին փոխանցում: Զեղծարարության ռիսկից զերծ մնալու նպատակով անհրաժեշտ է՝ 
                //                                                    ա) ճշտել հաճախորդից հաշվի համարի ստացման եղանակը և արդյոք նա համոզված է, որ հաշվի համարը ճիշտ է: Եթե հաշվի տվյալները ստացված են միայն էլ.հասցեի միջոցով, ապա առաջարկել հաճախորդին նաև հեռախոսակապ հաստատել գործընկերոջ հետ՝ հաշվի տվյալները կրկին ճշտելու նպատակով:  
                //                                                    բ) ստուգել, թե արդյոք հաճախորդը նախկինում կատարել է նույն ստացողին փոխանցում, սակայն այլ հաշվի համարին: Եթե «այո», ապա մեծ է զեղծարարության հավանականությունը: Պարտադիր անհրաժեշտ է կապ հաստատել հաճախորդի հետ: ";
                error.Description = XBService.GetTerm(isVerified, null, xbs.Languages.hy);
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = xbs.ResultCode.Warning;
                result.Errors.Add(error);

                return Json(result);
            }
            order.Quality = xbs.OrderQuality.Draft;
            result = XBService.SaveInternationalPaymentOrder(order);

            return Json(result);//must return error view

        }
        public JsonResult GetFee(xbs.InternationalPaymentOrder paymentOrder)
        {
            return Json(XBService.GetInternationalPaymentOrderFee(paymentOrder), JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetInternationalPaymentOrder(long orderID)
        {
            return Json(XBService.GetInternationalPaymentOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult InternationalPaymentOrderDetails()
        {
            return PartialView("InternationalPaymentOrderDetails");
        }

        public ActionResult CountryList()
        {
            return PartialView("CountryList");
        }

        public ActionResult GetCrossConvertationVariant(string debitCurrency, string creditCurrency)
        {
            return Json(XBService.GetCrossConvertationVariant(debitCurrency, creditCurrency));
        }
        public JsonResult PrintInternationalPaymentOrder(xbs.InternationalPaymentOrder paymentOrder)
        {


            string AmountInDebetCurrency = "";

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string guid = Utility.GetSessionId();
            int filailCode = Convert.ToInt32(((XBS.User)Session[guid + "_User"]).filialCode.ToString());

            parameters.Add(key: "Number", value: paymentOrder.OrderNumber);

            parameters.Add(key: "TransactionDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yy"));
           
            parameters.Add(key: "TransactionTime", value: DateTime.Now.ToString("HH:mm") );
            parameters.Add(key: "FilialCode", value: filailCode.ToString());
             parameters.Add(key: "OurBen", value: paymentOrder.DetailsOfCharges);
            parameters.Add(key: "FastSystem", value: "0");
            parameters.Add(key: "System", value: "SWIFT");
            parameters.Add(key: "Swift", value: "1");
            parameters.Add(key: "TransferSystem", value: "SWIFT");
            parameters.Add(key: "AcbaTransfer", value: "");
            parameters.Add(key: "SenderName", value: paymentOrder.Sender);
            parameters.Add(key: "SenderAddress", value: paymentOrder.SenderAddress);
            if (paymentOrder.SenderType == 6)
            {
                parameters.Add(key: "SenderPassport", value: paymentOrder.SenderPassport);
                parameters.Add(key: "SenderDateOfBirth", value: paymentOrder.SenderDateOfBirth.ToString("dd/MM/yy"));
                parameters.Add(key: "SenderEmail", value: paymentOrder.SenderEmail);
            }
            else
            {
                parameters.Add(key: "SenderTaxCode", value: paymentOrder.SenderCodeOfTax);
            }

            parameters.Add(key: "SenderPhone", value: paymentOrder.SenderPhone);
            parameters.Add(key: "SenderOtherBankAccount", value: paymentOrder.SenderOtherBankAccount);
            parameters.Add(key: "Amount", value: paymentOrder.Amount.ToString());
            parameters.Add(key: "Currency", value: paymentOrder.Currency);
            parameters.Add(key: "Receiver", value: paymentOrder.Receiver);
            parameters.Add(key: "ReceiverAddInf", value: paymentOrder.ReceiverAddInf);
            parameters.Add(key: "ReceiverAccount", value: paymentOrder.ReceiverAccount.AccountNumber);
            parameters.Add(key: "INN", value: paymentOrder.INN);
            if (!String.IsNullOrEmpty(paymentOrder.FedwireRoutingCode))
                parameters.Add(key: "ReceiverBankSwift", value: "FW" + paymentOrder.FedwireRoutingCode);
            else
                parameters.Add(key: "ReceiverBankSwift", value: paymentOrder.ReceiverBankSwift);


            parameters.Add(key: "ReceiverAccountBank", value: paymentOrder.ReceiverBank);
            parameters.Add(key: "ReceiverBankAddInf", value: paymentOrder.ReceiverBankAddInf);
            parameters.Add(key: "Bik", value: paymentOrder.BIK);
            parameters.Add(key: "Ks", value: paymentOrder.CorrAccount);
            parameters.Add(key: "Kpp", value: paymentOrder.KPP);
            parameters.Add(key: "IntermidateBankSwift", value: paymentOrder.IntermediaryBankSwift);
            parameters.Add(key: "IntermidateBank", value: paymentOrder.IntermediaryBank);
            parameters.Add(key: "PaymentDescription", value: paymentOrder.DescriptionForPayment);
            parameters.Add(key: "PaymentDescriptionRUR", value: paymentOrder.DescriptionForPaymentRUR1);
            if (paymentOrder.Currency == "RUR")
            {
                string descriptionForPaymentRUR = "";
                descriptionForPaymentRUR = (paymentOrder.DescriptionForPaymentRUR2 == null ? "" : paymentOrder.DescriptionForPaymentRUR2) + " " + (paymentOrder.DescriptionForPaymentRUR3 == null ? "" : paymentOrder.DescriptionForPaymentRUR3) + " " + (paymentOrder.DescriptionForPaymentRUR4 == null ? "" : paymentOrder.DescriptionForPaymentRUR4) + " " + (paymentOrder.DescriptionForPaymentRUR5 == null ? "" : paymentOrder.DescriptionForPaymentRUR5);
                if (paymentOrder.DescriptionForPaymentRUR5 == "с НДС")
                {
                    descriptionForPaymentRUR = descriptionForPaymentRUR + " " + paymentOrder.DescriptionForPaymentRUR6 + " RUB";
                }
                parameters.Add(key: "PaymentDescriptionRUROther", value: descriptionForPaymentRUR);

            }
            if (paymentOrder.Type != FrontOffice.XBS.OrderType.CashInternationalTransfer)
            {
                parameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber);
                parameters.Add(key: "MT", value: paymentOrder.DebitAccount.AccountNumber + " " + paymentOrder.DebitAccount.Currency);

                if (paymentOrder.DebitAccount.Currency == paymentOrder.Currency)
                    AmountInDebetCurrency = "";
                else if (paymentOrder.DebitAccount.Currency == "AMD")
                    AmountInDebetCurrency = Math.Round(paymentOrder.Amount * paymentOrder.ConvertationRate, 1).ToString("#,###.0") + " " + paymentOrder.DebitAccount.Currency;
                else
                    AmountInDebetCurrency = Math.Round(paymentOrder.Amount * (paymentOrder.ConvertationRate1 / paymentOrder.ConvertationRate), 2).ToString("#,###.#0") + " " + paymentOrder.DebitAccount.Currency;
            }
            else
            {
                AmountInDebetCurrency = "";
                parameters.Add(key: "DebetAccount", value: "0");
                parameters.Add(key: "MT", value: "");
            }

            parameters.Add(key: "Commission", value: paymentOrder.TransferFee.ToString());
            parameters.Add(key: "FileName", value: "InternationalTransferApplicationForm");
            parameters.Add(key: "AmountInDebetCurrency", value: AmountInDebetCurrency);

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOperationSystemAccountForFee(xbs.InternationalPaymentOrder orderForFee, short feeType)
        {
            xbs.Account account = XBService.GetOperationSystemAccountForFee(orderForFee, feeType);
            return Json(account.AccountNumber, JsonRequestBehavior.AllowGet);

        }

        /// <summary>
        /// Ստուգում է՝ արդյոք տվյալ ժամին փոխանցումը ենթակա է շտապ պայմանով կատարման, թե ոչ
        /// </summary>
        /// <returns></returns>
        public bool IsUrgentTime()
        {
            bool flag = false;
            TimeSpan start = new TimeSpan(15, 00, 0);
            TimeSpan end = new TimeSpan(15, 30, 0);
            TimeSpan now = DateTime.Now.TimeOfDay;
           
            if ((now >= start) && (now <= end))
            {
                flag = true;
            }

            return flag;
        }

        public bool PostInternationalPaymentAddresses(xbs.InternationalPaymentOrder order)
        {

            return XBService.PostInternationalPaymentAddresses(order);
        }
    }
}