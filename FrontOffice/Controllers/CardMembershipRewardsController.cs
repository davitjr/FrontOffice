using System;   
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;
using FrontOffice.Models;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CardMembershipRewardsController : Controller
    {
        public JsonResult GetCardMembershipRewards(string cardNumber)
        {
            return Json(XBService.GetCardMembershipRewards(cardNumber), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CardMembershipRewards()
        {
            return PartialView("CardMembershipRewards");
        }

        public ActionResult CardMembershipRewardsStatusHistory()
        {
            return PartialView("CardMembershipRewardsStatusHistory");
        }
        
        public ActionResult CardMembershipRewardsBonusHistory()
        {
            return PartialView("CardMembershipRewardsBonusHistory");
        }

        public ActionResult CardMembershipRewardsOrderDetails()
        {
            return PartialView("CardMembershipRewardsOrderDetails");
        }

        public JsonResult GetCardMembershipRewardsStatusHistory(string cardNumber)
        {
            return Json(XBService.GetCardMembershipRewardsStatusHistory(cardNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCardMembershipRewardsBonusHistory(string cardNumber, DateTime startDate, DateTime endDate)
        {
            return Json(XBService.GetCardMembershipRewardsBonusHistory(cardNumber, startDate, endDate), JsonRequestBehavior.AllowGet);
        }


        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        //[ActionAccessFilter(actionType = ActionType.CardStatusChangeOrderSave)]
        public ActionResult SaveCardMembershipRewardsOrder(xbs.MembershipRewardsOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveCardMembershipRewardsOrder(order);
            return Json(result);
        }


        public JsonResult GetCardMembershipRewardsOrder(int orderID)
        {
            return Json(XBService.GetCardMembershipRewardsOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMRDataChangeAvailability(int mrID)
        {
            return Json(XBService.GetMRDataChangeAvailability(mrID), JsonRequestBehavior.AllowGet);
        }


    }
}