using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class ProblemLoanTax
    {
        public string TaxRegistrationDateToString
        {
            get
            {
                return TaxRegistrationDate.ToString("dd/MM/yyyy");
            }
        }

        public string TaxRegistrationTimeToString
        {
            get
            {
                return TaxRegistrationTime.ToString(@"hh\:mm");
            }
        }

        public string TransferRegistrationDateToString
        {
            get
            {
                if (TransferRegistrationDate != null && TransferRegistrationDate.Value != null)
                {
                    return TransferRegistrationDate.Value.ToString("dd/MM/yyyy");
                }
                else return null;
            }
        }

        public string ConfirmationDateToString
        {
            get
            {
                if (ConfirmationDate != null && ConfirmationDate.Value != null)
                {
                    return ConfirmationDate.Value.ToString("dd/MM/yyyy");
                }
                else return null;
            }
        }
    }
}