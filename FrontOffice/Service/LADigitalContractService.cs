using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;
using FrontOffice.LADigitalContractService;

namespace FrontOffice.Service
{
    public class LADigitalContractService
    {
        public static void Use(Action<ILADigitalContractService> action)
        {
            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

            var requestFactory = new RequestFactory() { CurrentUser = new User() };
            requestFactory.CurrentUser.userID = user.userID;
            requestFactory.CurrentUser.userName = user.userName;

            bool success = false;

            ILADigitalContractService client = ProxyManager<ILADigitalContractService>.GetProxy(nameof(ILADigitalContractService));
            try
            {
                client.InitRequestFactory(requestFactory);
                action(client);
                ((IClientChannel)client).Close();

                success = true;
            }
            catch (FaultException ex)
            {
                ((IClientChannel)client).Close();

                throw;
            }
            catch (TimeoutException e)
            {
                ((IClientChannel)client).Close();

                throw;
            }
            catch (Exception e)
            {
                ((IClientChannel)client).Abort();
                throw;
            }
            finally
            {
                if (!success)
                {
                    ((IClientChannel)client).Abort();

                }
                ((IClientChannel)client).Dispose();
            }
        }

        public static ActionResult SendLoanContract(ulong productId, ulong customerNumber)
        {
            ActionResult actionResult = new ActionResult();
            LADigitalContractService.Use(client =>
            {
                actionResult = client.SendLoanContract(productId, customerNumber);
            });
            return actionResult;
        }

        public static Dictionary<string, string> GetLoanDigitalContractStatus(ulong productId)
        {
            var result = new Dictionary<string, string>();
            LADigitalContractService.Use(client =>
            {
                result = client.GetLoanDigitalContractStatus(productId);
            });
            return result;
        }
    }
}