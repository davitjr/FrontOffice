using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using FrontOffice.Models;
using xbsManagement = FrontOffice.XBManagement;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    public class PhoneBankingController : Controller
    {
        // GET: PhoneBanking
        public ActionResult Index()
        {
            return View("AllProducts");
        }

        
    }
}