using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class MembershipRewardsStatusHistory
    {
        public string ChangeDateToString
        {
            get
            {
                return ChangeDate.ToString("dd/MM/yyyy HH:mm:ss");
            }
        }
    }
}