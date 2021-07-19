using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using FrontOffice.ACBAServiceReference;
using System.Web.SessionState;
namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class OrdersController : Controller
    {
        //
        // GET: /Orders/
        public ActionResult Index()
        {
            return PartialView("Orders");
        }

        public JsonResult GetOrders(xbs.SearchOrders searchParams)
        {
            return Json(XBService.GetOrders(searchParams), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetNotConfirmedOrders()
        {
            return Json(XBService.GetNotConfirmedOrders(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOrderTypes()
        {
            return Json(InfoService.GetOrderTypes(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetOrderQualityTypes()
        {

            Dictionary<string, string> qualityTypes = InfoService.GetOrderQualityTypes();
            qualityTypes.Remove("1");
            qualityTypes.Remove("4");
            qualityTypes.Remove("6");
            qualityTypes.Remove("40");
            qualityTypes.Remove("55");
            qualityTypes.Remove("56");
            qualityTypes.Remove("100");
            return Json(qualityTypes, JsonRequestBehavior.AllowGet);
        }
        public ActionResult OrderHistory()
        {
            return PartialView("OrderHistory");
        }

        public JsonResult GetOrderHistory(long orderID)
        {
            return Json(XBService.GetOrderHistory(orderID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GenerateNewOrderNumber(xbs.OrderNumberTypes orderNumberType)
        {
            return Json(XBService.GenerateNewOrderNumber(orderNumberType), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOrderOPPersons(string accountNumber, xbs.OrderType orderType)
        {
            return Json(XBService.GetOrderOPPersons(accountNumber, orderType));
        }

        public ActionResult NonCashOPPerson()
        {
            return PartialView("NonCashOPPerson");
        }

        public ActionResult CashOPPerson()
        {
            return PartialView("CashOPPerson");
        }


        public JsonResult GetOrderRejectHistory(long orderID)
        {
            return Json(XBService.GetOrderRejectHistory(orderID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOrderAttachments(long orderID)
        {
            return Json(XBService.GetOrderAttachments(orderID), JsonRequestBehavior.AllowGet);
        }

        public void GetOrderAttachment(string id)
        {
            xbs.OrderAttachment attachment = XBService.GetOrderAttachment(id);
            ExportFormat exportFormat = ReportService.GetExportFormatEnumeration(attachment.FileExtension);
            ReportService.ShowDocument(attachment.Attachment, exportFormat, "OrderAttachment");
        }


        public ActionResult AttachmentDocuments()
        {
            return PartialView("OrderAttachments");
        }

        public JsonResult SetOrderPerson(ulong customerNumber = 0)
        {
            if (customerNumber == 0)
            {
                customerNumber = XBService.GetAuthorizedCustomerNumber();

            }
            if (ACBAOperationService.GetCustomerType(customerNumber) != 6)
            {
                customerNumber = ACBAOperationService.GetLinkedCustomerNumber(customerNumber);
            }

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            xbs.OPPerson person = new xbs.OPPerson();
            person.CustomerNumber = customer.CustomerNumber;
            person.PersonName = customer.FirstName;
            person.PersonLastName = customer.LastName;
            person.PersonDocument = Utility.ConvertAnsiToUnicode(customer.DocumentNumber + "," + customer.DocumentGivenBy + "," + customer.DocumentGivenDate);
            person.PersonSocialNumber = customer.SocCardNumber;
            person.PersonNoSocialNumber = customer.NoSocCardNumber;
            person.PersonAddress = customer.RegistrationAddress;
            if (customer.PhoneList != null)
            {
                CustomerPhone phone = new CustomerPhone();
                if (customer.PhoneList.Exists(ph => ph.phoneType.key == 1))
                {
                    phone = customer.PhoneList.Find(ph => ph.phoneType.key == 1);
                    if (phone != null)
                    {
                        person.PersonPhone = phone.phone.countryCode + phone.phone.areaCode + phone.phone.phoneNumber;
                    }

                }
                else
                {
                    phone = customer.PhoneList.Find(ph => ph.phoneType.key == 2);
                    if (phone != null)
                    {
                        person.PersonPhone = phone.phone.countryCode + phone.phone.areaCode + phone.phone.phoneNumber;
                    }

                }

            }
            if (customer.EmailList != null)
            {

                for (int i = 0; i < customer.EmailList.Count; i++)
                {
                    if ((person.PersonEmail + customer.EmailList[i]).Length < 50)
                    {
                        person.PersonEmail += customer.EmailList[i];
                        if (i < customer.EmailList.Count - 1)
                        {
                            person.PersonEmail += ",";
                        }
                    }
                }
            }


            person.PersonBirth = customer.BirthDate;
            person.PersonResidence = (short)customer.Residence;
            return Json(person, JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilterAttribute]
        public ActionResult ConfirmOrder(long orderID)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            result = XBService.ConfirmOrder(orderID);
            return Json(result);
        }

        public JsonResult GetOrderServiceFee(xbs.OrderType type, int urgent = 0)
        {
            return Json(XBService.GetOrderServiceFee(type, urgent), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCurrentOperDay()
        {
            return Json(XBService.GetCurrentOperDay(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GenerateNextOrderNumber(ulong customerNumber)
        {
            return Json(XBService.GenerateNextOrderNumber(customerNumber), JsonRequestBehavior.AllowGet);
        }

        public ActionResult OrderDetails()
        {
            return PartialView("OrderDetails");
        }

        public JsonResult GetOrder(long orderID)
        {
            return Json(XBService.GetOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public ActionResult NotificationPanel()
        {
            return PartialView("NotificationPanel");
        }

        public JsonResult GetRejectedMessages(int filter)
        {
            return Json(XBService.GetRejectedMessages(filter), JsonRequestBehavior.AllowGet);
        }

        public void CloseRejectedMessage(int messageId)
        {
            XBService.CloseRejectedMessage(messageId);
        }
        public JsonResult GetNotConfirmedOrdersWithScroll(int filter, int scrollState, int count)
        {
            int start = scrollState * count;
            int end = scrollState * count + count;
            return Json(XBService.GetNotConfirmedOrders(start, end), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GeUserRejectedMessagesWithScroll(int filter, int scrollState, int count)
        {
            int start = scrollState * count;
            int end = scrollState * count + count;
            return Json(XBService.GetRejectedMessages(filter, start, end), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SetTotalUserMessages()
        {
            int notConfirmedOrdersCount = XBService.GetTotalNotConfirmedOrder();
            int rejectedUserMessagesCount = XBService.GetTotalRejectedUserMessages();

            return Json(notConfirmedOrdersCount + rejectedUserMessagesCount, JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetCTPaymentOrder(int orderID)
        {
            return Json(XBService.GetCTPaymentOrder(orderID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCTLoanMatureOrder(int orderID)
        {
            return Json(XBService.GetCTLoanMatureOrder(orderID), JsonRequestBehavior.AllowGet);
        }


        public ActionResult CTOrderDetails()
        {
            return PartialView("CTOrderDetails");
        }


        public static DateTime GetOrderConfirmationDate(long orderId)
        {
            List<xbs.OrderHistory> ordersHistory = XBService.GetOrderHistory(orderId);

            DateTime confirmationDate;

            if (ordersHistory.Exists(m => m.Quality == xbs.OrderQuality.Completed))
            {
                confirmationDate = ordersHistory.Find(m => m.Quality == xbs.OrderQuality.Completed).ChangeDate;
            }
            else
            {
                confirmationDate = ordersHistory.Find(m => m.Quality == xbs.OrderQuality.Sent3).ChangeDate;
            }

            return confirmationDate;
        }

        public ActionResult OrderOPPersonDetails()
        {
            return PartialView("OrderOPPersonDetails");
        }

        /// <summary>
        /// ՀԲ-ի 1 տեսակի փոխանցման ԴԱՀԿ արգելադրման նպատակի պահպանում
        /// </summary>
        public void PostDAHKPaymentType(long orderId, int paymentType)
        {
            XBS.User user = (XBS.User)Session["HB_User"];

            int setNumber = user.userID;

            XBService.PostDAHKPaymentType(orderId, paymentType, setNumber);
        }
    }
}