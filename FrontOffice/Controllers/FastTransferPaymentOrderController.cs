using FrontOffice.Service;
using FrontOffice.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class FastTransferPaymentOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult FastTransferPaymentOrder()
        {
            return PartialView("FastTransferPaymentOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.FastTransferOrderSave)]
        public ActionResult SaveFastTransferPaymentOrder(xbs.FastTransferPaymentOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveFastTransferPaymentOrder(order);

            if (result.ResultCode == xbs.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);//must return error view
        }




        public JsonResult GetFastTransferPaymentOrder(long orderID)
        {
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();
            return Json(XBService.GetFastTransferPaymentOrder(orderID, authorizedUserSessionToken), JsonRequestBehavior.AllowGet);
        }

        public ActionResult FastTransferPaymentOrderDetails()
        {
            return PartialView("FastTransferPaymentOrderDetails");
        }

        public JsonResult GetFastTransferFeeAcbaPercent(byte transferType )
        {
            return Json(XBService.GetFastTransferFeeAcbaPercent(transferType), JsonRequestBehavior.AllowGet);

        }
        public ActionResult GetCrossConvertationVariant(string debitCurrency, string creditCurrency)
        {
            return Json(XBService.GetCrossConvertationVariant(debitCurrency, creditCurrency));
        }
        public JsonResult PrintFastTransferPaymentOrder(xbs.FastTransferPaymentOrder paymentOrder)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string guid = Utility.GetSessionId();
            int filailCode = Convert.ToInt32(((XBS.User)Session[guid + "_User"]).filialCode.ToString());

            parameters.Add(key: "Number", value: paymentOrder.OrderNumber);
            parameters.Add(key: "TransactionDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "TransactionTime", value: DateTime.Now.ToString("HH:mm"));
            parameters.Add(key: "FilialCode", value: filailCode.ToString());
            parameters.Add(key: "FastSystem", value: "1");
            parameters.Add(key: "System", value: paymentOrder.TransferSystemDescription);
            parameters.Add(key: "Swift", value: paymentOrder.SubType.ToString());
            parameters.Add(key: "TransferSystem", value: paymentOrder.TransferSystemDescription);
            parameters.Add(key: "AcbaTransfer", value: "");
            parameters.Add(key: "SenderName", value: paymentOrder.Sender);
            parameters.Add(key: "SenderAddress", value: paymentOrder.SenderAddress);
            parameters.Add(key: "OurBen", value: "OUR");
            parameters.Add(key: "SenderPassport", value: paymentOrder.SenderPassport);
            parameters.Add(key: "SenderDateOfBirth", value: paymentOrder.SenderDateOfBirth.ToString("dd/MM/yy"));
            parameters.Add(key: "SenderEmail", value: paymentOrder.SenderEmail);
            parameters.Add(key: "SenderPhone", value: paymentOrder.SenderPhone);
            parameters.Add(key: "Amount", value: paymentOrder.Amount.ToString());
            parameters.Add(key: "Currency", value: paymentOrder.Currency);
            parameters.Add(key: "Receiver", value: paymentOrder.Receiver);
            parameters.Add(key: "PaymentDescriptionAddInf", value: ", transfer control number:"  + paymentOrder.Code);
            parameters.Add(key: "ReceiverAddInf", value: paymentOrder.ReceiverAddInf);
            parameters.Add(key: "ReceiverPassport", value: paymentOrder.ReceiverPassport);
            parameters.Add(key: "PaymentDescription", value: paymentOrder.DescriptionForPayment);
            if (paymentOrder.Type == FrontOffice.XBS.OrderType.FastTransferFromCustomerAccount)
            {
                parameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber);
                parameters.Add(key: "MT", value: paymentOrder.DebitAccount.AccountNumber + " " + paymentOrder.DebitAccount.Currency);
            }
            else
            {
                parameters.Add(key: "DebetAccount", value: "0");
                parameters.Add(key: "MT", value: "");
            }

            parameters.Add(key: "Commission", value: paymentOrder.TransferFee.ToString());
            parameters.Add(key: "FileName", value: "InternationalTransferApplicationForm");


            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult ARUSFastTransferOrder()
        {
            return PartialView("ARUSFastTransferOrder");
        }


        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.FastTransferOrderSave)]
        public ActionResult SaveFastTransferOrder(xbs.FastTransferPaymentOrder order)
        {

            order.Quality = xbs.OrderQuality.Draft;

            xbs.ActionResult result = XBService.SaveFastTransferOrder(order);

            return Json(result);

        }

        public ActionResult ApproveFastTransferOrder(long orderId)
        {
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.ApproveFastTransferOrder(orderId, authorizedUserSessionToken);
            return Json(result);
        }

        public List<xbs.MTOListAndBestChoiceOutput> GetSTAKMTOListAndBestChoice(xbs.MTOListAndBestChoiceInput bestChoice)
        {

            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            List<xbs.MTOListAndBestChoiceOutput> response = XBService.GetSTAKMTOListAndBestChoice(bestChoice, authorizedUserSessionToken);
            return response;
        }

        public JsonResult PrintSTAKSendMoneyPaymentOrder(xbs.FastTransferPaymentOrder paymentOrder)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string guid = Utility.GetSessionId();
            int filailCode = Convert.ToInt32(((XBS.User)Session[guid + "_User"]).filialCode.ToString());

            parameters.Add(key: "Number", value: paymentOrder.OrderNumber);
            parameters.Add(key: "TransactionDate", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "TransactionTime", value: DateTime.Now.ToString("HH:mm"));
            parameters.Add(key: "TransferSystem", value: paymentOrder.TransferSystemDescription);
            parameters.Add(key: "SenderName", value: paymentOrder.Sender);
            parameters.Add(key: "SenderNameARM", value: ", " + paymentOrder.NATSenderFirstName + " " + paymentOrder.NATSenderLastName);
            parameters.Add(key: "SenderAddress", value: paymentOrder.SenderAddress);
            parameters.Add(key: "SenderPassport", value: paymentOrder.SenderPassport);
            parameters.Add(key: "SenderDateOfBirth", value: paymentOrder.SenderDateOfBirth.ToString("dd/MM/yy"));
            parameters.Add(key: "SenderEmail", value: paymentOrder.SenderEmail);
            parameters.Add(key: "SenderMobileNo", value: paymentOrder.SenderMobileNo);
            parameters.Add(key: "Amount", value: paymentOrder.Amount.ToString());
            parameters.Add(key: "Currency", value: paymentOrder.Currency);
            parameters.Add(key: "Receiver", value: paymentOrder.Receiver);
            parameters.Add(key: "PaymentDescription", value: paymentOrder.DescriptionForPayment + " by STAK system");
            parameters.Add(key: "PaymentDescriptionAddInf", value: ", transfer control number: " + paymentOrder.Code);
            parameters.Add(key: "BeneficiaryAgentCode", value: paymentOrder.BeneficiaryAgentCode == null ? "" : paymentOrder.BeneficiaryAgentCode);
            parameters.Add(key: "URN", value: ", URN: " + paymentOrder.Code);
            parameters.Add(key: "DestinationCountry", value: ", Destination (Country): " + paymentOrder.CountryName);
            parameters.Add(key: "Commission", value: paymentOrder.TransferFee.ToString());
            parameters.Add(key: "CommissionByCurrency", value: paymentOrder.Fee.ToString());
            parameters.Add(key: "CurrencyOfCommission", value: paymentOrder.Currency);
            parameters.Add(key: "SettlementExchangeRate", value: paymentOrder.SettlementExchangeRate.ToString());   //ՍՏԱԿ համակարգի հաշվարկային բանկի փոխարժեքը ՀՀ դրամով

            if ((int)paymentOrder.Type == 76)   // 76 = Փոխանցում արագ համակարգերով
            {
                parameters.Add(key: "CashNonCash", value: "1");  // 1 = կանխիկ
                parameters.Add(key: "FileName", value: "STAKSendMoneyApplicationForm_Cash");

            }
            else if ((int)paymentOrder.Type == 102)     // 102 = Փոխանցում արագ համակարգերով հաճախորդի հաշվից
            {
                parameters.Add(key: "CashNonCash", value: "2"); //  անկանխիկ
                parameters.Add(key: "FileName", value: "STAKSendMoneyApplicationForm_NonCash");
            }

            parameters.Add(key: "SenderPhone", value: paymentOrder.SenderPhone);
            parameters.Add(key: "FilialCode", value: filailCode.ToString());
            parameters.Add(key: "FastSystem", value: "1");
            parameters.Add(key: "System", value: paymentOrder.TransferSystemDescription);
            parameters.Add(key: "Swift", value: paymentOrder.SubType.ToString());
            parameters.Add(key: "AcbaTransfer", value: "");
            parameters.Add(key: "ReceiverAddInf", value: paymentOrder.ReceiverAddInf);
            parameters.Add(key: "ReceiverPassport", value: paymentOrder.ReceiverPassport);
            if (paymentOrder.Type == FrontOffice.XBS.OrderType.FastTransferFromCustomerAccount)
            {
                parameters.Add(key: "DebetAccount", value: paymentOrder.DebitAccount.AccountNumber);
                parameters.Add(key: "MT", value: paymentOrder.DebitAccount.AccountNumber + " " + paymentOrder.DebitAccount.Currency);
            }
            else
            {
                parameters.Add(key: "DebetAccount", value: "0");
                parameters.Add(key: "MT", value: "");
            }



            string insertIntoTableType = null;

            if (paymentOrder.SubType == 23 && (int)paymentOrder.Type == 76) //  STAK համակարգով փոխանցումներ , // 76 = Փոխանցում արագ համակարգերով - (կանխիկ)
            {
                string countryCode = null;

                if (!String.IsNullOrEmpty(paymentOrder.Country))
                {
                    Dictionary<string, string> countries = InfoService.GetCountriesWithA3();
                    countryCode = countries.FirstOrDefault(c => c.Key.Equals(paymentOrder.Country)).Value;
                }

                xbs.MTOListAndBestChoiceInput input = new xbs.MTOListAndBestChoiceInput() { Amount = (decimal)paymentOrder.Amount, CountryCode = countryCode, CurrencyCode = paymentOrder.Currency, DeliveryCode = paymentOrder.PayoutDeliveryCode };
                //xbs.MTOListAndBestChoiceInput input = new xbs.MTOListAndBestChoiceInput() { Amount = 75, CountryCode = "ARM", CurrencyCode = "EUR", DeliveryCode = "10" };
                List<xbs.MTOListAndBestChoiceOutput> bestChoiceList = GetSTAKMTOListAndBestChoice(input);

                if (bestChoiceList.Count != 0)
                {
                    foreach (xbs.MTOListAndBestChoiceOutput item in bestChoiceList)
                    {
                        insertIntoTableType = insertIntoTableType + "('''" + item.MTOName + "''', '''" + paymentOrder.Currency + "''', " + item.FeeAmount + ", " + item.FeeAmount_National + ") ,";
                    }

                    insertIntoTableType = insertIntoTableType.Substring(0, insertIntoTableType.Length - 1);
                }
                else
                {
                    insertIntoTableType = "";
                }
            }
            else
            {
                insertIntoTableType = "";
            }

            parameters.Add(key: "InsertValues", value: insertIntoTableType);


            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

    }
}