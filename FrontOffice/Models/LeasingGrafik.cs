using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class LeasingLoanRepayments
    {
        public string RepaymentDateTostring
        {
            get
            {
                return DateOfRepayment.ToString("dd/MM/yyyy");
            }
        }

        public string RestCapitalToString
        {
            get
            {
                return CurrentCapital.ToString("#,0.00");
            }
        }
        public string RateRepaymentToString
        {
            get
            {
                return RateRepayment.ToString("#,0.00");
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
                return PayableAmount.ToString("#,0.00");
            }
        }
    }
}