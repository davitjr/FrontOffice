using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class CustomerLeasingLoans
    {
        public string StartCapitalString
        {
            get
            {
                return StartCapital.ToString("#,0.00");
            }
        }

        public string NextRepaymentDateString
        {
            get
            {               
                return NextRepaymentDate?.ToString("dd/MM/yyyy") ?? "-";
            }
        }
        public string EndDateString
        {
            get
            {
                return EndDate?.ToString("dd/MM/yyyy") ?? "-";
            }
        }

        public string SumOfCurrentAndOutCapitalsString
        {
            get
            {
                return CurrentCapital.ToString("#,0.00");
            }
        }

        public string NextRepaymentAmountString
        {
            get
            {
                return LeasingPayment.ToString("#,0.00");
            }            
        }
    }
}