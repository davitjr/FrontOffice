namespace FrontOffice.XBS
{
    public partial class DepositRepayment
    {
        public string DateOfRepaymentString
        {
            get
            {
                return DateOfRepayment.ToString("dd/MM/yyyy");
            }
        }
        public string ProfitTaxToString
        {
            get
            {
                return ProfitTax.ToString("#,0.00");
            }
        }
        public string CapitalRepaymentToString
        {
            get
            {
                return CapitalRepayment.ToString("#,0.00");
            }
        }
        public string RateRepaymentToString
        {
            get
            {
                return RateRepayment.ToString("#,0.00");
            }
        }
    }
}