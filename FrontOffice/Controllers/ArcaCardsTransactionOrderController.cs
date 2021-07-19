using FrontOffice.Models;
using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class ArcaCardsTransactionOrderController : Controller
    {
        public ActionResult ArcaCardsTransactionOrder()
        {
            return PartialView("ArcaCardsTransactionOrder");
        }

        public ActionResult ArcaCardsTransactionOrderDetails()
        {
            return PartialView("ArcaCardsTransactionOrderDetails");
        }

        [ActionAccessFilter(actionType = ActionType.ArcaCardsTransactionOrderSave)]
        public JsonResult SaveArcaCardsTransactionOrder(xbs.ArcaCardsTransactionOrder order)
        {
            xbs.ActionResult result = XBService.SaveArcaCardsTransactionOrder(order);
            return Json(result);
        }

        public JsonResult GetActionsForCardTransaction()
        {
            Dictionary<string, string> result = InfoService.GetActionsForCardTransaction();
            return Json(result);
        }

        public JsonResult GetReasonsForCardTransactionAction()
        {
            Dictionary<string, string> result = InfoService.GetReasonsForCardTransactionAction();
            return Json(result);
        }

        public JsonResult GetArcaCardsTransactionOrder(long selectedOrder)
        {
            return Json(XBService.GetArcaCardsTransactionOrder(selectedOrder), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBlockingReasonForBlockedCard(string cardNumber)
        {
            return Json(XBService.GetBlockingReasonForBlockedCard(cardNumber), JsonRequestBehavior.AllowGet);
        }

        [ActionAccessFilter(actionType = ActionType.ArcaCardsTransactionOrdersReport)]
        public void GetArcaCardsTransactionOrdersReport(xbs.SearchOrders searchParams)
        {
            Dictionary<string, string> param = new Dictionary<string, string>();

            param.Add(key: "startDate", value: (searchParams.DateFrom == null) ? null : String.Format("{0:dd/MMM/yy}", searchParams.DateFrom));
            param.Add(key: "endDate", value: (searchParams.DateTo == null) ? null : String.Format("{0:dd/MMM/yy}", searchParams.DateTo));
            param.Add(key: "id", value: searchParams.Id.ToString());
            param.Add(key: "quality", value: ((short)searchParams.OrderQuality).ToString());
            param.Add(key: "setNumber", value: searchParams.RegisteredUserID.ToString());
            param.Add(key: "customerNumber", value: searchParams.CustomerNumber.ToString());
            param.Add(key: "cardNumber", value: searchParams.CardNumber);
            ReportService.GetArcaCardsTransactionsReport(param);
        }

        public JsonResult GetPreviousBlockUnblockOrderComment(string cardNumber)
        {
            return Json(XBService.GetPreviousBlockUnblockOrderComment(cardNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllReasonsForCardTransactionAction()
        {
            Dictionary<string, string> result = InfoService.GetAllReasonsForCardTransactionAction();
            return Json(result);
        }
    }
}