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
    public class CardRegistrationOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult CardRegistrationOrder()
        {
            return PartialView("CardRegistrationOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult CardRegistrationOrderDetails()
        {
            return PartialView("CardRegistrationOrderDetails");
        }

        // GET: /Cards/
        public JsonResult GetCardsForRegistration()
        {
            return Json(XBService.GetCardsForRegistration(), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.CardRegistrationSave)]
        public ActionResult SaveCardRegistrationOrder(xbs.CardRegistrationOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveCardRegistrationOrder(order);

            if (result?.ResultCode != xbs.ResultCode.ValidationError && result?.ResultCode != xbs.ResultCode.Failed)
            {
                Utility.RefreshUserAccessForCustomer();
            }

            return Json(result);
        }

        public JsonResult GetAccountListForCardRegistration(string cardCurrency, int cardFilial)
        {
            return Json(XBService.GetAccountListForCardRegistration(cardCurrency, cardFilial), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOverdraftAccountsForCardRegistration(string cardCurrency, int cardFilial)
        {
            return Json(XBService.GetOverdraftAccountsForCardRegistration(cardCurrency, cardFilial), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardRegistrationOrder(long orderId)
        {
            return Json(XBService.GetCardRegistrationOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardRegistrationWarnings(xbs.PlasticCard plasticCard)
        {
            return Json(XBService.GetCardRegistrationWarnings(plasticCard), JsonRequestBehavior.AllowGet);
        }


    }
}