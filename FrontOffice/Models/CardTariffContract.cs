using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class CardTariffContract
    {
        public string StartDateString
        {
            get
            {
                return StartDate.ToString("dd/MM/yyyy");
            }
        }

        public string EndDateString
        {
            get
            {
                if (EndDate != null && EndDate.Value != null)
                {
                    return EndDate.Value.ToString("dd/MM/yyyy");
                }
                else return null;
            }
        }
    }
}