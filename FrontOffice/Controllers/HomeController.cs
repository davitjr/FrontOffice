using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using FrontOffice.Service;
using System.Drawing;
using System.IO;
using xbs = FrontOffice.XBS;
using System.Threading;
using acba = FrontOffice.ACBAServiceReference;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{

    [SessionState(SessionStateBehavior.ReadOnly)]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MainPage()
        {
            return PartialView("Index");
        }
        public ActionResult SessionExpiredDialog()
        {
            return PartialView("~/Views/Shared/SessionExpired.cshtml");
        }

        [SessionExpireFilter]
        public JsonResult GetUserID()
        {
            string guid = Utility.GetSessionId();

            XBS.User user = ((XBS.User)Session[guid + "_User"]);
            return Json(user.userID, JsonRequestBehavior.AllowGet);
        }

        [SessionExpireFilter]
        public JsonResult GetUserDescription()
        {
            string guid = Utility.GetSessionId();
            short setNumber = ((XBS.User)Session[guid + "_User"]).userID;
            string casherDescription = ACBAOperationService.GetCasherDescription(setNumber);

            casherDescription=Utility.ConvertAnsiToUnicode(casherDescription);
            return Json(casherDescription, JsonRequestBehavior.AllowGet);
        }

        [SessionExpireFilter]
        public JsonResult  GetCasherDescription(int setNumber)
        {
            string casherDescription = ACBAOperationService.GetCasherDescription(setNumber);
            casherDescription = Utility.ConvertAnsiToUnicode(casherDescription);
            return Json(casherDescription, JsonRequestBehavior.AllowGet);
        }

        [SessionExpireFilter]
        public JsonResult GetCasherDepartment()
        {
            string guid = Utility.GetSessionId();
            short setNumber = ((XBS.User)Session[guid + "_User"]).userID;

            acba.KeyValue casherDepartment = ACBAOperationService.GetCasherDepartment(setNumber);

            casherDepartment.value = Utility.ConvertAnsiToUnicode(casherDepartment.value);

            return Json(casherDepartment, JsonRequestBehavior.AllowGet);
        }

        [SessionExpireFilter]
        public ActionResult UserSetNumber()
        {
            return PartialView("UserSetNumber");
        }

        [SessionExpireFilter]
        public void GetCurrentUserPicture()
        {
            string guid = Utility.GetSessionId();
            short setNumber = ((XBS.User)Session[guid + "_User"]).userID;
            GetUserPicture(setNumber);
        }

        [SessionExpireFilter]
        public JsonResult GetUserFilialCode()
        {
            string guid = Utility.GetSessionId();
            int filialCode = Convert.ToInt32(((XBS.User)Session[guid + "_User"]).filialCode.ToString());
            return Json(filialCode, JsonRequestBehavior.AllowGet); ;
        }

        
        public JsonResult HasATSSystemAccountInFilial()
        {
            string guid = Utility.GetSessionId();
            bool hasATS = false;

            if (!String.IsNullOrEmpty(guid))
            {
                int filialCode = Convert.ToInt32(((XBS.User)Session[guid + "_User"]).filialCode.ToString());
                List<int> listFilials = InfoService.GetATSFilials();
                hasATS = listFilials.Exists(m => m == filialCode);
            }
            
            return Json(hasATS, JsonRequestBehavior.AllowGet);
        }


        public ActionResult UserDetails()
        {
            return PartialView("UserDetails");
        }

        [SessionExpireFilter]
        public JsonResult GetCashier(uint setNumber)
        {
            return Json(ACBAOperationService.GetCashier(setNumber), JsonRequestBehavior.AllowGet);
        }

        [SessionExpireFilter]
        public void GetUserPicture(short setNumber)
        {
            string userName = ACBAOperationService.GetUserLoginName(setNumber);

            byte[] fileContent = Utility.GetUserPicture(userName);

            if (fileContent != null)
            {
                ReportService.ShowDocument(fileContent, ExportFormat.Image, "UserPicture");
            }
        }

        public JsonResult RedirectProducts(ulong customerNumber)
        {
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid+"_authorizedUserSessionToken"].ToString();
            int customerType;
            customerType = ACBAOperationService.GetCustomerType(customerNumber);
            return Json(new { redirectUrl = "/Login/AllProductsSharePoint/", authorizedUserSessionToken = authorizedUserSessionToken, customerNumber = customerNumber, customerType = customerType });
        }

        public JsonResult GetCasherDepartmentId()
        {
            string guid = Utility.GetSessionId();
            short setNumber = ((XBS.User)Session[guid + "_User"]).userID;

            return Json(ACBAOperationService.GetCasherDepartment(setNumber).key, JsonRequestBehavior.AllowGet);
        }



        [SessionExpireFilter]
        public JsonResult IsUserManager(uint setNumber)
        {
            bool isUserManager = false;
            string guid = Utility.GetSessionId();
            XBS.User user = ((XBS.User)Session[guid + "_User"]);
            if (user.filialCode != 22000)
            {
                acba.Cashier cashier = ACBAOperationService.GetCashier(setNumber);
                if (cashier.filial.key == user.filialCode && (user.IsChiefAcc || user.IsManager))
                {
                    isUserManager = true;
                }

            }
            else
            {
                List<acba.Cashier> cashiers = ACBAOperationService.GetAllManagersOfUser(setNumber);
                if (cashiers.Exists(m => m.setNumber == user.userID))
                {
                    isUserManager = true;
                }
            }

            return Json(isUserManager, JsonRequestBehavior.AllowGet);
        }



    }
}
