using System;

namespace FrontOffice.XBS
{
    public partial class Card
    {
        public string BalanceString
        {
            get
                {
                    if (isAccessible)
                        return Balance.ToString("#,0.00");
                    else
                    {
                        Balance = 0;
                        if (CreditLine != null)
                        {
                            CreditLine.StartCapital = 0;
                        }
                        return "*****";
                    }                        
                }
        }
        public string ClosingDateString
        {
            get
            {
                return ClosingDate != null ? ClosingDate.Value.ToString("dd/MM/yy") : "null";
            }
        }
        public double ServiceFee { get; set; }
        public double AMEX_MRServiceFee { get; set; }
        public string PetTurk { get; set; }
        
        public string CreditCapital { get { if (CreditLine != null) { return (CreditLine.CurrentCapital + CreditLine.StartCapital).ToString("#,0.00"); } return ""; } }
        public string CreditStartCapitalToString { get { if (CreditLine != null) { return CreditLine.StartCapital.ToString("#,0.00"); } return ""; } }
        public string CreditLineStartDateToString { get { if (CreditLine != null) { return CreditLine.StartDate.ToString("dd/MM/yyyy"); } return ""; } }
        public string CreditLineEndDateToString { get { if (CreditLine != null) { return CreditLine.EndDate.ToString("dd/MM/yyyy"); } return ""; } }
        public string CurrentCapitalToString { get { if (CreditLine != null) { return (CreditLine.CurrentCapital*-1).ToString("#,0.00"); } return ""; } }
        public string Totoal { get { if (CreditLine != null) { return (Math.Abs(CreditLine.CurrentCapital)+CreditLine.PenaltyRate+CreditLine.JudgmentRate+CreditLine.CurrentRateValue).ToString("#,0.00"); } return ""; } }
        public string Percent { get { if (CreditLine != null) { return (Math.Abs(CreditLine.PenaltyRate) + Math.Abs(CreditLine.CurrentRateValue) + Math.Abs(CreditLine.JudgmentRate)).ToString("#,0.00"); } return ""; } }
        public string Overdue { get { if (CreditLine != null) { return (CreditLine.OverdueCapital+CreditLine.InpaiedRestOfRate+CreditLine.PenaltyRate+CreditLine.JudgmentRate).ToString("#,0.00"); } return ""; } }
        public string PercPenalty { get { if (CreditLine != null) { return (CreditLine.InpaiedRestOfRate+CreditLine.PenaltyRate).ToString("#,0.00"); } return ""; } }

        public bool isAccessible
        {
            get
            {
                if(CardAccount != null)
                {
                    return CardAccount.isAccessible;
                }
                else
                {
                    return false;
                }
                
            }
        }

        public DAHKDetail DAHKDetail { get; set; }
    }

}