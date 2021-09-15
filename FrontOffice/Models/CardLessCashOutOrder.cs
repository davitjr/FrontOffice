using System;
using FrontOffice.Service;

namespace FrontOffice.XBS
{
    public partial class CardlessCashoutOrder
    {
        public string RegistrationDateString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yyyy");
            }
        }

        public string OperationDateString
        {
            get
            {
                return OperationDate?.ToString("dd/MM/yyyy");
            }
        }

        public string CashoutAttemptDateString
        {
            get
            {
                return CashoutAttemptDate?.ToString("dd/MM/yyyy");
            }
        }
    }
}