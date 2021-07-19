using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using FrontOffice.ACBAServiceReference;
using System.Threading.Tasks;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class ServicePaymentNoteOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult GetCustomerServicePaymentNotes()
        {
            string guid = Utility.GetSessionId();
            int userFilialCode = Convert.ToInt32(((XBS.User)Session[guid + "_User"]).filialCode.ToString());
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            int customerFilialCode = ACBAOperationService.GetCustomerFilial(customerNumber);
            if (userFilialCode!= customerFilialCode)
            {
                ControllerContext.HttpContext.Response.StatusCode = 423;
            }
            return PartialView("CustomerServicePaymentNotes");
        }

        public ActionResult GetServicePaymentNoteOrderDetails()
        {
            return PartialView("ServicePaymentNoteOrderDetails");
        }

        public ActionResult GetDeletedServicePaymentNoteOrderDetails()
        {
            return PartialView("DeletedServicePaymentNoteOrderDetails");
        }

        public JsonResult GetServicePaymentNoteList()
        {
            return Json(XBService.GetServicePaymentNoteList(), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult PersonalServicePaymentNoteOrder()
        {
            return PartialView("PersonalServicePaymentNoteOrder");
        }
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        //[ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        //[ActionAccessFilter(actionType = ActionType.ServicePaymentNoteOrderSave)]
        public ActionResult SaveServicePaymentNoteOrder(xbs.ServicePaymentNoteOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveAndApproveServicePaymentNoteOrder(order);
            return Json(result);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]

        public ActionResult DeleteServicePaymentNoteOrder()
        {
            return PartialView("DeleteServicePaymentNoteOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public JsonResult GetServicePaymentNoteOrder(long orderID)
        {
            return Json(XBService.GetServicePaymentNoteOrder(orderID), JsonRequestBehavior.AllowGet);
        }


        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public JsonResult GetDelatedServicePaymentNoteOrder(long orderID)
        {
            return Json(XBService.GetDelatedServicePaymentNoteOrder(orderID), JsonRequestBehavior.AllowGet);
        }




    }
}