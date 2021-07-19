using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class VirtualCardStatusChangeOrderController : Controller
    {

		[ActionAccessFilter(actionType = ActionType.VirtualCardStatusChangeOrder)]
		public ActionResult SaveVirtualCardStatusChangeOrder(xbs.VirtualCardStatusChangeOrder order)
		{
			order.Quality = xbs.OrderQuality.Draft;
			xbs.ActionResult result = XBService.SaveVirtualCardStatusChangeOrder(order);
			return Json(result);

		}
		public JsonResult GetVirtualCardStatusChangeOrder(int orderID)
		{
			return Json(XBService.GetVirtualCardStatusChangeOrder(orderID), JsonRequestBehavior.AllowGet);
		}

		public ActionResult PersonalVirtualCardStatusChangeOrder()
		{
			return PartialView("PersonalVirtualCardStatusChangeOrder");
		}

		public ActionResult ReSendVirtualCardRequest(int requestId)
		{
			xbs.ActionResult result = XBService.ReSendVirtualCardRequest(requestId);
			return Json(result);
		}
		
	}
}