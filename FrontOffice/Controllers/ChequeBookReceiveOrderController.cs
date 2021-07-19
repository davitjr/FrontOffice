using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class ChequeBookReceiveOrderController : Controller
    {
        public JsonResult GetChequeBookReceiveOrder(long orderID)
        {
            return Json(XBService.GetChequeBookReceiveOrder(orderID), JsonRequestBehavior.AllowGet);
        }


        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.RequestForChequebookReceiveOrderSave)]
        public ActionResult SaveChequeBookReceiveOrder(xbs.ChequeBookReceiveOrder order)
        {
            order.Type = xbs.OrderType.ChequeBookReceiveOrder;
            order.Currency = "AMD";
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveChequeBookReceiveOrder(order);
            return Json(result);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult PersonalChequeBookReceiveOrder()
        {
            return PartialView("PersonalChequeBookReceiveOrder");
        }

        public ActionResult ChequeBookReceiveOrderDetails()
        {
            return PartialView("ChequeBookReceiveOrderDetails");
        }

        public JsonResult GetChequeBookReceiveOrderWarnings(ulong customerNumber, string accountNumber)
        {
            return Json(XBService.GetChequeBookReceiveOrderWarnings(customerNumber, accountNumber), JsonRequestBehavior.AllowGet);
        }
        public void GetChequeBookApplication(string accountNumber, string personName,string pageNumberStart, string pageNumberEnd)
        {
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)System.Web.HttpContext.Current.Session[guid + "_User"]).filialCode.ToString();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "accountNumber", value: accountNumber.ToString());
            parameters.Add(key: "filialCode", value: filialCode);
            parameters.Add(key: "trustedPersonName", value: personName);
            parameters.Add(key: "pageNumberStart", value: pageNumberStart);
            parameters.Add(key: "pageNumberEnd", value: pageNumberEnd);
            ContractService.GetChequeBookApplication(parameters);
        }

    }
}