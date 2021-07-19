using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBManagement
{
    public partial class HBUserLog

    {
        public string TimeStampString
        {
            get
            {
                return TimeStamp.ToString("dd/MM/yy HH:mm:ss");
            }
        }
    }
}