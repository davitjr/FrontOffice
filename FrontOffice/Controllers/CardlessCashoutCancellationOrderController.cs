using FrontOffice.Service;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class CardlessCashoutCancellationOrderController : Controller
    {
        public ActionResult CardlessCashoutCancellationOrder()
        {
            return PartialView("CardlessCashoutCancellationOrderDetails");
        }

        public JsonResult GetCardlessCashoutOrder(uint orderId) => Json(XBService.GetCardlessCashoutOrder(orderId), JsonRequestBehavior.AllowGet);


        public ActionResult SaveAndApproveCardlessCashoutCancellationOrder(xbs.CardlessCashoutCancellationOrder order)
        {
            xbs.ActionResult result = XBService.SaveAndApproveCardlessCashoutCancellationOrder(order);
            return Json(result);            
        }

        public JsonResult GetCardlessCashoutCancellationOrderReport(xbs.SearchOrders searchParams)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "StartDate", value: (searchParams.DateFrom == null) ? null : String.Format("{0:dd/MMM/yy}", searchParams.DateFrom));
            parameters.Add(key: "EndDate", value: (searchParams.DateTo == null) ? null : String.Format("{0:dd/MMM/yy}", searchParams.DateTo));
            parameters.Add(key: "DocId", value: searchParams.Id.ToString());
            parameters.Add(key: "EmployeeNumber", value: searchParams.RegisteredUserID.ToString());
            parameters.Add(key: "CustomerNumber", value: searchParams.CustomerNumber.ToString());
            parameters.Add(key: "Amount", value: searchParams.Amount.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

    }
}