using FrontOffice.ACBAServiceReference;
using FrontOffice.Models;
using FrontOffice.Models;
using FrontOffice.XBManagement;
using FrontOffice.XBS;
using FrontOffice.XBSInfo;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace FrontOffice.Service
{
    public static class AMXService
    {
        private const string GetListedInstruments = "/AMX/getListedInstrumentsAsync";

        private static readonly HttpClient httpClient;

        static AMXService()
        {
            httpClient = new HttpClient() { BaseAddress = new Uri(WebConfigurationManager.AppSettings["DepositoryApiBaseAddress"].ToString()) };
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

        }
        public static async Task<JArray> GetListedInstrumentsAsync()
        {
            HttpRequestMessage httpRequest = new HttpRequestMessage(HttpMethod.Post, GetListedInstruments);

            HttpResponseMessage response = await httpClient.SendAsync(httpRequest);

            return JsonConvert.DeserializeObject<JArray>(await response.Content.ReadAsStringAsync());
        }

    }
}