using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class Order
    {
        public string RegistrationDateString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yyyy");
            }
        }
        public string AmountString
        {
            get
            {
                return Amount.ToString("#,0.00");
            }
        }
        public string SourceDescription
        {

            get
            {
                return Enum.GetName(typeof(SourceType), Source);
            }
        
        }

        /// <summary>
        /// Ավտոմատ ձևակերպման նշան
        /// </summary>
        /// <returns></returns>
        public bool HasAoutomaticConfirmation;

        public string OperationDateString
        {
            get
            {
                if (OperationDate!=null && OperationDate.Value != default(DateTime))
                {
                    return OperationDate.Value.ToString("dd/MM/yyyy");
                }
                else
                {
                    return "-";
                }
            }
        }

       
    }


}