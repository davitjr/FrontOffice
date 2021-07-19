using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class AccountStatement
    {
        public string TotalCreditAmountString
        {
            get
            {
                return TotalCreditAmount.ToString("#,0.00");
            }
        }
        public string TotalDebitAmountString
        {
            get
            {
                return TotalDebitAmount.ToString("#,0.00");
            }
        }
        public string InitialBalanceString
        {
            get
            {
                return InitialBalance.ToString("#,0.00");
            }
        }
        public string FinalBalanceString
        {
            get
            {
                return FinalBalance.ToString("#,0.00");
            }
        }
    }
}