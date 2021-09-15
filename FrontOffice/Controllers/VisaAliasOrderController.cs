using FrontOffice.Models.VisaAliasModels;
using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;


namespace FrontOffice.Controllers
{
    public class VisaAliasOrderController : Controller
    {


        /// <summary>
        /// VISA -յում տվյալների պահպանում 
        /// </summary>
        /// <param name="changeAction"></param>
        /// <param name="CardNumber"></param>
        /// <param name="alias"></param>
        /// <param name="addInfo"></param>
        /// <returns></returns>
        public async Task<JsonResult> SaveVisaAliasDataChange(string changeAction, string CardNumber, string alias, string addInfo)
        {
            int SetNumber = GetSetNumber();

            if (!string.IsNullOrEmpty(CardNumber))
            {
                VisaAliasHistoryWithCard visaAliasHistoryWithCard = new VisaAliasHistoryWithCard { CardNumber = CardNumber };
                VisaAliasHistory visaAliasHistory = await VisaAliasService.GetVisaAliasHistory(visaAliasHistoryWithCard);

                if (changeAction == "0")
                {
                    string guid = Guid.NewGuid().ToString("N");

                    CreateAliasRequest createAliasRequest = new CreateAliasRequest
                    {
                        Country = "AM",
                        RecipientFirstName = visaAliasHistory.RecipientFirstName,
                        recipientLastName = visaAliasHistory.recipientLastName,
                        RecipientLastName = visaAliasHistory.recipientLastName,
                        RecipientPrimaryAccountNumber = CardNumber,
                        IssuerName = "ACBA Bank",
                        CardType = visaAliasHistory.CardType,
                        ConsentDateTime = Convert.ToString(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")),
                        AliasType = "01",
                        Guid = guid,
                        Alias = alias,
                        ExpiryDate = visaAliasHistory.ExpiryDate,
                        SetNumber = SetNumber
                    };

                    return Json(await VisaAliasService.CreateVisaAlias(createAliasRequest), JsonRequestBehavior.AllowGet);
                }
                else if (changeAction == "1")
                {
                    UpdateAliasRequest updateAliasRequest = new UpdateAliasRequest
                    {
                        RecipientPrimaryAccountNumber = CardNumber,
                        IssuerName = "ACBA Bank",
                        CardType = visaAliasHistory.CardType,
                        ConsentDateTime = Convert.ToString(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")),
                        AliasType = "01",
                        Guid = visaAliasHistory.Guid,
                        Alias = alias,
                        ExpiryDate = visaAliasHistory.ExpiryDate,
                        SetNumber = SetNumber
                    };

                    return Json(await VisaAliasService.UpdateVisaAlias(updateAliasRequest), JsonRequestBehavior.AllowGet);

                }
                else if (changeAction == "2")
                {
                    DeleteAliasRequest deleteAliasRequest = new DeleteAliasRequest { Guid = visaAliasHistory.Guid, Alias = visaAliasHistory.Alias, SetNumber = SetNumber };

                    return Json(await VisaAliasService.DeleteVisaAlias(deleteAliasRequest), JsonRequestBehavior.AllowGet);
                }
                else if (changeAction == "3")
                {
                    GetAliasRequest getAliasRequest = new GetAliasRequest { Guid = visaAliasHistory.Guid };

                    return Json(await VisaAliasService.GetVisaAlias(getAliasRequest), JsonRequestBehavior.AllowGet);

                }
                else if (changeAction == "4")
                {
                    ResolveAliasRequest resolveAliasRequest = new ResolveAliasRequest { BusinessApplicationId = "PP", Alias = visaAliasHistory.Alias, AccountLookUp = "Y", SetNumber = SetNumber };

                    return Json(await VisaAliasService.ResolveVisaAlias(resolveAliasRequest), JsonRequestBehavior.AllowGet);

                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

        public int GetSetNumber()
        {
            string guid = Utility.GetSessionId();
            FrontOffice.XBS.User user = (FrontOffice.XBS.User)Session[guid + "_User"];
            int setNumber = user.userID;
            return setNumber;
        }


        public ActionResult SaveAndApproveVisaAliasOrder(xbs.VisaAliasOrder order)
        {
            order.CustomerNumber = XBService.GetAuthorizedCustomerNumber();
            order.Source = xbs.SourceType.Bank;
            order.FilialCode = order.FilialCode;            
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveAndApproveVisaAliasOrder(order);
            return Json(result);

        }


    }
}