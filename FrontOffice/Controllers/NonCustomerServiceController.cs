using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net.Http;
using Newtonsoft.Json;
using xbs = FrontOffice.XBS;

namespace FrontOffice.Controllers
{

    public class NonCustomerServiceController : Controller
    {
        // GET: getTransferList
        public ActionResult NonCustomerService()
        {
            return View("NonCustomerService");
        }
    }
}