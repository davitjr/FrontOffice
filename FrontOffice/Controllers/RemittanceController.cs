using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Net.Http;
using Newtonsoft.Json;
using System.Configuration;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using acbaRef = FrontOffice.ACBAServiceReference;
using FrontOffice.ACBAServiceReference;
using FrontOffice.Models;
using System.Security.Cryptography;
using System.Text;

namespace FrontOffice.Controllers
{
    public class RemittanceController : Controller
    {

        public JsonResult GetRemittanceDetailsByURN(string URN)
        {

            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            xbs.RemittanceDetailsRequestResponse response = new xbs.RemittanceDetailsRequestResponse();
            response = XBService.GetRemittanceDetailsByURN(URN, authorizedUserSessionToken);
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRemittanceFeeData(xbs.RemittanceFeeInput feeInput)
        {

            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            xbs.RemittanceFeeDataRequestResponse response = new xbs.RemittanceFeeDataRequestResponse();
            response = XBService.GetRemittanceFeeData(feeInput, authorizedUserSessionToken);
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSTAKMTOListAndBestChoice(xbs.MTOListAndBestChoiceInput bestChoice)
        {

            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            List<xbs.MTOListAndBestChoiceOutput> response = new List<xbs.MTOListAndBestChoiceOutput>();
            response = XBService.GetSTAKMTOListAndBestChoice(bestChoice, authorizedUserSessionToken);
            return Json(response, JsonRequestBehavior.AllowGet);
        }

    }
}