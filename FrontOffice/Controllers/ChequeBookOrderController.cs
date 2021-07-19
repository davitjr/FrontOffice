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
    public class ChequeBookOrderController : Controller
    {
        public JsonResult GetChequeBookOrder(long orderID)
        {
            return Json(XBService.GetChequeBookOrder(orderID), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PersonalChequeBookOrder()
        {
            return PartialView("PersonalChequeBookOrder");
        }
        public ActionResult ChequeBookOrderDetails()
        {
            return PartialView("ChequeBookOrderDetails");
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.RequestForChequebookOrderSave)]
        public ActionResult SaveChequeBookOrder(xbs.ChequeBookOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            order.Type = xbs.OrderType.ChequeBookOrder;

            order.Currency = "AMD";

            if (string.IsNullOrEmpty(order.PersonFullName))
            {
                xbs.ActionError err = new xbs.ActionError();
                err.Description = "Մուտքագրեք չեկային գրքույկը ստացողի անուն ազգանունը";
                result.ResultCode = xbs.ResultCode.Failed;
                result.Errors.Add(err);
                return Json(result);
            }

            result = XBService.SaveChequeBookOrder(order);
            return Json(result);
        }

        public void GetChequeBookApplication(string accountNumber,string personName, string pageNumberStart, string pageNumberEnd)
        {
            string guid = Utility.GetSessionId();
            string filialCode =((xbs.User)System.Web.HttpContext.Current.Session[guid +"_User"]).filialCode.ToString();
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