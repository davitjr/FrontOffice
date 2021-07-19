using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using acba = FrontOffice.ACBAServiceReference;
using FrontOffice.Models;

namespace FrontOffice.Controllers
{
    public class ImageSliderController : Controller
    {

        public ActionResult ImageSlider()
        {
            return PartialView("ImageSlider");
        }
    }
}