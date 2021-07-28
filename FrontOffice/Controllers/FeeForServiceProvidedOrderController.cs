using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class FeeForServiceProvidedOrderController : Controller
    {
         [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult FeeForServiceProvidedOrder()
        {
            return PartialView("FeeForServiceProvidedOrder");
        }


        public JsonResult GetServiceProvidedOrderFee(xbs.OrderType orderType,ushort serviceType)
        {
            return Json(XBService.GetServiceProvidedOrderFee(orderType,serviceType), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveFeeForServiceProvidedOrder(xbs.FeeForServiceProvidedOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = new xbs.ActionResult();

            result = XBService.SaveFeeForServiceProvidedOrder(order);
            return Json(result);
        }

        public ActionResult FeeForServiceProvidedOrderDetails()
        {
            return PartialView("FeeForServiceProvidedOrderDetails");
        }


        public JsonResult GetFeeForServiceProvidedOrder(long orderID)
        {

            xbs.FeeForServiceProvidedOrder order = new xbs.FeeForServiceProvidedOrder();
            order = XBService.GetFeeForServiceProvidedOrder(orderID);
            return Json(order, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFeeForServiceProvidedOrderDetails(xbs.FeeForServiceProvidedOrder paymentOrder, bool isCopy = false)
        {
           
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid +"_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "amount", value: paymentOrder.Amount.ToString());
            parameters.Add(key: "currency", value: paymentOrder.Currency);
            parameters.Add(key: "nom", value: paymentOrder.OrderNumber);
            parameters.Add(key: "lname", value: paymentOrder.OPPerson.PersonName + " " + paymentOrder.OPPerson.PersonLastName);

            if (!string.IsNullOrEmpty(paymentOrder.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: paymentOrder.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "False");
            }

            if (paymentOrder.ReceiverAccount == null)
                paymentOrder.ReceiverAccount = XBService.GetFeeForServiceProvidedOrderCreditAccount(paymentOrder);

            parameters.Add(key: "wd", value: paymentOrder.Description);
            parameters.Add(key: "credit", value: paymentOrder.ReceiverAccount.AccountNumber); 
            parameters.Add(key: "reg_Date", value: paymentOrder.OperationDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");

            return Json(parameters, JsonRequestBehavior.AllowGet);


        }

        

    }
}