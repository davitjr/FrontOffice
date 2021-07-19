using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using FrontOffice.Models;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class DepositCasePenaltyMatureOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveDepositCasePenaltyMatureOrder(xbs.DepositCasePenaltyMatureOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveDepositCasePenaltyMatureOrder(order);
            return Json(result);

        }

        public ActionResult DepositCasePenaltyMatureOrder()
        {
            return PartialView("DepositCasePenaltyMatureOrder");
        }

        public JsonResult GetDepositCasePenaltyMatureOrder(long orderId)
        {
            return Json(XBService.GetDepositCasePenaltyMatureOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult DepositCasePenaltyMatureOrderDetails()
        {
            return PartialView("DepositCasePenaltyMatureOrderDetails");
        }


        public void GetCashInPaymentOrderDetails(xbs.DepositCasePenaltyMatureOrder order, bool isCopy = false)
        {
            ulong customerNumber = 0;
            customerNumber=XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "amount", value: order.Amount.ToString());
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "nom", value: order.OrderNumber);
            parameters.Add(key: "lname", value: Utility.ConvertAnsiToUnicode(customer.FirstName+" "+customer.LastName) );

            if (!string.IsNullOrEmpty( customer.SocCardNumber))
            {
                parameters.Add(key: "soccard", value: customer.SocCardNumber);
                parameters.Add(key: "check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: customer.SocCardNumber);
                parameters.Add(key: "check", value: "False");
            }

            parameters.Add(key: "wd", value: order.Description);

            xbs.DepositCase depositCase = XBService.GetDepositCase(order.ProductId);


            xbs.Account receiverAccount=XBService.GetOperationSystemAccount(order,xbs.OrderAccountType.CreditAccount,"AMD",(ushort)depositCase.FilialCode, "",customerNumber);

            parameters.Add(key: "credit", value: receiverAccount.AccountNumber.ToString());
            parameters.Add(key: "reg_Date", value: order.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");

            ReportService.GetCashInPaymentOrder(parameters);


        }



        
    }
}