using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;

namespace FrontOffice.Service
{
    internal static class ProxyManager<IType>
    {
        internal static ConcurrentDictionary<string, ChannelFactory<IType>> proxies = new ConcurrentDictionary<string, ChannelFactory<IType>>();
     
        internal static IType GetProxy(string key)
        {
            return proxies.GetOrAdd(key, m => new ChannelFactory<IType>("*")).CreateChannel();
        }
     
       internal static bool RemoveProxy(string key)
       {
           ChannelFactory<IType> proxy;
           return proxies.TryRemove(key, out proxy);
       }
   }
}