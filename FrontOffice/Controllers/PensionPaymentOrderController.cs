using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;
using FrontOffice.ACBAServiceReference;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class PensionPaymentOrderController : Controller
    {
        [OutputCache(CacheProfile = "AppViewCache")]
        public ActionResult PensionPaymentOrder()
        {
            return PartialView("PensionPaymentOrder");
        }
        public ActionResult PensionPaymentOrderDetails()
        {
            return View();
        }

        public JsonResult GetAllPensionPayment()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            byte customerType = ACBAOperationService.GetCustomerType(customerNumber);

            if (customerType == (byte)xbs.CustomerTypes.physical)
            {
                var customerDocuments = ACBAOperationService.GetCustomerDocuments(customerNumber, 1);
                if (customerDocuments.Exists(m => m.documentType.key == 56))
                    return Json(XBService.GetAllPensionPayment(customerDocuments.FirstOrDefault(d => d.documentType.key == 56).documentNumber), JsonRequestBehavior.AllowGet);
                else
                {
                    if (customerDocuments.Exists(m => m.documentType.key == 57))
                        return Json(XBService.GetAllPensionPayment(Utility.ConvertAnsiToUnicode(customerDocuments.FirstOrDefault(d => d.documentType.key == 57).documentNumber)), JsonRequestBehavior.AllowGet);
                    else
                        return Json(new List<xbs.PensionPaymentOrder>(), JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json(new List<xbs.PensionPaymentOrder>(), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetPensionPaymentOrderDetails(uint orderId) => Json(XBService.GetPensionPaymentOrderDetails(orderId), JsonRequestBehavior.AllowGet);
        public JsonResult SavePensionPaymentOrder(xbs.PensionPaymentOrder order) => Json(XBService.SavePensionPaymentOrder(order), JsonRequestBehavior.AllowGet);
    }
}