using FrontOffice.Service;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class AccountClosingOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter (actionType = ActionType.CurrentAccountCloseOrderSave)]
        public ActionResult SaveAccountClosingOrder(xbs.AccountClosingOrder order)
        {
            List<xbs.Account> distinctAccounts = order.ClosingAccounts
                                                  .GroupBy(p => p.AccountNumber)
                                                  .Select(g => g.First())
                                                  .ToList();
            
            order.ClosingAccounts = distinctAccounts;
            xbs.ActionResult result = XBService.SaveAccountClosingOrder(order);
            return Json(result);            
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult PersonalAccountClosingOrder()
        {
            return PartialView("PersonalAccountClosingOrder");
        }

        public JsonResult GetAccountClosingOrder(long orderId)
        {
            return Json(XBService.GetAccountClosingOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PersonalAccountClosingOrderDetails()
        {
            return PartialView("PersonalAccountClosingOrderDetails");
        }

        public void GetAccountClosingApplication(string accountNumber, string closingReason, string isReprint,string RegistrationDateString)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid + "_User"]).filialCode.ToString();
            
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            parameters.Add(key: "armNumber", value: "(" + accountNumber + ")");
            parameters.Add(key: "closingReason", value: closingReason);
            parameters.Add(key: "filialCode", value: filialCode);
            parameters.Add(key: "isReprint", value: isReprint);
            parameters.Add(key: "RegistrationDateString", value: RegistrationDateString);
            ContractService.CurrentAccountClosingContract(parameters);
        }
    }
}