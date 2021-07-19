using FrontOffice.Service;
using FrontOffice.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net.Http;
using Newtonsoft.Json;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [SessionExpireFilter]
    public class TransferByCallController : Controller
    {
        // GET: getTransferList
        
        [AllowAnonymous]
        public ActionResult TransfersByCall()
        {
              return View("TransfersByCall");
        }

        // GET: getTransferList
        [SessionExpireFilter]
        public ActionResult TransfersByCallFilter()
        {
            return PartialView("TransfersByCall");
        }

        public JsonResult GetTransferList(xbs.TransferByCallFilter filter)
        {
            filter.StartDate = Convert.ToDateTime (filter.StartDate).Date;
            filter.EndDate = Convert.ToDateTime(filter.EndDate).Date;
            if (filter.StartDate.Year > 1900 && filter.EndDate.Year > 1900)
                return Json(XBService.GetTransferList(filter), JsonRequestBehavior.AllowGet);
            else
                return Json("", JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransferCallQuality()
        {
           return Json(InfoService.GetTransferCallQuality(), JsonRequestBehavior.AllowGet);
           
        }

        public JsonResult GetTransferTypes(short isActive)
        {
            return Json(InfoService.GetTransferTypes(isActive), JsonRequestBehavior.AllowGet);
           
        }

        public ActionResult PersonalTransferByCall()
        {
            return PartialView("PersonalTransferByCall");
        }

        
        public JsonResult SaveTransferCall(xbs.TransferByCall transferCall)
        {
            return Json(XBService.SaveTransferCall(transferCall), JsonRequestBehavior.AllowGet);
        }

        //public JsonResult SaveCallTransferChangeOrder(xbs.TransferByCallChangeOrder transferCall)
        //{
        //    return Json(XBService.SaveAndApproveCallTransferChangeOrder(transferCall), JsonRequestBehavior.AllowGet);
        //}

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionType = ActionType.FastTransferOrderSave)]
        public ActionResult SaveCallTransferChangeOrder(xbs.TransferByCallChangeOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            if (order.ReceivedFastTransfer.Source != xbs.SourceType.Bank )
            {
                XBService.SetTransferByCallType(order.ReceivedFastTransfer.SubType, order.ReceivedFastTransfer.TransferByCallID);
            }

            if (order.SubType == 5)
            {
              if (order.ReceivedFastTransfer.SubType!= 18)
              {
                bool IsExisting = XBService.IsExistingTransferByCall(order.ReceivedFastTransfer.SubType, order.ReceivedFastTransfer.Code, order.ReceivedFastTransfer.TransferByCallID);
                if (IsExisting)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Գոյություն ունի տվյալ համակարգի նույն հսկիչ համարով փոխանցում";
                    result.Errors = new List<xbs.ActionError>();
                   
                        result.ResultCode = xbs.ResultCode.ValidationError;
                    result.Errors.Add(error);

                    return Json(result);
                    }
                }
            }
            order.Quality = xbs.OrderQuality.Draft;
            result = XBService.SaveAndApproveCallTransferChangeOrder(order);

            if (result.ResultCode == xbs.ResultCode.Normal)
                return Json(result);
            else
                return Json(result);//must return error view
        }
        public JsonResult SendTransfeerCallForPay(ulong  transferID)
        {
            return Json(XBService.SendTransfeerCallForPay(transferID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransferSystemCurrency(short transferSystem)
        {
            return Json(InfoService.GetTransferSystemCurrency(transferSystem), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetContractsForTransfersCall(string customerNumber, string accountNumber, string cardNumber)
        {
            return Json(XBService.GetContractsForTransfersCall(customerNumber, accountNumber, cardNumber), JsonRequestBehavior.AllowGet);
        }

        public ActionResult TransferByCallDetails()
        {
            return PartialView("TransferByCallDetails");
        }

        public JsonResult GetTransferDetails(long transferId)
        {
            return Json(XBService.GetTransferDetails(transferId), JsonRequestBehavior.AllowGet);

        }

        public ActionResult RemittanceCancellationOrder(xbs.RemittanceCancellationOrder order)
        {
            RemittanceCancellationOrderController cancellation = new RemittanceCancellationOrderController();
            return cancellation.SaveRemittanceCancellationOrder(order);
        }
    }
}