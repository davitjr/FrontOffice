using System.Collections.Generic;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class MatureOrderController : Controller
    {

        public ActionResult PersonalMatureOrder()
        {
            return PartialView("PersonalMatureOrder");
        }
        public ActionResult MatureOrderDetails()
        {
            return PartialView("MatureOrderDetails");
        }
        public JsonResult GetMatureOrder(int orderId)
        {
            return Json(XBService.GetMatureOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveMatureOrder(xbs.MatureOrder order)
        {

            order.SubType = (byte)order.MatureType;
            xbs.ActionResult result = XBService.SaveMatureOrder(order);

            return Json(result);//must return error view
        }

        public void GetMatureApplication(xbs.Account account, string matureType, string currentRateValue, string contractNumber, double amount)
        {

            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid + "_User"]).filialCode.ToString();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "customerNumber", value: customerNumber.ToString());
            if (account.AccountNumber == null)
            {
                account.AccountNumber = "0";
            }
            parameters.Add(key: "accountNumber", value: account.AccountNumber);
            parameters.Add(key: "balance", value: account.Balance.ToString());
            parameters.Add(key: "leftoverBalance", value: (account.Balance - amount).ToString());
            parameters.Add(key: "percent", value: currentRateValue);
            parameters.Add(key: "matureType", value: matureType);
            parameters.Add(key: "securityCode", value: contractNumber);
            parameters.Add(key: "filialCode", value: filialCode);
            ContractService.LoanMatureApplication(parameters);
        }

        public JsonResult GetThreeMonthLoanRate(ulong productId)
        {
            return Json(XBService.GetThreeMonthLoanRate(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanMatureCapitalPenalty(xbs.MatureOrder order)
        {
            return Json(XBService.GetLoanMatureCapitalPenalty(order), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanCalculatedRest(xbs.Loan loan, xbs.MatureOrder order)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            return Json(XBService.GetLoanCalculatedRest(loan, customerNumber, (short)order.MatureType), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductAccount(xbs.MatureOrder order)
        {

            return Json(XBService.GetProductAccount(order.ProductId, 18, 224), JsonRequestBehavior.AllowGet);
        }

    }
}