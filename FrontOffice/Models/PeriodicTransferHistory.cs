using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class PeriodicTransferHistory
    {
        public string AmountString
        {
            get
            {
                return Amount.ToString("#,0.00");
            }
        }
    }
}