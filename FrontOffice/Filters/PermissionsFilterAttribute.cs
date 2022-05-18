using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Configuration;
using xbs = FrontOffice.XBS;
using FrontOffice.Models;
using xbsInfo = FrontOffice.XBSInfo;
using System.Data;
using FrontOffice.Service;
using Newtonsoft.Json;
using System.Web.Script.Serialization;
using Newtonsoft.Json.Linq;

namespace FrontOffice
{
    #region Enumerations

    /// <summary>
    /// ActionType-ի որոշելու եղանակներ
    /// </summary>
    public enum ActionTypeInitReason { Undefined, InitFromOrder }

    /// <summary>
    /// Class-ի տեսակներ, որոնցից որոշվում է ActionType-ը
    /// </summary>
    public enum ParamClassType { Order }

    /// <summary>
    /// Վերադարձվող հաշիվների տեսակը (հաշիվների ցուցակ, մեկ հաշիվ)
    /// </summary>
    public enum AccountContextResultTypes { ListAccount, Account }

    #endregion

    /// <summary>
    /// Հաճախորդին հասանլիության որոշում
    /// </summary>
    public class CustomerAccessFilter : ActionFilterAttribute
    {

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            //if (!testutil.isTestUsers()) return;

            string guid = Utility.GetSessionId();
            if (context.HttpContext.Session[guid + "_CustomerNumber"].ToString() == "0")
                return;

            bool resultFlag = false;

            xbs.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

            string authUserSessionTokenId = "", authCustomerSessionId = "";
            XBS.UserAccessForCustomer userAccessForCustomer = new XBS.UserAccessForCustomer();

            if (HttpContext.Current.Session[guid + "_authorizedUserSessionToken"] != null)
                authUserSessionTokenId = HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

            if (HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"] != null)
                authCustomerSessionId = HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"].ToString();

            if (HttpContext.Current.Session[guid + "_userAccessForCustomer"] != null)
                userAccessForCustomer = (XBS.UserAccessForCustomer)HttpContext.Current.Session[guid + "_userAccessForCustomer"];

            if (authUserSessionTokenId != "" && authCustomerSessionId != "" && userAccessForCustomer.IsCustomerAccessible || ((SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"]).SourceType == 6)
                resultFlag = true;

            if (!resultFlag && user.filialCode != 60400)
            {
                var urlHelper = new UrlHelper(context.RequestContext);

                context.Result = new JsonResult
                {
                    Data = new
                    {
                        LogOnUrl = urlHelper.Action("PermissionDeniedDialog", "Home", new { area = "" }, null)
                    },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };

            }
            else
            {
                HttpContext.Current.Session[guid + "_CNumber"] = HttpContext.Current.Session[guid + "_CustomerNumber"];
                context.HttpContext.Session.Remove(guid + "_CustomerNumber");
            }
        }

    }

    /// <summary>
    /// Հաճախորդի պրոդուկտներին հասանելիության որոշում
    /// </summary>
    public class CustomerProductsAccessFilter : ActionFilterAttribute
    {
        public xbs.ProductType productCode { get; set; }

        public override void OnActionExecuting(ActionExecutingContext context)
        {

            //bool disabled = context.ActionDescriptor.IsDefined(typeof(IgnoreCustomerProductsAccessFilter), true) ||
            //            context.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(IgnoreCustomerProductsAccessFilter), true);
            //if (disabled)
            //    return;

            //bool resultFlag = false;

            //string authUserSessionTokenId = "", authCustomerSessionId = "";            
            //XBS.UserAccessForCustomer userAccessForCustomer = new XBS.UserAccessForCustomer();

            //if (HttpContext.Current.Session["authorizedUserSessionToken"] != null)
            //    authUserSessionTokenId = HttpContext.Current.Session["authorizedUserSessionToken"].ToString();

            //if (HttpContext.Current.Session["AuthorisedCustomerSessionId"] != null)
            //    authCustomerSessionId = HttpContext.Current.Session["AuthorisedCustomerSessionId"].ToString();

            //if (HttpContext.Current.Session["userAccessForCustomer"] != null)
            //    userAccessForCustomer = (XBS.UserAccessForCustomer)HttpContext.Current.Session["userAccessForCustomer"];

            //if (authUserSessionTokenId != "" && authCustomerSessionId != "" && userAccessForCustomer.IsCustomerAccessible)
            //{
            //        if (userAccessForCustomer.ListOfAccessibleProducts.Exists(i => i.ProductTypeID == (Int16)productCode))
            //             resultFlag = true;

            //}

            ////Կբացենք երբ սկսենք կիրառել
            ////if (!resultFlag)
            ////context.Result = new RedirectResult("~/Login/ProductPermissionDenied");

        }

    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public sealed class IgnoreCustomerProductsAccessFilter : Attribute { }

    /// <summary>
    /// Գործողությունների հասանելիություն
    /// </summary>
    public class ActionAccessFilter : ActionFilterAttribute
    {
        public ActionType actionType { get; set; }
        public ActionTypeInitReason actionTypeInitReason { get; set; }

        public String paramName { get; set; }
        public ParamClassType paramClassType { get; set; }
        public List<xbsInfo.ActionPermission> actionPermissionTypes { get; set; }

        public ActionAccessFilter()
        {
            actionTypeInitReason = ActionTypeInitReason.Undefined;
        }

        /// <summary>
        /// Որոշվում է ActionType-ը
        /// </summary>
        /// <param name="context"></param>
        private bool InitActionType(ActionExecutingContext context)
        {
            return true;
            if (actionType != ActionType.Undefined)
                return true;

            if (actionTypeInitReason == ActionTypeInitReason.InitFromOrder)
            {
                if (paramClassType == ParamClassType.Order)
                {
                    if (context.ActionParameters[paramName] == null)
                        return false;
                    xbs.Order ord = (xbs.Order)context.ActionParameters[paramName];

                    actionPermissionTypes = InfoService.GetActionPermissionTypes();
                    xbsInfo.ActionPermission actPermType = actionPermissionTypes.Find(t => (int)t.OrderType == (int)ord.Type & t.OrderSubType == ord.SubType);

                    if (actPermType != null)
                        actionType = (ActionType)actPermType.ActionID;

                }
                return true;
            }

            return false;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            //if (!testutil.isTestUsers()) return;

            bool resultFlag = false;
            resultFlag = true;
            if (InitActionType(context))
            {
                string guid = Utility.GetSessionId();
                string authUserSessionTokenId = "", authCustomerSessionId = "";
                XBS.UserAccessForCustomer userAccessForCustomer = new XBS.UserAccessForCustomer();

                if (HttpContext.Current.Session[guid + "_authorizedUserSessionToken"] != null)
                    authUserSessionTokenId = HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

                if (HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"] != null)
                    authCustomerSessionId = HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"].ToString();

                if (HttpContext.Current.Session[guid + "_userAccessForCustomer"] != null)
                    userAccessForCustomer = (XBS.UserAccessForCustomer)HttpContext.Current.Session[guid + "_userAccessForCustomer"];

                if (authUserSessionTokenId != "" && authCustomerSessionId != "" && userAccessForCustomer.IsCustomerAccessible)
                {
                    if (userAccessForCustomer.ListOfAccessibleActions.Exists(i => i.ActionID == (Int32)actionType))
                        resultFlag = true;
                }
            }

            if (!resultFlag)
            {
                if (context.HttpContext.Request.IsAjaxRequest())
                {
                    var urlHelper = new UrlHelper(context.RequestContext);
                    context.HttpContext.Response.StatusCode = 423;
                    context.Result = new JsonResult
                    {
                        Data = new
                        {
                            Error = "NotAuthorized",
                            LogOnUrl = urlHelper.Action("SessionExpireDialog", "Home", new { area = "" }, null)
                        },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }
                else
                {
                    context.HttpContext.Response.StatusCode = 423;
                    context.Result = new ViewResult//();
                    {
                        ViewName = "~/Views/Shared/PermissionDenied.cshtml"
                    };
                }

            }
            //actionType = ActionType.Undefined;
        }

        public override void OnResultExecuted(ResultExecutedContext context)
        {
            if (actionTypeInitReason == ActionTypeInitReason.InitFromOrder)
                actionType = ActionType.Undefined;
        }

        ///// <summary>
        ///// Հասանելիություն տվյալ գործողության
        ///// </summary>
        ///// <param name="actionType"></param>
        ///// <returns></returns>
        public static bool isAccessibleToAction(int actionType)
        {
            XBS.UserAccessForCustomer userAccessForCustomer = new XBS.UserAccessForCustomer();
            string guid = Utility.GetSessionId();

            userAccessForCustomer = (XBS.UserAccessForCustomer)HttpContext.Current.Session[guid + "_userAccessForCustomer"];

            if (userAccessForCustomer.ListOfAccessibleActions.Exists(i => i.ActionID == (Int32)actionType))
                return true;
            else
                return false;
        }
    }

    /// <summary>
    /// Հաճախորդի հաշիվների հասանելության որոշում
    /// </summary>
    //public class CustomerAccountsAccessFilter : ActionFilterAttribute
    //{
    //    public AccountContextResultTypes accountContextResultType { get; set; }

    //    public override void OnActionExecuted(ActionExecutedContext context)
    //    { 

    //        string authUserSessionTokenId = "", authCustomerSessionId = "";
    //        XBS.UserAccessForCustomer userAccessForCustomer = new XBS.UserAccessForCustomer();

    //        string guid = Utility.GetSessionId();
    //        if (HttpContext.Current.Session[guid + "_authorizedUserSessionToken"] != null)
    //            authUserSessionTokenId = HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();

    //        if (HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"] != null)
    //            authCustomerSessionId = HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"].ToString();

    //        if (HttpContext.Current.Session[guid + "_userAccessForCustomer"] != null)
    //            userAccessForCustomer = (XBS.UserAccessForCustomer)HttpContext.Current.Session[guid + "_userAccessForCustomer"];

    //        if (authUserSessionTokenId != "" && authCustomerSessionId != "" && userAccessForCustomer.IsCustomerAccessible)
    //        {

    //            string jsonOBJ = new JavaScriptSerializer().Serialize(context.Result);
    //            if (accountContextResultType == AccountContextResultTypes.ListAccount)
    //            { 
    //                List<xbs.Account> accounts = JsonConvert.DeserializeObject<List<xbs.Account>>(JObject.Parse(jsonOBJ)["Data"].ToString());
    //                foreach (xbs.Account account in accounts)
    //                {
    //                    if (userAccessForCustomer.ListOfAccessibleAccountsGroups.Exists(i => i.AccountGroup.ToString() == account.AccountPermissionGroup)) 
    //                        account.isAccessible = true; 
    //                    else
    //                        account.isAccessible = false;
    //                }

    //                var jsonResult = new JsonResult();
    //                jsonResult.Data = accounts;

    //                context.Result = jsonResult;
    //            }
    //            else if (accountContextResultType == AccountContextResultTypes.Account)
    //            {
    //                xbs.Account account = JsonConvert.DeserializeObject<xbs.Account>(JObject.Parse(jsonOBJ)["Data"].ToString());

    //                    if (userAccessForCustomer.ListOfAccessibleAccountsGroups.Exists(i => i.AccountGroup.ToString() == account.AccountPermissionGroup)) 
    //                        account.isAccessible = true; 
    //                    else
    //                        account.isAccessible = false;

    //                var jsonResult = new JsonResult();
    //                jsonResult.Data = account;

    //                context.Result = jsonResult;
    //            }
    //        }

    //    }
    //}
    //public static class testutil {
    //public static bool isTestUsers()
    //{
    //    xbs.User user = (xbs.User)HttpContext.Current.Session["User"];
    //    if (user.userName.ToLower() == "vahe" || user.userName.ToLower() == "hovik22002")
    //        return true;
    //    else
    //        return false;
    //}
    //}


    public class ProductDetailsAccesibleFilter : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            bool resultFlag = false;
            string guid = Utility.GetSessionId();
            XBS.UserAccessForCustomer userAccessForCustomer = new XBS.UserAccessForCustomer();

            if (HttpContext.Current.Session[guid + "_userAccessForCustomer"] != null)
            {
                userAccessForCustomer = (XBS.UserAccessForCustomer)HttpContext.Current.Session[guid + "_userAccessForCustomer"];
                if (userAccessForCustomer.ListOfAccessibleAccountsGroups.Exists(i => i.AccountGroup.ToString() == filterContext.Controller.ViewData["accountGroup"].ToString()))
                    resultFlag = true;
                else
                    resultFlag = false;
            }

            if (!resultFlag)
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    var urlHelper = new UrlHelper(filterContext.RequestContext);
                    filterContext.HttpContext.Response.StatusCode = 423;
                    filterContext.Result = new JsonResult
                    {
                        Data = new
                        {
                            Error = "NotAuthorized",
                            LogOnUrl = urlHelper.Action("SessionExpireDialog", "Home", new { area = "" }, null)
                        },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }
                else
                {
                    filterContext.HttpContext.Response.StatusCode = 423;
                    filterContext.Result = new ViewResult
                    {
                        ViewName = "~/Views/Shared/PermissionDenied.cshtml"
                    };
                }

            }
        }
    }

}