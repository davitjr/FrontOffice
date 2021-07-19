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
    [SessionState(SessionStateBehavior.ReadOnly)]
    [SessionExpireFilter]
    public class TransferCallContractDetailsController : Controller
    {

        public ActionResult TransferCallContractDetails()
        {
            return PartialView("TransferCallContractDetails");
        }

        public JsonResult GetTransferCallContractsDetails()
        {
            return Json(XBService.GetTransferCallContractsDetails(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTransferCallContractDetails(long contractId)
        {
            return Json(XBService.GetTransferCallContractDetails(contractId), JsonRequestBehavior.AllowGet);
        }


        
    }
}