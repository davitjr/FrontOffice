using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class PensionPaymentOrder
    {
        public string AmountString
        {
            get
            {
                return Amount.ToString("#,0.00");
            }
        }

        public string DateGetString
        {
            get
            {
                return DateGet.ToString("dd/MM/yy");
            }
        }
        public string OperationDateToString
        {
            get
            {
                return OperationDate != null ? OperationDate.Value.ToString("dd/MM/yy") : "null";
            }
        }

        public string MonthString 
        {
            get
            { 
                return new DateTime(1900, Month, 1).ToString("MMMM", new CultureInfo("hy"));
            } 
        }

    }
}