using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using System.Net;
using System.IO;
using System.Text;
using acba = FrontOffice.ACBAServiceReference;
using System.Net.Http;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using Newtonsoft.Json;
using System.Web.SessionState;
using System.Web.UI;
using FrontOffice.ACBAServiceReference;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class LeasingCustomerController : Controller
    {
        // GET: Customer
        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult Index()
        {
            return View("CustomerNew");
        }


        // GET: /Customer/
        public JsonResult GetCustomer(ulong customerNumber = 0)
        {
            if (customerNumber == 0)
            {
                customerNumber = XBService.GetAuthorizedCustomerNumber();
            }

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);
            return Json(customer, JsonRequestBehavior.AllowGet);

        }

        public ActionResult ChangeCustomerNumber(ulong customerNumber)
        {

            if (customerNumber.ToString().Length != 12)
            {
                customerNumber = 0;
                return Json(customerNumber, JsonRequestBehavior.AllowGet);
            }

            CustomerViewModel customer=new CustomerViewModel();
            customer.Get(customerNumber);

            if (customer == null || customer.CustomerNumber.ToString().Length != 12 || customer.CustomerType == 0)
            {
                customerNumber = 0;
            }
            //else if (customer.Link == 2 || customer.Link == 3)
            //{
            //   customerNumber = 99;
            //}
            else
            {
                // Session["customerNumber"] = customerNumber;
            }

            return Json(customerNumber, JsonRequestBehavior.AllowGet);
        }

        public JsonResult HasACBAOnline()
        {
            return Json(XBService.HasACBAOnline(), JsonRequestBehavior.AllowGet);
        }

        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult HasACBAOnlineDirective()
        {
            return PartialView("HasACBAOnline");
        }
        public JsonResult GetCustomerDebts(ulong customerNumber=0)
        {          
            
            if (customerNumber == 0)
            {
                customerNumber = XBService.GetAuthorizedCustomerNumber();
            }
            List<xbs.CustomerDebts> debts = new List<xbs.CustomerDebts>();
            debts= XBService.GetCustomerDebts(customerNumber);

            List<xbs.CustomerDebts> provisionDebts = new List<xbs.CustomerDebts>();
            provisionDebts=debts.FindAll(m => m.DebtType == xbs.DebtTypes.Provision);
           
            debts.RemoveAll(m => m.DebtType == xbs.DebtTypes.Provision);

            for (int i = 0; i < provisionDebts.Count; i++)
            {
                double provisionAmount = 0;
                provisionAmount =provisionDebts.FindAll(m => m.Currency == provisionDebts[i].Currency).Sum(m=> Convert.ToDouble(m.Amount));
                xbs.CustomerDebts customerDebts = new xbs.CustomerDebts();
                customerDebts.Currency = provisionDebts[i].Currency;
                customerDebts.Amount = provisionAmount.ToString();
                customerDebts.DebtType = provisionDebts[i].DebtType;
                customerDebts.DebtDescription = provisionDebts[i].DebtDescription;
                customerDebts.AmountDescription = provisionDebts[i].AmountDescription;
                customerDebts.ObjectNumber = provisionDebts[i].ObjectNumber;
                customerDebts.AlowTransaction = provisionDebts[i].AlowTransaction;
                if (!debts.Exists(m => m.Currency == provisionDebts[i].Currency && m.DebtType == xbs.DebtTypes.Provision))
                {
                    debts.Add(customerDebts);
                }
            }
            return Json(debts, JsonRequestBehavior.AllowGet);

        }

        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult CustomerDebtsDirective()
        {
            return PartialView("CustomerDebts");
        }

        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult CustomerInfoDirective()
        {
            return PartialView("CustomerNew");
        }

        public ActionResult CustomerInfoDirectiveOld()
        {
            return PartialView("Customer");
        }

        public JsonResult GetCustomerDocumentWarnings(ulong customerNumber)
        {
            return Json(XBService.GetCustomerDocumentWarnings(customerNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetIdentityId(ulong customerNumber)
        {
            return Json(ACBAOperationService.GetIdentityId(customerNumber),JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerType(ulong customerNumber=0)
        {
            if (customerNumber == 0)
            {
                customerNumber = XBService.GetAuthorizedCustomerNumber();
            }
            if (customerNumber == 0)
            {
                return Json("-1", JsonRequestBehavior.AllowGet);
            }
            return Json(ACBAOperationService.GetCustomerType(customerNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerSyntheticStatus(ulong customerNumber = 0)
        {
            if (customerNumber == 0)
            {
                customerNumber = XBService.GetAuthorizedCustomerNumber();
            }
            return Json(XBService.GetCustomerSyntheticStatus(customerNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAttachmentDocumentList(ulong customerNumber, int docQuality)
        {
            var jsonResult = Json(ACBAOperationService.GetCustomerDocumentList(customerNumber,docQuality), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public void GetOneAttachmentDocument(ulong attachmentId, Int16 fileExtension)
        {
            byte[] attachment = ACBAOperationService.GetOneAttachment(attachmentId);

            if (fileExtension == 1)
            {
                ReportService.ShowDocument(attachment, ExportFormat.Image, "AttachmentImage");
            }
            else if (fileExtension == 2)
            {
                ReportService.ShowDocument(attachment, ExportFormat.PDF, "AttachmentPDF");
            }
        }

        public JsonResult GetAuthorizedCustomerNumber()
        {
            return Json(XBService.GetAuthorizedCustomerNumber(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult ServicePaymentOrder()
        {
            return PartialView("ServicePaymentOrder");
        }
        public ActionResult ServicePaymentDetails()
        {
            return PartialView("ServicePaymentDetails");
        }

        public JsonResult HasPhoneBanking()
        {
            return Json(XBService.HasPhoneBanking(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult CutomerVIewList()
        {
            return PartialView("CutomerVIewList");
        }

        public JsonResult GetSessionProperties()
        {
            string guid = Utility.GetSessionId();

            SessionProperties sessionProperties = ((SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"]);
            return Json(sessionProperties, JsonRequestBehavior.AllowGet);
        }

        [ActionAccessFilter(actionType = ActionType.HBApplicationOrderSave)]
        public ActionResult GetPendingRequests()
        {
            return PartialView("CustomerPendingRequests");
        }

        public JsonResult IsDAHKAvailability()
        {

            bool result = XBService.IsDAHKAvailability(XBService.GetAuthorizedCustomerNumber());
            return Json(result, JsonRequestBehavior.AllowGet);
           
        }

        public JsonResult SaveCustomerPhoto(xbs.OrderAttachment oneAttachment)
        {
            ACBAOperationService.SaveCustomerPhoto(oneAttachment.Attachment, oneAttachment.FileExtension, Convert.ToUInt64(oneAttachment.Id));
            return Json("OK", JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetCustomerPhoto(ulong customerNumber=0)
        {
            if (customerNumber == 0)
            {
                customerNumber = XBService.GetAuthorizedCustomerNumber();
            }
            var jsonResult = Json(ACBAOperationService.GetCustomerPhoto(customerNumber), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public ActionResult GetCustomerLinkedPersons()
        {
            return PartialView("CustomerLinkedPersons");
        }

        public JsonResult GetCustomerLinkedPersonsList(ulong customerNumber, int quality)
        {
            return Json(ACBAOperationService.GetCustomerLinkedPersonsList(customerNumber, quality), JsonRequestBehavior.AllowGet);
        }


        public JsonResult DeleteCustomerPhoto(ulong photoId)
        {
            ACBAOperationService.DeleteCustomerPhoto(photoId);
            return Json("OK", JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCustomerOnePhoto(ulong photoId)
        {
            var jsonResult = Json(ACBAOperationService.GetCustomerOnePhoto(photoId), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public JsonResult HasCardTariffContract()
        {
            return Json(XBService.HasCardTariffContract(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult HasPosTerminal()
        {
            return Json(XBService.HasPosTerminal(), JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetCustomerMainData(ulong customerNumber)
        {
            if (customerNumber == 0) return null;
            acba.CustomerMainData customer = ACBAOperationService.GetCustomerMainData(customerNumber);
                      
            List<CustomerEmail> list = new List<CustomerEmail>();
            list.Add(ACBAOperationService.GetCustomerMainEmail(customerNumber));
            customer.Emails = list;
            return Json(customer, JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult GetCustomerFilialCode()
        {
            return Json(ACBAOperationService.GetCustomerFilial(XBService.GetAuthorizedCustomerNumber()), JsonRequestBehavior.AllowGet);
        }

        public JsonResult IsCustomerConnectedToOurBank()
        {
            return Json(XBService.IsCustomerConnectedToOurBank(XBService.GetAuthorizedCustomerNumber()), JsonRequestBehavior.AllowGet);
        }

        [OutputCache(CacheProfile = "AppViewCache" )]
        public ActionResult CustomerDetails()
        {
            return PartialView("CustomerDetails");
        }
        public JsonResult GetCardTariffContractAttachment(ulong customerNumber, int docQuality)
        {
            var jsonResult = Json(ACBAOperationService.GetCardTariffContractAttachment(customerNumber, docQuality), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }


        public JsonResult HasCustomerBankruptBlockage()
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            return Json(ACBAOperationService.HasCustomerBankruptBlockage(customerNumber), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLeasingCustomerNumber(int leasingCustomerNumber)
        {
            return Json(XBService.GetLeasingCustomerNumber(leasingCustomerNumber), JsonRequestBehavior.AllowGet);
        }
    }
}
