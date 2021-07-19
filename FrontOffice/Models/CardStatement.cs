using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class CardStatement
    {
        public string InitialBalanceToString 
        {
            get { return InitialBalance.ToString("#,0.00"); }
        }
        public string TotalDebitAmountToString
        {
            get { return TotalDebitAmount.ToString("#,0.00"); }
        }
        public string TotalCreditAmountToString
        {
            get { return TotalCreditAmount.ToString("#,0.00"); }
        }
        public string FinalBalanceToString
        {
            get { return FinalBalance.ToString("#,0.00"); }
        }
    }
}