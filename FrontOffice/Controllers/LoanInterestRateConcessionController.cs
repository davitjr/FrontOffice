using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using xbs = FrontOffice.XBS;
using FrontOffice.Service;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class LoanInterestRateConcessionController : Controller
    {
        // GET: LoanInterestRateConcession
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult LoanInterestRateConcession()
        {
            return PartialView("LoanInterestRateConcession");
        }
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveLoanInterestRateConcession(xbs.LoanInterestRateConcessionOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveLoanInterestRateConcessionOrder(order);
            return Json(result);
        }
        public ActionResult LoanInterestRateConcessionDetails()
        {
            return PartialView("LoanInterestRateConcessionDetails");
        }
        public JsonResult GetLoanInterestRateConcessionOrder(int orderID)
        {
            return Json(XBService.GetLoanInterestRateConcessionOrder(orderID), JsonRequestBehavior.AllowGet);
        }
    }
}