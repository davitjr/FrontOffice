using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FrontOffice.XBS
{
    public partial class Loan
    {

        public string CurrentRateValueString
        {
            get
            {
                return CurrentRateValue.ToString("#,0.00");
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
        public string InpaiedRestOfRateString
        {
            get
            {
                return InpaiedRestOfRate.ToString("#,0.00");
            }
        }
        public string CurrentCapitalString
        {
            get
            {
                if (isAccessible)
                    return CurrentCapital.ToString("#,0.00");
                else
                    return "*****";
            }
        }
        public string PenaltyRateString
        {
            get
            {
                return PenaltyRate.ToString("#,0.00");
            }
        }
        public string PenaltyAddString
        {
            get
            {
                return PenaltyAdd.ToString("#,0.00");
            }
        }
        public string TotalFeeString
        {
            get
            {
                return TotalFee.ToString("#,0.00");
            }
        }
        public string TotalRateValueString
        {
            get
            {
                return TotalRateValue.ToString("#,0.00");
            }
        }
        public string DayOfRateCalculationString
        {
            get
            {
                if (DayOfRateCalculation != null)
                {
                    return DayOfRateCalculation.Value.ToString("dd/MM/yy");
                }
                else
                {
                    return "-";
                }
            }
        }
        public double OverdueAmount
        {
            get
            {
                double amount = -OverdueCapital - InpaiedRestOfRate - PenaltyRate - JudgmentRate;
                if (amount != 0)
                {
                    return CurrentFee;
                }
                else return  0;
            }
        }
        public string ProductTypeDescription
        {
            get
            {
                return LoanTypeDescription.ToString();
            }
        }

        public double PetTurq
        {
            get;
            set;
        }
        
        public bool isAccessible
        {
            get
            {
                if (LoanAccount != null)
                {
                    return LoanAccount.isAccessible;
                }
                else
                {
                    return false;
                }
                
                
            }
        }
        public string SumOfCurrentAndOutCapitalsString
        {
            get
            {
                if (isAccessible)
                    return (CurrentCapital + OutCapital).ToString("#,0.00");
                else
                    return "*****"; 
            }
        }
        public string NextRepaymentDateString
        {
            get {
                if (NextRepayment == null || NextRepayment.RepaymentDate == default(DateTime))
                {
                    return "-";
                }
                else
                {
                    return NextRepayment.RepaymentDate.ToString("dd/MM/yy");
                }

            }
        }


        public string NextRepaymentAmountString
        {
            get
            {
                if (isAccessible && NextRepayment!=null)
                    return (NextRepayment.TotalRepayment).ToString("#,0.00");
                else
                    return "*****";
            }
        }

        public string ContractAmountString
        {
            get
            {
                if (isAccessible && ContractAmount != 0)
                    return ContractAmount.ToString("#,0.00");
                else
                    return "*****";
            }
        }

    }
}
