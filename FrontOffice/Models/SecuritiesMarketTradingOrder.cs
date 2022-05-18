using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class SecuritiesMarketTradingOrder
    {

        public string RegistrationDateString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yy");
            }
        }
        public string SecuritiTrandingOrderDateString
        {
            get
            {
                return SecuritiTrandingOrderDate.ToString("dd/MM/yyyy  HH:mm ");
            }
        }
    }
}