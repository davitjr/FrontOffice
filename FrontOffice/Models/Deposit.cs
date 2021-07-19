using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class Deposit
    {
        public string StartDateToString
        {
            get
            {
                return StartDate.ToString("dd/MM/yyyy");
            }
        }
        public string EndDateToString
        {
            get
            {
                if (EndDate == default(DateTime))
                {
                    return "-";
                }
                else
                {
                    return EndDate.ToString("dd/MM/yyyy");
                }
                
            }
        }
        public string BalanceString
        {
            get
            {
                if (DepositAccount.isAccessible)
                    return DepositAccount.Balance.ToString("#,0.00");
                else
                    return "*****";
            }
        }
        public string CurrentRateValueString
        {
            get
            {
                return CurrentRateValue.ToString("#,0.00");
            }
        }
        public List<string> ThirdPersonDescription { get; set; }

        public string StartCapitalString
        {
            get
            {
                if (DepositAccount.isAccessible)
                    return StartCapital.ToString("#,0.00");
                else
                    return "*****";
            }
        }

        public string CancelRateValueString
        {
            get
            {
                return CancelRateValue.ToString("#,0.00");
            }
        }

        public string ProfitOnMonthFirstDayString
        {
            get
            {
                return ProfitOnMonthFirstDay.ToString("#,0.00");
            }
        }
        public bool isAccessible
        {
            get
            {
                return DepositAccount.isAccessible;
            }
        }
    }
}