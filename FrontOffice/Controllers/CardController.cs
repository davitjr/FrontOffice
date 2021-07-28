using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using System.Web.UI;
using FrontOffice.Models;
using FrontOffice.ACBAServiceReference;
using System.Threading.Tasks;
using FrontOffice.Models.VisaAliasModels;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CardController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache")]
        public ActionResult Cards()
        {
            return PartialView("Cards");
        }

        // GET: /Cards/
        public JsonResult GetCards(int filter)
        {
            JsonResult s = new JsonResult();

            s = Json(XBService.GetCards((xbs.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
            return s;
        }

        public ActionResult CardDetails()
        {
            return View("CardDetails");
        }

        // GET: /Card/
        [ProductDetailsAccesibleFilter]
        public JsonResult GetCard(ulong productId)
        {
            XBS.Card card = XBService.GetCard(productId);
            ViewBag.accountGroup = card.CardAccount.AccountPermissionGroup;
            card.ServiceFee = XBService.GetCardTotalDebt(card.CardNumber);
            card.AMEX_MRServiceFee = XBService.GetMRFeeAMD(card.CardNumber);
            if (card.CreditLine != null)
            {
                card.PetTurk = XBService.GetPetTurk(card.CreditLine.ProductId).ToString("#,0.00");
            }
            return Json(card, JsonRequestBehavior.AllowGet);
        }

        //[FrontLoggingFilterAttribute(ActionType = (int)ActionType.CardStatementOpen)]
        public JsonResult GetCardStatement(XBS.Card card, string dateFrom, string dateTo)
        {
            return Json(XBService.GetCardStatement(card, Convert.ToDateTime(dateFrom), Convert.ToDateTime(dateTo)), JsonRequestBehavior.AllowGet);
        }
        public ActionResult CardStatement()
        {
            return PartialView("CardStatement");
        }
        public JsonResult GetCardCreditLineGrafik(XBS.Card card)
        {
            return Json(XBService.GetCreditLineGrafik(card.CreditLine), JsonRequestBehavior.AllowGet);
        }
        public ActionResult CardCreditLineGrafik()
        {
            return PartialView("CardCreditLineGrafik");
        }
        public JsonResult GetArCaBalance(XBS.Card card)
        {
            return Json(XBService.GetArCaBalance(card), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetArCaBalanceResponseData(XBS.Card card)
        {
            return Json(XBService.GetArCaBalanceResponseData(card), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ArCaBalance()
        {
            return PartialView("ArCaBalance");
        }

        public ActionResult ArCaBalanceResponseData()
        {
            return PartialView("ArCaBalanceResponseData");
        }

        /// <summary>
        /// Քարտային դիմումներ և պայմանագրեր
        /// </summary>
        /// <param name="applicationID">Դիմումի տեսակ</param>
        /// <param name="cardNumber">Քարտի համար</param>
        public JsonResult GetCardApplicationDetails(short applicationID, string cardNumber)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            byte customerType = ACBAOperationService.GetCustomerType(customerNumber);

            string value = XBService.GetCustomerEmailByCardNumber(cardNumber); ;

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "cardNumber", value: cardNumber);
            //3DSecure ակտիվացման միմումի համար
            if (applicationID == 18)
            {
                parameters.Add(key: "email", value: value);
            }
            return Json(parameters, JsonRequestBehavior.AllowGet);
        }




        //[FrontLoggingFilterAttribute(ActionType =(int) ActionType.CardStatementPrint)]
        public JsonResult PrintCardStatement(XBS.Card card, string dateFrom, string dateTo, int lang, string exportFormat = "pdf")
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            if (XBService.AccountAccessible(card.CardAccount.AccountNumber, currentUser.AccountGroup))
            {
                parameters.Add(key: "card", value: card.CardNumber);
                parameters.Add(key: "start_date", value: Convert.ToDateTime(dateFrom).ToString("dd/MMM/yy"));
                parameters.Add(key: "end_date", value: Convert.ToDateTime(dateTo).ToString("dd/MMM/yy"));
                parameters.Add(key: "fil", value: currentUser.filialCode.ToString());
                parameters.Add(key: "lang", value: lang.ToString());
                string statementGuid = Guid.NewGuid().ToString().Replace("-", "");

                parameters.Add(key: "guid", value: statementGuid);
            }

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardServiceFee(ulong productId)
        {
            return Json(XBService.GetCardServiceFee(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CardServiceFee()
        {
            return PartialView("CardServiceFee");
        }



        public ActionResult CardPositiveRate()
        {
            return PartialView("CardPositiveRate");
        }


        /// <summary>
        /// Ստանում է քարտային դիմումների և պայմանագրերի տեսակները
        /// </summary>
        /// <returns></returns>
        public JsonResult GetCardApplicationTypes()
        {
            return Json(InfoService.GetUtilityCardApplicationTypes(), JsonRequestBehavior.AllowGet);
        }


        public ActionResult CardTariffContractDetails()
        {
            return PartialView("CardTariffContractDetails");
        }

        // Get:  Card Service Fee Grafik 
        public JsonResult GetCardServiceFeeGrafik(ulong productId)
        {
            JsonResult result = new JsonResult();
            List<xbs.CardServiceFeeGrafik> cardServiceFeeGrafik = cardServiceFeeGrafik = XBService.GetCardServiceFeeGrafik(productId);
            if (cardServiceFeeGrafik == null)
            {
                //TO DO

            }
            else
            {
                result = Json(cardServiceFeeGrafik, JsonRequestBehavior.AllowGet);
            }
            return result;
        }

        //Get: Card  Service Fee Grafik Details
        public ActionResult CardServiceFeeGrafikDetails()
        {
            return View("CardServiceFeeGrafik");
        }

        public ActionResult CardTariffs()
        {
            return PartialView("CardTariffs");
        }

        /// <summary>
        /// Ստանում է քարտի սկագները
        /// </summary>
        /// <returns></returns>
        public JsonResult GetCardTariff(ulong productId)
        {
            return Json(XBService.GetCardTariff(productId), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Ստանում է քարտի կարգավիճակը
        /// </summary>
        /// <returns></returns>
        public JsonResult GetCardStatus(ulong productId)
        {
            return Json(XBService.GetCardStatus(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CardStatus()
        {
            return PartialView("CardStatus");
        }


        public ActionResult ValidateRenewedOtherTypeCardApplicationForPrint(string cardNumber, bool confirm = false)
        {
            if (!confirm)
            {
                string description = "";
                if (XBService.IsNormCardStatus(cardNumber) == false)
                {
                    description = "Քարտի կարգավիճակը NORM չէ:";
                }
                if (XBService.IsCardRegistered(cardNumber) == false)
                {
                    description = description + " " + "@Քարտ գրանցված չէ:";
                }
                if (description.Length != 0)
                {
                    description = description.Replace("@", Environment.NewLine);
                    xbs.ActionResult result = new xbs.ActionResult();
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = description;
                    result.Errors = new List<xbs.ActionError>();
                    result.ResultCode = xbs.ResultCode.Warning;
                    result.Errors.Add(error);
                    return Json(result);
                }
            }
            return Json(XBService.ValidateRenewedOtherTypeCardApplicationForPrint(cardNumber), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// ՊՔ պայմանագիր
        /// </summary>
        /// <param name="productId">Քարտի app_id</param>
        public void GetCardContractDetails(ulong productId, string confirmationPerson)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "appID", value: productId.ToString());
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);
            ContractService.GetCardContractDetails(parameters);
        }

        public void GetCardContractDetailsForBusinessCards(ulong productId, string confirmationPerson)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "appID", value: productId.ToString());
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);
            ContractService.GetCardContractDetailsForBusinessCards(parameters);
        }

        public void GetCardTransactionsLimitApplication(ulong customerNumber, string cardType, string cardCurrency, ulong cardNumber, ulong cardAccount)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "cardType", value: cardType);
            parameters.Add(key: "cardCurrency", value: cardCurrency);
            parameters.Add(key: "cardNumber", value: cardNumber.ToString());
            parameters.Add(key: "cardAccount", value: cardAccount.ToString());
            ContractService.GetCardTransactionsLimitApplication(parameters);
        }

        public JsonResult SetNewCardServiceFeeGrafik(ulong productId)
        {
            return Json(XBService.SetNewCardServiceFeeGrafik(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardDAHKDetails(string cardNumber)
        {
            return Json(XBService.GetCardDAHKDetails(cardNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPlasticCard(ulong productId, bool productIdType)
        {
            return Json(XBService.GetPlasticCard(productId, productIdType), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardCashbackAccount(ulong productId)
        {
            return Json(XBService.GetCardCashbackAccount(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardMotherName(ulong productId)
        {
            return Json(XBService.GetCardMotherName(productId), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCardActivationInArCa(string cardNumber, DateTime startDate, DateTime endDate)
        {
            return Json(XBService.GetCardActivationInArCa(cardNumber, startDate, endDate), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLastSendedPaymentFileDate()
        {
            return Json(XBService.GetLastSendedPaymentFileDate(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardActivationInArCaApigateDetail(ulong Id)
        {
            return Json(XBService.GetCardActivationInArCaApigateDetail(Id), JsonRequestBehavior.AllowGet);
        }


        public ActionResult CardActivationInArCaApigateDetails()
        {
            return PartialView("CardActivationInArCaApigateDetails");
        }

        public ActionResult CardActivationInArCaDetails()
        {
            return PartialView("CardActivationInArCaDetails");
        }

        public ActionResult CardTariffAdditionalInformation()
        {
            return PartialView("CardTariffAdditionalInformation");
        }

        public JsonResult GetCardTariffAdditionalInformation(int officeID, int cardType)
        {
            return Json(InfoService.GetCardTariffAdditionalInformation(officeID, cardType), JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Վերադարձնում է քարտի USSD ծառայության կարգավիճակը
        /// </summary>
        /// <param name="productID"></param>
        /// <returns></returns>
        public short GetCardUSSDService(ulong productID)
        {
            return (short)XBService.GetCardUSSDService(productID);
        }

        /// <summary>
        /// Վերադարձնում է USSD ծառայության սակագինը
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        public JsonResult GetCardUSSDServiceTariff(ulong productId)
        {
            return Json(XBService.GetCardUSSDServiceTariff(productId), JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Վերադարձնում է քարտի 3DSecure ծառայության կարգավիճակը
        /// </summary>
        /// <param name="productID"></param>
        /// <returns></returns>
        public JsonResult GetCard3DSecureService(ulong productID)
        {
            return Json(XBService.GetCard3DSecureService(productID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult VirtualCards()
        {
            return PartialView("VirtualCards");
        }

        public ActionResult VirtualCardHistory()
        {
            return PartialView("VirtualCardHistory");
        }

        public JsonResult GetVirtualCards(ulong productID)
        {
            string jsonResult = Utility.DoPostRequestJson(Newtonsoft.Json.JsonConvert.SerializeObject(new { issuerCardRefId = productID }), "getCardInfo", "CtokenURL", null);
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetVirtualCardHistory(string virtualCardId)
        {
            string jsonResult = Utility.DoPostRequestJson(Newtonsoft.Json.JsonConvert.SerializeObject(new { virtualCardId = virtualCardId }), "getVirtualCardHistory", "CtokenURL", null);
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardArCaStatus(ulong productID)
        {
            return Json(XBService.GetCardArCaStatus(productID), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCardToOtherCardOrder(long orderId)
        {
            return Json(XBService.GetCardToOtherCardOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CardToOtherCardOrderDetails()
        {
            return PartialView("CardToOtherCardOrderDetails");
        }

        public JsonResult GetCardTechnology(ulong productId)
        {
            return Json(XBService.GetCardTechnology(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardHolderFullName(ulong productId)
        {
            return Json(XBService.GetCardHolderFullName(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardHolderData(ulong productId, string dataType)
        {
            return Json(XBService.GetCardHolderData(productId, dataType), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CardRetainHistory()
        {
            return PartialView("CardRetainHistory");
        }
        public JsonResult GetCardRetainHistory(string cardNumber)
        {
            return Json(XBService.GetCardRetainHistory(cardNumber), JsonRequestBehavior.AllowGet);
        }
        public ActionResult ValidateSMSApplicationForPrint()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            byte customerType = ACBAOperationService.GetCustomerType(customerNumber);
            xbs.ActionResult result = new xbs.ActionResult();

            if (customerType == 6)
            {
                CustomerPhone phone = ACBAOperationService.GetCustomerMainMobilePhone(customerNumber);

                if (phone is null)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Հեռախոսահամարը մուտքագրված չէ";
                    result.Errors = new List<xbs.ActionError>();
                    result.ResultCode = xbs.ResultCode.ValidationError;
                    result.Errors.Add(error);
                    return Json(result);
                }
            }
            return Json(result);
        }
        public ActionResult Validate3DSecureEmailForPrint(string cardNumber)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            string email = XBService.GetCustomerEmailByCardNumber(cardNumber);
            if (email is null)
            {
                xbs.ActionError error = new xbs.ActionError();
                error.Code = 599;
                error.Description = "Հաճախորդը չունի գրանցված հիմնական էլ․ հասցե";
                result.Errors = new List<xbs.ActionError>();
                result.ResultCode = xbs.ResultCode.ValidationError;
                result.Errors.Add(error);
                return Json(result);
            }

            return Json(result);
        }

        public ActionResult VisaAlias()
        {
            return PartialView("VisaAlias");
        }

        public ActionResult VisaAliasDataChange()
        {
            return PartialView("VisaAliasDataChange");
        }

        public ActionResult VisaAliasOrderDetails()
        {
            return PartialView("VisaAliasOrderDetails");
        }

        public async Task<JsonResult> GetVisaAliasHistory(string CardNumber)
        {
            if (!string.IsNullOrEmpty(CardNumber))
            {
                VisaAliasHistoryWithCard visaAliasHistoryWithCard = new VisaAliasHistoryWithCard();
                visaAliasHistoryWithCard.CardNumber = CardNumber;
                return Json(await VisaAliasService.GetVisaAliasHistory(visaAliasHistoryWithCard), JsonRequestBehavior.AllowGet);
            }
            else
            {
                return null;
            }
        }
        public JsonResult GetVisaAliasOrderDetails(long orderId)
        {
            return Json(XBService.VisaAliasOrderDetails(orderId), JsonRequestBehavior.AllowGet);
        }
    }
}