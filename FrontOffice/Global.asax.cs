using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using NLog;
using System.Web.Configuration;
using NLog.Targets;
using NLog.Config;

namespace FrontOffice
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {

            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new RazorViewEngine());

            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

       
        protected void Application_Error()
        {

            Logger _logger = LogManager.GetCurrentClassLogger();
            Exception ex = Server.GetLastError();

            string ipAddress = "";

            System.Web.HttpContext context = System.Web.HttpContext.Current;

            if (context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
            {
                ipAddress = (context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].Split(',').Last().Trim()).Split(':').First().Trim();
            }
            else
            {
                ipAddress = Request.ServerVariables["REMOTE_ADDR"];
            }


            //string ipAddress = HttpContext.Current.Request["REMOTE_ADDR"];


            //string ipAddress = Request.UserHostAddress;
            GlobalDiagnosticsContext.Set("ClientIp", ipAddress);

            bool isTestVersion = bool.Parse(WebConfigurationManager.AppSettings["TestVersion"].ToString());

            if (!isTestVersion)
            {
                GlobalDiagnosticsContext.Set("Logger", "FrontOfficeApplication");
            }
            else
            {
                GlobalDiagnosticsContext.Set("Logger", "FrontOfficeApplication-Test");
            }

            string stackTrace = (ex.StackTrace != null ? ex.StackTrace : " ") + Environment.NewLine + " InnerException StackTrace:" + (ex.InnerException != null ? ex.InnerException.StackTrace : "");
            GlobalDiagnosticsContext.Set("StackTrace", stackTrace);
            GlobalDiagnosticsContext.Set("ExceptionType", ex.GetType().ToString());

            string guid = Utility.GetSessionId();
            XBS.User uAcbaUser = ((XBS.User)Session[guid+ "_User"]);

            if (uAcbaUser != null)
            {
                GlobalDiagnosticsContext.Set("UserName", uAcbaUser.userName);
            }
            else
            {
                GlobalDiagnosticsContext.Set("UserName", "");
            }


            if (ipAddress != null)
                GlobalDiagnosticsContext.Set("ClientIp", ipAddress);
            else
                GlobalDiagnosticsContext.Set("ClientIp", "");

            string message = (ex.Message != null ? ex.Message : " ") + Environment.NewLine + " InnerException:" + (ex.InnerException != null ? ex.InnerException.Message : "");

            string startupPath = AppDomain.CurrentDomain.BaseDirectory;
            startupPath += @"NLog.config";
            LogManager.Configuration = new XmlLoggingConfiguration(startupPath);

            var databaseTarget = (DatabaseTarget)LogManager.Configuration.FindTargetByName("database");
            databaseTarget.ConnectionString = WebConfigurationManager.ConnectionStrings["NLogDb"].ToString();
            LogManager.ReconfigExistingLoggers();

            _logger.Error(message);

        }


    }
}
