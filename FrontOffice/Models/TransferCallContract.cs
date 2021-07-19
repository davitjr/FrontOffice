using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FrontOffice.XBS
{
    public partial class TransferCallContract
    {
      
        public string StartCapitalString
        {
            get
            {
                return StartCapital.ToString("#,###.00");
            }
        }
        public string CardValidationDateString
        {
            get
            {
                string cardValidationDate = "";
                if (CardValidationDate != null)
                    cardValidationDate = CardValidationDate.Value.ToString("dd/MM/yyyy");

                return cardValidationDate;
            }
        }
    }
}