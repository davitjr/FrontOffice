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
    public class CardDataChangeOrderController : Controller
    {

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveCardDataChangeOrder(xbs.CardDataChangeOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveCardServiceFeeDataChangeOrder(order);
            return Json(result);

        }

        public JsonResult GetCardDataChangeOrder(int orderID)
        {

            return Json(XBService.GetCardDataChangeOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PersonalCardDataChangeOrder()
        {
            return PartialView("PersonalCardDataChangeOrder");
        }

        public JsonResult CheckCardDataChangeOrderFieldTypeIsRequaried(short fieldType)
        {
            return Json(XBService.CheckCardDataChangeOrderFieldTypeIsRequaried(fieldType), JsonRequestBehavior.AllowGet);
        }

        public ActionResult PersonalCardDataChangeOrderDetails()
        {
            return PartialView("PersonalCardDataChangeOrderDetails");
        }


        public ActionResult RelatedOfficeNumberChangeHistory()
        {
            return PartialView("RelatedOfficeNumberChangeHistory");
        }

        public ActionResult GetRelatedOfficeNumberChangeHistory(long ProductAppId, short FieldType)
        {
            return Json(XBService.GetRelatedOfficeNumberChangeHistory(ProductAppId, FieldType), JsonRequestBehavior.AllowGet);
        }

    }
}