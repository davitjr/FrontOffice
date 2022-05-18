using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class LeasingOverdueDetail
    {
        public string StartCapitalToString
        {
            get
            {
                return StartCapital.ToString("#,0.00");
            }
        }

        public string ProductStartDateToString
        {
            get
            {
                return ProductStartDate.ToString("dd/MM/yyyy");
            }
        }

        public string ProductEndDateToString
        {
            get
            {
                return ProductEndDate.ToString("dd/MM/yyyy");
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
                if (EndDate != default(DateTime))
                {
                    return EndDate?.ToString("dd/MM/yyyy");
                }
                return "-";
            }
        }

        public string AmountToString
        {
            get
            {
                return Amount.ToString("#,0.00");
            }
        }

        public string RateAmountToString
        {
            get
            {
                return RateAmount.ToString("#,0.00");
            }
        }


    }
}