using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    public class SearchTransferBankMailController : Controller
    {
        public JsonResult GetSearchedTransfersBankMail(xbs.SearchTransferBankMail searchParams)
        {

            if (searchParams.DateOfTransfer == DateTime.MinValue && String.IsNullOrEmpty(searchParams.SenderAccount) && String.IsNullOrEmpty(searchParams.ReceiverAccount) && String.IsNullOrEmpty(searchParams.Amount) && String.IsNullOrEmpty(searchParams.ReceiverName) && String.IsNullOrEmpty(searchParams.DescriptionForPayment))
            {
                return Json(new List<xbs.SearchTransferBankMail>(), JsonRequestBehavior.AllowGet);
            }
            return Json(XBService.GetSearchedTransfersBankMail(searchParams), JsonRequestBehavior.AllowGet);
        }
    }
}