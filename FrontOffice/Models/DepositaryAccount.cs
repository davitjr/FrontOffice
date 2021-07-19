using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    partial class DepositaryAccount
    {
        public string RegistrationDateToString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yyyy");
            }
        }
    }
}