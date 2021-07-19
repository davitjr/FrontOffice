using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using FrontOffice.Models;
using FrontOffice.Service;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class RemovalOrderController : Controller
    {

        [TransactionPermissionFilterAttribute]
        public ActionResult RemovalOrder()
        {
            return PartialView("RemovalOrder");
        }

        public void GetRemovableOrderApplication(long orderId,double amount,string currency,string accountNumber,string customerName )
        {
            DateTime confirmationDate = OrdersController.GetOrderConfirmationDate(orderId);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid + "_User"]).filialCode.ToString();

            parameters.Add(key: "bankCode", value: filialCode);
            parameters.Add(key: "dateOfValue", value: confirmationDate.ToString("MM/dd/yy HH:mm:ss tt"));
            parameters.Add(key: "customerName", value: customerName);
            parameters.Add(key: "amount", value: amount.ToString());
            parameters.Add(key: "currency", value: currency);
            parameters.Add(key: "accountNumber", value: accountNumber);

            ContractService.GetOperationDeletingApplication(parameters);
        }

  

        [TransactionPermissionFilterAttribute]
        [ActionAccessFilter(actionType = ActionType.TransactionRemovalOrderSave)]
        public ActionResult SaveRemovalOrder(xbs.RemovalOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveRemovalOrder(order);
            return Json(result);
        }

        public ActionResult RemovalOrderDetails()
        {
            return PartialView("RemovalOrderDetails");
        }


        public JsonResult GetRemovalOrderDetails(long orderID)
        {
            xbs.RemovalOrder order = new xbs.RemovalOrder();
            order = XBService.GetRemovalOrder(orderID);
            return Json(order, JsonRequestBehavior.AllowGet);
        }

    }
}