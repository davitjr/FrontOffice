using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBManagement
{
    public partial class HBUser
    {
        public string RegistrationDateString
        {
            get
            { 
                return RegistrationDate.HasValue ? RegistrationDate.Value.ToString("dd/MM/yyyy") : ""; 
            }
        }

        public string BlockingDateString
        {
            get
            {   
                return BlockingDate.HasValue ? BlockingDate.Value.ToString("dd/MM/yyyy") : "";
            }
        }

        public ushort Action { get; set; }        
    }       
}