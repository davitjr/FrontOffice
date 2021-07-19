
using System.Web.Mvc;
using System.Web.Configuration;
using FrontOffice.Service;

namespace FrontOffice
{
    public class SessionExpireFilterAttribute : AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(AuthorizationContext context)
        {

            bool isDevVersion = false;
            isDevVersion = bool.Parse(WebConfigurationManager.AppSettings["ForDevelopment"].ToString());

            string guid = "";


            if (context.HttpContext.Request.Headers["SessionId"] != null)
            {
                guid = context.HttpContext.Request.Headers["SessionId"].ToString();
            }

            XBS.User uAcbaUser = ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]);



            if (!isDevVersion)
            {
                bool isAuthorized = true;

                if ((uAcbaUser == null || uAcbaUser.userID == 0))
                {
                    isAuthorized = false;
                }
                else
                {
                    string authorizedUserSessionToken = System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString();
                    isAuthorized = XBService.AuthorizeUserBySessionToken(authorizedUserSessionToken);
                }


                if (!isAuthorized)
                {
                    if (context.HttpContext.Request.IsAjaxRequest())
                    {
                        var urlHelper = new UrlHelper(context.RequestContext);
                        context.HttpContext.Response.StatusCode = 419;
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

                        context.HttpContext.Response.StatusCode = 419;
                        context.Result = new ViewResult
                        {
                            ViewName = "~/Views/Shared/SessionExpired.cshtml"
                        };
                    }
                }
            }
            else if (isDevVersion && (uAcbaUser == null || uAcbaUser.userID == 0))
            {
                context.HttpContext.Response.StatusCode = 419;
                context.Result = new ViewResult
                {
                    ViewName = "~/Views/TestLogin/TestLogin.cshtml"
                };
            }
        }
    }



}