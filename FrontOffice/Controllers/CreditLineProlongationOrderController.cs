using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CreditLineProlongationOrderController : Controller
    {

        //public ActionResult SaveCreditLineProlongationOrder(xbs.CreditLineProlongationOrder order)
        //{
        //    xbs.ActionResult result = new xbs.ActionResult();

        //    result = XBService.SaveCreditLineProlongationOrder(order);

        //    return Json(result);
        //}

        public ActionResult CreditLineProlongationOrderDetails()
        {
            return PartialView("CreditLineProlongationOrderDetails");
        }



        public JsonResult SaveCreditLineProlongationOrder(ulong productId)
        {
            xbs.CreditLineProlongationOrder order = new xbs.CreditLineProlongationOrder();
            order.ProductAppID = productId;
            order.Type = xbs.OrderType.CreditLineProlongationOrder;
            order.SubType= 1;
            order.RegistrationDate = DateTime.Now.Date;
            order.Quality=xbs.OrderQuality.Draft;
            return Json(XBService.SaveCreditLineProlongationOrder(order), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCreditLineProlongationOrder(int id)
        {
            return Json(XBService.GetCreditLineProlongationOrder(id),JsonRequestBehavior.AllowGet);
        }

        public bool IsCreditLineActivateOnApiGate(long orderId)
        {
            return XBService.IsCreditLineActivateOnApiGate(orderId);
        }

    }
}