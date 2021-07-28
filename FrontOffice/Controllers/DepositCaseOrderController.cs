using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class DepositCaseOrderController : Controller
    {
        [TransactionPermissionFilterAttribute(OnlyFrontOffice = true)]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveDepositCaseOrder(xbs.DepositCaseOrder order)
        {
            order.Quality = xbs.OrderQuality.Draft;
            xbs.ActionResult result = XBService.SaveDepositCaseOrder(order);

            return Json(result);
        }

        public ActionResult PersonalDepositCaseOrder()
        {
            return PartialView("PersonalDepositCaseOrder");
        }

        public JsonResult GetDepositCaseContractEndDate(DateTime startDate,short dayCount)
        {
            DateTime endDate=new DateTime();
            if (dayCount == 1)
                endDate = startDate.AddDays(14);
            else
            {
                switch (dayCount)
                {
                    case 2:
                        endDate = startDate.AddMonths(1);
                        break;
                    case 3:
                        endDate = startDate.AddMonths(3);
                        break;
                    case 4:
                        endDate = startDate.AddMonths(6);
                        break;
                    case 5:
                        endDate = startDate.AddYears(1);
                        break;
                    default:
                        break;
                }

            }

            if (InfoService.IsWorkingDay(endDate))
                return Json(endDate, JsonRequestBehavior.AllowGet);
            else
            {

                do
                {
                  endDate = endDate.AddDays(-1);
                } while (!InfoService.IsWorkingDay(endDate));

                return Json(endDate, JsonRequestBehavior.AllowGet);
            }


           
        }

        public JsonResult GetDepositCaseOrderContractNumber()
        {
            return Json(XBService.GetDepositCaseOrderContractNumber(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDepositCaseMap(short caseSide)
        {
            return Json(XBService.GetDepositCaseMap(caseSide), JsonRequestBehavior.AllowGet);
        }

        public ActionResult DepositCaseMap()
        {
            return PartialView("DepositCaseMap");
        }

        public JsonResult GetDepositCasePrice(string caseNumber,short contractDuration)
        {
            return Json(XBService.GetDepositCasePrice(caseNumber, contractDuration), JsonRequestBehavior.AllowGet);
        }

        public ActionResult DepositCaseOrderDetails()
        {
            return PartialView("DepositCaseOrderDetails");
        }

        public JsonResult GetDepositCaseOrder(long orderId)
        {
            xbs.DepositCaseOrder order = XBService.GetDepositCaseOrder(orderId);
            if (order.DepositCase.JointCustomers != null && order.DepositCase.JointCustomers.Count > 0)
            {
                List<XBS.KeyValuePairOfunsignedLongstring> JointCustomers = new List<xbs.KeyValuePairOfunsignedLongstring>();

                foreach (XBS.KeyValuePairOfunsignedLongstring customer in order.DepositCase.JointCustomers)
                {
                    string CustomerDescription = ACBAOperationService.GetCustomerDescription(customer.key);
                    xbs.KeyValuePairOfunsignedLongstring Customer = new xbs.KeyValuePairOfunsignedLongstring();
                    Customer.key = customer.key;
                    Customer.value = Utility.ConvertAnsiToUnicode(CustomerDescription);
                    JointCustomers.Add(Customer);
                }
                order.DepositCase.JointCustomers = new List<xbs.KeyValuePairOfunsignedLongstring>();
                order.DepositCase.JointCustomers.AddRange(JointCustomers);
            }

            return Json(order, JsonRequestBehavior.AllowGet);
        }


        public void GetDepositCaseContract(ulong productId)
        {
           
            string guid = Utility.GetSessionId();
            string filialCode = ((xbs.User)Session[guid + "_User"]).filialCode.ToString();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "filialCode", value: filialCode);
            parameters.Add(key: "appID", value: productId.ToString());


            ContractService.GetDepositCaseContract(parameters);
        }

        public void GetDepositCaseCloseContract(ulong productId)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(key: "appID", value: productId.ToString());
            ContractService.DepositCaseCloseContract(parameters);
        }


        public JsonResult PrintOrder(xbs.DepositCaseOrder order)
        {
            ulong customerNumber = 0;
            customerNumber = XBService.GetAuthorizedCustomerNumber();

            CustomerViewModel customer = new CustomerViewModel();
            customer.Get(customerNumber);

            string description = "Թիվ " + order.DepositCase.CaseNumber + " պահատուփ," + Utility.ConvertAnsiToUnicode(customer.FirstName) + " " +
                Utility.ConvertAnsiToUnicode(customer.LastName) + ", անձնագիր " + Utility.ConvertAnsiToUnicode(customer.DocumentNumber);
            if (order.DepositCase.JointType == 1)
            {
               
                for (int i = 0; i < order.DepositCase.JointCustomers.Count; i++)
                {
                    customer.Get(order.DepositCase.JointCustomers[i].key);
                    description = description + ", "  + Utility.ConvertAnsiToUnicode(customer.FirstName) + " " +
                    Utility.ConvertAnsiToUnicode(customer.LastName) + ", անձնագիր " + Utility.ConvertAnsiToUnicode(customer.DocumentNumber);
                }
            }


            short prixRasx = 0;
            if (order.Type == xbs.OrderType.DepositCaseTermiationOrder)
            {
                prixRasx = 7;
            }
            else
            {
                prixRasx = 5;
            }
            string guid = Utility.GetSessionId();
            xbs.User user = (xbs.User)Session[guid + "_User"];
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            DateTime operationDate = XBService.GetCurrentOperDay();

            parameters.Add(key: "FilialCode", value: user.filialCode.ToString());
            parameters.Add(key: "DebetAccount", value: prixRasx==7?order.DepositCase.OutBalanceAccount.AccountNumber:"0");
            parameters.Add(key: "CreditAccount", value: prixRasx==5?order.DepositCase.OutBalanceAccount.AccountNumber:"0");
            parameters.Add(key: "AmountPaid", value: "1");
            parameters.Add(key: "OrderNum", value: order.OrderNumber);
            parameters.Add(key: "AmountCurrency", value: "AMD");
            parameters.Add(key: "PaymentDate", value: operationDate.ToString("dd/MMM/yyyy"));
            parameters.Add(key: "PrixRasx", value: prixRasx.ToString());
            parameters.Add(key: "Wording", value: description);
            parameters.Add(key: "Quantity", value: "1");
            parameters.Add(key: "TransactionNumber", value: "0");
            parameters.Add(key: "RePrint", value: "0");

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }
    }
}