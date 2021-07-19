using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBManagement
{
    public partial class HBApplication
    {
        public string ContractDateString
        {
            get
            {
                if (ContractDate != null)
                {
                    return ContractDate.Value.ToString("dd/MM/yyyy");
                }
                else
                {
                    return "";
                }

            }
        }


        public string ApplicationDateString
        {
            get
            {
                if (ApplicationDate != null)
                {
                    return ApplicationDate.Value.ToString("dd/MM/yyyy");
                }
                else
                {
                    return "";
                }
                
            }
        }


        public string StatusChangeDateString
        {
            get
            {
                if (StatusChangeDate != null)
                {
                    return StatusChangeDate.Value.ToString("dd/MM/yyyy");
                }
                else
                {
                    return "";
                }
              
            }
        }

    }

    public partial class HBApplicationOrder {

        public string RegistrationDateString
        {
            get
            {
                if (RegistrationDate != null)
                {
                    return RegistrationDate.ToString("dd/MM/yyyy");
                }
                else
                {
                    return "";
                }

            }
        }
    }
}