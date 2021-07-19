using FrontOffice.Models;
using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;


namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class DepositCaseStoppingPenaltyCalculationOrderController : Controller
    {

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult PersonalDepositCaseStoppingPenaltyCalculationOrder()
        {
            return PartialView("PersonalDepositCaseStoppingPenaltyCalculationOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.DepositCasePenaltyCancelingOrder)]
        public ActionResult SaveDepositCaseStoppingPenaltyCalculationOrder(xbs.DepositCaseStoppingPenaltyCalculationOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveDepositCaseStoppingPenaltyCalculationOrder(order);
            return Json(result);
        }

        public JsonResult GetDepositCaseStoppingPenaltyCalculationOrder(int orderID)
        {
            return Json(XBService.GetDepositCaseStoppingPenaltyCalculationOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PersonalDepositCaseStoppingPenaltyCalculationOrderDetails()
        {
            return PartialView("PersonalDepositCaseStoppingPenaltyCalculationOrderDetails");
        }

    }
}