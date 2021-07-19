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
    [SessionState(SessionStateBehavior.ReadOnly)]
    [SessionExpireFilter]
    public class TransitAccountsForDebitTransactionsController : Controller
    {
        [AllowAnonymous]
        // GET: TransitAccountsForDebitTransactions
        public ActionResult Index()
        {
            return View("InputTransitAccountsForDebitTransactions");
        }
        public ActionResult NewTransitAccountsForDebitTransactions()
        {
            return PartialView("NewTransitAccountsForDebitTransactions");
        }

        public ActionResult FilialTransitAccountsForDebitTransactionsList()
        {
            return PartialView("FilialTransitAccountsForDebitTransactions");
        }

        public ActionResult TransitAccountDetails()
        {
            return PartialView("TransitAccountDetails");
        }
        public JsonResult SaveTransitAccountForDebitTransactions(xbs.TransitAccountForDebitTransactions account, bool confirm = false)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            if (!confirm)
            {
                xbs.Account transitAccount = XBService.GetAccountInfo(account.TransitAccount.AccountNumber);
                if (transitAccount!=null && transitAccount.FilialCode != account.FilialCode && !confirm)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Հաշիվը պատկանում է այլ մ/ճ-ի";
                    result.Errors = new List<xbs.ActionError>();
                    result.ResultCode = xbs.ResultCode.Warning;
                    result.Errors.Add(error);
                    return Json(result);
                }
            }

            result = XBService.SaveTransitAccountForDebitTransactions(account);
            return Json(result,JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdateTransitAccountForDebitTransactions(xbs.TransitAccountForDebitTransactions account)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.UpdateTransitAccountForDebitTransactions(account);
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetAllTransitAccountsForDebitTransactions(xbs.ProductQualityFilter quality)
        {
            return Json(XBService.GetAllTransitAccountsForDebitTransactions(quality), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CloseTransitAccountForDebitTransactions(xbs.TransitAccountForDebitTransactions account)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.CloseTransitAccountForDebitTransactions(account);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransitAccountsForDebitTransactions()
        {
            return Json(XBService.GetTransitAccountsForDebitTransactions(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult ReopenTransitAccountForDebitTransactions(xbs.TransitAccountForDebitTransactions account)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.ReopenTransitAccountForDebitTransactions(account);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}