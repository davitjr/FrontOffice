using FrontOffice.FinancialPlanningService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;

namespace FrontOffice.Service
{
    public class FinancialPlanningService
    {

        public static ActionResult Save(Document document)
        {
            ActionResult result = new ActionResult();
            try
            {
                FinancialPlanningService.Use(client =>
                {
                    result = client.Save(document);
                });
            }
            catch (Exception)
            {
                result.ResultCode = ResultCode.Failed;
            }
            return result;
        }


        public static List<PlanningTypeInfo> GetPlanningTypes()
        {


            string cacheKey = "Info_PlanningTypes";
            List<PlanningTypeInfo> info = CacheHelper.Get<List<PlanningTypeInfo>>(cacheKey);

            if (info == null)
            {
                FinancialPlanningService.Use(client =>
                info = client.GetPlanningTypes()
                );
                CacheHelper.Add(info, cacheKey);
            }
            return info;
        }

        public static Dictionary<string, int> GetFinancialPlanningTypes()
        {
            string cacheKey = "Info_FinancialPlanningTypes";
            Dictionary<string, int> info = CacheHelper.Get<Dictionary<string, int>>(cacheKey);

            if (info == null)
            {
                FinancialPlanningService.Use(client =>
                info = client.GetFinancialPlanningTypes()
                );
                CacheHelper.Add(info, cacheKey);
            }
            return info;
        }

        public static Document GetFinancialPlanning(Document document, DateTime year, int filialCode,int? setNumber)
        {
            FinancialPlanningService.Use(client =>
            document = client.GetFinancialPlanning(document, year, filialCode, setNumber)
            );
            return document;
        }
        public static void Use(Action<IFinancialPlanningService> action)
        {

            IFinancialPlanningService client = ProxyManager<IFinancialPlanningService>.GetProxy(nameof(IFinancialPlanningService));
            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

            FrontOffice.FinancialPlanningService.User acbaUser = new FrontOffice.FinancialPlanningService.User();
            acbaUser.userID = user.userID;
            acbaUser.filialCode = user.filialCode;
            acbaUser.userName = user.userName;
            acbaUser.GroupID = user.userPermissionId;

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
                throw;
            }
#pragma warning disable CS0168 // The variable 'e' is declared but never used
            catch (TimeoutException e)
#pragma warning restore CS0168 // The variable 'e' is declared but never used
            {
                ((IClientChannel)client).Close();
                throw;
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