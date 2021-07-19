using FrontOffice.ACBAServiceReference;
using FrontOffice.LeasingStatementService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;

namespace FrontOffice.Service
{
    public class LeasingStatementService
    {

        public static List<LeasingStatementSession> GetLeasingStatementSessions(int statementType)
        {

            List<LeasingStatementSession> result = null;
            LeasingStatementService.Use(client =>
            {
                result = client.GetLeasingStatementSessions(statementType);
            });
            return result;
        }

        public static ActionResult CreateLeasingStatementSession(DateTime periodStart, DateTime periodEnd, int statementType)
        {

            ActionResult result = new ActionResult();
            LeasingStatementService.Use(client =>
            {
                result = client.CreateLeasingStatementSession(periodStart, periodEnd, statementType);
            });
            return result;
        }

        public static ActionResult DeleteLeasingStatementSession(int sessionID)
        {

            ActionResult result = new ActionResult();
            LeasingStatementService.Use(client =>
            {
                result = client.DeleteLeasingStatementSession(sessionID);
            });
            return result;
        }

        public static Dictionary<string, string> GetStatementSessionQualityTypes()
        {

            Dictionary<string, string> LeasingStatementSessionQualityTypes = new Dictionary<string, string>();
            LeasingStatementService.Use(client =>
            {
                LeasingStatementSessionQualityTypes = client.GetStatementSessionQualityTypes();
            });
            return LeasingStatementSessionQualityTypes;
        }

        public static LeasingStatementSessionDetails GetLeasingSessionDetails(int sessionID)
        {
            LeasingStatementSessionDetails LeasingStatementSessionDetails = new LeasingStatementSessionDetails();
            LeasingStatementService.Use(client =>
            {
                LeasingStatementSessionDetails = client.GetLeasingSessionDetails(sessionID);
            });
            return LeasingStatementSessionDetails;
        }

        public static List<StatementSessionHistory> GetSatementHistory(int sessionID)
        {
            List<StatementSessionHistory> statementSessionHistoryList = new List<StatementSessionHistory>();

            LeasingStatementService.Use(client =>
            {
                statementSessionHistoryList = client.GetSatementHistory(sessionID);
            });

            foreach (StatementSessionHistory statementSessionHistory in statementSessionHistoryList)
            {
                if (statementSessionHistory.userID != 0)
                {
                    string casherDescription = ACBAOperationService.GetCasherDescription((int)statementSessionHistory.userID);
                    casherDescription = Utility.ConvertAnsiToUnicode(casherDescription);
                    statementSessionHistory.ChangeUserName = casherDescription;
                }
                else
                {
                    statementSessionHistory.ChangeUserName = "Ավտոմատացված";
                }
            }

            return statementSessionHistoryList;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="sessionID"></param>
        /// <param name="startType">1- անմիջապես է աշխատում, 2-ըստ schedule-ի</param>
        /// <param name="schedule"></param>
        /// <returns></returns>
        public static ActionResult StartLeasingStatementSessionSubscription(int sessionID, int startType, DateTime schedule, int statementType)
        {
            ActionResult result = new ActionResult();
            LeasingStatementService.Use(client =>
            {
                result = client.StartLeasingStatementSessionSubscription(sessionID, startType, schedule, statementType);
            });
            return result;
        }

        public static int ChangeStatementSessionStatus(int sessionID)
        {
            int quality = 0;
            LeasingStatementService.Use(client =>
            {
                quality = client.ChangeLeasingStatementSessionStatus(sessionID);
            });
            return quality;
        }

        public static ActionResult DeleteLeasingStatementSessionSchedule(int sessionID)
        {
            ActionResult result = new ActionResult();
            LeasingStatementService.Use(client =>
            {
                result = client.DeleteLeasingStatementSessionSchedule(sessionID);
            });
            return result;
        }
        public static void Use(Action<ILeasingStatementService> action)
        {
            ILeasingStatementService client = ProxyManager<ILeasingStatementService>.GetProxy(nameof(ILeasingStatementService));
            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

            FrontOffice.LeasingStatementService.User acbaUser = new FrontOffice.LeasingStatementService.User();
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

        public static AdvertisementConfiguration GetOneLeasingAdvertisements(int LeasingType)
        {
            AdvertisementConfiguration statementAdvertisements = new AdvertisementConfiguration();
            LeasingStatementService.Use(client =>
            {
                statementAdvertisements = client.GetOneLeasingAdvertisements(LeasingType);
            });
            return statementAdvertisements;
        }

        public static AdvertisementFile GetAdvertisementFileByID(int ID)
        {
            AdvertisementFile advertisementFile = new AdvertisementFile();
            LeasingStatementService.Use(client =>
            {
                advertisementFile = client.GetAdvertisementFileByID(ID);
            });
            return advertisementFile;
        }

        public static Advertisement GetAllLeasingsAdvertisements()
        {
            Advertisement advertisement = new Advertisement();
            LeasingStatementService.Use(client =>
            {
                advertisement = client.GetAllLeasingsAdvertisements();
            });
            return advertisement;
        }

        public static Advertisement GetAdvertisementFiles(int ID)
        {
            Advertisement advertisement = new Advertisement();
            LeasingStatementService.Use(client =>
            {
                advertisement = client.GetAdvertisementFiles(ID);
            });
            return advertisement;
        }

        public static ActionResult UpdateAdvertisementWithNewFile(Advertisement advertisement)
        {
            ActionResult result = new ActionResult();
            LeasingStatementService.Use(client =>
            {
                result = client.UpdateAdvertisementWithNewFile(advertisement);
            });
            return result;
        }

        public static ActionResult InsertAdvertisement(AdvertisementConfiguration statementAdvertisements)
        {
            ActionResult result = new ActionResult();
            string guid = Utility.GetSessionId();

            XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];
            int setNumber = user.userID;

            for (int i = 0; i < statementAdvertisements.OneLeasingAdvertisements.Count; i++)
            {
                for (int j = 0; j < statementAdvertisements.OneLeasingAdvertisements[i].Files.Count; j++)
                {
                    statementAdvertisements.OneLeasingAdvertisements[i].Files[j].SetNumber = setNumber;
                }
            }

            LeasingStatementService.Use(client =>
            {
                result = client.InsertAdvertisement(statementAdvertisements);
            });
            return result;
        }

        public static ActionResult DeactivateAdvertisement(int advertisementID)
        {
            ActionResult result = new ActionResult();
            LeasingStatementService.Use(client =>
            {
                result = client.DeactivateAdvertisement(advertisementID);
            });
            return result;
        }

        public static ActionResult RunStatementSessionSubscription(int sessionID)
        {

            ActionResult result = new ActionResult();
            LeasingStatementService.Use(client =>
            {
                result = client.RunLeasingStatementSessionSubscription(sessionID);
            });
            return result;
        }
    }
}