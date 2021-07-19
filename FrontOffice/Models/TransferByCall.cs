using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace FrontOffice.XBS
{
    public partial class TransferByCall
    {
        public string RegistrationDateString
        {
            get
            {
                return RegistrationDate.ToString("dd/MM/yyyy H:mm");
            }
        }

        public string CallTimeString
        {
            get
            {
                return CallTime.ToString("dd/MM/yyyy H:mm");
            }
        }
        
        public string ConfirmationDateString
        {
            get
            {
                string confirmationDate;
                if (ConfirmationDate != default(DateTime))
                    confirmationDate = ConfirmationDate.ToString("dd/MM/yyyy H:mm");
                else
                    confirmationDate = "-";

                return confirmationDate;
            }
        }

       public string ConfirmationDateString2
        {
            get
            {
                string confirmationDate;
                if (ConfirmationDate2 != default(DateTime))
                    confirmationDate = ConfirmationDate2.ToString("dd/MM/yyyy H:mm");
                else
                    confirmationDate = "-";

                return confirmationDate;
            }
        }
      
       public string TransferConfirmationDateString
       {
           get
           {
               string confirmationDate;
               if (TransferConfirmationDate != default(DateTime))
                   confirmationDate = TransferConfirmationDate.ToString("dd/MM/yyyy H:mm");
               else
                   confirmationDate = "-";

               return confirmationDate;
           }
       }
        public string AmountString
        {
            get
            {
                return Amount.ToString("#,###.00");
            }
        }

        public string CustomerAmountString
        {
            get
            {
                return CustomerAmount.ToString("#,###.00");
            }
        }

        public string RateBuyString
        {
            get
            {
                return RateBuy.ToString("#,###.00");
            }
        }

        public string RateSellString
        {
            get
            {
                return RateSell.ToString("#,###.00");
            }
        }  
        
        public string AccountString
        {
            get
            {
                string accountString = "";
            
             
                if(!String.IsNullOrEmpty(AccountNumber))
                {                  
                 
                    accountString = AccountNumber + " " + AccountDescription + " " + AccountCurrency;
                }
                return accountString;
            }
        }            
    }
}