using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class OverdueDetail
    {

        public string StartDateToString
        {
            get
            {
                return StartDate.ToString("dd/MM/yyyy");
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
                if (ProductEndDate != default(DateTime))
                {
                    return ProductEndDate.ToString("dd/MM/yyyy");
                }
                return "-";
            }
        }
        public string EndDateToString
        {
            get
            {
                if (EndDate != default(DateTime))
                {
                    return EndDate.ToString("dd/MM/yyyy");
                }
                return "-";
            }
        }
        public string AmountString
        {
            get
            {
                return Amount.ToString("#,0.00");
            }
        }
        public string StartCapitalString
        {
            get
            {
                return StartCapital.ToString("#,0.00");
            }
        }
        public string RateAmountString
        {
            get
            {
                return RateAmount.ToString("#,0.00");
            }
        }

        public double OverdueDaysCount
        {
            get
            {
                if (EndDate != default(DateTime))
                {
                    return (EndDate - StartDate).Days;
                }
                else
                {
                    return (DateTime.Now - StartDate).Days;
                }
            }
        }
    }
}