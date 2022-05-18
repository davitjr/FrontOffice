using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class LeasingLoanDetails
    {
        public string SumOverdueCapitalsString
        {
            get
            {
                double sumOverdueCapitals = OverdueCapital + OverduePercent + PenaltyRate;
                
                if (FeePaymentDate!=null && FeePaymentDate < DateTime.Now)
                    sumOverdueCapitals += FeeAmount;
                if (PrepaymentPaymentDate != null && PrepaymentPaymentDate < DateTime.Now)
                    sumOverdueCapitals += PrepaymentAmount;
                if (InsurancePaymentDate != null && InsurancePaymentDate < DateTime.Now)
                    sumOverdueCapitals += InsuranceAmount;
                                
                return sumOverdueCapitals.ToString("#,0.00");                
            }
        }

    }
}