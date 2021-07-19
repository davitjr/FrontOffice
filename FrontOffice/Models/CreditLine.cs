
namespace FrontOffice.XBS
{
    public partial class CreditLine
    {
        public string CreditLineAccountNumber
        {
            get
            {
                string result="";
                if(this.LoanAccount!=null)
                        result = this.LoanAccount.AccountNumber;

                return result;

            }
        }
        public string StartDateToString
        {
            get
            {
                return StartDate.ToString("dd/MM/yyyy");
            }
        }
        public string EndDateToString
        {
            get
            {
                return EndDate.ToString("dd/MM/yyyy");
            }
        }
        public string StartCapitalString
        {
            get
            {
                if (isAccessible)
                    return StartCapital.ToString("#,0.00");
                else
                    return "*****";
            }
        }
        public string CurrentCapitalToString
        {
            get
            {
                if (isAccessible)
                    return (CurrentCapital * -1).ToString("#,0.00");
                else
                    return "*****";
            }
        }
        public string CreditCapital
        {
            get
            {
                if (isAccessible)
                    return (CurrentCapital + StartCapital).ToString("#,0.00");
                else
                    return "*****";
            }
        }
        public string CurrentRateValueString
        {
            get
            {
                return CurrentRateValue.ToString("#,0.00");
            }
        }
               
        public string ProductTypeDescription
        {
            get
            {
                if (TypeDescription == null)
                    return "";
                else
                    return TypeDescription.ToString();
            }
        }
        public double PetTurq { get; set; }
        public bool isAccessible
        {
            get
            {
                return LoanAccount.isAccessible;
            }
        }
    }
}