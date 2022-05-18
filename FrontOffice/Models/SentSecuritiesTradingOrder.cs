using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class SentSecuritiesTradingOrder
    {
        public string RegistrationDateString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yy");
            }
        }

        public string ChangeDateString
        {
            get
            {
                return ChangeDate.ToString("dd/MM/yy HH:mm");
            }
        }

    }
}