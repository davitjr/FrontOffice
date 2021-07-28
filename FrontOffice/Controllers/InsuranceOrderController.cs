using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class InsuranceOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        public ActionResult PersonalInsuranceOrder()
        {
            return PartialView("PersonalInsuranceOrder");
        }



        [TransactionPermissionFilter]
        //[ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveInsuranceOrder(xbs.InsuranceOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            order.RegistrationDate = DateTime.Now.Date;
            xbs.ActionResult result = new xbs.ActionResult();
            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)Session[guid + "_User"];

            if (order.Insurance.InsuranceContractType == 2)
            {
                order.Insurance.InvolvingSetNumber = user.userID;
            }

            result = XBService.SaveInsuranceOrder(order);
            return Json(result);
        }


        public JsonResult GetInsuranceOrder(long orderId)
        {
            return Json(XBService.GetInsuranceOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public ActionResult InsuranceOrderDetails()
        {
            return PartialView("InsuranceOrderDetails");
        }


        public JsonResult GetPaymentOrderDetails(xbs.InsuranceOrder order, bool isCopy = false)
        {
            ulong customerNumber = 0;

            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);


            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "reg_date", value: order.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "document_number", value: order.OrderNumber);

            if (!isCopy && order.Type == xbs.OrderType.CashInsuranceOrder)
            {
                xbs.Account debitAccount = XBService.GetOperationSystemAccount(order, xbs.OrderAccountType.DebitAccount, order.DebitAccount.Currency);
                order.DebitAccount = debitAccount;
            }


            order.ReceiverAccount = XBService.GetInsuraceCompanySystemAccount(order.Insurance.Company, order.Insurance.InsuranceType);

            string customerName = "";

            if (order.OPPerson != null) 
                customerName = order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName;
            else if (String.IsNullOrEmpty(customer.OrganisationName))
                customerName = customer.FirstName + " " + customer.LastName;
            else
                customerName = customer.OrganisationName;
            
            string receiver = order.ReceiverAccount.AccountDescription;


            parameters.Add(key: "deb_acc", value: order.DebitAccount.AccountNumber.Substring(5));
            parameters.Add(key: "deb_bank", value: order.DebitAccount.AccountNumber.Substring(0, 5));


            parameters.Add(key: "tax_code", value: customer.TaxCode);
            parameters.Add(key: "cred_acc", value: order.ReceiverAccount.AccountNumber.Substring(5));

            parameters.Add(key: "quality", value: "1");
            parameters.Add(key: "soc_card", value: customer.SocCardNumber);
            parameters.Add(key: "credit_bank", value: order.ReceiverAccount.AccountNumber.Substring(0, 5));
            parameters.Add(key: "amount", value: order.Amount.ToString());
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "descr", value: order.Description);
            parameters.Add(key: "reciever", value: receiver);
            parameters.Add(key: "confirm_date", value: null);
            parameters.Add(key: "police_code", value: "0");
            parameters.Add(key: "for_HB", value: "0");
            parameters.Add(key: "print_soc_card", value:  "True" );
            parameters.Add(key: "reg_code", value: null);
            parameters.Add(key: "doc_id", value: null);
            parameters.Add(key: "cust_name", value: customerName);
            parameters.Add(key: "is_copy", value: isCopy ? "True" : "False");
            parameters.Add(key: "reciever_tax_code", value: "");

            return Json(parameters, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetCashInPaymentOrderDetails(xbs.InsuranceOrder order, bool isCopy = false)
        {
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            order.ReceiverAccount = XBService.GetInsuraceCompanySystemAccount(order.Insurance.Company, order.Insurance.InsuranceType);


            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "amount", value: order.Amount.ToString());
            parameters.Add(key: "currency", value: order.Currency);
            parameters.Add(key: "nom", value: order.OrderNumber);
            parameters.Add(key: "lname", value: order.OPPerson.PersonName + " " + order.OPPerson.PersonLastName);

            if (!string.IsNullOrEmpty(order.OPPerson.PersonSocialNumber))
            {
                parameters.Add(key: "soccard", value: order.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "True");
            }
            else
            {
                parameters.Add(key: "soccard", value: order.OPPerson.PersonSocialNumber);
                parameters.Add(key: "check", value: "False");
            }

            parameters.Add(key: "wd", value: order.Description);
            parameters.Add(key: "credit", value: order.ReceiverAccount.AccountNumber.ToString());
            parameters.Add(key: "reg_Date", value: order.OperationDate.Value.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "f_cashin", value: isCopy ? "True" : "False");

            return Json(parameters, JsonRequestBehavior.AllowGet);


        }


        public JsonResult GetInsuranceCompanySystemAccountNumber(ushort companyID, ushort insuranceType)
        {
            return Json(XBService.GetInsuranceCompanySystemAccountNumber(companyID, insuranceType), JsonRequestBehavior.AllowGet);
        }



    }
}