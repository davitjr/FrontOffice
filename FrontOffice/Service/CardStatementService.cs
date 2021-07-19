using FrontOffice.ACBAServiceReference;
//using FrontOffice.SMSMessagingService;
using FrontOffice.CardStatementService;
//using FrontOffice.XBS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;

namespace FrontOffice.Service
{
    public class CardStatementService
    {
        public static List<CardStatementSession> GetCardStatementSessions(int statementType)
        {

            List<CardStatementSession> result = null;
            CardStatementService.Use(client =>
            {
                result = client.GetCardStatementSessions(statementType);
            });
            return result;
        }

        public static ActionResult CreateCardStatementSession(DateTime periodStart, DateTime periodEnd, int statementType, int frequency)
        {

            ActionResult result = new ActionResult();
            CardStatementService.Use(client =>
            {
                result = client.CreateCardStatementSession(periodStart, periodEnd, statementType, frequency);
            });
            return result;
        }

        public static ActionResult DeleteCardStatementSession(int sessionID)
        {

            ActionResult result = new ActionResult();
            CardStatementService.Use(client =>
            {
                result = client.DeleteCardStatementSession(sessionID);
            });
            return result;
        }

        public static Dictionary<string, string> GetStatementSessionQualityTypes()
        {

            Dictionary<string, string> cardStatementSessionQualityTypes = new Dictionary<string, string>();
            CardStatementService.Use(client =>
            {
                cardStatementSessionQualityTypes = client.GetStatementSessionQualityTypes();
            });
            return cardStatementSessionQualityTypes;
        }

        public static CardStatementSessionDetails GetCardSessionDetails(int sessionID)
        {
            CardStatementSessionDetails cardStatementSessionDetails = new CardStatementSessionDetails();
            CardStatementService.Use(client =>
            {
                cardStatementSessionDetails = client.GetCardSessionDetails(sessionID);
            });
            return cardStatementSessionDetails;
        }

        public static List<StatementSessionHistory> GetSatementHistory(int sessionID)
        {
            List<StatementSessionHistory> statementSessionHistoryList = new List<StatementSessionHistory>();

            CardStatementService.Use(client =>
            {
                statementSessionHistoryList = client.GetSatementHistory(sessionID);
            });

            foreach (StatementSessionHistory statementSessionHistory in statementSessionHistoryList)
            {
                string casherDescription = ACBAOperationService.GetCasherDescription((int)statementSessionHistory.userID);
                casherDescription = Utility.ConvertAnsiToUnicode(casherDescription);
                statementSessionHistory.ChangeUserName = casherDescription;
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
        public static ActionResult StartCardStatementSessionSubscription(int sessionID, int startType, DateTime schedule, int statementType)
        {
            ActionResult result = new ActionResult();
            CardStatementService.Use(client =>
            {
                result = client.StartCardStatementSessionSubscription(sessionID, startType, schedule, statementType);
            });
            return result;
        }

        public static int ChangeStatementSessionStatus(int sessionID)
        {
            int quality = 0;
            CardStatementService.Use(client =>
            {
                quality = client.ChangeStatementSessionStatus(sessionID);
            });
            return quality;
        }

        public static ActionResult DeleteCardStatementSessionSchedule(int sessionID)
        {
            ActionResult result = new ActionResult();
            CardStatementService.Use(client =>
            {
                result = client.DeleteCardStatementSessionSchedule(sessionID);
            });
            return result;
        }
        public static void Use(Action<ICardStatementService> action)
        {
            ICardStatementService client = ProxyManager<ICardStatementService>.GetProxy(nameof(ICardStatementService));
            string guid = Utility.GetSessionId();
            XBS.User user = (XBS.User)HttpContext.Current.Session[guid + "_User"];

            FrontOffice.CardStatementService.User acbaUser = new FrontOffice.CardStatementService.User();
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

        public static AdvertisementConfiguration GetOneCardAdvertisements(int cardType)
        {
            AdvertisementConfiguration statementAdvertisements = new AdvertisementConfiguration();
            CardStatementService.Use(client =>
            {
                statementAdvertisements = client.GetOneCardAdvertisements(cardType);
            });
            return statementAdvertisements;
        }

        public static AdvertisementFile GetAdvertisementFileByID(int ID)
        {
            AdvertisementFile advertisementFile = new AdvertisementFile();
            CardStatementService.Use(client =>
            {
                advertisementFile = client.GetAdvertisementFileByID(ID);
            });
            return advertisementFile;
        }

        public static Advertisement GetAllCardsAdvertisements()
        {
            Advertisement advertisement = new Advertisement();
            CardStatementService.Use(client =>
            {
                advertisement = client.GetAllCardsAdvertisements();
            });
            return advertisement;
        }

        public static Advertisement GetAdvertisementFiles(int ID)
        {
            Advertisement advertisement = new Advertisement();
            CardStatementService.Use(client =>
            {
                advertisement = client.GetAdvertisementFiles(ID);
            });
            return advertisement;
        }

        public static ActionResult UpdateAdvertisementWithNewFile(Advertisement advertisement)
        {
            ActionResult result = new ActionResult();
            CardStatementService.Use(client =>
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

            for (int i = 0; i < statementAdvertisements.OneCardAdvertisements.Count; i++)
            {
                for (int j = 0; j < statementAdvertisements.OneCardAdvertisements[i].Files.Count; j++)
                {
                    statementAdvertisements.OneCardAdvertisements[i].Files[j].SetNumber = setNumber;
                }
            }

            CardStatementService.Use(client =>
            {
                result = client.InsertAdvertisement(statementAdvertisements);
            });
            return result;
        }

        public static ActionResult DeactivateAdvertisement(int advertisementID)
        {
            ActionResult result = new ActionResult();
            CardStatementService.Use(client =>
            {
                result = client.DeactivateAdvertisement(advertisementID);
            });
            return result;
        }

    }
}