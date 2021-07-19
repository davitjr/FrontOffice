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
    public class PeriodicOrderController : Controller
    {
        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SavePeriodicPaymentOrder(xbs.PeriodicPaymentOrder order,bool confirm=false)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            order.Type = xbs.OrderType.PeriodicTransfer;
            order.PaymentOrder.Quality = xbs.OrderQuality.Draft;
            
            if (!confirm && order.IsRAFound==1 && order.PeriodicType==1)
            {
                
                result.Errors = new List<xbs.ActionError>();
                List<xbs.PeriodicTransfer> list = XBService.GetPeriodicTransfers(xbs.ProductQualityFilter.Opened).FindAll(m => m.DebitAccount.AccountNumber == order.PaymentOrder.DebitAccount.AccountNumber && m.CreditAccount==order.PaymentOrder.ReceiverAccount.AccountNumber);
                if (list != null && list.Count > 0)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Տվյալ դեբետ և կրեդիտ հաշվեհամարների համար արդեն առկա է «Գործող» կարգավիճակով պարբերական հանձնարարական Մ/ճ : " + list[0].FilialCode.ToString() + ", Պ/Փ N: " + list[0].Number.ToString() + ", Դեբետ հաշիվ: " + list[0].DebitAccount.AccountNumber ;
                    result.ResultCode = xbs.ResultCode.Warning;
                    result.Errors.Add(error);
                }
                
                if (result.Errors.Count > 0)
                {
                    return Json(result);
                }
                
            }
            result = XBService.SavePeriodicPaymentOrder(order);
            return Json(result);
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.PeriodicBudgetTransferOrderSave)]
        public ActionResult SavePeriodicBudgetPaymentOrder(xbs.PeriodicBudgetPaymentOrder order, bool confirm = false)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            order.Type = xbs.OrderType.PeriodicTransfer;
            order.BudgetPaymentOrder.Quality = xbs.OrderQuality.Draft;
            if (!confirm)
            {
                List<xbs.PeriodicTransfer> list = XBService.GetPeriodicTransfers(xbs.ProductQualityFilter.Opened).FindAll(m => m.DebitAccount.AccountNumber == order.BudgetPaymentOrder.DebitAccount.AccountNumber && m.CreditAccount == order.BudgetPaymentOrder.ReceiverAccount.AccountNumber);
                if (list != null && list.Count > 0)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Տվյալ դեբետ և կրեդիտ հաշվեհամարների համար արդեն առկա է «Գործող» կարգավիճակով պարբերական հանձնարարական Մ/ճ : " + list[0].FilialCode.ToString() + ", Պ/Փ N: " + list[0].Number.ToString() + ", Դեբետ հաշիվ: " + list[0].DebitAccount.AccountNumber ;
                    result.ResultCode = xbs.ResultCode.Warning;
                    result.Errors = new List<xbs.ActionError>();
                    result.Errors.Add(error);
                    return Json(result);
                }

            }
            result = XBService.SavePeriodicBudgetPaymentOrder(order);
            return Json(result);
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.PeriodicUtilityOrderSave)]
        public ActionResult SavePeriodicUtilityPaymentOrder(xbs.PeriodicUtilityPaymentOrder order, bool confirm = false)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            order.Type = xbs.OrderType.PeriodicTransfer;
            order.Quality = xbs.OrderQuality.Draft;
            order.UtilityPaymentOrder.Quality = xbs.OrderQuality.Draft;
            order.UtilityPaymentOrder.Type = xbs.OrderType.PeriodicTransfer;
            order.UtilityPaymentOrder.Currency = "AMD";
            //if (order.ServicePaymentType == -1)
            //{
            //    order.ServicePaymentType = 0;
            //}
            order.Currency = "AMD";
            if (!confirm)
            {
                List<xbs.PeriodicTransfer> list = XBService.GetPeriodicTransfers(xbs.ProductQualityFilter.Opened).FindAll(m => m.DebitAccount.AccountNumber == order.UtilityPaymentOrder.DebitAccount.AccountNumber);
                if (list != null && list.Count > 0)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Տվյալ դեբետ հաշվեհամարի համար արդեն առկա է «Գործող» կարգավիճակով պարբերական հանձնարարական Մ/ճ : " + list[0].FilialCode.ToString() + ", Պ/Փ N: " + list[0].Number.ToString() + ", Դեբետ հաշիվ: " + list[0].DebitAccount.AccountNumber ;
                    result.Errors = new List<xbs.ActionError>();
                    result.ResultCode = xbs.ResultCode.Warning;
                    result.Errors.Add(error);
                    return Json(result);
                }

            }
             result = XBService.SavePeriodicUtilityPaymentOrder(order);
            return Json(result);
        }

        public ActionResult PeriodiclyType()
        {
            return Json(InfoService.GetPeriodicityTypes(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult DebtType()
        {
            Dictionary<string, string> dictionary = new Dictionary<string, string>();
            dictionary.Add("0", "Պարտքի առկայության դեպքում");
            dictionary.Add("1", "Անկախ պարտքի առկայությունից");
            return Json(dictionary, JsonRequestBehavior.AllowGet);
        }

        public ActionResult PersonalPeriodicOrder()
        {
            return PartialView("PersonalPeriodicOrder");
        }

        public ActionResult PeriodicUtilityPaymentOrderDetails()
        {
            return PartialView("PeriodicUtilityPaymentOrderDetails");
        }


        public ActionResult PersonalPeriodicSwiftStatementOrder()
        {
            return PartialView("PersonalPeriodicSwiftStatementOrder");
        }

        public ActionResult PeriodicPersonalPaymentOrderDetails()
        {
            return PartialView("PeriodicPersonalPaymentOrderDetails");
        }

        public ActionResult ChoosePeriodicOrderType()
        {
            return PartialView("ChoosePeriodicOrderType");
        }

        public ActionResult CommunalSearch()
        {
            return PartialView("CommunalSearch");
        }

        public JsonResult GetPeriodicBudgetPaymentOrder(int orderId)
        {
            return Json(XBService.GetPeriodicBudgetPaymentOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPeriodicUtilityPaymentOrder(int orderId)
        {

            return Json(XBService.GetPeriodicUtilityPaymentOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPeriodicPaymentOrder(int orderId,int subType)
        {
            if (subType == 3 || subType==1)
            {
                return Json(XBService.GetPeriodicPaymentOrder(orderId), JsonRequestBehavior.AllowGet);
            }
            else if (subType == 4)
            {
                return Json(XBService.GetPeriodicBudgetPaymentOrder(orderId), JsonRequestBehavior.AllowGet);
            }
            else if (subType == 5)
            {
                return Json(XBService.GetPeriodicSwiftStatementOrder(orderId), JsonRequestBehavior.AllowGet);
            }
            else
                return Json("", JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetRAFoundAccount()
        {
            return Json(XBService.GetRAFoundAccount());
        }

        [TransactionPermissionFilter]
        [SMSAuthorizationFilter]
        [ActionAccessFilter(actionType = ActionType.PeriodicBudgetTransferOrderSave)]
        public ActionResult SavePeriodicSwiftStatementOrder(xbs.PeriodicSwiftStatementOrder order, bool confirm = false)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            order.Type = xbs.OrderType.PeriodicTransfer;
            if (!confirm)
            {
                List<xbs.PeriodicTransfer> list = XBService.GetPeriodicTransfers(xbs.ProductQualityFilter.Opened).FindAll(m => m.DebitAccount.AccountNumber == order.StatementAccount.AccountNumber);
                if (list != null && list.Count > 0)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Տվյալ հաշվեհամարի համար արդեն առկա է «Գործող» կարգավիճակով պարբերական հանձնարարական Մ/ճ : " + list[0].FilialCode.ToString() + ", Պ/Փ N: " + list[0].Number.ToString() + ", Դեբետ հաշիվ: " + list[0].DebitAccount.AccountNumber ;
                    result.ResultCode = xbs.ResultCode.Warning;
                    result.Errors = new List<xbs.ActionError>();
                    result.Errors.Add(error);
                    return Json(result);
                }

            }
            result = XBService.SavePeriodicSwiftStatementOrder(order);
            return Json(result);
        }



        public JsonResult GetPeriodicSwiftStatementOrderFee()
        {
            return Json(XBService.GetPeriodicSwiftStatementOrderFee());
        }

        public ActionResult SWIFTCodeInfoDetails()
        {
            return PartialView("SWIFTCodeInfoDetails");
        }



    }
}