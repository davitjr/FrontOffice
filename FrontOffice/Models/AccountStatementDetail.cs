using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class AccountStatementDetail
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