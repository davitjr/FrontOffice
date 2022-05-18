using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;
using eSign = FrontOffice.eSignServiceReference;

namespace FrontOffice.Service
{
    public class eSignService
    {
        private static void Use(Action<eSign.IESignService> action)
        {
            ChannelFactory<eSign.IESignService> factory = new ChannelFactory<eSign.IESignService>("*");
            eSign.IESignService client = factory.CreateChannel();
            bool success = false;

            try
            {
                action(client);
                ((IClientChannel)client).Close();
                success = true;
            }
            catch (FaultException ex)
            {
                ((IClientChannel)client).Close();
                factory.Close();
                throw ex;
            }
            catch (CommunicationException e)
            {
                ((IClientChannel)client).Abort();
                factory.Abort();
                throw;
            }
            catch (TimeoutException e)
            {

            }
            catch (Exception e)
            {
                ((IClientChannel)client).Abort();
                factory.Abort();
                throw;
            }
            finally
            {
                if (!success)
                {
                    ((IClientChannel)client).Abort();
                    factory.Abort();
                }
            }
        }

        public static eSign.ActionResult SendDigitalContract(ulong productId, ulong customerNumber, int[] attachmentTypes, Dictionary<string, string> parameters, DateTime operDay, bool includeAll)
        {
            eSign.ActionResult result = new eSign.ActionResult();
            List<int> attachmentTypesList = attachmentTypes.ToList();
            Use(client =>
            {
                result = client.SendDigitalContract(productId, customerNumber, attachmentTypesList, parameters, operDay, includeAll);
            }
          );

            return result;
        }

        public static List<eSign.SentDigitalContract> GetSentDigitalContracts(ulong customerNumber)
        {
            List<eSign.SentDigitalContract> result = new List<eSign.SentDigitalContract>();
            Use(client =>
            {
                result = client.GetSentDigitalContracts(customerNumber);
            }
          );

            return result;
        }

        public static List<eSign.SignedDigitalContract> GetSignedDigitalContracts(ulong customerNumber)
        {
            List<eSign.SignedDigitalContract> result = new List<eSign.SignedDigitalContract>();
            Use(client =>
            {
                result = client.GetSignedDigitalContracts(customerNumber);
            }
          );

            return result;
        }

        public static eSign.ActionResult CancelDigitalContract(Guid digitalContractId)
        {
            eSign.ActionResult result = new eSign.ActionResult();
            Use(client =>
            {
                result = client.CancelDigitalContractById(digitalContractId);
            }
          );

            return result;
        }

        public static eSign.ActionResult SignedInPaperDigitalContract(Guid digitalContractId)
        {
            eSign.ActionResult result = new eSign.ActionResult();
            Use(client =>
            {
                result = client.SignedInPaperById(digitalContractId);
            }
          );

            return result;
        }

        public static byte[] GetSignedDocument(string fileId, string fileName)
        {
            byte[] result = null;
            Use(client =>
            {
                result = client.GetSignedDocuments(fileId, fileName);
            }
          );

            return result;
        }

    }
}