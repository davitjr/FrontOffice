using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBManagement
{
    public partial class HBApplicationQualityChangeOrder
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
                if (OperationDate != null && OperationDate.Value != default(DateTime))
                {
                    return OperationDate.Value.ToString("dd/MM/yyyy");
                }
                else
                {
                    return "-";
                }
            }
        }
        public string SourceDescription
        {

            get
            {
                return Enum.GetName(typeof(SourceType), Source);
            }

        }
    }
}