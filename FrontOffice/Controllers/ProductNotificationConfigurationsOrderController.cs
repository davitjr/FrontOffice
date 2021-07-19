using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    public class ProductNotificationConfigurationsOrderController : Controller
    {
        // GET: ProductNotificationConfigurationOrder
        public ActionResult PersonalProductNotificationConfigurationsOrder()
        {
            return PartialView("PersonalProductNotificationConfigurationsOrder");
        }

        public ActionResult SaveProductNotificationConfigurationsOrder(xbs.ProductNotificationConfigurationsOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            result = XBService.SaveProductNotificationConfigurationsOrder(order);
            return Json(result);
        }

        public ActionResult ProductNotificationConfigurations()
        {
            return PartialView("ProductNotificationConfigurations");
        }

        public JsonResult GetProductNotificationConfigurations(ulong productid)
        {
            return Json(XBService.GetProductNotificationConfigurations(productid));
        }

        public void PrintProductNotificationContract(xbs.ProductNotificationConfigurations productNotificationConfiguration)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid + "_User"]).filialCode.ToString();

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "bankCode", value: filialCode);
            parameters.Add(key: "customerNumber", value: productNotificationConfiguration.CustomerNumber.ToString());
            parameters.Add(key: "notificationOptionType", value: productNotificationConfiguration.NotificationOption.ToString());
            parameters.Add(key: "notificationFrequencyType", value: productNotificationConfiguration.NotificationFrequency.ToString());
            parameters.Add(key: "loanFullNumber", value: productNotificationConfiguration.ProductId.ToString());
            parameters.Add(key: "email", value: productNotificationConfiguration.Emails);
            ContractService.ProductNotificationContract(parameters);
        }

        public ActionResult ProductNotificationConfigurationOrderDetails()
        {
            return PartialView("ProductNotificationConfigurationOrderDetails");
        }

        public JsonResult GetProductNotificationConfigurationOrder(int orderId)
        {
            return Json(XBService.GetProductNotificationConfigurationOrder(orderId), JsonRequestBehavior.AllowGet);
        }


    }

}