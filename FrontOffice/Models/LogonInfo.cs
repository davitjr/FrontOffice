using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBManagement
{
    public partial class LogonInfo
    {
        public string LastGoodLogonDateString
        {
            get
            {
                return LastGoodLogonDate == (DateTime?)null ? string.Empty : LastGoodLogonDate.Value.ToString("dd/MM/yy HH:mm");
            }
        }

        public string LastBadLogonDateString
        {
            get
            {
                return LastBadLogonDate == (DateTime?)null ? string.Empty : LastBadLogonDate.Value.ToString("dd/MM/yy HH:mm");
            }
        }
    }
}