using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using xbs = FrontOffice.XBS;
using FrontOffice.Service;
using FrontOffice.Models;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class PlasticCardOrderController : Controller
    {
        public ActionResult PlasticCardOrder()
        {
            return PartialView("PlasticCardOrder");
        }

        public ActionResult LinkedCardOrder()
        {
            return PartialView("LinkedPlasticCardOrder");
        }

        public ActionResult SavePlasticCardOrder(xbs.PlasticCardOrder cardOrder)
        {
            cardOrder.RegistrationDate = DateTime.Now;
            xbs.ActionResult result = XBService.SavePlasticCardOrder(cardOrder);
            return Json(result);
        }

        public ActionResult PlasticCardOrderCustomer()
        {
            return PartialView("PlasticCardOrderCustomer");
        }

        public ActionResult PlasticCardOrderDetails()
        {
            return PartialView("PlasticCardOrderDetails");
        }

        public JsonResult GetPlasticCardOrder(long orderID)
        {            
            return Json(XBService.GetPlasticCardOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public string GetCustomerLastMotherName(ulong customerNumber)
        {
            string lastMotherName = "";

            InfoService.Use(client =>
            {
                lastMotherName = client.GetCustomerLastMotherName(customerNumber);

            });

            return lastMotherName;
        }

        public JsonResult GetMainCards()
        {
            return Json( XBService.GetCustomerMainCards(), JsonRequestBehavior.AllowGet);
        }


        public string GetCustomerAddressEng(ulong customerNumber)
        {
            return InfoService.GetCustomerAddressEng(customerNumber);
        }

        [ActionAccessFilter(actionType = ActionType.PlasticCardOrdersReport)]
        public JsonResult GetPlasticCardOrdersReport(xbs.SearchOrders searchParams)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            currentUser.AdvancedOptions.TryGetValue("accessToSeeAllPlasticCardOrders", out string accessToSeeAllPlasticCardOrders);

            parameters.Add(key: "startDate", value: (searchParams.DateFrom == null) ? null : String.Format("{0:dd/MMM/yy}", searchParams.DateFrom));
            parameters.Add(key: "endDate", value: (searchParams.DateTo == null) ? null : String.Format("{0:dd/MMM/yy}", searchParams.DateTo));
            parameters.Add(key: "id", value: searchParams.Id.ToString());
            parameters.Add(key: "quality", value: ((short)searchParams.OrderQuality).ToString());
            parameters.Add(key: "setNumber", value: searchParams.RegisteredUserID.ToString());
            parameters.Add(key: "customerNumber", value: searchParams.CustomerNumber.ToString());
            parameters.Add(key: "cardNumber", value: searchParams.CardNumber);
            parameters.Add(key: "operationFilialCode", value: (accessToSeeAllPlasticCardOrders == "1") ? null : currentUser.filialCode.ToString());
            parameters.Add(key: "documentType", value: ((short)searchParams.Type).ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerMainCardsForAttachedCardOrder()
        {
            return Json(XBService.GetCustomerMainCardsForAttachedCardOrder(), JsonRequestBehavior.AllowGet);
        }
    }
}