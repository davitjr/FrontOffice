using FrontOffice.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class Bond
    {
        //public BondIssue BondIssue
        //{
        //    get
        //    {
        //        BondIssue bondIssue = new BondIssue();
        //        BondIssueFilter issueFilter = new BondIssueFilter();

        //        issueFilter.ISIN = this.ISIN;

        //        bondIssue = XBService.GetBondIssuesList(issueFilter).FirstOrDefault();

        //        return bondIssue;
        //    }
        //    set { }
        //}

        
        public string RegistrationDateToString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yyyy");
            }
        }

        public string AmountChargeDateToString
        {
            get
            {
                return AmountChargeDate.ToString("dd/MM/yyyy");
            }
        }
        
        public string AmountChargeTimeToString
        {
            get
            {
                return AmountChargeTime.ToString(@"hh\:mm");
            }
        }

        public string InterestRateValueToString
        {
            get
            {
                return (InterestRate * 100).ToString("#,0.00");
            }
        }

        public string TotalPriceToString
        {
            get
            {
                return TotalPrice.ToString("#,0.00");
            }
        }

    }
}