using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.DirectoryServices;
using System.IO;
using System.Drawing;
using FrontOffice.XBS;
using FrontOffice.Service;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Net;
using System.Web.Configuration;

namespace FrontOffice
{
    public class Utility
    {
        /// <summary>
        /// ANSI -> Unicode փոփոխություն
        /// </summary>
        /// <param name="str">Փոփոխման ենթակա տողը</param>
        /// <returns></returns>
        public static string ConvertAnsiToUnicode(string str)
        {

            string result = "";
            if (str == null)
            {
                return result;
            }

            for (int i = 0; i <= str.Length - 1; i++)
            {
                int charCode = (int)str[i];
                char uChar;
                if (charCode >= 178 && charCode <= 253)
                {
                    if (charCode % 2 == 0)
                    {
                        uChar = (char)((charCode - 178) / 2 + 1329);
                    }
                    else
                    {
                        uChar = (char)((charCode - 179) / 2 + 1377);
                    }
                }
                else
                {
                    if (charCode >= 32 && charCode <= 126)
                    {
                        uChar = str[i];
                    }
                    else
                    {
                        switch (charCode)
                        {
                            case 162:
                                uChar = (char)1415;
                                break;
                            case 168:
                                uChar = (char)1415;
                                break;
                            case 176:
                                uChar = (char)1371;
                                break;
                            case 175:
                                uChar = (char)1372;
                                break;
                            case 177:
                                uChar = (char)1374;
                                break;
                            case 170:
                                uChar = (char)1373;
                                break;
                            case 173:
                                uChar = '-';
                                break;
                            case 163:
                                uChar = (char)1417;
                                break;
                            case 169:
                                uChar = '.';
                                break;
                            case 166:
                                uChar = '»';
                                break;
                            case 167:
                                uChar = '«';
                                break;
                            case 164:
                                uChar = ')';
                                break;
                            case 165:
                                uChar = '(';
                                break;
                            case 46:
                                uChar = '.';
                                break;
                            default:
                                uChar = str[i];
                                break;
                        }
                    }
                }
                result += uChar;
            }
            return result;
        }
        /// <summary>
        /// Unicode->ANSI փոփոխություն
        /// </summary>
        /// <param name="str">Փոփոխման ենթակա տողը</param>
        /// <returns></returns>
        public static string ConvertUnicodeToAnsi(string str)
        {
            string result = "";
            if (str == null)
            {
                return result;
            }

            foreach (char c in str)
            {
                int charCode = (int)c;
                char asciiChar;
                if (charCode >= 1329 && charCode <= 1329 + 37)
                {
                    asciiChar = (char)((charCode - 1240) * 2);
                }
                else if (charCode >= 1329 + 48 && charCode <= 1329 + 48 + 37)
                {
                    asciiChar = (char)((charCode - 1288) * 2 + 1);
                }
                else if (char.IsNumber(c))
                {
                    asciiChar = c;
                }
                else if (charCode == 1415) // և
                {
                    asciiChar = (char)168;
                }
                else if (charCode == 1371) // Շեշտ
                {
                    asciiChar = (char)176;
                }
                else if (charCode == 1372) // Բացականչական
                {
                    asciiChar = (char)175;
                }
                else if (charCode == 1374) // Հարցական
                {
                    asciiChar = (char)177;
                }
                else if (charCode == 1373) // Բութ
                {
                    asciiChar = (char)170;
                }
                else if (charCode == 58) // Վերջակետ
                {
                    asciiChar = (char)163;
                }
                else if (charCode == 32) // Բացատ
                {
                    asciiChar = (char)32;
                }
                else if (c == ')')
                {
                    asciiChar = (char)164;
                }
                else if (c == '(')
                {
                    asciiChar = (char)165;
                }
                else
                {
                    asciiChar = c;
                }

                result += asciiChar;
            }

            return result;
        }

        public static double RoundAmount(double amount, string currency)
        {

            if (currency == "AMD")
            {
                amount = Math.Round(amount, 1);
            }
            else
            {
                amount = Math.Round(amount, 2);
            }

            return amount;
        }
        public static byte[] GetUserPicture(string userName)
        {
            byte[] result = null;
            using (DirectoryEntry directory = new DirectoryEntry(string.Format("LDAP://acbaca.local")))
            {
                using (DirectorySearcher searcher = new DirectorySearcher(directory))
                {
                    searcher.Filter = @"(SAMAccountName=" + userName + ")";
                    SearchResult searchResult = searcher.FindOne();
                    if (searchResult != null)
                    {
                        using (DirectoryEntry user = new DirectoryEntry(searchResult.Path))
                        {
                            if (user != null)
                            {
                                if (user.Properties["thumbnailPhoto"].Value != null)
                                {
                                    result = (byte[])user.Properties["thumbnailPhoto"].Value;
                                }
                            }
                        }
                    }
                }
                    
            }
            return result;
        }

        public static string GetSessionId()
        {
            string guid = "";

            if (HttpContext.Current.Request.Headers["SessionId"] != null)
            {
                guid = HttpContext.Current.Request.Headers["SessionId"].ToString();
            }

            return guid;
        }


        /// <summary>
        /// Թարմացնում է օգտագործողի հասանելիությունները տվյալ հաճախորդի մասով
        /// </summary>
        public static void RefreshUserAccessForCustomer()
        {
                try
                {
                    string guid = Utility.GetSessionId();
                    UserAccessForCustomer userAccessForCustomer = (UserAccessForCustomer)(System.Web.HttpContext.Current.Session[guid + "_userAccessForCustomer"]);
                    if (userAccessForCustomer?.ListOfAccessibleAccountsGroups?.Count == 0)
                    {
                        userAccessForCustomer = new UserAccessForCustomer();
                        userAccessForCustomer = XBService.GetUserAccessForCustomer(System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString(), System.Web.HttpContext.Current.Session[guid + "_AuthorisedCustomerSessionId"].ToString());
                        System.Web.HttpContext.Current.Session[guid + "_userAccessForCustomer"] = userAccessForCustomer;
                    }
                }
                catch
                {

                }
        }

        public static void ClearSession(string guid)
        {
            if (!string.IsNullOrEmpty(guid))
            {

                int count = System.Web.HttpContext.Current.Session.Keys.Count;
                List<string> sessionKeys = new List<string>();


                for (int i = 0; i < count; i++)
                {
                    if (System.Web.HttpContext.Current.Session.Keys[i].Contains(guid))
                    {
                        sessionKeys.Add(System.Web.HttpContext.Current.Session.Keys[i]);
                    }
                }
                foreach (string sessionKey in sessionKeys)
                {
                    System.Web.HttpContext.Current.Session.Remove(sessionKey);
                }
            }
            else
            {
                int count = System.Web.HttpContext.Current.Session.Keys.Count;
                List<string> sessionKeys = new List<string>();


                for (int i = 0; i < count; i++)
                {
                    if (System.Web.HttpContext.Current.Session.Keys[i].ToString()[0].ToString()=="_")
                    {
                        sessionKeys.Add(System.Web.HttpContext.Current.Session.Keys[i]);
                    }
                }
                foreach (string sessionKey in sessionKeys)
                {
                    System.Web.HttpContext.Current.Session.Remove(sessionKey);
                }
            }

        }


        public static string  GetDateMonthArm(DateTime date)
        {
            string monthString = "";
            switch (date.Month)
            {
                case 1: {  monthString = "հունվար"; break; }
                case 2: {  monthString = "փետրվար"; break; }
                case 3: {  monthString = "մարտ"; break; }
                case 4: {  monthString = "ապրիլ"; break; }
                case 5: {  monthString = "մայիս"; break; }
                case 6: {  monthString = "հունիս"; break; }
                case 7: {  monthString = "հուլիս"; break; }
                case 8: {  monthString = "օգոստոս"; break; }
                case 9: {  monthString = "սեպտեմբեր"; break; }
                case 10: {  monthString = "հոկտեմբեր"; break; }
                case 11: {  monthString = "նոյեմբեր"; break; }
                case 12: {  monthString = "դեկտեմբեր"; break; }
                default: { break; };
            }

            return monthString;
        }

        internal static void SetAuthorizationHeaders()
        {
            try
            {
                string guid = Utility.GetSessionId();

                MessageHeader<string> headerUserSessionToken = new MessageHeader<string>(System.Web.HttpContext.Current.Session[guid + "_authorizedUserSessionToken"].ToString());
                MessageHeader untypedHeaderUserSessionToken = headerUserSessionToken.GetUntypedHeader("myAuthorizedUserSessionToken", "InfSecServiceOperationNamespace");
                MessageHeader<string> headerIP = new MessageHeader<string>(HttpContext.Current.Request["REMOTE_ADDR"]);
                MessageHeader untypedHeaderIP = headerIP.GetUntypedHeader("remoteAddr", "InfSecServiceOperationNamespace");
                OperationContext.Current.OutgoingMessageHeaders.Add(untypedHeaderUserSessionToken);
                OperationContext.Current.OutgoingMessageHeaders.Add(untypedHeaderIP);
            }

            catch
            {
                MessageHeader<string> headerUserSessionToken = new MessageHeader<string>("WithoutUserSessionToken");
                MessageHeader untypedHeaderUserSessionToken = headerUserSessionToken.GetUntypedHeader("myAuthorizedUserSessionToken", "InfSecServiceOperationNamespace");
                MessageHeader<string> headerIP = new MessageHeader<string>(HttpContext.Current.Request["REMOTE_ADDR"]);
                MessageHeader untypedHeaderIP = headerIP.GetUntypedHeader("remoteAddr", "InfSecServiceOperationNamespace");
                OperationContext.Current.OutgoingMessageHeaders.Add(untypedHeaderUserSessionToken);
                OperationContext.Current.OutgoingMessageHeaders.Add(untypedHeaderIP);
            }
        }

        internal static string DoPostRequestJson(string jsonObject, string url, string baseAddressName, List<KeyValuePair<string, string>> paramList = null)
        {

            string json = "";
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(WebConfigurationManager.AppSettings[baseAddressName].ToString() + url);

            request.Method = "POST";
            request.ContentType = "application/json; charset=UTF-8";

            request.Headers.Add("SessionId", "ba0f312d-8487-445e-aee2-d5877ac1d4de");
            string language = paramList?.Find(m => m.Key == "language").Value;
            if (paramList != null)
            {
                foreach (KeyValuePair<string, string> param in paramList)
                {
                    request.Headers.Add(param.Key, param.Value);
                }
            }

            System.Text.UTF8Encoding encoding = new System.Text.UTF8Encoding();
            byte[] bytes = encoding.GetBytes(jsonObject);

            request.ContentLength = bytes.Length;

            using (Stream requestStream = request.GetRequestStream())
            {
                // Send the data.
                requestStream.Write(bytes, 0, bytes.Length);
            }


            {
                StreamReader reader;
                Stream stream;
                try
                {
                    HttpWebResponse response = request.GetResponse() as HttpWebResponse;
                    stream = response.GetResponseStream();
                }
                catch (WebException ex)
                {
                    stream = ex.Response.GetResponseStream();
                }
                using (reader = new StreamReader(stream))
                {
                    json = reader.ReadToEnd();
                }

            }
            return json;

        }
    }
}