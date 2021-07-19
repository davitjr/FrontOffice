using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class ClassifiedLoanActionOrderController : Controller
    { 
        public ActionResult PersonalClassifiedLoanActionOrder()
        {
            return PartialView("PersonalClassifiedLoanActionOrder");
        }
        [TransactionPermissionFilter]
        [ActionAccessFilter(actionType = ActionType.ClassifiedLoanProductClassificationRemoveOrder)]
        public ActionResult SaveLoanProductClassificationRemoveOrder(xbs.LoanProductClassificationRemoveOrder order, String includingSurcharge="0" )
        { 
            xbs.ActionResult result = new xbs.ActionResult();
            
            result = XBService.SaveLoanProductClassificationRemoveOrder(order, includingSurcharge=="1");

            return Json(result);
        }
        [TransactionPermissionFilter]
        [ActionAccessFilter(actionType = ActionType.ClassifiedLoanProductMakeOutOrder)]
        public ActionResult SaveLoanProductMakeOutOrder(xbs.LoanProductMakeOutOrder order, String includingSurcharge="0")
        {
            xbs.ActionResult result = new xbs.ActionResult();
             
            result = XBService.SaveLoanProductMakeOutOrder(order, includingSurcharge == "1");

            return Json(result);
        }

        public ActionResult ClassifiedLoanActionOrderDetails()
        {
            return PartialView("ClassifiedLoanActionOrderDetails");
        }

        [TransactionPermissionFilter]
        [ActionAccessFilter(actionType = ActionType.ClassifiedLoanProductMakeOutOrder)]
        public ActionResult SaveLoanProductMakeOutBalanceOrder(xbs.LoanProductMakeOutBalanceOrder order, String includingSurcharge = "0")
        {
            xbs.ActionResult result = new xbs.ActionResult();

            result = XBService.SaveLoanProductMakeOutBalanceOrder(order, includingSurcharge == "1");

            return Json(result);
        }
        
    }
}