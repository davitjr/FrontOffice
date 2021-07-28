using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbs = FrontOffice.XBS;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionState(SessionStateBehavior.ReadOnly)]
    [SessionExpireFilter]
    public class ReceivedBankMailTransfersController : Controller
    {
        // GET: Credential        
        public ActionResult Index()
        {
            return View("ReceivedBankMailTransfers");
        }
        public ActionResult CustomerTransfers()
        {
            return PartialView("ReceivedBankMailTransfers");
        }
         
 

        public JsonResult GetTransferList(xbs.TransferFilter filter)
        {
            filter.DateFrom = Convert.ToDateTime(filter.DateFrom).Date;
            filter.DateTo = Convert.ToDateTime(filter.DateTo).Date;
            return Json(XBService.GetReceivedBankMailTransfers(filter), JsonRequestBehavior.AllowGet);

        }




        public ActionResult TransferDetails()
        {
            return PartialView("ReceivedBankMailTransferDetails");
        }

        public JsonResult GetTransfer(ulong transferID)
        {
            return Json(XBService.GetReceivedBankMailTransfer(transferID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult PrintTransfer(ulong  Id)
        {
             
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "wherecond", value: "WHERE ID=" +Id.ToString() );
            parameters.Add(key: "archive", value: "0");
            parameters.Add(key: "transOK", value: "1");
            parameters.Add(key: "oneMessage", value: "1");

            //parameters.Add(key: "FileName", value: "BankMail");

            return Json(parameters, JsonRequestBehavior.AllowGet);
        }
 

    }
}