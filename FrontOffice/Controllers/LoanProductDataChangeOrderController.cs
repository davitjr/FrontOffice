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
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class LoanProductDataChangeOrderController : Controller
    {
        [ActionAccessFilter(actionType = ActionType.LoanProductDataChangeOrderSave)]

        public JsonResult SaveLoanProductDataChangeOrder(xbs.LoanProductDataChangeOrder order)
        {
            order.Type = xbs.OrderType.LoanProductDataChangeOrder;
            order.SubType = 1;
            order.RegistrationDate = DateTime.Now.Date;
            order.Quality = xbs.OrderQuality.Draft;
            return Json(XBService.SaveLoanProductDataChangeOrder(order), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanProductDataChangeOrder(int orderID)
        {

            return Json(XBService.GetLoanProductDataChangeOrder(orderID), JsonRequestBehavior.AllowGet);
        }


        public ActionResult LoanProductDataChangeOrderDetails()
        {
            return PartialView("LoanProductDataChangeOrderDetails");
        }



        public JsonResult ExistsLoanProductDataChange(ulong  appId)
        {
            return Json(XBService.ExistsLoanProductDataChange(appId), JsonRequestBehavior.AllowGet);
        }

    }
}