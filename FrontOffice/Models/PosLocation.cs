using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class PosLocation
    {
        public string OpenDateString
        {
            get
            {
                return OpenDate.ToString("dd/MM/yyyy");
            }
        }

        public string ClosedDateString
        {
            get
            {
                if (ClosedDate != null && ClosedDate.Value != null)
                {
                    return ClosedDate.Value.ToString("dd/MM/yyyy");
                }
                else return null;
            }
        }
    }
}