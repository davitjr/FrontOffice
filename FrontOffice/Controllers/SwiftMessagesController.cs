using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using acba = FrontOffice.ACBAServiceReference;
using FrontOffice.Models;
using System.Web.SessionState;


namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class SwiftMessagesController : Controller
    {
        [AllowAnonymous]
        // GET: SwiftMessages
        public ActionResult Index()
        {
            return View("SwiftMessages");
        }

        public ActionResult SwiftMessages()
        {
            return PartialView("SwiftMessages");
        }

        public ActionResult Reject()
        {
            return PartialView("SwiftMessageReject");
        }
        public JsonResult GetSearchedSwiftMessages(xbs.SearchSwiftMessage searchParams)
        {
            var jsonResult = Json(XBService.GetSearchedSwiftMessages(searchParams), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public ActionResult SwiftMessageDetails()
        {
            return PartialView("SwiftMessageDetails");
        }

        public JsonResult GetSwiftMessage(ulong messageUnicNumber)
        {
            return Json(XBService.GetSwiftMessage(messageUnicNumber), JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveTransactionSwiftConfirmOrder(xbs.TransactionSwiftConfirmOrder order)
        {
            order.Type = xbs.OrderType.TransactionSwiftConfirmOrder;
            order.SubType = 1;
            xbs.ActionResult result = XBService.SaveTransactionSwiftConfirmOrder(order);
            return Json(result);
        }

        public JsonResult GetTransactionSwiftConfirmOrder(long orderID)
        {

            return Json(XBService.GetTransactionSwiftConfirmOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult TransactionSwiftConfirmOrderDetails()
        {
            return View("TransactionSwiftConfirmOrderDetails");
        }

        public ActionResult SaveSwiftMessageRejectOrder(xbs.SwiftMessageRejectOrder order)
        {
            order.Type = xbs.OrderType.SWIFTMessageRejectOrder;
            order.SubType = 1;
            xbs.ActionResult result = XBService.SaveSwiftMessageRejectOrder(order);
            return Json(result);
        }
    }
}