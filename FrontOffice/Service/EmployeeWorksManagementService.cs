using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;
using FrontOffice.EmployeeWorksManagementService;

namespace FrontOffice.Service
{
    public class EmployeeWorksManagementService
    {


        public static ActionResult SaveEmployeeWork(EmployeeWork work)
        {

            ActionResult result = null;
            EmployeeWorksManagementService.Use(client =>
            {
                result = client.SaveEmployeeWork(work);
            });
            return result;
        }


        public static Dictionary<string, string> GetTypeOfEmployeeWorks()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            EmployeeWorksManagementService.Use(client =>
            {
                result = client.GetTypeOfEmployeeWorks();
            });
            return result;
        }

        public static Dictionary<string, string> GetTypeOfEmployeeWorkImportances()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            EmployeeWorksManagementService.Use(client =>
            {
                result = client.GetTypeOfEmployeeWorkImportances();
            });
            return result;
        }

        public static Dictionary<string, string> GetTypeOfEmployeeWorkQualities()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            EmployeeWorksManagementService.Use(client =>
            {
                result = client.GetTypeOfEmployeeWorkQualities();
            });
            return result;
        }

        public static Dictionary<string, string> GetTypeOfEmployeeWorkDescriptions()
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            EmployeeWorksManagementService.Use(client =>
            {
                result = client.GetTypeOfEmployeeWorkDescriptions();
            });
            return result;
        }



        public static List<SearchEmployeeWork> SearchEmployeesWorks(SearchEmployeeWork searchParams)
        {

            List<SearchEmployeeWork> result = null;
            EmployeeWorksManagementService.Use(client =>
            {
                result = client.SearchEmployeesWorks(searchParams);
            });
            return result;
        }


        public static EmployeeWork GetEmployeeWork(ulong id)
        {

            EmployeeWork result = null;
            EmployeeWorksManagementService.Use(client =>
            {
                result = client.GetEmployeeWork(id);
            });
            return result;
        }


        public static void Use(Action<IEmployeeWorksManagementService> action)
        {
            IEmployeeWorksManagementService client = ProxyManager<IEmployeeWorksManagementService>.GetProxy(nameof(IEmployeeWorksManagementService));

            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

            string ipAddress = HttpContext.Current.Request["REMOTE_ADDR"];

            FrontOffice.EmployeeWorksManagementService.User acbaUser = new FrontOffice.EmployeeWorksManagementService.User();
            acbaUser.userID = user.userID;
            acbaUser.filialCode = user.filialCode;
            acbaUser.userName = user.userName;
            acbaUser.IsChiefAcc = user.IsChiefAcc;
            acbaUser.IsManager = user.IsManager;

            client.SetCurrentUser(acbaUser);
            client.SetClientIp(ipAddress);

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