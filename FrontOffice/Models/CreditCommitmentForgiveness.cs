using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class CreditCommitmentForgivenessOrder
    {
        public string DateOfDeathToString
        {
            get
            {
                return DateOfDeath != null ? DateOfDeath.Value.ToString("dd/MMM/yyyy") : "null";
            }
        }

        public string OperationDateToString
        {
            get
            {
                return OperationDate != null ? OperationDate.Value.ToString("dd/MM/yy") : "null";
            }
        }

        public string DateOfFoundationToString
        {
            get
            {
                return DateOfFoundation != null ? DateOfFoundation.Value.ToString("dd/MM/yy") : "null";
            }
        }

        public string CurrentFeeToString
        {
            get
            {
                if (Currency == "AMD")
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.0}", CurrentFee);
                }
                else
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", CurrentFee);
                }
            }
        }

        public string JudgmentPenaltyRateToString
        {
            get
            {
                if (Currency == "AMD")
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.0}", JudgmentPenaltyRate);
                }
                else
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", JudgmentPenaltyRate);
                }
            }
        }

        public string PenaltyRateToString
        {
            get
            {
                if (Currency == "AMD")
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.0}", PenaltyRate);
                }
                else
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", PenaltyRate);
                }

            }
        }

        public string TaxToString
        {
            get
            {
                if (Currency == "AMD")
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.0}", Tax);
                }
                else
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", Tax);
                }
            }
        }

        public string CurrentRateValueToString
        {
            get
            {
                if (Currency == "AMD")
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.0}", CurrentRateValue);
                }
                else
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", CurrentRateValue);
                }
            }
        }

        public string CurrentRateValueNusedToString
        {
            get
            {
                if (Currency == "AMD")
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.0}", CurrentRateValueNused);
                }
                else
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.00}", CurrentRateValueNused);
                }
            }
        }

        public string CurrentCapitalToString
        {
            get
            {
                if (Currency == "AMD")
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.0}", CurrentCapital);
                }
                else
                {
                    return String.Format("{0:#,##0.00}", CurrentCapital);
                }
            }
        }

        public string OutCapitalToString
        {
            get
            {
                if (Currency == "AMD")
                {
                    return String.Format(CultureInfo.InvariantCulture, "{0:#,##0.0}", OutCapital);
                }
                else
                {
                    return String.Format("{0:#,##0.00}", OutCapital);
                }
            }
        }


    }
}