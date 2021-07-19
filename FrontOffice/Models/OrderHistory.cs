using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class OrderHistory
    {
        public string ChangeDateString
        {
            get
            {
                return ChangeDate.ToString("dd/MM/yy HH:mm");
            }
        }
    }
}