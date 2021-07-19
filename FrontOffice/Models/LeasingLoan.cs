using FrontOffice.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FrontOffice.Service;

namespace FrontOffice.XBS
{
    public partial class LeasingLoan
    {
        public bool MultiplyRate
        {
            get
            {
                if (StartDate.Date > Convert.ToDateTime("01/01/2017").Date)
                    return false;
                else
                    return true;
            }
        }
        

    }
}