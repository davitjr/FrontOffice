using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class BondIssue
    {
        public string RepaymentDateToString
        {
            get
            {
                return RepaymentDate.Value.ToString("dd/MM/yyyy");
            }
        }

        public string ReplacementDateToString
        {
            get
            {
                return ReplacementDate.ToString("dd/MM/yyyy");
            }
        }

        public string RegistrationDateToString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yyyy");
            }
        }


        public string PurchaseDeadlineTimeToString
        {
            get
            {
                return PurchaseDeadlineTime.ToString(@"hh\:mm");
            }
        }

        public string IssueDateToString
        {
            get
            {
                return IssueDate.ToString("dd/MM/yyyy");
            }
        }

        public string InterestRateValueToString
        {
            get
            {
                return (InterestRate * 100).ToString("#,0.00");
            }
        }

        public string ReplacementEndDateToString
        {
            get
            {
                return ReplacementEndDate.ToString("dd/MM/yyyy");
            }
        }

    }
}