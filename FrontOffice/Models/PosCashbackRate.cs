using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class PosCashbackRate
    {
        public string StartDateString
        {
            get
            {
                return StartDate.ToString("dd/MM/yyyy");
            }
        }


    }
}