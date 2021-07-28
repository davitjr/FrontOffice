using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Configuration;
using xbs = FrontOffice.XBS;
using FrontOffice.Models;
using xbsInfo = FrontOffice.XBSInfo;
using System.Data;
using FrontOffice.Service;
using Newtonsoft.Json;
using System.Web.Script.Serialization;
using Newtonsoft.Json.Linq;
using ActionLogger;
using FrontOffice.Controllers;
using System.Web.Mvc;
using System.Web;

namespace FrontOffice 
{
    /// <summary>
    /// FrontOffice համակարգում գործողությունների լոգավորում
    /// </summary>
    public class FrontLoggingFilterAttribute : LoggingFilterAttribute
    {
        /// <summary>
        /// Գործողության տեսակ
        /// </summary>
        public int ActionType { get; set; }
        /// <summary>
        /// Գործողության մանրամասն տվյալ
        /// </summary>
        public string ActionDetails { get; set; }
        /// <summary>
        /// Լրացուցիչ տեղեկատվություն
        /// </summary>
        public string AdditionalInfo { get; set; }
        /// <summary>
        /// Հարցման TempData-ի օգտագործման նշում
        /// </summary>
        public bool UseTempDataForInit { get; set; }
        /// <summary>
        /// TempData-ում GUID պարունակող փոփոխականի անունը
        /// </summary>
        public string GuidTempDataName { get; set; }
        /// <summary>
        /// TempData-ում օգտագործողի անունը պարունակող փոփոխականի անունը
        /// </summary>
        public string UserTempDataName { get; set; }
        /// <summary>
        /// TempData-ում հաճախորդի համարը պարունակող փոփոխականի անունը
        /// </summary>
        public string CustomerNumberTempDataName { get; set; }

        /// <summary>
        /// Ծրագրի անվանման սկզբնական արժեքավորում
        /// </summary>
        public override void SetApplicationName()
        {
            ApplicationName = "FrontOffice";
        }

        /// <summary>
        /// Հասանելիության սահմանափակումը նկարագրող StatusCode-ի արժեքավորում
        /// </summary>
        public override void SetNotPermitedStatusCode()
        {
            NotPermitedStatusCode = 423;
        }

        /// <summary>
        /// Լոգավորվող գործողության արժեքավորում
        /// </summary>
        /// <param name="filterContext"></param>
        public override void InitActionLogger(ActionExecutingContext filterContext)
        {
            InitAction(filterContext);
            InitCustomerNumber(filterContext);
            InitUser(filterContext);
        }

        /// <summary>
        /// ActionLogger օբյեկտի արժեքավորում
        /// </summary>
        /// <param name="filterContext"></param>
        private void InitAction(ActionExecutingContext filterContext)
        {
            action.ActionType = (int)ActionType;
            action.ActionDetails = ActionDetails;
            action.AdditionalInfo = AdditionalInfo;
            action.MethodName = filterContext.Controller.GetType().FullName + "-" + filterContext.ActionDescriptor.ActionName;
            foreach (KeyValuePair<string, object> p in filterContext.ActionParameters.ToArray())
            {
                action.MethodParameters = action.MethodParameters + p.Key.ToString() + "=" + GetParamValue(p) + ",";
            }
        }

        /// <summary>
        /// Օգտագործողի արժեքավորում
        /// </summary>
        /// <param name="filterContext"></param>
        private void InitUser(ActionExecutingContext filterContext)
        {
            string guid;
            if (UseTempDataForInit)
            {
                if (!String.IsNullOrEmpty(GuidTempDataName))
                {
                    guid = filterContext.Controller.TempData[GuidTempDataName].ToString();
                }
                if (!String.IsNullOrEmpty(GuidTempDataName))
                {
                    xbs.User user = (xbs.User)filterContext.Controller.TempData[UserTempDataName];
                    action.UserID = user.userID;
                }
            }
            else
            {
                guid = Utility.GetSessionId();

                if (HttpContext.Current.Session[guid + "_User"] != null)
                {
                    xbs.User user = (xbs.User)HttpContext.Current.Session[guid + "_User"];
                    action.UserID = user.userID;
                }
            }

        }

        /// <summary>
        /// Հաճախորդի համարի արժեքավորում
        /// </summary>
        /// <param name="filterContext"></param>
        private void InitCustomerNumber(ActionExecutingContext filterContext)
        {
            if (UseTempDataForInit)
            {
                if (!String.IsNullOrEmpty(CustomerNumberTempDataName))
                {
                    action.CustomerNumber = filterContext.Controller.TempData[CustomerNumberTempDataName].ToString();
                }
            }
            else
            {
                string guid = Utility.GetSessionId();

                if (HttpContext.Current.Session[guid + "_CustomerNumber"] != null)
                {
                    action.CustomerNumber = HttpContext.Current.Session[guid + "_CustomerNumber"].ToString();
                }
                else if (HttpContext.Current.Session[guid + "_CNumber"] != null)
                {
                    action.CustomerNumber = HttpContext.Current.Session[guid + "_CNumber"].ToString();
                }

            }

        }

        /// <summary>
        /// Պարամետրի արժեքների ստացում
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        private string GetParamValue(KeyValuePair<string, object> param)
        {
            if (DateTime.TryParse(param.Value.ToString(), out DateTime result))
            {
                return result.ToString("dd/MMM/yy");
            }

            if (param.Value.GetType().FullName == typeof(FrontOffice.XBS.Card).FullName.ToString())
            {
                Convert.ChangeType(param.Value, typeof(FrontOffice.XBS.Card));
                return GetPropValue(param.Value, "CardNumber").ToString();
            }
            else
                return param.Value.ToString();
        }


        public static object GetPropValue(object src, string propName)
        {
            System.Reflection.PropertyInfo[] properties = src.GetType().GetProperties();
            System.Reflection.PropertyInfo property = properties.FirstOrDefault(item => item.Name == propName);
            if (property != null)
            {
                return src.GetType().GetProperty(propName).GetValue(src, null);
            }
            else
            {
                return null;
            };
        }

    }



}