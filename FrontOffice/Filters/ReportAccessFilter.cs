using System;
using System.Collections.Generic;
using System.Collections;
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
using System.Collections.Specialized;

namespace FrontOffice.Filters
{

    /// <summary>
    /// Հաշվետվությունների հասանելիության որոշում
    /// </summary>
    public class ReportAccessFilter : ActionFilterAttribute
    {
        public string ProgName
        {
            get
            {
                return "FrontOffice";
            }
        }
        public string FormName
        {
            get; set;
        }

        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            xbs.ApplicationClientPermissionsInfo appClientPermInfo = new xbs.ApplicationClientPermissionsInfo();
            appClientPermInfo.formName = FormName;
            appClientPermInfo.progName = ProgName;


            var jsonResult = (JsonResult)filterContext.Result;
            var allResults = (Dictionary<string, string>)jsonResult.Data;

            List<xbs.ApplicationClientPermissions> reports = new List<xbs.ApplicationClientPermissions>();
            reports = XBService.GetPermittedReports(appClientPermInfo);

            Dictionary<string, string> userList = new Dictionary<string, string>();


            foreach (var item in reports)
            {
                if (item.nameOfPermission != null && item.nameOfControl.Equals("0"))
                {
                    userList.Add(item.nameOfPermission.ToString(), (allResults.FirstOrDefault(result => item.nameOfPermission == result.Key).Value));

                }
            }

            jsonResult.Data = userList;

        }

    }

}