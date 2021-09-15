using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.ReportingRS1001;
using System.ServiceModel;
using xbsInfo = FrontOffice.XBSInfo;
using xbs = FrontOffice.XBS;
using FrontOffice.Models;

namespace FrontOffice
{
    /// <summary>
    /// File Export Formats.
    /// </summary>
    public enum ExportFormat
    {
        /// <summary>Image</summary>
        Image,
        /// <summary>PDF</summary>
        PDF,
        /// <summary>Excel</summary>
        Excel,
        /// <summary>Word</summary>
        Word
    }
}

namespace FrontOffice.Service
{

    public class ReportService
    {
        public static void CardApplicationDetails(short applicationID, Dictionary<string, string> parameters)
        {
            switch (applicationID)
            {
                case 1:
                    RenderReport("/ACBAReports/CardAccountDetails", parameters, ExportFormat.PDF, "CardAccountDetails");
                    break;
                case 2:
                    RenderReport("/ACBAReports/RenewedCardApplication", parameters, ExportFormat.PDF, "RenewedCardApplication");
                    break;
                case 3:
                    RenderReport("/ACBAReports/CardReplacementApplication", parameters, ExportFormat.PDF, "CardReplacementApplication");
                    break;
                case 4:
                    RenderReport("/ACBAReports/CardAccountDetailChange", parameters, ExportFormat.PDF, "CardAccountDetailChange");
                    break;
                case 5:
                    RenderReport("/ACBAReports/CardRenewalApplication", parameters, ExportFormat.PDF, "CardRenewalApplication");
                    break;
                case 6:
                    RenderReport("/ACBAReports/AdditionalCardApplication", parameters, ExportFormat.PDF, "AdditionalCardApplication");
                    break;
                case 7:
                    RenderReport("/ACBAReports/CardClosingApplication", parameters, ExportFormat.PDF, "CardClosingApplication");
                    break;
                case 8:
                    RenderReport("/ACBAReports/CardBlockApplication", parameters, ExportFormat.PDF, "CardBlockApplication");
                    break;
                case 10:
                    RenderReport("/ACBAReports/TransactionChargebackApplication", parameters, ExportFormat.PDF, "TransactionChargebackApplication");
                    break;
                case 11:
                    RenderReport("/ACBAReports/SMSDimum", parameters, ExportFormat.PDF, "SMSDimum");
                    break;
                case 12:
                    RenderReport("/ACBAReports/CreditlineClosingApplication", parameters, ExportFormat.PDF, "CreditlineClosingApplication");
                    break;
                case 13:
                    RenderReport("/ACBAReports/LinkedCard", parameters, ExportFormat.PDF, "LinkedCard");
                    break;
                case 14:
                    RenderReport("/ACBAReports/BusinessCardApplicationProlongation", parameters, ExportFormat.PDF, "BusinessCardApplicationProlongation");
                    break;
                case 17:
                    RenderReport("/ACBAReports/RenewedOtherTypeCardApplication", parameters, ExportFormat.PDF, "RenewedOtherTypeCardApplication");
                    break;
                case 18:
                    RenderReport("/ACBAReports/3DSecureDimum", parameters, ExportFormat.PDF, "3DSecureDimum");
                    break;
                case 20:
                    RenderReport("/ACBAReports/ACBADigitalCardOrderReceiptConfirmation", parameters, ExportFormat.PDF, "ACBADigitalCardOrderReceiptConfirmation");
                    break;
            }
        }

        public static void CardStatement(Dictionary<string, string> parameters,ExportFormat exportFormat)
        {

            if (parameters["lang"] == ((byte)xbsInfo.Languages.hy).ToString())
            {
                parameters.Remove("lang");
                RenderReport("/ACBAReports/CardStatement", parameters, exportFormat, "CardStatement");
            }
            else if (parameters["lang"] == ((byte)xbsInfo.Languages.eng).ToString())
            { 
                parameters.Remove("lang");
                RenderReport("/ACBAReports/CardStatement_eng", parameters, exportFormat, "CardStatement");
            }
        }
       

        private static void RenderReport(string reportPath, Dictionary<string, string> parameters, ExportFormat exportFormat, string fileName)
        {
            try
            {
                using(ReportExecutionService rs = new ReportExecutionService())
                {
                        rs.Credentials = System.Net.CredentialCache.DefaultCredentials;
            
                        byte[] fileContent = null;
                      
                        string historyID = null;
                        string devInfo = @"";

                        List<ParameterValue> parametersList = new List<ParameterValue>();
            
                        if (parameters != null)
                        {
                            foreach (KeyValuePair<string, string> param in parameters)
                            {
                                ParameterValue oneParam = new ParameterValue();
                                oneParam.Name = param.Key;
                                oneParam.Value = param.Value;
                                parametersList.Add(oneParam);
                            }
                        }
                                               
                        string encoding;
                        string mimeType;
                        string extension;
                        Warning[] warnings = null;
                        string[] streamIDs = null;

                        ExecutionInfo execInfo = new ExecutionInfo();
                        ExecutionHeader execHeader = new ExecutionHeader();

                        rs.ExecutionHeaderValue = execHeader;

                        execInfo = rs.LoadReport(reportPath, historyID);

                        rs.SetExecutionParameters(parametersList.ToArray(), "en-us");
                        String SessionId = rs.ExecutionHeaderValue.ExecutionID;

                        rs.Timeout = 180000;
                        string format = GetExportFormatString(exportFormat);
                        fileContent = rs.Render(format, devInfo, out extension, out encoding, out mimeType, out warnings, out streamIDs);

                        ShowDocument(fileContent, exportFormat, fileName);


                }
            }
              catch (Exception ex)
                {
                    
                    System.Web.HttpContext.Current.Response.BufferOutput = true;
                    System.Web.HttpContext.Current.Response.TrySkipIisCustomErrors = true;
                    System.Web.HttpContext.Current.Response.StatusCode = 422;
                    System.Web.HttpContext.Current.Response.StatusDescription = Utility.ConvertUnicodeToAnsi(ex.Message);
                }
        }

        public static void GetSentSMSMessages(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/SentSMSMessages", parameters, ExportFormat.PDF, "SentSMSMessages");
        }


        public static void ShowDocument(byte[] fileContent,ExportFormat exportFormat,string fileName)
        {
            //DOWNLOAD FILE
            string format = GetExportExtensionString(exportFormat);

            System.Web.HttpContext.Current.Response.Clear();
            System.Web.HttpContext.Current.Response.ClearContent();
            System.Web.HttpContext.Current.Response.ClearHeaders();
            System.Web.HttpContext.Current.Response.AddHeader("content-disposition", "attachment; filename=" + fileName + "." + format);

            if (exportFormat == ExportFormat.Excel)
            {
                System.Web.HttpContext.Current.Response.ContentType = "application/excel";
            }
            else
            { 
                System.Web.HttpContext.Current.Response.ContentType = format;
            }

            System.Web.HttpContext.Current.Response.BinaryWrite(fileContent);
            //System.Web.HttpContext.Current.Response.OutputStream.Write(fileContent,0,fileContent.Length);
            System.Web.HttpContext.Current.Response.End();
       }

        /// <summary>
		/// Gets the string export format of the specified enum.
		/// </summary>
		/// <param name="f">export format enum</param>
		/// <returns>enum equivalent string export format</returns>
		public static string GetExportFormatString(ExportFormat f)
		{
			switch (f)
			{
				case ExportFormat.Image: return "IMAGE";
				case ExportFormat.PDF: return "PDF";
                case ExportFormat.Excel: return "Excel";
				case ExportFormat.Word: return "WORD";

				default:
					return "PDF";
			}
		}

        /// <summary>
        /// Gets the string export format of the specified enum.
        /// </summary>
        /// <param name="f">export format enum</param>
        /// <returns>enum equivalent string export format</returns>
        public static string GetExportExtensionString(ExportFormat f)
        {
            switch (f)
            {
                case ExportFormat.Image: return "IMAGE";
                case ExportFormat.PDF: return "pdf";
                case ExportFormat.Excel: return "xls";
                case ExportFormat.Word: return "WORD";

                default:
                    return "PDF";
            }
        }

        /// <summary>
        /// Gets the enum export format of the specified extension.
        /// </summary>
        /// <param name="f">format string</param>
        /// <returns>equivalent enum export format</returns>
        public static ExportFormat GetExportFormatEnumeration(string f)
        {
            switch (f)
            {
                case "jpg": return ExportFormat.Image;
                case "jpeg": return ExportFormat.Image;
                case "png": return ExportFormat.Image;
                case "pdf": return ExportFormat.PDF;
                case ".jpg": return ExportFormat.Image;
                case ".jpeg": return ExportFormat.Image;
                case ".png": return ExportFormat.Image;
                case ".pdf": return ExportFormat.PDF;
                case ".xls": return ExportFormat.Excel;
                case "xls": return ExportFormat.Excel;
                default:
                    return ExportFormat.PDF;
            }
        }

        public static void PeriodicTransferDetails(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/PaymentInstructionByPeriodFromAppID", parameters, ExportFormat.PDF, "PeriodicTransferDetails");
        }

        public static void PeriodicSWIFTStatementTransferDetails(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/PaymentInstructionByPeriodSwiftExtractFromAppID", parameters, ExportFormat.PDF, "PeriodicTransferDetails");
        }

        public static void PeriodicTransferClosingDetails(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/ClosePaymentInstructionByPeriodFromAppID", parameters, ExportFormat.PDF, "PeriodicTransferDetails");
        }

        public static void GetCardClosingApplication(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/CardClosingApplication", parameters, ExportFormat.PDF, "CardClosingApplication");
        }

        public static void GetLoanGrafikApplication(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Loan_Repayment_Schedule", parameters, ExportFormat.PDF, "LoanGrafikApplication");
        }

        public static void GetPaymentOrder(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Payment_Order", parameters, ExportFormat.PDF, "PaymentOrder");
        }

        public static void GetConvertation(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Convertation_NonCash", parameters, ExportFormat.PDF, "ConvertationPaymentOrder");
        }

        public static void GetCrossConvertation(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Cross_Convertation_NonCash", parameters, ExportFormat.PDF, "CrossConvertationPaymentOrder");
        }
        public static void GetCreditLineGrafikApplication(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/CreditLine_Repayment_Schedule", parameters, ExportFormat.PDF, "CreditLineGrafikApplication");
        }


        public static void DepositRepaymentsGrafik(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/DepositRepaymentsGrafik", parameters, ExportFormat.PDF, "DepositRepaymentsGrafik");
        }

        public static void AccountStatement(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/CurrentAccountStatement", parameters, exportFormat, "CurrentAccountStatement");
        }

        public static void AccountStatementNew(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/CurrentAccountStatementNew", parameters, exportFormat, "CurrentAccountStatementNew");
        }

        public static void DepositStatement(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/DepositAccountStatementNew", parameters, exportFormat, "DepositStatement");
        }

        public static void Memorial(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Memorial_by_Period", parameters, ExportFormat.PDF, "Memorial_by_Period");
        }


                      
        public static void ENAPaymentReport(Dictionary<string, string> parameters,int abonentType, byte operationType)
        {

           // if (abonentType == 1)
           // {
                if (operationType == 0)
                {
                    RenderReport("/ACBAReports/ElentricityPaymentReportPlPor", parameters, ExportFormat.PDF, "ENAPayment");
                }
                else
                {
                    RenderReport("/ACBAReports/ElentricityPaymentReportCash", parameters, ExportFormat.PDF, "ENAPayment");
                }
            //}
            //else
            //{
            //    if (operationType == 0)
            //    {
            //        RenderReport("/ACBAReports/ENA_Payment_Report_PL_POR", parameters, ExportFormat.PDF, "ENAPayment");
            //    }
            //    else
            //    {
            //        RenderReport("/ACBAReports/ENA_Payment_Report_CASH", parameters, ExportFormat.PDF, "ENAPayment");
            //    }
            //}

        }

        public static void VivaCellPaymentReport(Dictionary<string, string> parameters, byte operationType)
        {
            if (operationType == 0)
            {
            RenderReport("/ACBAReports/VivaCell_Payment_Report_Pl_Por", parameters, ExportFormat.PDF, "VivaCellPayment");         
            }
            else
            {
                RenderReport("/ACBAReports/VivaCell_Payment_Report_CASH", parameters, ExportFormat.PDF, "VivaCellPayment");  
        }
        }

        public static void ArmenTelPaymentReport(Dictionary<string, string> parameters, byte operationType)
        {
            if (operationType == 0)
            {
            RenderReport("/ACBAReports/Armentel_Payment_Report_Pl_Por", parameters, ExportFormat.PDF, "ArmenTelPayment");
            }
            else
            {
                RenderReport("/ACBAReports/Armentel_Payment_Report_CASH", parameters, ExportFormat.PDF, "ArmenTelPayment");
        }
        }

        public static void OrangePaymentReport(Dictionary<string, string> parameters, byte operationType)
        {
            if(operationType == 0)
            {
            RenderReport("/ACBAReports/Orange_Payment_Report_Pl_Por", parameters, ExportFormat.PDF, "OrangePayment");
            }
            else
            {
                RenderReport("/ACBAReports/Orange_Payment_Report_CASH", parameters, ExportFormat.PDF, "OrangePayment");
        }
        }

        public static void GasPaymentReport(Dictionary<string, string> parameters, byte operationType)
        {
            if (operationType == 0)
            {
            RenderReport("/ACBAReports/GasProm_Payment_Report_Pl_Por", parameters, ExportFormat.PDF, "GasPayment");
            }
            else
            {
                RenderReport("/ACBAReports/GasProm_Payment_Report_Cash", parameters, ExportFormat.PDF, "GasPayment");               
        }
        }

        public static void UComPaymentReport(Dictionary<string, string> parameters, byte operationType)
        {
            if(operationType == 0)
            {
            RenderReport("/ACBAReports/UCOM_Payment_Report_Pl_Por", parameters, ExportFormat.PDF, "UComPayment");
            }
            else
            {
                RenderReport("/ACBAReports/UCOM_Payment_Report_CASH", parameters, ExportFormat.PDF, "UComPayment");
        }
        }

        public static void WaterPaymentReport(Dictionary<string, string> parameters, XBS.CommunalTypes comunalType, byte operationType)
        {
            if (comunalType == xbs.CommunalTypes.YerWater)
            {
                if(operationType == 0)
                {
                RenderReport("/ACBAReports/VeoliaJur_Payment_Report_Pl_Por", parameters, ExportFormat.PDF, "ErJurPayment");
                }
                else
                {
                    RenderReport("/ACBAReports/VeoliaJur_Payment_Report_Cash", parameters, ExportFormat.PDF, "ErJurPayment");                 
            }
            }
            else
            {
                if(operationType == 0)
                {
                RenderReport("/ACBAReports/ArmWater_Payment_Report_PL_POR", parameters, ExportFormat.PDF, "ArmWaterPayment");
                }
                else
                {
                    RenderReport("/ACBAReports/ArmWater_Payment_Report_CASH", parameters, ExportFormat.PDF, "ArmWaterPayment");                   
            }             
        }
        }

        public static void LoanStatement(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Loan_Statment", parameters, ExportFormat.PDF, "LoanStatement");
        }

        public static void LoanStatementNew(Dictionary<string, string> parameters,ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/Loan_Statment_NEW", parameters, exportFormat, "LoanStatement");
        }

        public static void CustomerKYC(Dictionary<string, string> parameters, int customerType)
        {
            if (customerType == 6)
            {
                RenderReport("/ACBAReports/KYC_Individual_MVC", parameters, ExportFormat.PDF, "KYC_Individual_MVC");
            }
            else
            {
                RenderReport("/ACBAReports/KYC_Legal_MVC", parameters, ExportFormat.PDF, "KYC_Legal_MVC");
            }
        }

        public static void GetCreditLineTerminationApplication(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/CreditlineClosingApplication", parameters, ExportFormat.PDF, "CreditlineClosingApplication");
        }

        public static void GetCashInPaymentOrder(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Cash_In", parameters, ExportFormat.PDF, "PaymentOrder");
        }
        public static void GetCashOutPaymentOrder(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Cash_Out", parameters, ExportFormat.PDF, "PaymentOrder");
        }

        public static void GetConvertationCashPaymentOrder(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Convertation_Cash", parameters, ExportFormat.PDF, "PaymentOrder");
        }

        public static void GetConvertationCashNonCashPaymentOrder(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Convertation_Cash_NonCash", parameters, ExportFormat.PDF, "PaymentOrder");
        }

        public static void GetConvertationNonCashCashPaymentOrder(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Convertation_NonCash_Cash", parameters, ExportFormat.PDF, "PaymentOrder");
        }

        public static void CashBigAmountReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Cash_Big_Amount", parameters, ExportFormat.PDF, "Հայտարարություն");
        }

        public static void GetInternationalTransferApplicationForm(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/InternationalTransferApplicationForm", parameters, ExportFormat.PDF, "InternationalTransferApplicationForm");
        }

        public static void GetReceivedBankMailTransfer(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/BankMail", parameters, ExportFormat.PDF, "BankMail");
        }

        public static void GetCrossConvertationCash(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Cross_Convertation_Cash", parameters, ExportFormat.PDF, "CrossConvertationPaymentOrder");
        }

        public static void GetCrossConvertationCashNonCash(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Cross_Convertation_Cash_NonCash", parameters, ExportFormat.PDF, "CrossConvertationPaymentOrder");
        }

        public static void GetCrossConvertationNonCashCash(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Cross_Convertation_NonCash_Cash", parameters, ExportFormat.PDF, "CrossConvertationPaymentOrder");
        }

        public static void GetPrixRasxOperations(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Prix_Rasx_Operations", parameters, ExportFormat.PDF, "Prix_Rasx_Operations");
        }


        public static void GetCashInPaymentOrderDetailsForRATransfer(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Transfer_Without_Account_Report", parameters, ExportFormat.PDF, "TransitPaymentOrder");
        }



        public static void CashBookAccountStatementReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Account_Statement_Report_For_Cash_Book", parameters, ExportFormat.PDF, "CashBookAccountStatement");
        }

        public static void TrashPaymentReport(Dictionary<string, string> parameters, byte operationType)
        {
            if (operationType == 0)
            {
                RenderReport("/ACBAReports/Trash_Payment_Report_PL_POR", parameters, ExportFormat.PDF, "TrashPayment");
            }
            else
            {
                RenderReport("/ACBAReports/Trash_Payment_Report_CASH", parameters, ExportFormat.PDF, "TrashPayment");
            }
        }


        public static void PensionCloseApplicationContract(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Pension_Application", parameters, ExportFormat.PDF, "Pension_Application");
        }

        public static void GetCashInByReestrAmounts(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Cash_In_By_Reestr_Amounts", parameters, ExportFormat.PDF, "PaymentOrder");
        }

        public static void GetCashInByReestr(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Cash_In_By_Reestr", parameters, ExportFormat.PDF, "PaymentOrder");
        }

        public static void GetCashInByReestrNote(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Cash_In_By_Reestr_Note", parameters, ExportFormat.PDF, "PaymentOrder");
        }


        public static void PosStatement(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/POS_Statement_Report", parameters, exportFormat, "PosAccountStatement");
        }

        public static void SMSMessagingReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/SMS_notification_REPORT_for_cards", parameters, ExportFormat.Excel, "SMSNotificationReportForCards");
        }


        public static void WaterCoPaymentReport(Dictionary<string, string> parameters, byte operationType)
        {
            
            RenderReport("/ACBAReports/WaterCo_Payment_Report_CASH", parameters, ExportFormat.PDF, "GasPayment");
           
        }


        public static void CurrentAccountJournalReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/Current_Account_Journal_Report", parameters, exportFormat, "CurrentAccountJournalReport");
        }

        public static void ClosedCurrentAccountJournalReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/Closed_Current_Account_Journal_Report", parameters, exportFormat, "ClosedCurrentAccountJournalReport");
        }
        
        public static void ReopenededCurrentAccountJournalReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/Reopeneded_Current_Account_Journal_Report", parameters, exportFormat, "ReopenededCurrentAccountJournalReport");
        }

        public static void DepositsJournalReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/Deposits_Journal_Report", parameters, exportFormat, "DepositsJournalReport");
        }


        public static void GetListOfCustomerDeposits(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/Rep_ListOfCustomerDeposits", parameters, ExportFormat.Excel, "ListOfCustomerDeposits");
        }

        public static void PrintWaterCoPaymentReportREESTR(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/WaterCo_Payment_Report_REESTR", parameters, ExportFormat.PDF, "WaterCoPaymentReportREESTR");
        }

        public static void PrintIntraTransactionsByPeriod(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/Intra_Transactions_By_Period", parameters, exportFormat, "IntraTransactionsByPeriod");
        }

        public static void PrintGivenCardsReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/GivenCardsReport", parameters, exportFormat, "GivenCardsReport");
        }

        public static void PrintCashTransactionExceededReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/CashTransactionExceeded", parameters, exportFormat, "CashTransactionExceeded");
        }

        public static void PrintCardsOverAccRestsReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/VisaOverAccRests", parameters, exportFormat, "VisaOverAccRests");
        }
        public static void DepositRepaymentsDetailedGrafik(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/GetProductPercentsAccumulationDetails", parameters, exportFormat, "GetProductPercentsAccumulationDetails");
        }
        public static void NotMaturedLoans(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/NotMaturedLoans", parameters, exportFormat, "NotMaturedLoans");
        }


        public static void ProvisionsReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/ProvisionsReport", parameters, exportFormat, "ProvisionsReport");
        }

        public static void CardStatementSession(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/CardStatementSession", parameters, exportFormat, "CardStatementSession");
        }

        public static void PrintPeriodicTransferReport(Dictionary<string, string> parameters, ExportFormat format,short periodicTransferType)
        {
            switch (periodicTransferType)
            {
                case 1: { RenderReport("/ACBAReports/O_B_P_Expired", parameters, format, "O_B_P_Expired"); break; }
                case 2: { RenderReport("/ACBAReports/O_B_P_NotExecuted", parameters, format, "O_B_P_NotExecuted"); break; }
                case 3: { RenderReport("/ACBAReports/O_B_P_Counts", parameters, format, "O_B_P_Counts"); break; }
                case 4: { RenderReport("/ACBAReports/Introduced_O_B_P_Counts", parameters, format, "Introduced_O_B_P_Counts"); break; }
                default: { break; }
            }
        }

        public static void PrintClosedDepositReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/ClosedDepositsReport", parameters, exportFormat, "ClosedDepositsReport");
        }

        public static void PrintDailyBalanceReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/DailyBalanceReport", parameters, exportFormat, "DailyBalanceReport");
        }

        public static void PrintReceivedSwiftTransfer(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/SwiftTransferMessage", parameters, ExportFormat.PDF, "SwiftTransferMessage");
        }

        public static void PrintCashJurnal(Dictionary<string, string> parameters, ExportFormat format, byte cashJurnalType)
        {
            if (cashJurnalType == 0)
            {
                RenderReport("/ACBAReports/CashDailyFlow", parameters, format, "CashDailyFlow");
            }
            else
            {
                RenderReport("/ACBAReports/CashJournalDailyReport", parameters, format, "CashJournalDailyReport");
            }
        }

        public static void CashTotalQuantityReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/CashTotalQuantityReport", parameters, exportFormat, "CashTotalQuantityReport");
        }

        public  static void PrintPaidTransfers(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/PaidTransfers​", parameters, ExportFormat.Excel, "PaidTransfers​");
        }

        public static void BankMailTransfers(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/BankMailTransfers​", parameters, ExportFormat.Excel, "BankMailTransfers​");
        }

      

        public static void BondCustomerCard(Dictionary<string, string> parameters, int customerType)
        {
            if (customerType == 6)
            {
                RenderReport("/ACBAReports/BondCustomerCard", parameters, ExportFormat.PDF, "BondCustomerCard");
            }
            else
            {
                RenderReport("/ACBAReports/BondCustomerCardLegal", parameters, ExportFormat.PDF, "BondCustomerCard");
            }
        }



        public static void TransfersByCallReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/Transfers_By_Call_Report", parameters, exportFormat, "Transfers_By_Call_Report");
        }

        public static void HBActiveUsersReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/ActiveTokensByFilialsReport", parameters, exportFormat, "ActiveTokensByFilialsReport");
        }
        

        public static void CashBookReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {

            RenderReport("/ACBAReports/CashBookReport", parameters, exportFormat, "CashBookReport");
        }

        public static void CashBookTotalReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {

            RenderReport("/ACBAReports/CashBookReportTotal", parameters, exportFormat, "CashBookReportTotal");
        }
        public static void StoredCreditProductsByCustReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {

            RenderReport("/ACBAReports/StoredCreditProductsByCustReport", parameters, exportFormat, "StoredCreditProductsByCustReport");
        }
        public static void StoredCreditProductReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {

            RenderReport("/ACBAReports/StoredCreditProductReport", parameters, exportFormat, "StoredCreditProductReport");
        }
        public static void ReportOfLoansToOutBalance(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {

            RenderReport("/ACBAReports/ReportOfLoansToOutBalance", parameters, exportFormat, "ReportOfLoansToOutBalance");
        }
        public static void ReportOfLoansReturningToOutBalance(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {

            RenderReport("/ACBAReports/ReportOfLoansReturningToOutBalance ", parameters, exportFormat, "ReportOfLoansReturningToOutBalance ");
        }
        public static void SaledEquipmentsReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {

            RenderReport("/ACBAReports/SaledEquipmentsReport", parameters, exportFormat, "SaledEquipmentsReport");
        } 

        public static void PrintSalPaymentReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {

            RenderReport("/ACBAReports/SalPaymentReport", parameters, exportFormat, "SalPaymentReport");
        }

        public static void FondAccountsList(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
                RenderReport("/ACBAReports/FondAccountsList", parameters, exportFormat, "CardStatement");
        }

        
        public static void GetArcaCardsTransactionsReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/ArcaCardsTransactions", parameters, ExportFormat.Excel, "ArcaCardsTransactions");
        }

        public static void TransactionReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/OnlineBankingOrdersReport", parameters, exportFormat, "OnlineBankingOrdersReport");
        }
        public static void GetHBApplicationReport(Dictionary<string, string> parameters,byte HBApplicationReportType)
        {
            switch (HBApplicationReportType)
            {
                case 1:
                    RenderReport("/ACBAReports/IBankingUsersCount", parameters, ExportFormat.Excel, "IBankingUsersCount");
                    break;
                case 2:
                    RenderReport("/ACBAReports/IBankingContractsCount", parameters, ExportFormat.Excel, "IBankingContractsCount");
                    break;
                case 3:
                    RenderReport("/ACBAReports/HBUsersActivity", parameters, ExportFormat.Excel, "HBUsersActivity");
                    break;

            }
        }

        public static void PrintHBApplicationsAndOrdersReport(Dictionary<string, string> parameters, ExportFormat format)
        {
            RenderReport("/ACBAReports/HBApplicationsAndOrdersReport", parameters, format, "HBApplicationsAndOrdersReport");
        }


        public static void GetHbDocumentsReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/HBDocumentsReport", parameters, ExportFormat.Excel, "HBDocumentsReport");
        }

        public static void PrintAparikReport(Dictionary<string, string> parameters, ExportFormat format, byte aparikReportType)
        {
            switch (aparikReportType)
            {
                case 1:
                    RenderReport("/ACBAReports/Aparik_Report_Submitted", parameters, format, "AparikReportSubmitted");
                    break;
                case 2:
                    RenderReport("/ACBAReports/Aparik_Report_Given", parameters, format, "AparikReportGiven");
                    break;
                case 3:
                    RenderReport("/ACBAReports/Aparik_Report_Current", parameters, format, "AparikReportCurrent");
                    break;

            }
        }

        public static void PrintSSTOperationsReport(Dictionary<string, string> parameters, ExportFormat format, byte SSTReportType)
        {
            switch (SSTReportType)
            {
                case 1: { RenderReport("/ACBAReports/SSTerminal_Operations_NATK", parameters, format, "SSTerminalOperationsNATK"); break; }
                case 2: { RenderReport("/ACBAReports/SSTerminal_Operations_ACBA", parameters, format, "SSTerminalOperationsACBA"); break; }
                case 3: { RenderReport("/ACBAReports/SSTerminal_Operations_Not_Exist_In_ACBA", parameters, format, "SSTerminalOperationsNotExistInACBA"); break; }
                case 4: { RenderReport("/ACBAReports/SSTerminal_Operations_To_Resend", parameters, format, "SSTerminalOperationsToResend"); break; }
                case 5: { RenderReport("/ACBAReports/SSTerminal_Incomplete_Operations_NATK", parameters, format, "SSTerminalIncompleteOperationsNATK"); break; }
                default: { break; }
            }

        }

        public static void PrintEOGetClientResponsesReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/EO_Get_Client_Responses_Report", parameters, exportFormat, "EOGetClientResponsesReport");
        }

        public static void ForgivenessReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/CreditCommitmentForgiveness​", parameters, exportFormat, "CreditCommitmentForgiveness​");
        }

        public static void PrintVirtualCardsReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/Tokenization_Card_Report", parameters, exportFormat, "TokenizationCardReport");
        }

        public static void TerminalReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/TerminalReport​", parameters, exportFormat, "TerminalReport​");
        }

        public static void GetPlasticCardOrdersReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/PlasticCardOrdersReport", parameters, ExportFormat.Excel, "PlasticCardOrders");
        }
        public static void PrintCardsToBeShippedReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/CardsToBeShippedReport", parameters, exportFormat, "CardsToBeShippedReport");
        }
        public static void PrintRemoteServicesMonitoringReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/RemoteServicesMonitoringReport", parameters, ExportFormat.Excel, "RemoteServicesMonitoringReport");
        }
        public static void GetCardAccountClosingApplication(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/CardAccountClosingApplication", parameters, ExportFormat.PDF, "CardAccountClosingApplication");
        }

        public static void PrintVDTransfersReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/VisaDirect-MasterMoneySend", parameters, exportFormat, "VDTransfersReport");
        }

        internal static void PrintLeasingCustomerConnectionData(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/RepLeasingCastomerConnection", parameters, ExportFormat.Excel, "RepLeasingCastomerConnection");
        }

        internal static void PrintOneMoreTimeClassifiedCustomersReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/RepLeasingOneMoreClassifiedCustomers", parameters, ExportFormat.Excel, "RepLeasingCastomerConnection");
        }
        public static void GetCreditLineOrderReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/CreditLine_Orders_Report", parameters, ExportFormat.Excel, "CreditLineOrder");
        }
        public static void GetClosedCreditLineOrderReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/ClosedCreditLine_Orders_Report", parameters, ExportFormat.Excel, "ClosedCreditLineOrder");
        }
        public static void GetProlongCreditLineOrderReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/ProlongCreditLine_Orders_Report", parameters, ExportFormat.Excel, "ProlongCreditLineOrder");
        }
        public static void LeasingStatementSession(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/LeasingStatementSession", parameters, exportFormat, "LeasingStatementSession");
        }

        public static void PrintLeasingCustomersWithoutEmailReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/LeasingCustomersWithoutEmail", parameters, exportFormat, "LeasingCustomersWithoutEmail");
        }

        public static void PrintLeasingCustomersWithoutEmailForStatementReport(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/LeasingCustomersWithoutEmailForStatement", parameters, exportFormat, "LeasingCustomersWithoutEmailForStatement");
        }

        public static void PrintLeasingSchedules(Dictionary<string, string> parameters, string exportFormat)
        {
            RenderReport("/ACBAReports/LeasingScheduleNonSubsid", parameters, ExportFormat.PDF, "LeasingScheduleNonSubsid");
        }
        public static void PrintLeasingSchedulesSubsid(Dictionary<string, string> parameters, string exportFormat)
        {
            RenderReport("/ACBAReports/LeasingScheduleSubsid", parameters, ExportFormat.PDF, "LeasingScheduleSubsid");
        }

        public static void PrintLeasingCustomersWithOpenBaseReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/LeasingCustomerWithOpenClassificationBasis", parameters, ExportFormat.Excel, "LeasingCustomerWithOpenClassificationBasis");
        }

        public static void PrintLeasingClassificationBaseChangedCustomersReport(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/LeasingClassificationBasisChangedCustomers", parameters, ExportFormat.Excel, "LeasingClassificationBasisChangedCustomers");
        }

        public static void LoanStatementSession(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/LoanStatementSession", parameters, exportFormat, "LoanStatementSession");
        }

        public static void PrintStakRemittancePayoutOrder(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/StakRemittancePayoutOrder", parameters, ExportFormat.PDF, "StakRemittancePayoutOrder");

        }

        public static void GetSTAKSendMoneyApplicationForm(Dictionary<string, string> parameters)
        {
            RenderReport("/ACBAReports/STAKSendMoneyApplicationForm", parameters, ExportFormat.PDF, "STAKSendMoneyApplicationForm");
        }

        public static void PrintHypotecLoanStatement(Dictionary<string, string> parameters, ExportFormat exportFormat)
        {
            RenderReport("/ACBAReports/Hypotec_Statment", parameters, exportFormat, "LoanStatement");
        }

    }
}
