using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.ContractServiceReference;
using System.Web.Mvc;
using System.Globalization;
using System.ServiceModel;

namespace FrontOffice.Service
{
    public class ContractService
    {
        public static void CurrentAccountClosingContract(Dictionary<string, string> parameters)
        {
            RenderContract("CurrentAccCloseApplication", parameters, "AccountClosingApplication");
        }

        public static void LoanMatureApplication(Dictionary<string, string> parameters)
        {
            RenderContract("LoanMatureApplication", parameters, "LoanMatureApplication");
        }
        
        public static void CurrentAccountContract(Dictionary<string, string> parameters)
        {
            RenderContract("CurrentAccContract", parameters, "CurrentAccountContract");
        }

        public static void DepositCloseApplication(Dictionary<string, string> parameters)
        {
            RenderContract("DepositCloseApplication", parameters, "DepositCloseApplication");
        }


        internal static void RenderContract(string contractName, Dictionary<string, string> parameters, string fileName)
        {
                try
                {
                    Contract contract = new Contract();
                    contract.ContractName = contractName;

                    contract.ParametersList = new List<StringKeyValue>();

                    if (parameters != null)
                    {
                        foreach (KeyValuePair<string, string> param in parameters)
                        {
                            StringKeyValue oneParam = new StringKeyValue();
                            oneParam.Key = param.Key;
                            oneParam.Value = param.Value;
                            contract.ParametersList.Add(oneParam);
                        }
                    }

                //byte[] fileContent = null;

                // using (ContractOerationServiceClient proxy = new ContractOerationServiceClient())
                //   {
                //     string guid = Utility.GetSessionId();
                //      fileContent = proxy.DownloadContract(contract, ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]).userName, System.Web.HttpContext.Current.Request["REMOTE_ADDR"]);
                //        proxy.Close();
                //   }

                    string guid = Utility.GetSessionId();
                    byte[] fileContent = DownloadContract(contract, ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]).userName, System.Web.HttpContext.Current.Request["REMOTE_ADDR"]);
                    ReportService.ShowDocument(fileContent, ExportFormat.PDF, fileName);
                }
                catch (Exception ex)
                {
                    System.Web.HttpContext.Current.Response.TrySkipIisCustomErrors = true;
                    System.Web.HttpContext.Current.Response.StatusCode = 422;
                    System.Web.HttpContext.Current.Response.StatusDescription = Utility.ConvertUnicodeToAnsi(ex.Message);
                }
        }


        public static byte[] DownloadContract(Contract contract , string userName , string clientIp)
        {
           
            IContractOerationService client = ProxyManager<IContractOerationService>.GetProxy(nameof(IContractOerationService));
            byte[] contractContent = null ;

            try
            {
               contractContent = client.DownloadContract(contract, userName, clientIp);
            }
            catch (FaultException ex)
            {
                ((IClientChannel)client).Close();
                throw ex;
            }
            catch (TimeoutException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ((IClientChannel)client).Abort();
                throw ex;
            }
            finally
            {
                ((IClientChannel)client).Close();
                ((IClientChannel)client).Dispose();
            }

            return contractContent;
        }

        public static void GetChequeBookApplication(Dictionary<string, string> parameters)
        {
            RenderContract("CheckBookApplication", parameters, "CheckBookApplication");
        }


        public static void GetCustomerSignature(Dictionary<string, string> parameters, int customerType)
        {
            string contractName = customerType == 6 ? "PhysicalCustomerSignature" : "LegalCustomerSignature";

            RenderContract(contractName, parameters, "CustomerSignature");
        }

        public static void PrintAccountTransferDetails(Dictionary<string, string> parameters, string accountCurrency)
        {
            if (accountCurrency == "AMD")
            {
                RenderContract("BankMailTransferDetails", parameters, "BankMailTransferDetails");
            }
            else if (accountCurrency == "RUR")
            {
                RenderContract("SwiftTransferDetailsRUR", parameters, "SwiftTransferDetailsRUR");
            }
            else
            {
                RenderContract("SwiftTransferDetails", parameters, "SwiftTransferDetails");
            }
        }

        public static void GetAccountStatementApplication(Dictionary<string, string> parameters)
        {
            RenderContract("AccountStatementApplication", parameters, "AccountStatementApplication");
        }

        public static void GetCustomerAllProducts(Dictionary<string, string> parameters)
        {
            RenderContract("ClientAllProducts", parameters, "CustomerAllProducts");
        }

        public static void GetCustomerDocuments(Dictionary<string, string> parameters)
        {
            RenderContract("CustomerDocumentsList", parameters, "CustomerDocuments");
        }

        public static void GetAccountOpenApplication(Dictionary<string, string> parameters)
        {
            RenderContract("CurrentAccOpenApplication", parameters, "AccountOpenApplication");
        }

        public static void GetAccountReOpenApplication(Dictionary<string, string> parameters)
        {
            RenderContract("CurrentAccReOpenApplication", parameters, "AccountReOpenApplication");
        }

        public static void GetDepositContract(Dictionary<string, string> parameters)
        {
            RenderContract("DepositContract", parameters, "DepositContract");
        }
        
        public static void ConsumeLoanContract(Dictionary<string, string> parameters)
        {
            RenderContract("ConsumeLoanContract", parameters, "ConsumeLoanContract");
        }

        public static void DepositLoanGrafik(Dictionary<string, string> parameters)
        {
            RenderContract("Grafik", parameters, "Grafik");
        }

        public static void DepositLoanProvision(Dictionary<string, string> parameters)
        {
            RenderContract("ProvisionContract", parameters, "ProvisionContract");
        }
        public static void LoanTerms(Dictionary<string, string> parameters)
        {
            RenderContract("LoanTerms", parameters, "LoanTerms");
        }

        public static void CreditLineContract(Dictionary<string, string> parameters)
        {
            RenderContract("CreditLineContract", parameters, "CreditLineContract");
        }

        public static void CreditLineContractAmex(Dictionary<string, string> parameters)
        {
            RenderContract("CreditLineAmex", parameters, "CreditLineAmex");
        }


        public static void CreditLineTerms(Dictionary<string, string> parameters)
        {
            RenderContract("CreditLineTerms", parameters, "CreditLineTerms");
        }


        public static void GetOperationDeletingApplication(Dictionary<string, string> parameters)
        {
            RenderContract("OperationDeletingApplication", parameters, "OperationDeletingApplication");
        }

        public static void CustomerCredentialApplication(Dictionary<string, string> parameters)
        {
            RenderContract("Assignees", parameters, "CredentialApplication");
        }

        public static void GetCurrentAccountServiceFee(Dictionary<string, string> parameters)
        {
            RenderContract("CurrentAccountServiceFee", parameters, "CurrentAccountServiceFee");
        }

        public static void GetCashBookSummary(Dictionary<string, string> parameters)
        {
            RenderContract("CashBook", parameters, "CashBook");
        }

        public static void ReferenceApplication(Dictionary<string, string> parameters)
        {
            RenderContract("ReferenceRecieptApplication", parameters, "ReferenceRecieptApplication");
        }

        public static void GetUnderageCustomerAgreement(Dictionary<string, string> parameters)
        {
            RenderContract("AgreementForJuniors", parameters, "UnderageCustomerAgreement");
        }

        public static void AccountNoticeForm(Dictionary<string, string> parameters)
        {
            RenderContract("AccountNoticeForm", parameters, "AccountNoticeForm");
        }

        public static void PensionAgreement(Dictionary<string, string> parameters)
        {
            RenderContract("PensionAgreement", parameters, "PensionAgreement");
        }

        public static void PensionCloseApplication(Dictionary<string, string> parameters)
        {
            RenderContract("PensionCloseApplication", parameters, "PensionCloseApplication");
        }

        public static void TransferCallContract(Dictionary<string, string> parameters)
        {
            RenderContract("NoAccTransferAgreement", parameters, "NoAccTransferAgreement");
        }

        public static void GetDepositCaseContract(Dictionary<string, string> parameters)
        {
            RenderContract("DepositCaseContract", parameters, "DepositCaseContract");
        }

        public static void DepositCaseCloseContract(Dictionary<string, string> parameters)
        {
            RenderContract("DepositCaseCloseContract", parameters, "DepositCaseCloseContract");
        }

        public static void GetCardContractDetails(Dictionary<string, string> parameters)
        {
            RenderContract("CardContractAppendix", parameters, "CardContractAppendix");
        }

        public static void GetCardContractDetailsForBusinessCards(Dictionary<string, string> parameters)
        {
            RenderContract("BusinessCardContract", parameters, "BusinessCardContract");
        }
        //Sevak
        public static void GetCardTransactionsLimitApplication(Dictionary<string, string> parameters)
        {
            RenderContract("CardTransactionsLimitApplication", parameters, "CardTransactionsLimitApplication");
        }

        public static void GetCustomerMergeApplication(Dictionary<string, string> parameters)
        {
            RenderContract("CustomerMergeApplication", parameters, "CustomerMergeApplication");
        }
        public static void GetPhoneBankingContract(Dictionary<string, string> parameters)
        {
            RenderContract("PhoneBankingContract", parameters, "PhoneBankingContract");
        }

        public static void GetPhoneBankingContractClosing(Dictionary<string, string> parameters)
        {
            RenderContract("PhoneBankingContractTerminate", parameters, "PhoneBankingContract");
        }
        public static void GetOnlineRequestLegal(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineRequestLegal", parameters, "OnlineRequestLegal");
        }
        public static void GetOnlineAddTokenRequestLegal(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineAddTokenRequestLegal", parameters, "OnlineAddTokenRequestLegal");
        }
        public static void GetOnlineChangeRightsRequestLegal(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineChangeRightsRequestLegal", parameters, "OnlineChangeRightsRequestLegal");
        }
        public static void GetOnlineChangeTokenRequestLegal(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineChangeTokenRequestLegal", parameters, "OnlineChangeTokenRequestLegal");
        }
        public static void GetOnlineDamagedTokenRequestLegal(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineDamagedTokenRequestLegal", parameters, "OnlineDamagedTokenRequestLegal");
        }
        public static void GetOnlineDeactivateRequestLegal(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineDeactivateRequestLegal", parameters, "OnlineDeactivateRequestLegal");
        }
        public static void GetOnlineLostTokenRequestLegal(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineLostTokenRequestLegal", parameters, "OnlineLostTokenRequestLegal");
        }
        public static void GetOnlinePartialDeactivateRequestLegal(Dictionary<string, string> parameters)
        {
            RenderContract("OnlinePartialDeactivateRequestLegal", parameters, "OnlinePartialDeactivateRequestLegal");
        }
        public static void GetOnlineRequestPhysical(Dictionary<string, string> parameters)
        {
            string guid = Utility.GetSessionId();
            parameters.Add(key: "filialCode", value: ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]).filialCode.ToString());
            RenderContract("OnlineRequestPhysical", parameters, "OnlineRequestPhysical");
        }
        public static void GetOnlineChangeRightsRequestPhysical(Dictionary<string, string> parameters)
        {
            string guid = Utility.GetSessionId();
            parameters.Add(key: "filialCode", value: ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]).filialCode.ToString());
            RenderContract("OnlineChangeRightsRequestPhysical", parameters, "OnlineChangeRightsRequestPhysical");
        }
        public static void GetOnlineChangeTokenRequestPhysical(Dictionary<string, string> parameters)
        {
            string guid = Utility.GetSessionId();
            parameters.Add(key: "filialCode", value: ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]).filialCode.ToString());
            RenderContract("OnlineChangeTokenRequestPhysical", parameters, "OnlineChangeTokenRequestPhysical");
        }
        
        public static void GetOnlineDamagedTokenRequestPhysical(Dictionary<string, string> parameters)
        {
            string guid = Utility.GetSessionId();
            parameters.Add(key: "filialCode", value: ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]).filialCode.ToString());
            RenderContract("OnlineDamagedTokenRequestPhysical", parameters, "OnlineDamagedTokenRequestPhysical");
        }
        public static void GetOnlineLostTokenRequestPhysical(Dictionary<string, string> parameters)
        {
            string guid = Utility.GetSessionId();
            parameters.Add(key: "filialCode", value: ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]).filialCode.ToString());
            RenderContract("OnlineLostTokenRequestPhysical", parameters, "OnlineLostTokenRequestPhysical");
        }
        public static void GetOnlineDeactivateTokenRequestPhysical(Dictionary<string, string> parameters)
        {
            string guid = Utility.GetSessionId();
            parameters.Add(key: "filialCode", value: ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]).filialCode.ToString());
            RenderContract("OnlineDeactivateTokenRequestPhysical", parameters, "OnlineDeactivateTokenRequestPhysical");
        }
        public static void GetOnlinePartialDeactivateRequestPhysical(Dictionary<string, string> parameters)
        {
            string guid = Utility.GetSessionId();
            parameters.Add(key: "filialCode", value: ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]).filialCode.ToString());
            RenderContract("OnlinePartialDeactivateRequestPhysical", parameters, "OnlinePartialDeactivateRequestPhysical");
        }
        public static void GetOnlineAddTokenRequestPhysical(Dictionary<string, string> parameters)
        {
            string guid = Utility.GetSessionId();
            parameters.Add(key: "filialCode", value: ((XBS.User)System.Web.HttpContext.Current.Session[guid + "_User"]).filialCode.ToString());
            RenderContract("OnlineAddTokenRequestPhysical", parameters, "OnlineAddTokenRequestPhysical");
        }

        public static void GetOnlineContractPhysical(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineContractPhysical", parameters, "OnlineContractPhysical");
        }
        public static void GetOnlineContractLegal(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineContractLegal", parameters, "OnlineContractLegal");
        }
        public static void GetOnlineAgreementPhysical(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineAgreementPhysical", parameters, "OnlineAgreementPhysical");
        }
        public static void GetOnlineAgreementLegal(Dictionary<string, string> parameters)
        {
            RenderContract("OnlineAgreementLegal", parameters, "OnlineAgreementLegal");
        }

        public static void BondContract(Dictionary<string, string> parameters)
        {
            RenderContract("BondContract", parameters, "BondContract");
        }

        public static void BondAcquirementApplication(Dictionary<string, string> parameters)
        {
            RenderContract("BondAcquirementApplicaton", parameters, "BondAcquirementApplicaton");
        }

        public static void ProductNotificationContract(Dictionary<string, string> parameters)
        {
            RenderContract("ProvisionLoanStatement", parameters, "ProvisionLoanStatement");
        }

        public static void RemittanceSendCancellationApplication(Dictionary<string, string> parameters)
        {
            RenderContract("RemittanceSendCancellationApplication", parameters, "RemittanceSendCancellationApplication");
        }

        public static void RemittanceAmendmentApplication(Dictionary<string, string> parameters)
        {
            RenderContract("RemittanceAmendmentApplication", parameters, "RemittanceAmendmentApplication");
        }

        public static void CardServiceContract(Dictionary<string, string> parameters)
        {
            RenderContract("CardServiceContract", parameters, "CardServiceContract");
        }

        public static void InternetCardServiceDocument(Dictionary<string, string> parameters)
        {
            RenderContract("InternetCardServiceDocument", parameters, "InternetCardServiceDocument");
        }

        public static void CardPaymentAgreementWithNoCard(Dictionary<string, string> parameters)
        {
            RenderContract("CardPaymentAgreementWithNoCard", parameters, "CardPaymentAgreementWithNoCard");
        }

        public static void WithoutCardPaymentContract(Dictionary<string, string> parameters)
        {
            RenderContract("WithoutCardPeymentContract", parameters, "WithoutCardPeymentContract");
        }

        public static void TradeServiceCentersAcceptanceDischargeAct(Dictionary<string, string> parameters)
        {
            RenderContract("TradeServiceCentersAcceptanceDischargeAct", parameters, "TradeServiceCentersAcceptanceDischargeAct");
        }

        public static void PosContract(Dictionary<string, string> parameters)
        {
            RenderContract("PosContract", parameters, "PosContract");
        }

        public static void ThirdPersonAccountRightsTransfer(Dictionary<string, string> parameters)
        {
            RenderContract("ThirdPersonAccountRightsTransfer", parameters, "PosContract");
        }
    }
}