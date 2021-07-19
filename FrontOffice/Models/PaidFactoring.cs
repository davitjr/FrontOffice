using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class PaidFactoring
    {
#pragma warning disable CS0108 // 'PaidFactoring.CurrentCapitalString' hides inherited member 'Loan.CurrentCapitalString'. Use the new keyword if hiding was intended.
        public string CurrentCapitalString
#pragma warning restore CS0108 // 'PaidFactoring.CurrentCapitalString' hides inherited member 'Loan.CurrentCapitalString'. Use the new keyword if hiding was intended.
        {
            get
            {
                if (isAccessible)
                    return CurrentCapital.ToString("#,0.00");
                else
                    return "*****";
            }
        }
#pragma warning disable CS0108 // 'PaidFactoring.isAccessible' hides inherited member 'Loan.isAccessible'. Use the new keyword if hiding was intended.
        public bool isAccessible
#pragma warning restore CS0108 // 'PaidFactoring.isAccessible' hides inherited member 'Loan.isAccessible'. Use the new keyword if hiding was intended.
        {
            get
            {
                return LoanAccount.isAccessible;
            }
        }
    }
}