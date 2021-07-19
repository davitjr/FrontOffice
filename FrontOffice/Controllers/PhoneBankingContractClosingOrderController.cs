using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbsManagement = FrontOffice.XBManagement;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    public class PhoneBankingContractClosingOrderController : Controller
    {
        // GET: PhoneBankingContractClosingOrder
        public ActionResult SavePhoneBankingContractClosingOrder(xbsManagement.PhoneBankingContractClosingOrder order)
        {
            order.Quality = XBManagement.OrderQuality.Draft;
            XBManagement.ActionResult result = XBManagementService.SavePhoneBankingContractClosingOrder(order);
            return Json(result);
        }

        public ActionResult PhoneBankingContractClosingOrder()
        {
            return PartialView("PhoneBankingContractClosingOrder");
        }

        public ActionResult PhoneBankingContractClosingOrderDetails()
        {
            return PartialView("PhoneBankingContractClosingOrderDetails");
        }

        public JsonResult GetPhoneBankingContractClosingOrder(long orderId)
        {
            return Json(XBManagementService.GetPhoneBankingContractClosingOrder(orderId), JsonRequestBehavior.AllowGet);
        }
    }
}