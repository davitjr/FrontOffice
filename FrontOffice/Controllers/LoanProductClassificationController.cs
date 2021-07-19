using FrontOffice.Service;
using xbs=FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice.Controllers
{
    public class LoanProductClassificationController : Controller
    {
        // GET: LoanClassification
        public ActionResult LoanProductClassificationDetails()
        {
            return PartialView("LoanProductClassificationDetails");
        }

        public JsonResult GetLoanProductClassifications(List<ulong> products,DateTime dateFrom)
        {
            List<xbs.LoanProductClassification> classifications = new List<xbs.LoanProductClassification>();

            products.FindAll(p=>p != 0).ForEach(m=> 
            {
                classifications.AddRange(XBService.GetLoanProductClassifications(m, dateFrom));
            });

            classifications = classifications.OrderByDescending(c => c.ClassificationDate).ToList();
                       
            return Json(classifications, JsonRequestBehavior.AllowGet);
        }
    }
}