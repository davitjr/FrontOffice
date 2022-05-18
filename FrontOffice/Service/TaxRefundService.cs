using FrontOffice.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace FrontOffice.Service
{
    public static class TaxRefundService
    {
        private const string SendRequestUri = "/TaxRefund/SendRequests";

        private static readonly HttpClient httpClient;

        static TaxRefundService()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            httpClient = new HttpClient() { BaseAddress = new Uri(WebConfigurationManager.AppSettings["AcraApiURL"].ToString()) };
        }
        public static async Task<XBS.ActionResult> SendRequests(TaxRefundRequestParameters requestParams)
        {
            var result = new XBS.ActionResult();
            HttpResponseMessage response = await httpClient.PostAsync(SendRequestUri, new StringContent(JsonConvert.SerializeObject(requestParams), Encoding.UTF8, "application/json"));
            var content = await response.Content.ReadAsStringAsync();

            if (JsonConvert.DeserializeObject<bool>(content))
                result.ResultCode = XBS.ResultCode.Normal;
            else
                result.ResultCode = XBS.ResultCode.Failed;

            return result;
        }
    }
}