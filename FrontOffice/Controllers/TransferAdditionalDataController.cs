using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    public class TransferAdditionalDataController : Controller
    {
        public ActionResult GetTransferAdditionalDataForm()
        {
            return PartialView("TransferAdditionalDataForm");
        }

        public ActionResult GetTransferAdditionalDataDetails()
        {
            return PartialView("TransferAdditionalDataDetails");
        }    
    }
}