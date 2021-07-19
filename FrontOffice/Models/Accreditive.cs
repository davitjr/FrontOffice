namespace FrontOffice.XBS
{
    public partial class Accreditive
    {

#pragma warning disable CS0108 // 'Accreditive.CurrentCapitalString' hides inherited member 'Loan.CurrentCapitalString'. Use the new keyword if hiding was intended.
        public string CurrentCapitalString
#pragma warning restore CS0108 // 'Accreditive.CurrentCapitalString' hides inherited member 'Loan.CurrentCapitalString'. Use the new keyword if hiding was intended.
        {
            get
            {
                if (isAccessible)
                    return CurrentCapital.ToString("#,0.00");
                else
                    return "*****";
            }
        }
#pragma warning disable CS0108 // 'Accreditive.StartCapitalString' hides inherited member 'Loan.StartCapitalString'. Use the new keyword if hiding was intended.
        public string StartCapitalString
#pragma warning restore CS0108 // 'Accreditive.StartCapitalString' hides inherited member 'Loan.StartCapitalString'. Use the new keyword if hiding was intended.
        {
            get
            {
                if (isAccessible)
                    return StartCapital.ToString("#,0.00");
                else
                    return "*****";
            }
        }
#pragma warning disable CS0108 // 'Accreditive.isAccessible' hides inherited member 'Loan.isAccessible'. Use the new keyword if hiding was intended.
        public bool isAccessible
#pragma warning restore CS0108 // 'Accreditive.isAccessible' hides inherited member 'Loan.isAccessible'. Use the new keyword if hiding was intended.
        {
            get
            {
                return ConnectAccount.isAccessible;
            }
        }
    }
}