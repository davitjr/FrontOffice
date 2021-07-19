using System;
using System.Collections.Generic;
using System.Web;
using System.Data;

namespace FrontOffice
{
    public static class CacheHelper
    {

        public static Dictionary<string,string> GetDictionary(string key)
        {
            return (Dictionary<string, string>)HttpRuntime.Cache[key];
        }
     
        public static DataTable Get(string key)
        {
            return (DataTable)HttpRuntime.Cache[key];
        }

        public static List<KeyValuePair<string,string>> GetObjectList(string key)
        {

            return (List<KeyValuePair<string, string>>)HttpRuntime.Cache[key];
        }

        public static T Get<T>(string key)
        {
            return (T)HttpRuntime.Cache[key];
        }

        public static void Add(DataTable value, string key)
        {
            HttpRuntime.Cache.Insert(key, value, null, DateTime.Now.AddMinutes(480), System.Web.Caching.Cache.NoSlidingExpiration);
        }

        public static void Add<T>(T value, string key)
        {
            HttpRuntime.Cache.Insert(key, value, null, DateTime.Now.AddMinutes(480), System.Web.Caching.Cache.NoSlidingExpiration);
        }

        public static void AddForSTAK<T>(T value, string key)
        {
            HttpRuntime.Cache.Insert(key, value, null, DateTime.Now.AddMinutes(180), System.Web.Caching.Cache.NoSlidingExpiration);
        }
    }
}