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
    public class LoginController : Controller
    {
        public ActionResult ExternalSharePoint()
        {

            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            System.Web.HttpContext.Current.Session[guid + "_CustomerNumber"] = this.Request.QueryString["customerNumber"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            System.Web.HttpContext.Current.Session[guid + "_AuthorizedUser"] = authorizedUser;
            System.Web.HttpContext.Current.Session[guid + "_User"] = user;

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.HasTransactionPermission = false;
            sessionProperties.SourceType = 6;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            System.Web.HttpContext.Current.Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;

            return RedirectToAction("PhoneBankingLogin", "Login");
        }


        public ActionResult AllProductsSharePoint()
        {
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();
            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);
            string guid = Guid.NewGuid().ToString();
            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;
            Session[guid + "_User"] = user;
            Session[guid + "_CustomerNumber"] = this.Request.QueryString["customerNumber"];

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.HasTransactionPermission = false;
            sessionProperties.SourceType = 2;
            sessionProperties.UserName = authorizedUser.userName;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            TempData["user"] = user;
            TempData["customerNumber"] = this.Request.QueryString["customerNumber"];

            return RedirectToAction("AllProducts", "Login");

        }







        // լինկ  դեպի հաճախորդների պրոդուկտներ
        public ActionResult CashierTransactionsToAllProducts(ulong customerNumber)
        {
            //TempData.Keep();

            XBS.AuthorizedCustomer authorizedCustomer = new xbs.AuthorizedCustomer();
            string guid = Utility.GetSessionId();

            authorizedCustomer = XBService.AuthorizeCustomer(customerNumber, Session[guid + "_authorizedUserSessionToken"].ToString());

            if (authorizedCustomer.SessionID != null)
            {
                Session[guid + "_AuthorisedCustomerSessionId"] = authorizedCustomer.SessionID;
            }
            else
            {
                Session[guid + "_AuthorisedCustomerSessionId"] = null;
            }

            xbs.UserAccessForCustomer userAccessForCustomer = new xbs.UserAccessForCustomer();
            userAccessForCustomer = XBService.GetUserAccessForCustomer(Session[guid + "_authorizedUserSessionToken"].ToString(), Session[guid + "_AuthorisedCustomerSessionId"].ToString());
            Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;

            ViewBag.redirecturl = "/AllProductsSharePoint/Index";
            return PartialView("RedirectDirection");
        }


        public void initUSerBySessionToken(string authorizedUserSessionToken, ref xbs.AuthorizedUser authorizedUser, ref xbs.User user)
        {
            XBService.initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            if (!authorizedUser.isAutorized)
            {
                user = null;
            }
        }


        [HttpPost]
        public JsonResult Redirect()//Redirecting to Customers 
        {
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            return Json(new { redirectUrl = ConfigurationManager.AppSettings["CustomersURL"] + ConfigurationManager.AppSettings["CustomersExternalSharePointURL"], redirectTarget = 1, customerNumber = customerNumber, authorizedUserSessionToken = authorizedUserSessionToken }, JsonRequestBehavior.AllowGet);
        }




        [HttpPost]
        [SessionExpireFilter]
        public JsonResult RedirectBackToCustomersList()//Redirecting to Customers search
        {



            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = " ";
            if (Session[guid + "_authorizedUserSessionToken"] != null)
                authorizedUserSessionToken = Session[guid + "_authorizedUserSessionToken"].ToString();

            ulong customerNumber = 0;
            customerNumber = XBService.GetAuthorizedCustomerNumber();


            if (customerNumber == 0 && Session[guid + "_CustomerNumber"] != null)
            {
                customerNumber = Convert.ToUInt64(Session[guid + "_CustomerNumber"]);
            }


            XBService.SaveExternalBankingLogOutHistory(authorizedUserSessionToken);
            Session[guid + "_AuthorisedCustomerSessionId"] = null;


            bool isDevVersion = false;
            isDevVersion = bool.Parse(ConfigurationManager.AppSettings["ForDevelopment"].ToString());

            if (isDevVersion)
            {
                return Json(new { redirectUrl = "/Login/Testversion" });
            }



            Utility.ClearSession(guid);
            return Json(new { redirectUrl = ConfigurationManager.AppSettings["CustomersURL"] + ConfigurationManager.AppSettings["CustomersExternalSharePointURL"], customerNumber = customerNumber, authorizedUserSessionToken = authorizedUserSessionToken }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [SessionExpireFilter]
        public JsonResult RedirectToCustomerData()//Redirecting to Customer Data
        {
            SetTicketCookie();
            string SAPredirectUrl = null;
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = " ";
            if (Session[guid + "_authorizedUserSessionToken"] != null)
                authorizedUserSessionToken = Session[guid + "_authorizedUserSessionToken"].ToString();

            ulong customerNumber = 0;
            customerNumber = XBService.GetAuthorizedCustomerNumber();


            if (customerNumber == 0 && Session[guid + "_CustomerNumber"] != null)
            {
                customerNumber = Convert.ToUInt64(Session[guid + "_CustomerNumber"]);
            }

            SAPredirectUrl = ACBAOperationService.GenerateSAPREdirectUrl(customerNumber);


            XBService.SaveExternalBankingLogOutHistory(authorizedUserSessionToken);
            Session[guid + "_AuthorisedCustomerSessionId"] = null;


            bool isDevVersion = false;
            isDevVersion = bool.Parse(ConfigurationManager.AppSettings["ForDevelopment"].ToString());

            if (isDevVersion)
            {
                return Json(new { redirectUrl = "/Login/Testversion" });
            }

            Utility.ClearSession(guid);
            return Json(new { redirectUrl = SAPredirectUrl }, JsonRequestBehavior.AllowGet);
            //return Json(new { redirectUrl = ConfigurationManager.AppSettings["CustomersURL"] + ConfigurationManager.AppSettings["CustomerDataExternalSharePointURL"], customerNumber = customerNumber, authorizedUserSessionToken = authorizedUserSessionToken }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Testversion()
        {
            return PartialView("~/Views/TestLogin/TestLogin.cshtml");
        }

        [HttpPost]
        public JsonResult LogOut()//Exit Customers Login page
        {

            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = " ";
            if (Session[guid + "_authorizedUserSessionToken"] != null)
                authorizedUserSessionToken = Session[guid + "_authorizedUserSessionToken"].ToString();

            XBService.SaveExternalBankingLogOutHistory(authorizedUserSessionToken);

            Utility.ClearSession(guid);

            bool isDevVersion = false;
            isDevVersion = bool.Parse(ConfigurationManager.AppSettings["ForDevelopment"].ToString());

            if (isDevVersion)
            {
                return Json(new { redirectUrl = "/Login/Testversion" });

            }
            else
            {
                return Json(new { redirectUrl = ConfigurationManager.AppSettings["CustomersURL"] });
            }
        }

        [HttpPost]
        public JsonResult ExitToCustomersLoginPage()//Exit Customers Login page
        {

            string guid = Utility.GetSessionId();

            Utility.ClearSession(guid);

            bool isDevVersion = false;
            isDevVersion = bool.Parse(ConfigurationManager.AppSettings["ForDevelopment"].ToString());

            if (isDevVersion)
            {
                return Json(new { redirectUrl = "/Login/Testversion" });

            }
            else
            {
                return Json(new { redirectUrl = ConfigurationManager.AppSettings["CustomersURL"] });
            }
        }


        public ActionResult TransferByCallSharePoint()
        {

            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;
            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.SourceType = 2;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.IsNonCustomerService = true;
            sessionProperties.NonCheckFilialATSAccount = true;
            Session[guid + "_SessionProperties"] = sessionProperties;

            Session[guid + "_AuthorisedCustomerSessionId"] = -1;

            xbs.UserAccessForCustomer userAccessForCustomer = new xbs.UserAccessForCustomer();
            userAccessForCustomer = XBService.GetUserAccessForCustomer(Session[guid + "_authorizedUserSessionToken"].ToString(), Session[guid + "_AuthorisedCustomerSessionId"].ToString());
            Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;

            TempData["sessionId"] = guid;
            return RedirectToAction("TransferByCall", "Login");
        }


        public ActionResult TransferByCall()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/TransferByCall/TransfersByCall";
            return PartialView("RedirectDirection");
        }


        public ActionResult NonCustomerServiceSharePoint()
        {
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            string guid = Guid.NewGuid().ToString();

            Session[guid + "_CustomerNumber"] = 0;
            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;
            Session[guid + "_User"] = user;
            Session[guid + "_AuthorisedCustomerSessionId"] = -1;

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.HasTransactionPermission = false;
            sessionProperties.SourceType = 2;
            sessionProperties.IsNonCustomerService = true;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            return RedirectToAction("NonCustomerService", "Login");

        }





        //public JsonResult GetCustomerAuthorizationData()
        //{

        //    string guid = TempData["sessionId"].ToString();
        //    TempData.Keep();
        //    List<XBS.TupleOfstringstring> result = new List<XBS.TupleOfstringstring>();
        //    ulong customerNumber = 0;
        //    if (Session[guid+"_AuthorisedCustomerSessionId"] != null)
        //    {
        //        ulong authorisedCustomerNumber = XBService.GetAuthorizedCustomerNumber();
        //        result = XBService.GetCustomerAuthorizationData(authorisedCustomerNumber);

        //        if (authorisedCustomerNumber == Convert.ToUInt64(Session[guid + "_CustomerNumber"]) && result.Count > 0)
        //        {
        //            return Json("authorised", JsonRequestBehavior.AllowGet);
        //        }
        //    }
        //    if (Session[guid + "_CustomerNumber"] != null)
        //    {
        //        customerNumber = Convert.ToUInt64(Session[guid + "_CustomerNumber"]);
        //        result = XBService.GetCustomerAuthorizationData(customerNumber);

        //        return Json(result, JsonRequestBehavior.AllowGet);
        //    }
        //    else
        //    {
        //        return Json("null", JsonRequestBehavior.AllowGet);
        //    }

        //}


        public ActionResult PhoneBankingLogin()
        {
            TempData.Keep();
            return PartialView("PhoneBankingLogin");
        }



        [FrontLoggingFilterAttribute(ActionType = (int)ActionType.CustomerAllProductsOpen, UseTempDataForInit = true,
                                GuidTempDataName = "sessionId",
                                UserTempDataName = "user",
                                CustomerNumberTempDataName = "customerNumber")]
        public ActionResult AllProducts()
        {
            TempData.Keep();
            return PartialView("AllProductsSharePoint");
        }

        public ActionResult NonCustomerService()
        {
            TempData.Keep();
            return PartialView("NonCustomerServiceLogin");
        }

        public ActionResult LoginQuestion()
        {
            TempData.Keep();
            return PartialView("LoginQuestion");
        }

        public ActionResult OpenSmsAuthorization()
        {
            return PartialView("SMSAuthorizationDialog");
        }

        //public ActionResult SendSMSAuthorizationCode()
        //{
        //    return Json(XBService.SendSMSAuthorizationCode(), JsonRequestBehavior.AllowGet);
        //}

        //public ActionResult VerifySMSAuthorizationCode(string smsCode)
        //{
        //    xbs.ActionResult result = XBService.VerifySMSAuthorizationCode(smsCode);

        //    if (result.ResultCode == xbs.ResultCode.Normal)
        //    {
        //        string guid = Utility.GetSessionId();
        //        SessionProperties sessionProperties = (SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"];
        //        sessionProperties.HasTransactionPermission = true;
        //    }

        //    return Json(XBService.VerifySMSAuthorizationCode(smsCode), JsonRequestBehavior.AllowGet);
        //}


        public ActionResult SetSessionGuid(DateTime clientDate)
        {
            string guid = TempData["sessionId"].ToString();

            bool checkDate = true;
            DateTime serverDate = DateTime.Now;

            if ((clientDate.Hour - serverDate.Hour != 0) || (clientDate.Year - serverDate.Year != 0)
                || (clientDate.Minute - serverDate.Minute > 5) || (clientDate.Day - serverDate.Day != 0))
            {
                checkDate = false;
            }
            if (!checkDate)
            {
                System.Web.HttpContext.Current.Response.StatusCode = 424;
                System.Web.HttpContext.Current.Response.StatusDescription = "TimeZoneProblem";
                return Json(guid, JsonRequestBehavior.AllowGet);
            }

            TempData.Keep();
            return Json(guid, JsonRequestBehavior.AllowGet);
        }


        [CustomerAccessFilter]
        public ActionResult LogIn()
        {
            ulong customerNumber = 0;
            bool session = false;

            string guid = Utility.GetSessionId();

            XBS.AuthorizedCustomer authorizedCustomer = new xbs.AuthorizedCustomer();
            SessionProperties sessionProperties = (SessionProperties)Session[guid + "_SessionProperties"];

            if (Session[guid + "_CustomerNumber"] != null)
            {
                customerNumber = Convert.ToUInt64(Session[guid + "_CustomerNumber"]);
                session = true;
            }

            authorizedCustomer = XBService.AuthorizeCustomer(customerNumber, Session[guid + "_authorizedUserSessionToken"].ToString());

            if (authorizedCustomer.SessionID != null)
            {
                Session[guid + "_AuthorisedCustomerSessionId"] = authorizedCustomer.SessionID;
            }
            else
            {
                Session[guid + "_AuthorisedCustomerSessionId"] = null;
            }

            if (sessionProperties.IsNonCustomerService)
            {
                Session[guid + "_CustomerNumber"] = 0;
                Session[guid + "_AuthorisedCustomerSessionId"] = -1;
            }

            xbs.UserAccessForCustomer userAccessForCustomer = new xbs.UserAccessForCustomer();
            userAccessForCustomer = XBService.GetUserAccessForCustomer(Session[guid + "_authorizedUserSessionToken"].ToString(), Session[guid + "_AuthorisedCustomerSessionId"].ToString());
            Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;

            return Json(session, JsonRequestBehavior.AllowGet);

        }

        public ActionResult SessionExpiredDialog()
        {
            return PartialView("~/Views/Shared/SessionExpiredDialog.cshtml");
        }

        public ActionResult TimeZoneProblemDialog()
        {
            return PartialView("~/Views/Shared/TimeZoneProblemDialog.cshtml");
        }

        public ActionResult ActionPermissionDeniedDialog()
        {
            return PartialView("~/Views/Shared/ActionPermissionDeniedDialog.cshtml");
        }

        public ActionResult ProductPermissionDeniedDialog()
        {
            return PartialView("~/Views/Shared/ProductPermissionDeniedDialog.cshtml");
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult LogInTest(TestLogin model)
        {
            //return View("~/Views/TestLogin/GeneralTest.cshtml");
            if (ModelState.IsValid)
            {
                LoginInfo lAcba = new LoginInfo();
                AuthorizedUser authorizedUser = new AuthorizedUser();
                User user = new User();
                string[] hostName;

                lAcba.progName = "Customers_Web";
                lAcba.progVersion = "1.0.0";
                hostName = System.Net.Dns.GetHostEntry(Request.ServerVariables["REMOTE_HOST"]).HostName.Split('.');
                lAcba.host = hostName[0];
                lAcba.ipAddress = Request.ServerVariables["REMOTE_ADDR"];

                lAcba.userName = model.UserName;
                lAcba.externalPassword = GetMd5Hash(model.Password);

                using (ACBAOperationServiceClient proxyClient = new ACBAOperationServiceClient())
                {
                    proxyClient.Open();
                    authorizedUser = proxyClient.AutorizeUser(lAcba);
                    user = proxyClient.GetCurrentUser();
                }

                string userStr = JsonConvert.SerializeObject(user);
                xbs.User usr = JsonConvert.DeserializeObject<xbs.User>(userStr);

                Session["_authorizedUserSessionToken"] = authorizedUser.userSessionToken;
                Session["_authorizedUser"] = authorizedUser;
                Session["_user"] = usr;
                Session["_progName"] = lAcba.progName;

                switch (authorizedUser.result)
                {
                    case 5:
                        return RedirectToAction("ChangePassword", new { id = lAcba.userName });
                    case 0:
                        HttpCookie cookie = new HttpCookie("AcbaSoftUserName", model.UserName);
                        HttpContext.Response.Cookies.Remove("AcbaSoftUserName");
                        cookie.Expires = DateTime.Now.AddMonths(1);
                        HttpContext.Response.SetCookie(cookie);
                        return View("~/Views/TestLogin/ChooseServeType.cshtml");
                    default:
                        ViewBag.Result = authorizedUser.result;
                        ViewBag.ResultDescription = authorizedUser.resultDescriptionAM;
                        ModelState.AddModelError("", authorizedUser.resultDescriptionAM);
                        ViewBag.UserName = model.UserName;
                        //return View(model);
                        return View("~/Views/TestLogin/TestLogin.cshtml");
                }
            }

            //ModelState.AddModelError("", "The user name or password provided is incorrect.");

            ViewBag.UserName = model.UserName;
            return View("~/Views/TestLogin/TestLogin.cshtml");
        }

        static string GetMd5Hash(string input)
        {
            MD5 md5Hash = MD5.Create();

            // Convert the input string to a byte array and compute the hash. 
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes 
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data  
            // and format each one as a hexadecimal string. 
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string. 
            return sBuilder.ToString();
        }

        public ActionResult OpenServeTypeDialog()
        {
            return PartialView("~/Views/TestLogin/ServeTypeDialog.cshtml");
        }


        public ActionResult TestServingCustomer(string customerNumber)
        {
            System.Web.HttpContext.Current.Session["_CustomerNumber"] = customerNumber;
            String authorizedUserSessionToken = Session["_authorizedUserSessionToken"].ToString();
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();
            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);
            string guid = Guid.NewGuid().ToString();
            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;
            Session[guid + "_User"] = user;
            Session[guid + "_CustomerNumber"] = this.Request.QueryString["customerNumber"];
            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.HasTransactionPermission = false;
            sessionProperties.SourceType = 2;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            System.Web.HttpContext.Current.Session["_SessionProperties"] = sessionProperties;
            

            XBS.AuthorizedCustomer authorizedCustomer = new xbs.AuthorizedCustomer();

            authorizedCustomer = XBService.AuthorizeCustomer(UInt64.Parse(customerNumber), Session["_authorizedUserSessionToken"].ToString());

            Session["_AuthorisedCustomerSessionId"] = authorizedCustomer.SessionID;

            return RedirectToAction("LogIn", "Login");
        }

        public ActionResult TestServingNonCustomer()
        {

            Session["_CustomerNumber"] = 0;

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.HasTransactionPermission = false;
            sessionProperties.SourceType = 2;
            sessionProperties.IsNonCustomerService = true;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            System.Web.HttpContext.Current.Session["_SessionProperties"] = sessionProperties;
            Session["_AuthorisedCustomerSessionId"] = -1;

            xbs.UserAccessForCustomer userAccessForCustomer = new xbs.UserAccessForCustomer();
            userAccessForCustomer = XBService.GetUserAccessForCustomer(Session["_authorizedUserSessionToken"].ToString(), Session["_AuthorisedCustomerSessionId"].ToString());
            Session["_userAccessForCustomer"] = userAccessForCustomer;


            return Json(false, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ProductPermissionDenied()
        {
            return new JsonResult
            {
                Data = new { productAccess = "false" },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult ActionPermissionDenied()
        {
            return new JsonResult
            {
                Data = new { actionAccess = "false" },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }



        public ActionResult TransfersSharePoint()
        {
            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            Session[guid + "_CustomerNumber"] = 0;
            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;
            Session[guid + "_AuthorisedCustomerSessionId"] = -1;
            Session[guid + "_User"] = user;

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.HasTransactionPermission = false;
            sessionProperties.SourceType = 2;
            sessionProperties.IsNonCustomerService = true;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.NonCheckFilialATSAccount = true;
            Session[guid + "_SessionProperties"] = sessionProperties;


            xbs.UserAccessForCustomer userAccessForCustomer = new xbs.UserAccessForCustomer();
            userAccessForCustomer = XBService.GetUserAccessForCustomer(Session[guid + "_authorizedUserSessionToken"].ToString(), Session[guid + "_AuthorisedCustomerSessionId"].ToString());
            Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;

            TempData["sessionId"] = guid;
            return RedirectToAction("Transfers", "Login");

        }


        public ActionResult Transfers()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/Transfers/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult SMSMessagingSharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;

            TempData["sessionId"] = guid;
            return RedirectToAction("SMSMessaging", "Login");
        }

        public ActionResult SMSMessaging()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/SMSMessaging/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult CustomersNotesSharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;
            TempData["sessionId"] = guid;
            return RedirectToAction("CustomersNotes", "Login");
        }

        public ActionResult CustomersNotes()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/CustomersNotes/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult OutPutReportsSharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;
            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.NonCheckFilialATSAccount = true;
            Session[guid + "_SessionProperties"] = sessionProperties;

            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            return RedirectToAction("OutPutReports", "Login");
        }

        public ActionResult OutPutReports()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/OutPutReports/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult CashBookSharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;
            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.IsNonCustomerService = true;
            sessionProperties.SourceType = 2;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.NonCheckFilialATSAccount = true;
            Session[guid + "_SessionProperties"] = sessionProperties;

            Session[guid + "_AuthorisedCustomerSessionId"] = -1;
            xbs.UserAccessForCustomer userAccessForCustomer = new xbs.UserAccessForCustomer();
            userAccessForCustomer = XBService.GetUserAccessForCustomer(Session[guid + "_authorizedUserSessionToken"].ToString(), Session[guid + "_AuthorisedCustomerSessionId"].ToString());
            Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;


            TempData["sessionId"] = guid;
            return RedirectToAction("CashBook", "Login");
        }

        public ActionResult InputTransitAccountsForDebitTransactionsSharePoint()
        {

            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;


            TempData["sessionId"] = guid;
            return RedirectToAction("TransitAccountsForDebitTransactions", "Login");
        }


        public ActionResult TransitAccountsForDebitTransactions()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/TransitAccountsForDebitTransactions/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult CashBook()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/CashBook";
            return PartialView("RedirectDirection");
        }

        public JsonResult IsTestingMode()
        {
            bool isDevVersion = false;
            isDevVersion = bool.Parse(ConfigurationManager.AppSettings["TestVersion"].ToString());
            return Json(isDevVersion, JsonRequestBehavior.AllowGet);
        }

        public ActionResult FinancialPlanningPoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;


            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.IsNonCustomerService = true;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;

            return RedirectToAction("FinancialPlanning", "Login");
        }

        public ActionResult FinancialPlanning()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/FinancialPlanning/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult CardStatementSharePoint()
        {
            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);



            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;






            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.IsNonCustomerService = true;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;


            return RedirectToAction("CardStatementSession", "Login");
        }


        public ActionResult CardStatementSession()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/CardStatementSession/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult FondsManagementSharePoint()
        {
            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.SourceType = 2;
            sessionProperties.NonCheckFilialATSAccount = true;
            sessionProperties.IsNonCustomerService = true;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            return RedirectToAction("FondsManagement", "Login");

        }

        public ActionResult FondsManagement()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/Fond/Fonds";
            return PartialView("RedirectDirection");
        }

        public ActionResult EmployeePersonalPageSharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;


            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.NonCheckFilialATSAccount = true;
            Session[guid + "_SessionProperties"] = sessionProperties;

            Session[guid + "_User"] = user;
            TempData["sessionId"] = guid;
            return RedirectToAction("EmployeeWorks", "Login");
        }

        public ActionResult EmployeeWorks()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/EmployeeWorks/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult CreditsHereAndNowSharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_User"] = user;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.SourceType = 2;
            sessionProperties.NonCheckFilialATSAccount = true;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            return RedirectToAction("CreditsHereAndNow", "Login");
        }
        public ActionResult CreditsHereAndNow()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/CreditHereAndNow/Index";
            return PartialView("RedirectDirection");
        }


        public ActionResult OnlineAppSharePoint()
        {
            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.NonCheckFilialATSAccount = true;
            Session[guid + "_SessionProperties"] = sessionProperties;

            Session[guid + "_User"] = user;

            TempData["sessionId"] = guid;
            return RedirectToAction("TokensDistribution", "Login");

        }

        public ActionResult TokensDistribution()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/TokensDistribution/Index";
            return PartialView("RedirectDirection");
        }
        public ActionResult BondIssueSharePoint()
        {
            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.SourceType = (int)xbs.SourceType.Bank;
            sessionProperties.IsNonCustomerService = false;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            Session[guid + "_SessionProperties"] = sessionProperties;


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;

            TempData["sessionId"] = guid;
            return RedirectToAction("BondIssue", "Login");
        }



        public ActionResult BondIssue()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/BondIssue/BondIssue";
            return PartialView("RedirectDirection");
        }

        public ActionResult ProblemLoanTaxesSharePoint()
        {
            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.SourceType = (int)xbs.SourceType.Bank;
            sessionProperties.IsNonCustomerService = false;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            Session[guid + "_SessionProperties"] = sessionProperties;


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;

            TempData["sessionId"] = guid;
            return RedirectToAction("ProblemLoanTaxes", "Login");
        }



        public ActionResult ProblemLoanTaxes()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/ProblemLoanTaxes/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult ClassifiedLoansSharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_User"] = user;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.SourceType = 2;
            sessionProperties.NonCheckFilialATSAccount = true;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            return RedirectToAction("ClassifiedLoans", "Login");
        }
        public ActionResult ClassifiedLoans()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/ClassifiedLoan/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult SwiftMessagesSharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;
            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.IsNonCustomerService = true;
            sessionProperties.SourceType = 2;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.NonCheckFilialATSAccount = true;

            Session[guid + "_SessionProperties"] = sessionProperties;

            Session[guid + "_AuthorisedCustomerSessionId"] = -1;
            xbs.UserAccessForCustomer userAccessForCustomer = new xbs.UserAccessForCustomer();
            userAccessForCustomer = XBService.GetUserAccessForCustomer(Session[guid + "_authorizedUserSessionToken"].ToString(), Session[guid + "_AuthorisedCustomerSessionId"].ToString());
            Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;


            TempData["sessionId"] = guid;
            return RedirectToAction("SwiftMessages", "Login");
        }

        public ActionResult SwiftMessages()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/SwiftMessages";
            return PartialView("RedirectDirection");
        }

        public ActionResult LoanEquipmentsSharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_User"] = user;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.SourceType = 2;
            sessionProperties.NonCheckFilialATSAccount = true;
            sessionProperties.IsNonCustomerService = true;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            return RedirectToAction("LoanEquipments", "Login");
        }
        public ActionResult LoanEquipments()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/LoanEquipments/Index";
            return PartialView("RedirectDirection");
        }


        public ActionResult OperDayModeSharePoint()
        {
            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.SourceType = (int)xbs.SourceType.Bank;
            sessionProperties.IsNonCustomerService = false;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            Session[guid + "_SessionProperties"] = sessionProperties;


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;

            TempData["sessionId"] = guid;
            return RedirectToAction("OperDayMode", "Login");
        }


        public ActionResult OperDayMode()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/OperDayMode/Index";
            return PartialView("RedirectDirection");
        }


        public ActionResult FrontOfficeLoanDetailsSharePoint()
        {
            string authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            ulong productId = Convert.ToUInt64(this.Request.QueryString["productId"]);
            short applicationGroup = Convert.ToInt16(this.Request.QueryString["applicationGroup"]);
            Session["loan"] = productId;
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            string guid = Guid.NewGuid().ToString();
            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_User"] = user;
            Session[guid + "_AuthorizedUser"] = authorizedUser;
            Session[guid + "_CustomerNumber"] = this.Request.QueryString["customerNumber"];



            Session[guid + "_AuthorisedCustomerSessionId"] = this.Request.QueryString["authorisedCustomerSessionId"];

            xbs.UserAccessForCustomer userAccessForCustomer = new xbs.UserAccessForCustomer();
            userAccessForCustomer = XBService.GetUserAccessForCustomer(Session[guid + "_authorizedUserSessionToken"].ToString(), Session[guid + "_AuthorisedCustomerSessionId"].ToString());

            Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;

            ViewBag.guid = guid;
            ViewBag.AuthorisedCustomerSessionId = Session[guid + "_AuthorisedCustomerSessionId"];

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.HasTransactionPermission = false;
            sessionProperties.SourceType = 2;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.LoanProductId = productId;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            if (applicationGroup == 1)
            {
                return RedirectToAction("LoanDetails", "Login");
            }
            else
            {
                return RedirectToAction("CreditLineDetails", "Login");
            }

        }
        public ActionResult LoanDetails()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/#!/loanDetails";
            return PartialView("RedirectDirection");
        }

        public ActionResult CreditLineDetails()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/#!/creditLineDetails";
            return PartialView("RedirectDirection");
        }

        public ActionResult OperDayOptions()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/OperDayOptions/Index";
            return PartialView("RedirectDirection");
        }

        public void InitUSerBySAPTicket(string SAPTicket, ref xbs.AuthorizedUser authorizedUser, ref xbs.User user)
        {
            XBService.InitUSerBySAPTicket(SAPTicket, ref authorizedUser, ref user);

            if (!authorizedUser.isAutorized)
            {
                user = null;
            }
        }

        public ActionResult AllProductsSharePointForSAP()
        {
            string SAPTicket = this.Request.Cookies["MYSAPSSO2"].Value;
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();
            InitUSerBySAPTicket(SAPTicket, ref authorizedUser, ref user);
            string guid = Guid.NewGuid().ToString();
            Session[guid + "_authorizedUserSessionToken"] = authorizedUser.userSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;
            Session[guid + "_User"] = user;
            Session[guid + "_CustomerNumber"] = this.Request.QueryString["customerNumber"];

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.HasTransactionPermission = false;
            sessionProperties.SourceType = 2;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            Session[guid + "_SessionProperties"] = sessionProperties; ;

            TempData["sessionId"] = guid;
            return RedirectToAction("AllProducts", "Login");

        }

        public ActionResult CardDeliverySharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();
            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);
            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;
            Session[guid + "_User"] = user;
            TempData["sessionId"] = guid;
            return RedirectToAction("CardDelivery", "Login");
        }
        public ActionResult CardDelivery()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/CardDelivery/Index";
            return PartialView("RedirectDirection");
        }


        // Դրամարկղի գործարքներ  
        public ActionResult CashierTransactionsSharePoint()
        {

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();
            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);
            string guid = Guid.NewGuid().ToString();
            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;
            Session[guid + "_User"] = user;
            Session[guid + "_CustomerNumber"] = this.Request.QueryString["customerNumber"];

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.HasTransactionPermission = true;
            sessionProperties.SourceType = 2;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            TempData["user"] = user;
            TempData["customerNumber"] = this.Request.QueryString["customerNumber"];

            return RedirectToAction("CashierTransactions", "Login");
        }

        public ActionResult CashierTransactions()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/CashierTransactions/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult HomeBankingSharePoint()
        {
            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.SourceType = (int)xbs.SourceType.Bank;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.IsNonCustomerService = false;
            sessionProperties.IsCalledFromHB = true;
            sessionProperties.IsCalledForHBConfirm = false;
            Session[guid + "_SessionProperties"] = sessionProperties;


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;

            TempData["sessionId"] = guid;
            return RedirectToAction("HomeBanking", "Login");
        }

        public ActionResult HomeBanking()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/HomeBankingDocuments/Index";
            return PartialView("RedirectDirection");
        }

        private void SetTicketCookie()
        {
            string guid = Utility.GetSessionId();

            string authorizedUserSessionToken = Session[guid + "_authorizedUserSessionToken"].ToString();
            string logonTicket = XBService.CreateLogonTicket(authorizedUserSessionToken);
            HttpCookie httpCookie = new HttpCookie("MYSAPSSO2", logonTicket);
            httpCookie.HttpOnly = true;
            httpCookie.Secure = true;
            httpCookie.Domain = ".acbaca.local";
            //httpCookie.Expires = DateTime.Now.AddHours(8);
            this.Response.Cookies.Add(httpCookie);
        }

        public ActionResult LeasingCustomerClassificationSharePoint()
        {
            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.SourceType = (int)xbs.SourceType.Bank;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.IsNonCustomerService = false;
            Session[guid + "_SessionProperties"] = sessionProperties;


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;

            TempData["sessionId"] = guid;
            return RedirectToAction("LeasingCustomerClassification", "Login");
        }

        public ActionResult LeasingCustomerClassification()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/LeasingCustomerClassification/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult LeasingStatementsSharePoint()
        {
            string guid = Guid.NewGuid().ToString();

            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);   
            
            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.SourceType = (int)xbs.SourceType.Bank;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.IsNonCustomerService = false;
            Session[guid + "_SessionProperties"] = sessionProperties;


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;

            TempData["sessionId"] = guid;
            return RedirectToAction("LeasingStatementSession", "Login");
        }

        public ActionResult LeasingStatementSession()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/LeasingStatementSession/Index";
            return PartialView("RedirectDirection");
        }

        public ActionResult LeasingAllProductsSharePoint()
        {
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();
            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);
            string guid = Guid.NewGuid().ToString();
            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;
            Session[guid + "_User"] = user;
            Session[guid + "_CustomerNumber"] = this.Request.QueryString["customerNumber"];
            System.Web.HttpContext.Current.Request.Headers["SessionId"] = guid;

            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.HasTransactionPermission = false;
            sessionProperties.SourceType = 2;
            sessionProperties.UserName = authorizedUser.userName;
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.LeasingOperDay = XBService.GetLeasingOperDay();
            sessionProperties.LeasingNumber = ACBAOperationService.GetLeasingNumber(Convert.ToString(this.Request.QueryString["customerNumber"]));

            Session[guid + "_LeasingCustomerNumber"] = sessionProperties.LeasingNumber;
            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            TempData["user"] = user;
            TempData["customerNumber"] = this.Request.QueryString["customerNumber"];

            return RedirectToAction("LeasingAllProducts", "Login");

        }

        public ActionResult LeasingAllProducts()
        {
            TempData.Keep();
            return PartialView("LeasingAllProductsSharePoint");
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult RedirectBackToLeasingCustomersList()//Redirecting to Customers search
        {
            string guid = Utility.GetSessionId();
            string authorizedUserSessionToken = " ";
            if (Session[guid + "_authorizedUserSessionToken"] != null)
                authorizedUserSessionToken = Session[guid + "_authorizedUserSessionToken"].ToString();

            ulong customerNumber = 0;
            customerNumber = XBService.GetAuthorizedCustomerNumber();


            if (customerNumber == 0 && Session[guid + "_CustomerNumber"] != null)
            {
                customerNumber = Convert.ToUInt64(Session[guid + "_CustomerNumber"]);
            }


            XBService.SaveExternalBankingLogOutHistory(authorizedUserSessionToken);
            Session[guid + "_AuthorisedCustomerSessionId"] = null;


            bool isDevVersion = false;
            isDevVersion = bool.Parse(ConfigurationManager.AppSettings["ForDevelopment"].ToString());

            if (isDevVersion)
            {
                return Json(new { redirectUrl = "/Login/Testversion" });
            }



            Utility.ClearSession(guid);
            return Json(new { redirectUrl = ConfigurationManager.AppSettings["CustomersURL"] + ConfigurationManager.AppSettings["LeasingCustomersExternalSharePointURL"], customerNumber = customerNumber, authorizedUserSessionToken = authorizedUserSessionToken }, JsonRequestBehavior.AllowGet);
        }

        
        public ActionResult LeasingOutPutReportsSharePoint()
        {
            string guid = Guid.NewGuid().ToString();
            String authorizedUserSessionToken = this.Request.QueryString["authorizedUserSessionToken"];
            xbs.AuthorizedUser authorizedUser = new xbs.AuthorizedUser();
            xbs.User user = new xbs.User();

            initUSerBySessionToken(authorizedUserSessionToken, ref authorizedUser, ref user);


            Session[guid + "_authorizedUserSessionToken"] = authorizedUserSessionToken;
            Session[guid + "_AuthorizedUser"] = authorizedUser;

            Session[guid + "_User"] = user;
            SessionProperties sessionProperties = new SessionProperties();
            sessionProperties.OperDay = XBService.GetCurrentOperDay();
            sessionProperties.UserId = Convert.ToUInt32(user.userID);
            sessionProperties.IsChiefAcc = user.IsChiefAcc;
            sessionProperties.IsManager = user.IsManager;
            sessionProperties.AdvancedOptions = user.AdvancedOptions;
            sessionProperties.NonCheckFilialATSAccount = true;
            sessionProperties.LeasingOperDay = XBService.GetLeasingOperDay();
            Session[guid + "_SessionProperties"] = sessionProperties;

            Session[guid + "_SessionProperties"] = sessionProperties;

            TempData["sessionId"] = guid;
            return RedirectToAction("LeasingOutPutReports", "Login");
        }

        public ActionResult LeasingOutPutReports()
        {
            TempData.Keep();
            ViewBag.redirecturl = "/LeasingOutPutReports/Index";
            return PartialView("RedirectDirection");
        }
    }
}

