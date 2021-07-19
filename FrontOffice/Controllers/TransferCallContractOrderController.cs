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
    public class TransferCallContractOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        //Ֆիլտրը հանվել է քանի որ բոլորը ունեն հասանոլիություն
        //[ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveTransferCallContractOrder(xbs.TransferCallContractOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveTransferCallContractOrder(order);

            return Json(result);

        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        //Ֆիլտրը հանվել է քանի որ բոլորը ունեն հասանոլիություն
        //[ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveTransferCallContractTerminationOrder(xbs.TransferCallContractTerminationOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveTransferCallContractTerminationOrder(order);

            return Json(result);

        }

        public ActionResult TransferCallContractOrder()
        {
            return PartialView("TransferCallContractOrder");
        }

        public ActionResult TransferCallContractTerminationOrder()
        {
            return PartialView("TransferCallContractTerminationOrder");
        }


        public ActionResult TransferCallContractOrderDetails()
        {
            return PartialView("TransferCallContractOrderDetails");
        }

        public ActionResult TransferCallContractTerminationOrderDetails()
        {
            return PartialView("TransferCallContractTerminationOrderDetails");
        }


        public JsonResult GetTransferCallContractTerminationOrder(long orderID)
        {
            xbs.TransferCallContractTerminationOrder order = new xbs.TransferCallContractTerminationOrder();
            order = XBService.GetTransferCallContractTerminationOrder(orderID);
            return Json(order, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetTransferCallContractOrder(long orderID)
        {
            xbs.TransferCallContractOrder order = new xbs.TransferCallContractOrder();
            order = XBService.GetTransferCallContractOrder(orderID);
            return Json(order, JsonRequestBehavior.AllowGet);
        }

        public void TransferCallContract(xbs.TransferCallContractDetails contract)
        {
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "accountNumber", value: contract.Account.AccountNumber.ToString());
            parameters.Add(key: "filialCode", value: user.filialCode.ToString());
            parameters.Add(key: "contractNumber", value: contract.ContractNumber.ToString());
            parameters.Add(key: "contractPassword", value: contract.ContractPassword);

            ContractService.TransferCallContract(parameters);
        }
    }
}