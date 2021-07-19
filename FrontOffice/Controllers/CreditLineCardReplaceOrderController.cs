using FrontOffice.Models.VisaAliasModels;
using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;


namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CreditLineCardReplaceOrderController : Controller
    {
        public ActionResult CreditLineCardReplaceOrder()
        {
            return PartialView("CreditLineCardReplaceOrder");
        }

        public ActionResult CreditLineCardReplaceOrderDetails()
        {
            return PartialView("CreditLineCardReplaceOrderDetails");
        }

        public JsonResult GetCard(ulong productId)
        {
            return Json(XBService.GetCard(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCreditLineCardReplaceOrder(long orderId)
        {
            return Json(XBService.GetCreditLineCardReplaceOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveCreditLineCardReplaceOrder(xbs.CreditLineCardReplaceOrder order)
        {
            xbs.ActionResult result = XBService.SaveCreditLineCardReplaceOrder(order);

            ////Visa Alias մուտքագրում
            if ((order.Card.CardSystem == 4 || order.Card.CardSystem == 5) && result.Errors.Any(error => error.Code == 0))
            {
                VisaAliasHistoryWithCard visaAliasHistoryWithCard = new VisaAliasHistoryWithCard { CardNumber = order.Card.CardNumber };
                VisaAliasHistory visaAliasHistory = VisaAliasService.GetVisaAliasHistoryDetails(visaAliasHistoryWithCard);

                ResolveAliasRequest resolveAliasRequest = new ResolveAliasRequest
                { BusinessApplicationId = "PP", Alias = visaAliasHistory.Alias, AccountLookUp = "Y", SetNumber = order.InvolvingSetNumber };

                ResolveAliasResponse resolveAliasResponse = VisaAliasService.ResolveVisaAliasDetails(resolveAliasRequest);

                if (resolveAliasResponse.RecipientPrimaryAccountNumber == null || resolveAliasResponse.IssuerName != "ACBA Bank")
                {
                    string guid = Guid.NewGuid().ToString("N");

                    CreateAliasRequest createAliasRequest = new CreateAliasRequest
                    {
                        Country = "AM",
                        RecipientFirstName = visaAliasHistory.RecipientFirstName,
                        recipientLastName = visaAliasHistory.recipientLastName,
                        RecipientLastName = visaAliasHistory.recipientLastName,

                        RecipientPrimaryAccountNumber = result.Errors[0].Description,
                        IssuerName = "ACBA Bank",
                        CardType = visaAliasHistory.CardType,
                        ConsentDateTime = Convert.ToString(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")),
                        AliasType = "01",
                        Guid = guid,
                        Alias = visaAliasHistory.Alias,
                        ExpiryDate = visaAliasHistory.ExpiryDate,
                        SetNumber = order.InvolvingSetNumber
                    };

                    VisaAliasService.CreateVisaAlias(createAliasRequest);
                }
                else if (resolveAliasResponse.IssuerName == "ACBA Bank" && resolveAliasResponse.RecipientPrimaryAccountNumber == order.Card.CardNumber)
                {
                    UpdateAliasRequest updateAliasRequest = new UpdateAliasRequest
                    {
                        RecipientPrimaryAccountNumber = result.Errors[0].Description,
                        IssuerName = "ACBA Bank",
                        CardType = visaAliasHistory.CardType,
                        ConsentDateTime = Convert.ToString(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")),
                        AliasType = "01",
                        Guid = visaAliasHistory.Guid,
                        Alias = visaAliasHistory.Alias,
                        ExpiryDate = visaAliasHistory.ExpiryDate,
                        SetNumber = order.InvolvingSetNumber
                    };
                    VisaAliasService.UpdateVisaAlias(updateAliasRequest);
                }
            }

            return Json(result);
        }
    }
}