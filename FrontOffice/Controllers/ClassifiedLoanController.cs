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

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class ClassifiedLoanController : Controller
    {
        [AllowAnonymous] 

        public ActionResult Index()
        {
            return View("ClassifiedLoan");
        }

        public JsonResult GetSearchedClassifiedLoans(xbs.SearchClassifiedLoan searchParams)
        { 
            var jsonResult =  Json(XBService.GetClassifiedLoans(searchParams), JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        //[ActionAccessFilter(actionType = ActionType.)]
        public JsonResult SaveClassifiedLoanActionPreOrder(xbs.ClassifiedLoanActionOrders classifiedLoanActionOrders)
        {
            return Json(XBService.SaveClassifiedLoanActionPreOrder(classifiedLoanActionOrders), JsonRequestBehavior.AllowGet);
        }

        public ActionResult ClassifiedLoanActionOrders(short id)
        {
            ViewBag.PreOrderType = id;
            return View("ClassifiedLoanActionOrders");
        }      

        public ActionResult ClassifiedLoans()
        {
            return PartialView("ClassifiedLoans");
        }

        //[ActionAccessFilter(actionType = ActionType.)]
        public JsonResult ApproveClassifiedLoanActionPreOrder(int preOrderID,short preOrderType)
        {
            return Json(XBService.ApproveClassifiedLoanActionPreOrder(preOrderID, preOrderType), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetClassifiedLoanOrder(long orderId)
        {
            return Json(XBService.GetClassifiedLoanOrder(orderId), JsonRequestBehavior.AllowGet);
        }
        public JsonResult CustomersClassification()
        {
            var jsonResult = Json(XBService.CustomersClassification(), JsonRequestBehavior.AllowGet);
            return jsonResult;
        }
        public JsonResult StoredCreditProductsByCustReport(int filialCode, short type)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            DateTime currentOperDay = XBService.GetCurrentOperDay();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: filialCode.ToString());
            parameters.Add(key: "setNumber", value: currentUser.userID.ToString());
            parameters.Add(key: "type", value: type.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }
        public JsonResult StoredCreditProductReport(int filialCode, short type)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            DateTime currentOperDay = XBService.GetCurrentOperDay();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: filialCode.ToString());
            parameters.Add(key: "setNumber", value: currentUser.userID.ToString());
            parameters.Add(key: "type", value: type.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ReportOfLoansToOutBalance(int filialCode)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            DateTime currentOperDay = XBService.GetCurrentOperDay();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: filialCode.ToString());
            parameters.Add(key: "setNumber", value: currentUser.userID.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ReportOfLoansReturningToOutBalance(int filialCode)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            DateTime currentOperDay = XBService.GetCurrentOperDay();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: filialCode.ToString());
            parameters.Add(key: "setNumber", value: currentUser.userID.ToString());

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }


    }
}