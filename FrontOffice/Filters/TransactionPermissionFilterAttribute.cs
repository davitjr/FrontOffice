using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FrontOffice
{
    public class TransactionPermissionFilterAttribute : ActionFilterAttribute
    {
        public bool OnlyFrontOffice { get; set; }
        
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            string guid = Utility.GetSessionId();
            SessionProperties sessionProperties = ((SessionProperties)System.Web.HttpContext.Current.Session[guid+ "_SessionProperties"]);

            bool hasPermission = false;

            if (sessionProperties.SourceType == 6 || sessionProperties.SourceType == 2)
            {
                if (sessionProperties.SourceType == 6 && OnlyFrontOffice)
                {
                    hasPermission = false;
                }
                else
                {
                    hasPermission = true;
                }
            }
            else
            {
                hasPermission = false;
            }


            if (!hasPermission)
            {
                if (context.HttpContext.Request.IsAjaxRequest())
                {
                    var urlHelper = new UrlHelper(context.RequestContext);
                    context.HttpContext.Response.StatusCode = 421;
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

                    context.HttpContext.Response.StatusCode = 421;
                    context.Result = new ViewResult
                    {
                        ViewName = "~/Views/Shared/SessionExpired.cshtml"
                    };
                }
            }
        }
    }
}