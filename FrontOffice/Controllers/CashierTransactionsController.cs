using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;



namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CashierTransactionsController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("CashierTransactions");
        }

        public ActionResult CashierTransactions()
        {
            return View("CashierTransactions");
        }

        [HttpPost]
        public JsonResult GetOrdersForCashRegister(xbs.SearchOrders searchOrders)

        {

            if (searchOrders.FirstName != null)
                searchOrders.FirstName = Utility.ConvertUnicodeToAnsi(searchOrders.FirstName);
            if (searchOrders.LastName != null)
                searchOrders.LastName = Utility.ConvertUnicodeToAnsi(searchOrders.LastName);
            if (searchOrders.MiddleName != null)
                searchOrders.MiddleName = Utility.ConvertUnicodeToAnsi(searchOrders.MiddleName);
            if (searchOrders.OrgName != null)
                searchOrders.OrgName = Utility.ConvertUnicodeToAnsi(searchOrders.OrgName);
            return Json(XBService.GetOrdersForCashRegister((xbs.SearchOrders) searchOrders));
        }


        [TransactionPermissionFilterAttribute]
        public ActionResult ConfirmOrder(long orderID, ulong customerNumber)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            XBS.AuthorizedCustomer authorizedCustomer = new xbs.AuthorizedCustomer();
            string guid = Utility.GetSessionId();

            authorizedCustomer = XBService.AuthorizeCustomer(customerNumber, Session[guid + "_authorizedUserSessionToken"].ToString());

            if (authorizedCustomer.SessionID != null)
            {
                Session[guid + "_AuthorisedCustomerSessionId"] = authorizedCustomer.SessionID;
            }
            else
            {
                Session[guid + "_AuthorisedCustomerSessionId"] = null;
            }

            result = XBService.ConfirmOrder(orderID);

            Session[guid + "_AuthorisedCustomerSessionId"] = null;

            return Json(result);
        }

    }
}