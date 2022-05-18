using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using FrontOffice.ACBAServiceReference;
using FrontOffice.Models;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class SafekeepingItemController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache")]
        public ActionResult SafekeepingItems()
        {
            return PartialView("SafekeepingItems");
        }

        public JsonResult GetSafekeepingItems(int filter)
        {
            return Json(XBService.GetSafekeepingItems((xbs.ProductQualityFilter)filter), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSafekeepingItem(ulong productId)
        {
            return Json(XBService.GetSafekeepingItem(productId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult SafekeepingItemDetails()
        {
            return PartialView("SafekeepingItemDetails");
        }

        public string GetSafekeepingItemDescription(string setPerson)
        {
            string description = string.Empty;
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            description = customer.FirstName + " " + customer.LastName + ", " + customer.DocumentNumber + ", " + customerNumber.ToString();

            return description;

        }
    }
}