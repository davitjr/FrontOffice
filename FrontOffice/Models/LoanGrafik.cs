using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class LoanRepaymentGrafik
    {
        public string RepaymentDateTostring
        {
            get 
            {
                return RepaymentDate.ToString("dd/MM/yyyy");
            }
        }
        public string RestCapitalToString 
        {
            get 
            {
                return RestCapital.ToString("#,0.00");
            }

        }
        public string RateRepaymentToString
        {
            get
            {
                return RateRepayment.ToString("#,0.00");
            }

        }
        public string FeeRepaymentToString
        {
            get
            {
                return FeeRepayment.ToString("#,0.00");
            }

        }
        public string CapitalRepaymentToString
        {
            get
            {
                return CapitalRepayment.ToString("#,0.00");
            }

        }
        public string TotalRepaymentToString
        {
            get
            {
                return TotalRepayment.ToString("#,0.00");
            }
        }

        public string RescheduledAmountToString
        {
            get
            {
                return RescheduledAmount.ToString("#,0.00");
            }
        }
    }
}