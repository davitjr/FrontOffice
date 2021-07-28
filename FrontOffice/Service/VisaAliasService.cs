using FrontOffice.ACBAServiceReference;
using FrontOffice.Models;
using FrontOffice.Models.VisaAliasModels;
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
using System.Web.Mvc;

namespace FrontOffice.Service
{
    public static class VisaAliasService
    {
        private const string CreateRequestUri = "/VisaAlias/CreateVisaAlias";
        private const string UpdateRequestUri = "/VisaAlias/UpdateVisaAlias";
        private const string DeleteRequestUri = "/VisaAlias/DeleteVisaAlias";
        private const string GetRequestUri = "/VisaAlias/GetVisaAlias";
        private const string GetAliasWithCardUri = "/VisaAlias/GetVisaAliasHistoryWithCard";
        private const string ResolveAliasUri = "/VisaAlias/ResolveVisaAlias";


        private static readonly HttpClient httpClient;

        static VisaAliasService()
        {
            httpClient = new HttpClient() { BaseAddress = new Uri(WebConfigurationManager.AppSettings["VisaAliasBaseAddress"].ToString()) };
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        }

        public static async Task<HttpStatusCode> CreateVisaAlias(CreateAliasRequest createAliasRequest)
        {
            ulong customerNumber = XBService.GetAuthorizedCustomerNumber();
            Phone phone = ACBAOperationService.GetCustomerMainMobilePhone(customerNumber)?.phone;
            string phoneNumber = phone?.countryCode + phone?.areaCode + phone?.phoneNumber;
            createAliasRequest.Alias = phoneNumber.Replace("+", "");
            HttpResponseMessage response = await httpClient.PostAsync(CreateRequestUri, new StringContent(JsonConvert.SerializeObject(createAliasRequest), Encoding.UTF8, "application/json"));
            await response.Content.ReadAsStringAsync();
            return response.StatusCode;
        }

        public static async Task<HttpStatusCode> UpdateVisaAlias(UpdateAliasRequest updateAliasRequest)
        {           
            HttpResponseMessage response = await httpClient.PostAsync(UpdateRequestUri, new StringContent(JsonConvert.SerializeObject(updateAliasRequest), Encoding.UTF8, "application/json"));
            await response.Content.ReadAsStringAsync();
            return response.StatusCode;
        }

        public static async Task<HttpStatusCode> DeleteVisaAlias(DeleteAliasRequest deleteAliasRequest)
        {            
            HttpResponseMessage response = await httpClient.PostAsync(DeleteRequestUri, new StringContent(JsonConvert.SerializeObject(deleteAliasRequest), Encoding.UTF8, "application/json"));
            await response.Content.ReadAsStringAsync();
            return response.StatusCode;
        }

        public static async Task<GetAliasResponse> GetVisaAlias(GetAliasRequest getAliasRequest)
        {           
            HttpResponseMessage response = await httpClient.PostAsync(GetRequestUri, new StringContent(JsonConvert.SerializeObject(getAliasRequest), Encoding.UTF8, "application/json"));
            GetAliasResponse getAliasResponse = JsonConvert.DeserializeObject<GetAliasResponse>(await response.Content.ReadAsStringAsync());
            return getAliasResponse;
        }

        public static async Task<ResolveAliasResponse> ResolveVisaAlias(ResolveAliasRequest resolveAliasRequest)
        {
            HttpResponseMessage response = await httpClient.PostAsync(ResolveAliasUri, new StringContent(JsonConvert.SerializeObject(resolveAliasRequest), Encoding.UTF8, "application/json"));
            ResolveAliasResponse resolveAliasResponse = JsonConvert.DeserializeObject<ResolveAliasResponse>(await response.Content.ReadAsStringAsync());
            return resolveAliasResponse;
        }


        public static async Task<VisaAliasHistory> GetVisaAliasHistory(VisaAliasHistoryWithCard visaAliasHistoryWithCard)
        {
            VisaAliasHistory visaAliasHistory = new VisaAliasHistory();
            HttpResponseMessage response = await httpClient.PostAsync(GetAliasWithCardUri, new StringContent(JsonConvert.SerializeObject(visaAliasHistoryWithCard), Encoding.UTF8, "application/json"));
            if (response.StatusCode == HttpStatusCode.OK)
            {
                visaAliasHistory = JsonConvert.DeserializeObject<VisaAliasHistory>(await response.Content.ReadAsStringAsync());
            }
            else
            {
                visaAliasHistory = null;
            }
            return visaAliasHistory;
        }

        public static   VisaAliasHistory GetVisaAliasHistoryDetails(VisaAliasHistoryWithCard visaAliasHistoryWithCard)
        {
            HttpResponseMessage response = httpClient.PostAsync(GetAliasWithCardUri, new StringContent(JsonConvert.SerializeObject(visaAliasHistoryWithCard), Encoding.UTF8, "application/json")).Result;

            VisaAliasHistory visaAliasHistory = JsonConvert.DeserializeObject<VisaAliasHistory>( response.Content.ReadAsStringAsync().Result);

            return visaAliasHistory;
        }

        public static ResolveAliasResponse ResolveVisaAliasDetails(ResolveAliasRequest resolveAliasRequest)
        {
            HttpResponseMessage response = httpClient.PostAsync(ResolveAliasUri, new StringContent(JsonConvert.SerializeObject(resolveAliasRequest), Encoding.UTF8, "application/json")).Result;
            ResolveAliasResponse resolveAliasResponse = JsonConvert.DeserializeObject<ResolveAliasResponse>(response.Content.ReadAsStringAsync().Result);
            return resolveAliasResponse;
        }

    }
}