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
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class PhoneBankingContractOrderController : Controller
    {
        public ActionResult SavePhoneBankingContractOrder(xbsManagement.PhoneBankingContractOrder order)
        {
            order.Quality = XBManagement.OrderQuality.Draft;
           
            XBManagement.ActionResult result = XBManagementService.SavePhoneBankingContractOrder(order);
            return Json(result);
        }

        public JsonResult GetPhoneBankingContractOrder(long orderId)
        {
            return Json(XBManagementService.GetPhoneBankingContractOrder(orderId), JsonRequestBehavior.AllowGet);
        }

      
    }
}