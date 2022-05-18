using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    public class LeasingProductsController : Controller
    {
        // GET: LeasingProducts
        public ActionResult Index()
        {
            return View("LeasingAllProducts");
        }
    }
}