using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CardServiceFeeGrafikDataChangeOrderController : Controller
    {
       
        public ActionResult PersonalCardServiceFeeGrafikDataChangeOrderDetails()
        {
            return PartialView("PersonalCardServiceFeeGrafikDataChangeOrderDetails");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveCardServiceFeeGrafikDataChangeOrder(xbs.CardServiceFeeGrafikDataChangeOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveCardServiceFeeGrafikDataChangeOrder(order);
            return Json(result);

        }

        public JsonResult GetCardServiceFeeGrafikDataChangeOrder(int orderID)
        {

            return Json(XBService.GetCardServiceFeeGrafikDataChangeOrder(orderID), JsonRequestBehavior.AllowGet);
        }
    }
}