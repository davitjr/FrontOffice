using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FrontOffice.Service;
using xbs = FrontOffice.XBS;
using acba = FrontOffice.ACBAServiceReference;
using FrontOffice.Models;
using System.Web.SessionState;

namespace FrontOffice.Controllers
{
    [SessionExpireFilter]
    [SessionState(SessionStateBehavior.ReadOnly)]
    public class OutPutReportsController : Controller
    {
        public ActionResult Reports()
        {
            return PartialView("Reports");
        }

        [AllowAnonymous]
        public ActionResult Index()
        {
            return View("Reports");
        }

        public void CurrentAccountJournalReport(DateTime? startDate, DateTime? endDate, ExportFormat format = ExportFormat.PDF)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            if (startDate != null)
                parameters.Add(key: "start_date", value: startDate.Value.ToString("dd/MMM/yy"));
            if (endDate != null)
                parameters.Add(key: "end_date", value: endDate.Value.ToString("dd/MMM/yy"));

            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            ReportService.CurrentAccountJournalReport(parameters, format);
        }

        public void ClosedCurrentAccountJournalReport(DateTime? startDate, DateTime? endDate, ExportFormat format = ExportFormat.PDF)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            ReportService.ClosedCurrentAccountJournalReport(parameters, format);
        }
        
        public void ReopenededCurrentAccountJournalReport(DateTime? startDate, DateTime? endDate, ExportFormat format = ExportFormat.PDF)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            ReportService.ReopenededCurrentAccountJournalReport(parameters, format);
        }

        public void DepositsJournalReport(DateTime? startDate, DateTime? endDate, uint setNumber, string currency, ushort depositType, ushort quality, ExportFormat format = ExportFormat.PDF)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            int depositReportMember = 0;


            SessionProperties sessionProperties = ((SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"]);

            if (sessionProperties.IsChiefAcc || sessionProperties.IsManager)
                depositReportMember = 1;

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            if (quality == 0)
            {
                depositReportMember = 1;
                if (startDate != null)
                    parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
                else
                    parameters.Add(key: "startDate", value: null);
                if (endDate != null)
                    parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
                else
                    parameters.Add(key: "endDate", value: null);
            }
            else
            {
                parameters.Add(key: "startDate", value: null);
                parameters.Add(key: "endDate", value: null);
            }

            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            if (setNumber != 0 && depositReportMember == 1)
                parameters.Add(key: "setNumber", value: setNumber.ToString());

            if (!string.IsNullOrEmpty(currency))
                parameters.Add(key: "currency", value: currency);

            if (depositType != 0)
                parameters.Add(key: "depositType", value: depositType.ToString());

            parameters.Add(key: "depositReportMember", value: depositReportMember.ToString());

            if (depositReportMember == 0)
                parameters.Add(key: "userID", value: currentUser.userID.ToString());

            parameters.Add(key: "quality", value: quality.ToString());


            ReportService.DepositsJournalReport(parameters, format);
        }

        public void IntraTransactionsByPeriodReport(DateTime? startDate, DateTime? endDate, ExportFormat format = ExportFormat.PDF)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            ReportService.PrintIntraTransactionsByPeriod(parameters, format);
        }

        public void CashTransactionExceededReport(DateTime? startDate, DateTime? endDate, ExportFormat format = ExportFormat.PDF)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            ReportService.PrintCashTransactionExceededReport(parameters, format);
        }

        public void CardsOverAccRestsReport(DateTime? calculationDate, ExportFormat format = ExportFormat.PDF)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();


            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            if (calculationDate != null)
                parameters.Add(key: "dCalc", value: calculationDate.Value.ToString("dd/MMM/yy"));

            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            ReportService.PrintCardsOverAccRestsReport(parameters, format);
        }

        public void GivenCardsReport(DateTime? startDate, DateTime? endDate, byte dateType, string cardSystemType, string cardType, int relatedOfficeNumber, string cardCurrency, ExportFormat format = ExportFormat.PDF)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            parameters.Add(key: "filDeb", value: currentUser.filialCode.ToString());

#pragma warning disable CS0472 // The result of the expression is always 'true' since a value of type 'int' is never equal to 'null' of type 'int?'
            if (dateType != null)
#pragma warning restore CS0472 // The result of the expression is always 'true' since a value of type 'int' is never equal to 'null' of type 'int?'
                parameters.Add(key: "dateType", value: dateType.ToString());

            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));

            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            if (!string.IsNullOrEmpty(cardCurrency))
                parameters.Add(key: "cardCurrency", value: cardCurrency);

            if (cardSystemType != string.Empty)
                parameters.Add(key: "card", value: cardSystemType);

            if (cardType != string.Empty)
                parameters.Add(key: "cardType", value: cardType);

            if (relatedOfficeNumber != 0)
                parameters.Add(key: "cardOffice", value: relatedOfficeNumber.ToString());

            ReportService.PrintGivenCardsReport(parameters, format);
        }

        public void PrintProvisionsReport(DateTime? startDate, DateTime? endDate, byte activeType, byte loanType, byte quality, ExportFormat format = ExportFormat.PDF)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));

            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

#pragma warning disable CS0472 // The result of the expression is always 'true' since a value of type 'int' is never equal to 'null' of type 'int?'
            if (activeType != null)
#pragma warning restore CS0472 // The result of the expression is always 'true' since a value of type 'int' is never equal to 'null' of type 'int?'
                parameters.Add(key: "activeType", value: activeType.ToString());

#pragma warning disable CS0472 // The result of the expression is always 'true' since a value of type 'int' is never equal to 'null' of type 'int?'
            if (loanType != null)
#pragma warning restore CS0472 // The result of the expression is always 'true' since a value of type 'int' is never equal to 'null' of type 'int?'
                parameters.Add(key: "loanType", value: loanType.ToString());

#pragma warning disable CS0472 // The result of the expression is always 'true' since a value of type 'int' is never equal to 'null' of type 'int?'
            if (quality != null)
#pragma warning restore CS0472 // The result of the expression is always 'true' since a value of type 'int' is never equal to 'null' of type 'int?'
                parameters.Add(key: "quality", value: quality.ToString());

            parameters.Add(key: "onlyYerevanFilials", value: "0");

            ReportService.ProvisionsReport(parameters, format);
        }

        public void PrintNotMaturedLoans(ExportFormat format = ExportFormat.PDF)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            parameters.Add(key: "customerNumber", value: "0");

            ReportService.NotMaturedLoans(parameters, format);
        }


        public void PrintPeriodicTransferReport(DateTime? startDate, DateTime? endDate, ExportFormat format, byte obpStarts, byte periodicTransferType)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            if (periodicTransferType != 3)
            {
                if (startDate != null)
                    parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));

                if (endDate != null)
                    parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
            }

            if (obpStarts != 0)
                parameters.Add(key: "O_B_P_Starts", value: obpStarts.ToString());

            ReportService.PrintPeriodicTransferReport(parameters, format, periodicTransferType);

        }

        public void PrintClosedDepositReport(DateTime? startDate, DateTime? endDate, ExportFormat format, byte reportType)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            string depositReportMember = "0";
            depositReportMember = currentUser.AdvancedOptions["depositReportMember"];
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));

            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            parameters.Add(key: "reportType", value: reportType.ToString());
            parameters.Add(key: "depositReportMember", value: depositReportMember);
            ReportService.PrintClosedDepositReport(parameters, format);

        }

        public void PrintDailyBalanceReport(DateTime? startDate, DateTime? endDate, ExportFormat format, bool byOldPlan)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));

            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            string byOldPlanString = byOldPlan == true ? "1" : "0";
            parameters.Add(key: "byOldPlan", value: byOldPlanString);

            ReportService.PrintDailyBalanceReport(parameters, format);

        }

        public void PrintCashJurnalReport(DateTime? startDate, byte cashJurnalType, byte onlyInkasDepartment, ExportFormat format)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            if (startDate != null)
                parameters.Add(key: "dCalc", value: startDate.Value.ToString("dd/MMM/yy"));
            parameters.Add(key: "onlyInkasDepartment", value: onlyInkasDepartment.ToString());
            switch (cashJurnalType)
            {
                case 1:
                    {
                        parameters.Add(key: "deb_cred", value: "d");
                        parameters.Add(key: "otherCur", value: "false");
                        ReportService.PrintDailyBalanceReport(parameters, format);
                        break;
                    }
                case 2:
                    {
                        parameters.Add(key: "deb_cred", value: "c");
                        parameters.Add(key: "otherCur", value: "false");
                        break;
                    }
                case 3:
                    {
                        parameters.Add(key: "deb_cred", value: "d");
                        parameters.Add(key: "otherCur", value: "true");
                        break;
                    }
                case 4:
                    {
                        parameters.Add(key: "deb_cred", value: "c");
                        parameters.Add(key: "otherCur", value: "true");
                        break;
                    }
                default: { break; }
            }
            ReportService.PrintCashJurnal(parameters, format, cashJurnalType);
        }

        public void CashTotalQuantityReport(DateTime? startDate, byte onlyInkasDepartment, ExportFormat format)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            if (startDate != null)
                parameters.Add(key: "operDay", value: startDate.Value.ToString("dd/MMM/yy"));

            parameters.Add(key: "onlyInkasDepartment", value: onlyInkasDepartment.ToString());
            ReportService.CashTotalQuantityReport(parameters, format);
        }

        public void TransfersByCallReport(DateTime? startDate, DateTime? endDate, ExportFormat format = ExportFormat.PDF)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            ReportService.TransfersByCallReport(parameters, format);
        }

        public void HBActiveUsersReport(ExportFormat format = ExportFormat.PDF)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            //string guid = Utility.GetSessionId();
            //SessionProperties sessionProperties = ((SessionProperties)System.Web.HttpContext.Current.Session[guid + "_SessionProperties"]);
            //if (sessionProperties.AdvancedOptions["isOnlineAcc"] == "1" || sessionProperties.AdvancedOptions["isCardHoldersRelation"] == "1")
            //{
                ReportService.HBActiveUsersReport(parameters, format);
            //}
            //else
            //{
            //    System.Web.HttpContext.Current.Response.StatusCode = 422;
            //    System.Web.HttpContext.Current.Response.StatusDescription = Utility.ConvertUnicodeToAnsi("Գործողությունը հասանելի չէ տվյալ օգտագործողի համար");
            //}
        }

        public void PrintSSTOperationsReport(DateTime? startDate, DateTime? endDate, ExportFormat format, int? authId, string SSTerminalId, string SSTOperationType, short? SSTOperationStatus, byte SSTReportType)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);
            
            switch (SSTReportType)
            {
                case 1:
                case 2:
                    {
                        if (startDate != null)
                            parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
                        if (endDate != null)
                            parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
                        if (authId != null)
                            parameters.Add(key: "authId", value: authId.Value.ToString());
                        if (SSTerminalId != string.Empty)
                            parameters.Add(key: "terminalId", value: SSTerminalId);
                        if (SSTOperationType != string.Empty)
                            parameters.Add(key: "providerID", value: SSTOperationType);
                        if (SSTOperationStatus != null)
                            parameters.Add(key: "operationStatus", value: SSTOperationStatus.Value.ToString());
                        break;
                    }
                case 3:
                    {
                        if (startDate != null)
                            parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
                        if (endDate != null)
                            parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
                        break;
                    }

                default: { break; }
            }

            parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());

            ReportService.PrintSSTOperationsReport(parameters, format, SSTReportType);

        }

        public void PrintEOGetClientResponsesReport(DateTime? startDate, DateTime? endDate, ExportFormat format)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            ReportService.PrintEOGetClientResponsesReport(parameters, format);
        }



        public void ForgivenessReport(DateTime? startDate, DateTime? endDate, short? filialCode, ExportFormat format = ExportFormat.PDF)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            if (startDate != null)
                parameters.Add(key: "StartDate", value: startDate.Value.ToString("dd/MMM/yy"));

            if (endDate != null)
                parameters.Add(key: "EndDate", value: endDate.Value.ToString("dd/MMM/yy"));

            if (currentUser.filialCode.ToString() != "22000")
            {
                parameters.Add(key: "FilialCode", value: currentUser.filialCode.ToString());
            }
            else
            {
                parameters.Add(key: "FilialCode", value: filialCode == null ? "0" : filialCode.ToString());
            }

            ReportService.ForgivenessReport(parameters, format);
        }

        public ushort GetUserFilialCode()
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            return currentUser.filialCode;
        }

        public void TransactionReport(DateTime? startDate, DateTime? endDate, short? filialCode, ExportFormat format = ExportFormat.Excel)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();
            if (startDate != null)
                parameters.Add(key: "StartDate", value: startDate.Value.ToString("dd/MMM/yy"));
            if (endDate != null)
                parameters.Add(key: "EndDate", value: endDate.Value.ToString("dd/MMM/yy"));

            if (currentUser.filialCode.ToString() != "22000")
            {
                parameters.Add(key: "FilialCode", value: currentUser.filialCode.ToString());
            }
            else
            {
                parameters.Add(key: "FilialCode", value: filialCode == null ? "0" : filialCode.ToString());
            }

            ReportService.TransactionReport(parameters, format);
        }

        public void GetHBApplicationReport(DateTime? endDate, short? filialCode, byte HBApplicationReportType)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
            if (currentUser.filialCode.ToString() != "22000")
                parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            else
                parameters.Add(key: "filialCode", value: filialCode != null ? filialCode.ToString() : "0");
            ReportService.GetHBApplicationReport(parameters, HBApplicationReportType);
        }

        public void PrintHBApplicationsAndOrdersReport(DateTime? startDate, DateTime? endDate, short? filialCode, ExportFormat format)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));

            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            if (currentUser.filialCode.ToString() != "22000")
            {
                parameters.Add(key: "filialCode", value: currentUser.filialCode.ToString());
            }
            else if (filialCode != null)
            {
                parameters.Add(key: "filialCode", value: filialCode.ToString());
            }

            ReportService.PrintHBApplicationsAndOrdersReport(parameters, format);
        }

        public void PrintAparikReport(byte aparikReportType, DateTime? startDate, DateTime? endDate, DateTime? calculationDate, byte? fundType, string shopIdentityIDList, string shopIDList, ExportFormat format)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            switch (aparikReportType)
            {
                case 1:
                    {
                        if (startDate != null)
                            parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
                        if (endDate != null)
                            parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
                        if (fundType != null)
                            parameters.Add(key: "fundType", value: fundType.ToString());
                        break;
                    }
                case 2:
                    {
                        if (startDate != null)
                            parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
                        if (endDate != null)
                            parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));
                        break;
                    }
                case 3:
                    {
                        if (calculationDate != null)
                            parameters.Add(key: "reportDate", value: calculationDate.Value.ToString("dd/MMM/yy"));
                        break;
                    }

                default: { break; }
            }

            parameters.Add(key: "shopIdentityIDList", value: shopIdentityIDList.ToString());
            parameters.Add(key: "shopIDList", value: shopIDList.ToString());

            ReportService.PrintAparikReport(parameters, format, aparikReportType);

        }
        public void PrintCardsToBeShippedReport(DateTime? startDate, DateTime? endDate, short? filialCode, string cardNumber, ExportFormat format = ExportFormat.PDF)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));

            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            if (filialCode != null)
                parameters.Add(key: "filialcode", value: filialCode.ToString());

            if (cardNumber != null)
                parameters.Add(key: "cardNumber", value: cardNumber);

            ReportService.PrintCardsToBeShippedReport(parameters, format);
        }




        ////  Տերմինալների հաշվետվություն

        public void TerminalReport(DateTime? date, string terminalId, ExportFormat format = ExportFormat.PDF)
        {
            string guid = Utility.GetSessionId();
            xbs.User currentUser = ((xbs.User)Session[guid + "_User"]);

            Dictionary<string, string> parameters = new Dictionary<string, string>();

            if (date != null)
                parameters.Add(key: "EventDate", value: date.Value.ToString("dd/MMM/yy"));

            if (terminalId != null)
                parameters.Add(key: "Terminal_id", value: terminalId);

            ReportService.TerminalReport(parameters, format);
        }

        public void PrintVirtualCardsReport(DateTime? startDate, DateTime? endDate, ExportFormat format)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            ReportService.PrintVirtualCardsReport(parameters, format);
        }

        public void PrintRemoteServicesMonitoringReport(DateTime? startDate, DateTime? endDate)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();

            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));

            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            ReportService.PrintRemoteServicesMonitoringReport(parameters);
        }

        public void PrintVDTransfersReport(DateTime? startDate, DateTime? endDate, ExportFormat format)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            if (startDate != null)
                parameters.Add(key: "startDate", value: startDate.Value.ToString("dd/MMM/yy"));
            if (endDate != null)
                parameters.Add(key: "endDate", value: endDate.Value.ToString("dd/MMM/yy"));

            ReportService.PrintVDTransfersReport(parameters, format);
        }

    }
   
}
