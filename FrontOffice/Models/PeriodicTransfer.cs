using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class PeriodicTransfer
    {
        public string PeriodicTransferAccountNumber
        {
            get
            {
                return DebitAccount.AccountNumber;
            }
            set { }
        }

        public string StartDateString
        {
            get
            {
                return StartDate.ToString("dd/MM/yyyy");
            }
            
        }
        public string EndDateString
        {
            get
            {
                return EndDate != null ? EndDate.Value.ToString("dd/MM/yy") : "null";
            }
        }
        public string AmountString
        {
            get
            {
                return Amount.ToString("#,0.00");
            }
        }
        public string FirstTransferDateString
        {
            get
            {
                return FirstTransferDate.ToString("dd/MM/yyyy");
            }

        }
    }
}