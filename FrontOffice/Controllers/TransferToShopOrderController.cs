using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using FrontOffice.Models;
using System.Web.SessionState;


namespace FrontOffice.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [SessionExpireFilter]
    public class TransferToShopOrderController : Controller
    {

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        //[ActionAccessFilter(actionType = ActionType.TransferToShopOrderSave)]
        public ActionResult SaveTransferToShopOrder(xbs.TransferToShopOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveTransferToShopOrder(order);
            return Json(result);
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult PersonalTransferToShopOrder()
        {
            return PartialView("PersonalTransferToShopOrder");
        }

        public JsonResult GetShopAccount(ulong productId)
        {

            return Json(XBService.GetShopAccount(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetShopTransferAmount(ulong productId)
        {

            return Json(XBService.GetShopTransferAmount(productId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransferToShopOrder(int orderID)
        {
            return Json(XBService.GetTransferToShopOrder(orderID), JsonRequestBehavior.AllowGet);
        }
        public ActionResult PersonalTransferToShopOrderDetails()
        {
            return PartialView("PersonalTransferToShopOrderDetails");
        }

    }
}