using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class MembershipRewardsBonusHistory
    {
        public string RegistrationDateToString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yyyy");
            }
        }

        public string BonusScoresToString
        {
            get
            {
                if (BonusScores != 0)
                {
                    return BonusScores.ToString("#,0.00");
                }
                return "";
            }
        }
    }
}