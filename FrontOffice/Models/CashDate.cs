using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS

{
    public partial class CashOrder
    {
        public string CashDateString
        {
            get
            {
                return CashDate.ToString("dd/MM/yy");
            }
        }
    }
}