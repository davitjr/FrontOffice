using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class Guarantee
    {
#pragma warning disable CS0108 // 'Guarantee.CurrentCapitalString' hides inherited member 'Loan.CurrentCapitalString'. Use the new keyword if hiding was intended.
        public String CurrentCapitalString
#pragma warning restore CS0108 // 'Guarantee.CurrentCapitalString' hides inherited member 'Loan.CurrentCapitalString'. Use the new keyword if hiding was intended.
        {
            get 
            {
                if (isAccessible)
                    return CurrentCapital.ToString("#,0.00");
                else
                    return "*****";
            }
        }

#pragma warning disable CS0108 // 'Guarantee.StartCapitalString' hides inherited member 'Loan.StartCapitalString'. Use the new keyword if hiding was intended.
        public String StartCapitalString
#pragma warning restore CS0108 // 'Guarantee.StartCapitalString' hides inherited member 'Loan.StartCapitalString'. Use the new keyword if hiding was intended.
        {
            get
            {
                if (isAccessible)
                    return StartCapital.ToString("#,0.00");
                else
                    return "*****";
            }
        }

#pragma warning disable CS0108 // 'Guarantee.isAccessible' hides inherited member 'Loan.isAccessible'. Use the new keyword if hiding was intended.
        public bool isAccessible
#pragma warning restore CS0108 // 'Guarantee.isAccessible' hides inherited member 'Loan.isAccessible'. Use the new keyword if hiding was intended.
        {
            get
            {
                return ConnectAccount.isAccessible;
            }
        }
    }
}