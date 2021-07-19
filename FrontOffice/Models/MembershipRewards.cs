using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class MembershipRewards
    {
        public string RegistrationDateToString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yyyy");
            }
        }

        public string EndDateToString
        {
            get
            {
                return EndDate.ToString("dd/MM/yyyy");
            }
        }

        public string ClosingDateToString
        {
            get
            {
                return ClosingDate != null ? ClosingDate.Value.ToString("dd/MM/yyyy") : "-";
            }
        }

        public string ValidationDateToString
        {
            get
            {
                return ValidationDate != null ? ValidationDate.Value.ToString("dd/MM/yyyy") : "-";
            }
        }

        public string LastDayOfBonusCalculationToString
        {
            get
            {
                return LastDayOfBonusCalculation.ToString("dd/MM/yyyy");
            }
        }

        public string FeePaymentDateToString
        {
            get
            {
                return FeePaymentDate != null ? FeePaymentDate.Value.ToString("dd/MM/yyyy") : "-";
            }
        }

    }
}