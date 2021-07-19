using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice
{
    public class SMSAuthorizationFilterAttribute : AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(AuthorizationContext context)
        {
            string guid = Utility.GetSessionId();
            SessionProperties sessionProperties = ((SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"]);

            if (sessionProperties.SourceType == 6 && sessionProperties.HasTransactionPermission == false)
            {
                if (context.HttpContext.Request.IsAjaxRequest())
                {
                    var urlHelper = new UrlHelper(context.RequestContext);
                    context.HttpContext.Response.StatusCode = 420;
                    context.Result = new JsonResult
                    {
                        Data = new
                        {
                            Error = "NotAuthorized",
                            LogOnUrl = urlHelper.Action("SessionExpireDialog", "Login", new { area = "" }, null)
                        },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                }
                else
                {

                    context.HttpContext.Response.StatusCode = 420;
                    context.Result = new ViewResult
                    {
                        ViewName = "~/Views/Shared/SMSAuthorization.cshtml"
                    };
                }
            }

        }
    }
}