using FrontOffice.Service;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class RenewedCardAccountRegOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult RenewedCardAccountRegOrder()
        {
            return PartialView("RenewedCardAccountRegOrder");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult RenewedCardAccountRegOrderDetails()
        {
            return PartialView("RenewedCardAccountRegOrderDetails");
        }

        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult SaveRenewedCardAccountRegOrder(xbs.RenewedCardAccountRegOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveRenewedCardAccountRegOrder(order);
            return Json(result);
        }

        public JsonResult GetRenewedCardAccountRegOrder(long orderId)
        {
            return Json(XBService.GetRenewedCardAccountRegOrder(orderId), JsonRequestBehavior.AllowGet);
        }
    }
}
