
namespace FrontOffice.XBS
{
    public partial class CreditLineGrafik
    {
        public string AmountToString
        {
            get
            {
                return Amount.ToString("#,0.00");
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
        public string PlannedAmountToString
        {
            get
            {
                return PlannedAmount.ToString("#,0.00");
            }
        }
        public string MaturedAmountToString
        {
            get
            {
                return MaturedAmount.ToString("#,0.00");
            }
        }
    }
}