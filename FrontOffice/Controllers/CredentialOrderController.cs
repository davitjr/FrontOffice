using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using XBSInfo = FrontOffice.XBSInfo;
using FrontOffice.Service;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class CredentialOrderController : Controller
    {

        [TransactionPermissionFilter]
        [ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "order")]
        public ActionResult SaveCredentialOrder(xbs.CredentialOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();

            if (order != null && order.Credential != null && order.Credential.AssigneeList != null)
            {
                foreach (xbs.Assignee assignee in order.Credential.AssigneeList)
                {
                    if (assignee.OperationList != null)
                    {
                        for (int i = assignee.OperationList.Count - 1; i >= 0; i--)
                        {
                            if (assignee.OperationList[i].Checked == false)
                            {
                                assignee.OperationList.RemoveAt(i);
                            }
                            else
                            {
                                if (assignee.OperationList[i].Accounts != null)
                                {
                                    for (int j = assignee.OperationList[i].Accounts.Count - 1; j >= 0; j--)
                                    {
                                        if (assignee.OperationList[i].Accounts[j].Checked == false)
                                        {
                                            assignee.OperationList[i].Accounts.RemoveAt(j);
                                        }
                                        else
                                        {
                                            assignee.OperationList[i].AccountList.Add(assignee.OperationList[i].Accounts[j].Account);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (order.Credential.CredentialType == 0 && order.Credential.GivenByBank)
            {
                order.Credential.Status = 10;
            }
            else
            {
                order.Credential.Status = 1;
            }
            result = XBService.SaveCredentialOrder(order);
            return Json(result);
        }

        public ActionResult PersonalCredentialOrder()
        {
            return PartialView("PersonalCredentialOrder");
        }

        public JsonResult InitOperationGroupList(int typeOfCustomer, int credentialType)
        {
            List<XBS.AssigneeOperationGroup> operationGroupList = new List<XBS.AssigneeOperationGroup>();
            Dictionary<string, string> list = InfoService.GetAssigneeOperationGroupTypes(typeOfCustomer);

            foreach (KeyValuePair<string, string> kvp in list)
            {
                if (!(credentialType == 2 && kvp.Key != "1"))
                {
                    XBS.AssigneeOperationGroup oneOperationGroup = new XBS.AssigneeOperationGroup();
                    oneOperationGroup.GroupId = ushort.Parse(kvp.Key);
                    oneOperationGroup.Description = kvp.Value;
                    oneOperationGroup.Checked = false;
                    operationGroupList.Add(oneOperationGroup);
                }
            }

            return Json(operationGroupList);
        }

        public JsonResult InitAssigneeOperationTypes(int groupId, int typeOfCustomer, int credentialType)
        {
            List<XBS.AssigneeOperation> operationList = new List<XBS.AssigneeOperation>();
            List<XBSInfo.TupleOfintintstringboolean> list = InfoService.GetAssigneeOperationTypes(groupId, typeOfCustomer);

            foreach (XBSInfo.TupleOfintintstringboolean operation in list)
            {
                if (!(credentialType == 2 && operation.m_Item2 != 14))
                {
                    XBS.AssigneeOperation oneAssignOperation = new XBS.AssigneeOperation();
                    oneAssignOperation.GroupId = ushort.Parse(operation.m_Item1.ToString());
                    oneAssignOperation.OperationType = ushort.Parse(operation.m_Item2.ToString());
                    oneAssignOperation.OperationTypeDescription = operation.m_Item3;
                    oneAssignOperation.Checked = false;
                    oneAssignOperation.CanChangeAllAccounts = operation.m_Item4;
                    operationList.Add(oneAssignOperation);
                }
            }

            return Json(operationList);
        }

        public ActionResult CredentialOrderDetails()
        {
            return PartialView("CredentialOrderDetails");
        }

        public JsonResult GetCredentialOrder(long orderId)
        {
            return Json(XBService.GetCredentialOrder(orderId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllOperations()
        {
            List<xbs.AssigneeOperation> opList = XBService.GetAllOperations();
            foreach (xbs.AssigneeOperation operation in opList)
            {
                if (operation.AllAccounts == false || operation.OperationType == 16 || operation.OperationType == 17)
                {
                    operation.CanChangeAllAccounts = false;
                }
                else
                {
                    operation.CanChangeAllAccounts = true;
                }
            }
            return Json(opList, JsonRequestBehavior.AllowGet);
        }

        [TransactionPermissionFilter]
        //[ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "orderId")]
        public ActionResult SaveCredentialTerminationOrder(XBS.Credential order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            xbs.CredentialTerminationOrder terminationOrder = new xbs.CredentialTerminationOrder();
            terminationOrder.Type = xbs.OrderType.CredentialTerminationOrder;
            terminationOrder.ClosingReasonType = order.ClosingReasonType;
            terminationOrder.ClosingDate = DateTime.Now;
            terminationOrder.ProductId = order.Id;
            terminationOrder.EndDate = order.EndDate;
            terminationOrder.CredentialType = order.CredentialType;
            result = XBService.SaveCredentialTerminationOrder(terminationOrder);
            return Json(result);

        }

        [TransactionPermissionFilter]
        //[ActionAccessFilter(actionTypeInitReason = ActionTypeInitReason.InitFromOrder, paramClassType = ParamClassType.Order, paramName = "orderId")]
        public ActionResult SaveCredentialDeleteOrder(XBS.Credential order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            xbs.CredentialTerminationOrder terminationOrder = new xbs.CredentialTerminationOrder();
            terminationOrder.Type = xbs.OrderType.CredentialDeleteOrder;
            terminationOrder.ClosingDate = DateTime.Now;
            terminationOrder.ProductId = order.Id;
            result = XBService.SaveCredentialTerminationOrder(terminationOrder);
            return Json(result);
        }

        public JsonResult GetCredentialClosingWarnings(ulong assignId)
        {
            return Json(XBService.GetCredentialClosingWarnings(assignId), JsonRequestBehavior.AllowGet);
        }


        public ActionResult PersonalCredentialActivationOrder()
        {
            return PartialView("PersonalCredentialActivationOrder");
        }

        public ActionResult PersonalCredentialActivationOrderDetails()
        {
            return PartialView("PersonalCredentialActivationOrderDetails");
        }


        public JsonResult SaveAssigneeIdentificationOrder(xbs.AssigneeIdentificationOrder order)
        {
            xbs.ActionResult result = new xbs.ActionResult();
            result = XBService.SaveAndApproveAssigneeIdentificationOrder(order);
            return Json(result);
        }

        public ActionResult AssigneeIdentificationOrderDetails()
        {
            return PartialView("AssigneeIdentificationOrderDetails");
        }

        public JsonResult GetAssigneeIdentificationOrder(long orderId)
        {
            return Json(XBService.GetAssigneeIdentificationOrder(orderId), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetNextCredentialDocumentNumber()
        {
            return Json(XBService.GetNextCredentialDocumentNumber(), JsonRequestBehavior.AllowGet);
        }

        public ActionResult AssigneeIdentificationOrder()
        {
            return PartialView("AssigneeIdentificationOrder");
        }
    }
}