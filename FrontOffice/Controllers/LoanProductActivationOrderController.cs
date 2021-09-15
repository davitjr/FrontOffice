using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class LoanProductActivationOrderController : Controller
    {

        [TransactionPermissionFilter]
        //[ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveLoanProductActivationOrder(xbs.LoanProductActivationOrder order,bool confirm=false)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            if (!confirm)
            {
                CustomerViewModel customer = new CustomerViewModel();
                customer.Get(XBService.GetAuthorizedCustomerNumber());
                if (customer.CustomerType==6 && customer.SocCardNumber=="" && customer.Residence==1)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Հաճախորդի հանրային ծառայությունների համարանիշը մուտքագրված չէ:";
                    result.Errors = new List<xbs.ActionError>();
                    result.Errors.Add(error);
                    result.ResultCode = xbs.ResultCode.Warning;
                    return Json(result);
                }
                else if (customer.CustomerType != 6 && customer.CustomerType != 2)
                {
                    xbs.ActionError error = new xbs.ActionError();
                    error.Code = 599;
                    error.Description = "Անհրաժեշտ է ստուգել թե արդյոք ՀՀ ԱՆ պետ. ռեգիստրից ստացված տեղեկանքի վճարը գանձված է:";
                    result.Errors = new List<xbs.ActionError>();
                    result.Errors.Add(error);
                    result.ResultCode = xbs.ResultCode.Warning;
                    return Json(result);
                }

            }
            
            
            result = XBService.SaveLoanProductActivationOrder(order);

            return Json(result);
        }

        public ActionResult PersonalLoanProductActivationOrder()
        {
            return PartialView("PersonalLoanProductActivationOrder");
        }

        public ActionResult LoanProductActivationOrderDetails()
        {
            return PartialView("LoanProductActivationOrderDetails");
        }

        public JsonResult GetLoanProductActivationOrder(long orderId)
        {
            return Json(XBService.GetLoanProductActivationOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public double GetServiceFee(ulong productId,short withTax)
        {
            double serviceFee = 0;
            serviceFee = XBService.GetLoanProductActivationFee(productId,withTax);

            return serviceFee;

        }

        public void GetConsumeLoanContract(ulong productId, string confirmationPerson)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "appID", value: productId.ToString());
            parameters.Add(key: "HbDocID", value: "0");
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);
            ContractService.ConsumeLoanContract(parameters);

        }

        public void GetDepositLoanGrafik(ulong productId, string confirmationPerson)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "appID", value: productId.ToString());
            parameters.Add(key: "prolongID",value: "0");
            parameters.Add(key: "HbDocID", value: "0");
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);
            ContractService.DepositLoanGrafik(parameters);

        }
        

        public void GetDepositLoanProvisionDetails(ulong productId,int fillialCode, string confirmationPerson)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            xbs.Provision provision = XBService.GetProductProvisions(productId)[0];
            parameters.Add(key: "IDContract", value: provision.ContractId.ToString());
            parameters.Add(key: "provisionNumber", value: provision.ProvisionNumber);
            parameters.Add(key: "contractType", value: "7");
            parameters.Add(key: "HbDocID", value: "0");
            parameters.Add(key: "assign", value: fillialCode==22000?"4":"6");
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);
            ContractService.DepositLoanProvision(parameters);

        }

        public void GetLoanTerms(ulong productId)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "appID", value: productId.ToString());
            ContractService.LoanTerms(parameters);

        }

        public void GetDepositCardCreditLineContract(ulong productId, int cardType, string confirmationPerson)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "appID", value: productId.ToString());
            parameters.Add(key: "bln_with_enddate", value: "True");
            parameters.Add(key: "HbDocID", value: "0");
            parameters.Add(key: "confirmationPerson", value: confirmationPerson);

            if (cardType == 23 || cardType == 34 || cardType == 40 || cardType == 50 || cardType == 20 || cardType == 41)
            {                
                ContractService.CreditLineContractAmex(parameters);
            }
            else
            {
                ContractService.CreditLineContract(parameters);
            }

        }

        public void GetCreditLineTerms(ulong productId)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "appID", value: productId.ToString());
            ContractService.CreditLineTerms(parameters);

        }

        public JsonResult GetLoanProductActivationWarnings(long productId,short productType)
        {
            return Json(XBService.GetLoanProductActivationWarnings(productId,productType),JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLoanTotalInsuranceAmount(ulong productId)
        {
            return Json(XBService.GetLoanTotalInsuranceAmount(productId), JsonRequestBehavior.AllowGet);
        }

        public bool IsCreditLineActivateOnApiGate(long orderId)
        {
            return XBService.IsCreditLineActivateOnApiGate(orderId);
        }
    }
}