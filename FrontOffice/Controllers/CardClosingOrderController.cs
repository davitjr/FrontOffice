using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using FrontOffice.Service;
using FrontOffice.Models;
using FrontOffice.Models.VisaAliasModels;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CardClosingOrderController : Controller
    {
        public int GetSetNumber()
        {
            string guid = Utility.GetSessionId();
            FrontOffice.XBS.User user = (FrontOffice.XBS.User)Session[guid + "_User"];
            int setNumber = user.userID;
            return setNumber;
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.CardClosingOrderSave)]
        public ActionResult SaveCardClosingOrder(xbs.CardClosingOrder order, string cardNumber)
        {
            int UserId = GetSetNumber();
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveCardClosingOrder(order);

            if (result.Errors.Count == 0)
            {
                VisaAliasHistoryWithCard visaAliasHistoryWithCard = new VisaAliasHistoryWithCard { CardNumber = cardNumber };
                VisaAliasHistory visaAliasHistory = VisaAliasService.GetVisaAliasHistoryDetails(visaAliasHistoryWithCard);

                DeleteAliasRequest deleteAliasRequest = new DeleteAliasRequest() { SetNumber = UserId, Alias = visaAliasHistory.Alias, Guid = visaAliasHistory.Guid };
                VisaAliasService.DeleteVisaAlias(deleteAliasRequest);
            }
            return Json(result);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult PersonalCardClosingOrder()
        {
            return PartialView("PersonalCardClosingOrder");
        }

        public JsonResult GetCardClosingOrder(long orderId)
        {
            return Json(XBService.GetCardClosingOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CardClosingOrderDetails()
        {
            return PartialView("CardClosingOrderDetails");
        }

        public JsonResult GetCardClosingWarnings(ulong productId)
        {
            return Json(XBService.GetCardClosingWarnings(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardClosingApplication(string cardNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "cardNumber", value: cardNumber);
            return Json(parameters, JsonRequestBehavior.AllowGet);
        }
    }
}



