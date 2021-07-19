using FrontOffice.ACBAServiceReference;
using FrontOffice.SMSMessagingService;
using FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web; 

namespace FrontOffice.Service
{
    public class SMSMessagingService
    {
        public static ActionResult SaveMessagingSession(SMSMessagingSession messagingSession)
        {
            ActionResult result = new ActionResult();
            result.Errors = new List<ActionError>();
            result.ResultCode = ResultCode.Normal;
            try
            {
                SMSMessagingService.Use(client =>
                {
                    client.SaveMessagingSession(messagingSession);
                });
            }
            catch (Exception ex)
            {
                result.ResultCode = ResultCode.Failed;
                result.Errors.Add(new ActionError() { Description = ex.Message });
            }

            return result;
        }

        public static ActionResult ChangeSMSMessagingSessionStatus(uint id, byte newStatus)
        {
            ActionResult result = new ActionResult();
            result.Errors = new List<ActionError>();
            result.ResultCode = ResultCode.Normal;
            try
            {
                SMSMessagingService.Use(client =>
                {
                    client.ChangeSMSMessagingSessionStatus(id, newStatus);
                });
            }
            catch (Exception)
            {
                result.ResultCode = ResultCode.Failed;
            }

            return result;
        }

        public static ActionResult DeleteMessagingSession(uint id)
        {
            ActionResult result = new ActionResult();
            result.Errors = new List<ActionError>();
            result.ResultCode = ResultCode.Normal;
            try
            {
                SMSMessagingService.Use(client =>
                {
                    client.DeleteMessagingSession(id);
                });
            }
            catch (Exception)
            {
                result.ResultCode = ResultCode.Failed;
            }

            return result;
        }
        public static List<SMSMessagingSession> GetSMSMessagingSessions(SearchSMSMessagingSession searchParams)
        {

            List<SMSMessagingSession> result = null;
            SMSMessagingService.Use(client =>
            {
                result = client.GetSMSMessagingSessions(searchParams);
            });
            return result;
        }

        public static void Use(Action<ISMSMessagingService> action)
        {

            ISMSMessagingService client = ProxyManager<ISMSMessagingService>.GetProxy(nameof(ISMSMessagingService));
            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

            FrontOffice.SMSMessagingService.User acbaUser = new FrontOffice.SMSMessagingService.User();
            acbaUser.userID = user.userID;
            acbaUser.filialCode = user.filialCode;
            acbaUser.userName = user.userName;

            client.SetCurrentUser(acbaUser);

            bool success = false;
            
            try
            {
                action(client);
                ((IClientChannel)client).Close();
                success = true;
            }
#pragma warning disable CS0168 // The variable 'ex' is declared but never used
            catch (FaultException ex)
#pragma warning restore CS0168 // The variable 'ex' is declared but never used
            {
                ((IClientChannel)client).Close();
                throw ;
            }
#pragma warning disable CS0168 // The variable 'e' is declared but never used
            catch (TimeoutException e)
#pragma warning restore CS0168 // The variable 'e' is declared but never used
            {
                ((IClientChannel)client).Close();
                throw ;
            }
#pragma warning disable CS0168 // The variable 'e' is declared but never used
            catch (Exception e)
#pragma warning restore CS0168 // The variable 'e' is declared but never used
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
    }
}